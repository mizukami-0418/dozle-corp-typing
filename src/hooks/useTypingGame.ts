"use client";

/**
 * タイピングゲームのコアロジックを管理するカスタムフック。
 * キー入力・正誤判定・スコア計算・ステージクリア検知を担う。
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { WordEntry, StageId } from "@/types";
import { toRomaji, isPartialMatch, isExactMatch } from "@/lib/romanizer";
import { playBlockPlace, playMiss, playClear } from "@/lib/sound";
import { useGameStore } from "@/store/game-store";

export interface UseTypingGameReturn {
  /** 現在入力中のワード */
  currentWord: WordEntry | undefined;
  /** 次のワード（プレビュー用） */
  nextWord: WordEntry | undefined;
  /** ユーザーが入力済みのローマ字バッファ */
  typedBuffer: string;
  /** 表示用ローマ字パターン（最初の一致パターン） */
  displayPattern: string;
  score: number;
  missCount: number;
  /** 正確率（0–100） */
  accuracy: number;
  /** WPM（1分あたりのワード数） */
  wpm: number;
  /** 経過ミリ秒 */
  elapsedMs: number;
  /** 現在のワードインデックス（0始まり） */
  wordIndex: number;
  /** ステージの総ワード数 */
  totalWords: number;
  /** 最初のキーを押した後 true */
  isStarted: boolean;
  /** 全ワードタイプ完了後 true */
  isCleared: boolean;
}

/** スター数を算出する（3 / 2 / 1） */
const calcStars = (accuracy: number, missCount: number): number => {
  if (accuracy >= 90 && missCount <= 3) return 3;
  if (accuracy >= 75 && missCount <= 10) return 2;
  return 1;
};

/** ワードのスコアを算出する（ミスが多いほど減点） */
const calcWordScore = (wordMiss: number): number =>
  Math.max(10, 100 - wordMiss * 10);

export const useTypingGame = (
  stageId: StageId,
  words: WordEntry[]
): UseTypingGameReturn => {
  const { soundEnabled, saveResult } = useGameStore();

  const [wordIndex, setWordIndex] = useState(0);
  const [typedBuffer, setTypedBuffer] = useState("");
  const [score, setScore] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState<number | undefined>();
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isCleared, setIsCleared] = useState(false);

  /**
   * イベントハンドラ内で最新の状態を読むための ref。
   * useCallback の deps を空にして listener の付け外しを1回に抑える。
   * ref の同期はレンダー後の useEffect で行う（ESLint: react-hooks/refs 対応）。
   */
  const stateRef = useRef({
    wordIndex,
    typedBuffer,
    score,
    missCount,
    totalKeystrokes,
    startTime,
    isCleared,
    soundEnabled,
    wordMissCount: 0,
    words,
    stageId,
    saveResult,
  });

  // レンダー後に ref を同期（イベントハンドラ内で最新値を読むため）
  useEffect(() => {
    stateRef.current.wordIndex = wordIndex;
    stateRef.current.typedBuffer = typedBuffer;
    stateRef.current.score = score;
    stateRef.current.missCount = missCount;
    stateRef.current.totalKeystrokes = totalKeystrokes;
    stateRef.current.startTime = startTime;
    stateRef.current.isCleared = isCleared;
    stateRef.current.soundEnabled = soundEnabled;
    stateRef.current.words = words;
    stateRef.current.stageId = stageId;
    stateRef.current.saveResult = saveResult;
  });

  // 経過時間タイマー（200ms ごとに更新）
  useEffect(() => {
    if (!startTime || isCleared) return;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 200);
    return () => clearInterval(id);
  }, [startTime, isCleared]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 修飾キー・特殊キーは無視
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.length !== 1) return;

    const r = stateRef.current;
    if (r.isCleared) return;

    const currentWord = r.words[r.wordIndex];
    if (!currentWord) return;

    e.preventDefault();

    const key = e.key.toLowerCase();
    const newBuffer = r.typedBuffer + key;

    // 初回キーでタイマー開始
    if (!r.startTime) {
      const now = Date.now();
      stateRef.current.startTime = now; // 同一フレーム内の再入防止
      setStartTime(now);
    }

    if (isPartialMatch(newBuffer, currentWord.reading)) {
      setTotalKeystrokes((t) => t + 1);

      if (r.soundEnabled) playBlockPlace();

      if (isExactMatch(newBuffer, currentWord.reading)) {
        // ワード完了
        const wordScore = calcWordScore(stateRef.current.wordMissCount);
        stateRef.current.wordMissCount = 0;

        const newScore = r.score + wordScore;
        const newTotal = r.totalKeystrokes + 1;
        const nextIndex = r.wordIndex + 1;

        setScore(newScore);
        setTypedBuffer("");

        if (nextIndex >= r.words.length) {
          // ステージクリア — 最終結果を確定して保存
          const finalElapsed = r.startTime ? Date.now() - r.startTime : 0;
          const finalAccuracy =
            newTotal === 0
              ? 100
              : Math.round(((newTotal - r.missCount) / newTotal) * 100);
          const stars = calcStars(finalAccuracy, r.missCount);

          r.saveResult(
            r.stageId,
            newScore,
            stars,
            finalAccuracy,
            r.missCount,
            finalElapsed
          );

          setElapsedMs(finalElapsed);
          if (r.soundEnabled) playClear();
          setIsCleared(true);
        } else {
          setWordIndex(nextIndex);
        }
      } else {
        setTypedBuffer(newBuffer);
      }
    } else {
      // ミス
      setTotalKeystrokes((t) => t + 1);
      setMissCount((m) => m + 1);
      stateRef.current.wordMissCount += 1;
      if (r.soundEnabled) playMiss();
    }
  }, []); // 安定したハンドラ：状態はすべて stateRef 経由で読む

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── 派生値 ──────────────────────────────────
  const currentWord = words[wordIndex];
  const nextWord = words[wordIndex + 1];

  const currentPatterns = currentWord ? toRomaji(currentWord.reading) : [];
  const displayPattern =
    currentPatterns.find((p) => p.startsWith(typedBuffer)) ??
    currentPatterns[0] ??
    "";

  const accuracy =
    totalKeystrokes === 0
      ? 100
      : Math.round(((totalKeystrokes - missCount) / totalKeystrokes) * 100);

  const wpm =
    startTime !== undefined && elapsedMs > 0
      ? Math.round(wordIndex / (elapsedMs / 60000))
      : 0;

  return {
    currentWord,
    nextWord,
    typedBuffer,
    displayPattern,
    score,
    missCount,
    accuracy,
    wpm,
    elapsedMs,
    wordIndex,
    totalWords: words.length,
    isStarted: startTime !== undefined,
    isCleared,
  };
};
