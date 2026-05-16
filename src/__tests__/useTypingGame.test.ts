/**
 * useTypingGame フックのインテグレーションテスト。
 * キーボード入力のシミュレーションで正誤判定・スコア・クリア検知を検証する。
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypingGame } from "@/hooks/useTypingGame";
import type { WordEntry, StageId } from "@/types";

// 外部依存をモックして副作用を排除する
vi.mock("@/lib/sound", () => ({
  playBlockPlace: vi.fn(),
  playMiss: vi.fn(),
  playClear: vi.fn(),
}));

vi.mock("@/store/game-store", () => ({
  useGameStore: vi.fn(() => ({
    soundEnabled: false,
    saveResult: vi.fn(() => false),
  })),
}));

// ── ヘルパー ──────────────────────────────────────────────────────────────

/** window に keydown イベントを発火して React の状態更新を flush する */
const typeKey = (key: string) => {
  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  });
};

/** 文字列を1文字ずつ入力する */
const typeString = (str: string) => {
  for (const ch of str) {
    typeKey(ch);
  }
};

// ── テスト ──────────────────────────────────────────────────────────────

const STAGE_ID: StageId = "grassland";

/** テスト用ワード（ねこ / いぬ の2ワード） */
const TWO_WORDS: WordEntry[] = [
  { display: "ねこ", reading: "ねこ", hint: "cat" },
  { display: "いぬ", reading: "いぬ", hint: "dog" },
];

describe("useTypingGame", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("初期状態", () => {
    it("初期値が正しい", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      const s = result.current;
      expect(s.wordIndex).toBe(0);
      expect(s.score).toBe(0);
      expect(s.missCount).toBe(0);
      expect(s.accuracy).toBe(100);
      expect(s.isStarted).toBe(false);
      expect(s.isCleared).toBe(false);
      expect(s.totalWords).toBe(2);
      expect(s.currentWord?.display).toBe("ねこ");
      expect(s.nextWord?.display).toBe("いぬ");
    });
  });

  describe("ゲーム開始", () => {
    it("最初のキー入力で isStarted が true になる", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      typeKey("n");

      expect(result.current.isStarted).toBe(true);
    });

    it("正しいキー入力でバッファが積まれる", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      typeKey("n");
      expect(result.current.typedBuffer).toBe("n");

      typeKey("e");
      expect(result.current.typedBuffer).toBe("ne");
    });
  });

  describe("正解入力", () => {
    it("1ワード完了で wordIndex が 1 に進む", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      typeString("neko"); // "ねこ"

      expect(result.current.wordIndex).toBe(1);
      expect(result.current.typedBuffer).toBe("");
      expect(result.current.currentWord?.display).toBe("いぬ");
    });

    it("1ワード完了でスコアが増える", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      typeString("neko");

      expect(result.current.score).toBeGreaterThan(0);
    });
  });

  describe("ミス入力", () => {
    it("無効なキーで missCount が 1 増える", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      // "ねこ" の先頭は "n" のみ有効。"x" はミス。
      typeKey("x");

      expect(result.current.missCount).toBe(1);
    });

    it("ミスしても typedBuffer は変わらない", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      typeKey("n"); // 正解（バッファ = "n"）
      typeKey("x"); // ミス

      expect(result.current.typedBuffer).toBe("n");
      expect(result.current.missCount).toBe(1);
    });

    it("正確率がミス数に応じて下がる", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      typeKey("n"); // 正解
      typeKey("x"); // ミス

      // 2打のうち1ミス → 正確率 50%
      expect(result.current.accuracy).toBe(50);
    });
  });

  describe("修飾キー", () => {
    it("Ctrl キーは無視される", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "n", ctrlKey: true, bubbles: true })
        );
      });

      expect(result.current.isStarted).toBe(false);
      expect(result.current.typedBuffer).toBe("");
    });

    it("特殊キー（Shift などの length > 1）は無視される", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      typeKey("Shift");
      typeKey("Enter");

      expect(result.current.isStarted).toBe(false);
    });
  });

  describe("ステージクリア", () => {
    it("全ワード入力完了で isCleared が true になる", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      typeString("neko"); // ねこ
      typeString("inu");  // いぬ

      expect(result.current.isCleared).toBe(true);
    });

    it("クリア後のキー入力は無視される", () => {
      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, TWO_WORDS)
      );

      typeString("neko");
      typeString("inu");

      const scoreBefore = result.current.score;
      typeKey("a");

      expect(result.current.score).toBe(scoreBefore);
      expect(result.current.missCount).toBe(0); // ミス数も変わらない
    });
  });

  describe("1ワードのみのステージ", () => {
    it("1ワード完了で即 isCleared になる", () => {
      const singleWord: WordEntry[] = [
        { display: "ねこ", reading: "ねこ" },
      ];

      const { result } = renderHook(() =>
        useTypingGame(STAGE_ID, singleWord)
      );

      typeString("neko");

      expect(result.current.isCleared).toBe(true);
    });
  });
});
