/**
 * useBattleGame フックのインテグレーションテスト。
 * キーボード入力・フェーズ遷移・HP計算・ステージクリアを検証する。
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBattleGame, PLAYER_INITIAL_HP } from "@/hooks/useBattleGame";
import type { BattleStageConfig, BattleStageId, WordEntry } from "@/types";

// ── モック ────────────────────────────────────────────────────────────────

vi.mock("@/lib/sound", () => ({
  playBlockPlace: vi.fn(),
  playMiss: vi.fn(),
  playClear: vi.fn(),
}));

const mockSaveBattleClear = vi.fn();

vi.mock("@/store/game-store", () => ({
  useGameStore: vi.fn(() => ({
    sfxEnabled: false,
    saveBattleClear: mockSaveBattleClear,
  })),
}));

/** テスト用ステージ（モンスター5体・maxHp=20・1.0秒/文字） */
const MOCK_STAGE: BattleStageConfig = {
  id: "zombie" as BattleStageId,
  name: "STAGE 1",
  theme: "テスト",
  setting: "テスト",
  secPerRomaji: 1.0,
  kanaLengthMin: 1,
  kanaLengthMax: 4,
  monsters: Array.from({ length: 5 }, (_, i) => ({
    id: `m${i + 1}`,
    name: `モンスター${i + 1}`,
    emoji: "🧟",
    maxHp: 20,
    isBoss: i === 4,
  })),
};

/** テスト用ワード（ねこ: neko / いぬ: inu） */
const MOCK_WORDS: WordEntry[] = [
  { display: "ねこ", reading: "ねこ" },
  { display: "いぬ", reading: "いぬ" },
];

vi.mock("@/lib/battle-stages", () => ({
  getBattleStageById: vi.fn(() => MOCK_STAGE),
  getWordsForBattleStage: vi.fn(() => MOCK_WORDS),
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
  for (const ch of str) typeKey(ch);
};

/**
 * 1体のモンスターを撃破する（maxHp=20: 2ワード必要）。
 * 撃破後に MONSTER_DEFEAT_DELAY_MS + 余裕 分だけタイマーを進める。
 */
const defeatMonster = () => {
  typeString("neko"); // ねこ: monsterHp 20→10
  typeString("inu");  // いぬ: monsterHp 10→0 → monster-defeated
  act(() => {
    vi.advanceTimersByTime(1_600); // 1500ms 待機 + 余裕
  });
};

// ── テスト ──────────────────────────────────────────────────────────────

const STAGE_ID: BattleStageId = "zombie";

describe("useBattleGame", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Math.random を固定してシャッフル順を安定させる
    // 0.9 の場合: fisherYates は ["ねこ","いぬ"] → ["ねこ","いぬ"]（順序維持）
    vi.spyOn(Math, "random").mockReturnValue(0.9);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ────────────────────────────────────────────────────────────────────────
  describe("初期状態", () => {
    it("初期値が正しい", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      const s = result.current;

      expect(s.playerHp).toBe(PLAYER_INITIAL_HP); // 20
      expect(s.monsterIndex).toBe(0);
      expect(s.monsterHp).toBe(20); // MOCK_STAGE monsters[0].maxHp
      expect(s.monsterCount).toBe(5);
      expect(s.phase).toBe("playing");
      expect(s.isStarted).toBe(false);
      expect(s.missCount).toBe(0);
      expect(s.wordsCompleted).toBe(0);
      expect(s.currentWord?.display).toBe("ねこ");
    });
  });

  // ────────────────────────────────────────────────────────────────────────
  describe("ゲーム開始", () => {
    it("最初のキー入力で isStarted が true になる", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      typeKey("n");
      expect(result.current.isStarted).toBe(true);
    });

    it("正しいキー入力でバッファが積まれる", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      typeKey("n");
      expect(result.current.typedBuffer).toBe("n");
      typeKey("e");
      expect(result.current.typedBuffer).toBe("ne");
    });

    it("playing フェーズ以外のキー入力は無視される", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      // ゲームオーバーにしてからキー入力
      for (let i = 0; i < 20; i++) typeKey("x");
      expect(result.current.phase).toBe("game-over");

      const missBefore = result.current.missCount;
      typeKey("x");
      expect(result.current.missCount).toBe(missBefore);
    });
  });

  // ────────────────────────────────────────────────────────────────────────
  describe("ミス入力", () => {
    it("ミスでプレイヤー HP が -1pt になる", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      typeKey("x"); // 間違ったキー
      expect(result.current.playerHp).toBe(19);
      expect(result.current.missCount).toBe(1);
    });

    it("ミスしても現在ワードは変わらない", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      typeKey("n"); // 正解
      typeKey("x"); // ミス
      expect(result.current.typedBuffer).toBe("n");
    });

    it("HP が 0 以下で game-over フェーズへ", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      // 20回ミスでHP 0
      for (let i = 0; i < 20; i++) typeKey("x");
      expect(result.current.playerHp).toBe(0);
      expect(result.current.phase).toBe("game-over");
    });

    it("HP は 0 未満にならない", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      for (let i = 0; i < 25; i++) typeKey("x");
      expect(result.current.playerHp).toBe(0);
    });
  });

  // ────────────────────────────────────────────────────────────────────────
  describe("正解入力", () => {
    it("ワード正解でモンスター HP が -10pt になる", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      typeString("neko"); // ねこ
      expect(result.current.monsterHp).toBe(10); // 20 - 10
      expect(result.current.wordsCompleted).toBe(1);
    });

    it("ワード完了後に次のワードへ進む", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      typeString("neko");
      expect(result.current.typedBuffer).toBe("");
      expect(result.current.currentWord?.display).toBe("いぬ");
    });

    it("モンスター HP が 0 で monster-defeated フェーズへ", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      typeString("neko"); // 20→10
      typeString("inu");  // 10→0
      expect(result.current.monsterHp).toBe(0);
      expect(result.current.phase).toBe("monster-defeated");
    });

    it("monster-defeated 中のキー入力は無視される", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      typeString("neko");
      typeString("inu"); // モンスター撃破

      const hpBefore = result.current.playerHp;
      typeKey("x"); // monster-defeated 中なので無視
      expect(result.current.playerHp).toBe(hpBefore);
    });
  });

  // ────────────────────────────────────────────────────────────────────────
  describe("モンスター撃破後の自動移行", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("1500ms 後に次のモンスターへ移行して playing フェーズになる", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      typeString("neko");
      typeString("inu"); // monster-defeated
      expect(result.current.phase).toBe("monster-defeated");

      act(() => {
        vi.advanceTimersByTime(1_600);
      });

      expect(result.current.phase).toBe("playing");
      expect(result.current.monsterIndex).toBe(1);
    });

    it("次モンスターの HP がそのモンスターの maxHp にリセットされる", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      typeString("neko");
      typeString("inu");
      act(() => {
        vi.advanceTimersByTime(1_600);
      });

      expect(result.current.monsterHp).toBe(MOCK_STAGE.monsters[1].maxHp); // 20
    });

    it("次モンスターのセットアップ後に入力できる", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      typeString("neko");
      typeString("inu");
      act(() => {
        vi.advanceTimersByTime(1_600);
      });

      typeString("neko");
      expect(result.current.monsterHp).toBe(10); // 20 - 10
    });
  });

  // ────────────────────────────────────────────────────────────────────────
  describe("タイムアウト", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("ワードタイムアウトでプレイヤー HP が -2pt になる", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      typeKey("n"); // ゲーム開始
      // ねこ = neko = 4文字 × 1.0秒 = 4000ms
      act(() => {
        vi.advanceTimersByTime(4_100);
      });

      expect(result.current.playerHp).toBe(18); // 20 - 2
    });

    it("タイムアウトで次のワードへ進む", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      typeKey("n");
      act(() => {
        vi.advanceTimersByTime(4_100);
      });

      expect(result.current.typedBuffer).toBe("");
      expect(result.current.currentWord?.display).toBe("いぬ");
    });

    it("タイムアウトで HP 0 以下になると game-over", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      // HP を 2 まで削る（18 回ミス）
      for (let i = 0; i < 18; i++) typeKey("x");
      expect(result.current.playerHp).toBe(2);

      typeKey("n"); // タイマー開始済みなのでそのまま
      // タイムアウトで -2pt → HP 0
      act(() => {
        vi.advanceTimersByTime(4_100);
      });

      expect(result.current.playerHp).toBe(0);
      expect(result.current.phase).toBe("game-over");
    });
  });

  // ────────────────────────────────────────────────────────────────────────
  describe("ステージクリア", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("5体全撃破で stage-clear フェーズへ", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      for (let i = 0; i < 5; i++) {
        defeatMonster();
      }

      expect(result.current.phase).toBe("stage-clear");
    });

    it("ステージクリア時に saveBattleClear が呼ばれる", () => {
      renderHook(() => useBattleGame(STAGE_ID));

      for (let i = 0; i < 5; i++) {
        defeatMonster();
      }

      expect(mockSaveBattleClear).toHaveBeenCalledWith(STAGE_ID);
      expect(mockSaveBattleClear).toHaveBeenCalledTimes(1);
    });

    it("クリア後のキー入力は無視される", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      for (let i = 0; i < 5; i++) {
        defeatMonster();
      }

      expect(result.current.phase).toBe("stage-clear");
      const missBefore = result.current.missCount;
      typeKey("x");
      expect(result.current.missCount).toBe(missBefore);
    });
  });

  // ────────────────────────────────────────────────────────────────────────
  describe("クリアタイム計測（Phase 16）", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("初期状態では clearTimeMs は undefined", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));
      expect(result.current.clearTimeMs).toBeUndefined();
    });

    it("ステージクリア時に clearTimeMs が数値（ms）になる", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      for (let i = 0; i < 5; i++) {
        defeatMonster();
      }

      expect(result.current.phase).toBe("stage-clear");
      expect(result.current.clearTimeMs).toBeTypeOf("number");
      expect(result.current.clearTimeMs).toBeGreaterThan(0);
    });

    it("ゲームオーバー時は clearTimeMs が undefined のまま", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      for (let i = 0; i < 20; i++) typeKey("x");

      expect(result.current.phase).toBe("game-over");
      expect(result.current.clearTimeMs).toBeUndefined();
    });

    it("reset 後は clearTimeMs が undefined に戻る", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      for (let i = 0; i < 5; i++) {
        defeatMonster();
      }
      expect(result.current.clearTimeMs).toBeTypeOf("number");

      act(() => {
        result.current.reset();
      });

      expect(result.current.clearTimeMs).toBeUndefined();
    });

    it("クリアタイムは初回キー入力からクリアまでの経過時間に近い値になる", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      // 1体目撃破（ここで初回キー入力 → startTime がセット）
      defeatMonster();

      // 2000ms 経過させる（ねこ=4s / いぬ=3s の制限内なのでタイムアウトしない）
      act(() => vi.advanceTimersByTime(2_000));

      // 残り4体撃破
      for (let i = 0; i < 4; i++) {
        defeatMonster();
      }

      expect(result.current.phase).toBe("stage-clear");
      // startTime〜クリアまで: 1600ms(1体目移行) + 2000ms + 1600ms×3(2〜4体目移行) = 8400ms 以上
      expect(result.current.clearTimeMs).toBeGreaterThanOrEqual(2_000);
    });
  });

  // ────────────────────────────────────────────────────────────────────────
  describe("修飾キー", () => {
    it("Ctrl キーは無視される", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "n", ctrlKey: true, bubbles: true })
        );
      });

      expect(result.current.isStarted).toBe(false);
    });

    it("特殊キー（Shift など length > 1）は無視される", () => {
      const { result } = renderHook(() => useBattleGame(STAGE_ID));

      typeKey("Shift");
      typeKey("Enter");

      expect(result.current.isStarted).toBe(false);
    });
  });
});
