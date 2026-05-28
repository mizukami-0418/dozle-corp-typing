"use client";

/**
 * タイピングゲームのコアロジックを管理するカスタムフック。
 * 時間制スコアアタック型：総制限時間内にできるだけ多くのワードを入力する。
 *
 * - ワードは難易度ごとにシャッフルされ、制限時間まで繰り返し出題される
 * - ワード別タイムアウト（ローマ字文字数 × 係数）を超えると自動で次へ進む
 * - タイムアウト時は減点のみ（スコア加算なし）
 * - 総制限時間ゼロで isCleared = true → リザルト画面へ遷移
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { WordEntry, StageId } from "@/types";
import { toRomaji, isPartialMatch, isExactMatch, countRomajiLength } from "@/lib/romanizer";
import { playBlockPlace, playMiss, playClear } from "@/lib/sound";
import { useGameStore } from "@/store/game-store";
import { DIFFICULTY_CONFIG, TIMEOUT_PENALTY } from "@/lib/difficulty";

export interface UseTypingGameReturn {
  currentWord: WordEntry | undefined;
  nextWord: WordEntry | undefined;
  typedBuffer: string;
  displayPattern: string;
  score: number;
  missCount: number;
  accuracy: number;
  wordsCompleted: number;
  totalWords: number;
  totalTimeRemainingMs: number;
  wordTimeRemainingMs: number;
  wordTimeLimitMs: number;
  isStarted: boolean;
  isCleared: boolean;
}

/**
 * Fisher-Yates アルゴリズムで配列をシャッフルする。
 *
 * @param arr - シャッフル対象のワード配列
 * @returns シャッフルされた新しい配列（元配列は変更しない）
 */
const fisherYates = (arr: WordEntry[]): WordEntry[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * ワード完了時のスコアを算出する。
 * ミス数に応じて減点し、最低 10 点を保証する。
 *
 * @param wordMiss - そのワードでのミス数
 * @returns 獲得スコア（10〜100）
 */
const calcWordScore = (wordMiss: number): number =>
  Math.max(10, 100 - wordMiss * 10);

/**
 * ゲーム終了時の獲得スター数を算出する。
 *
 * @param accuracy - 正確率（0〜100）
 * @param missCount - 総ミス数
 * @returns スター数（1〜3）
 */
const calcStars = (accuracy: number, missCount: number): number => {
  if (accuracy >= 90 && missCount <= 3) return 3;
  if (accuracy >= 75 && missCount <= 10) return 2;
  return 1;
};

export const useTypingGame = (
  stageId: StageId,
  words: WordEntry[]
): UseTypingGameReturn => {
  const { sfxEnabled, saveResult } = useGameStore();
  const config = DIFFICULTY_CONFIG[stageId];
  const totalTimeLimitMs = config.totalSec * 1000;

  // 初期シャッフル済みキューを state で保持（lazy initializer は初回レンダーのみ実行）
  const [initialQueue] = useState<WordEntry[]>(() =>
    words.length > 0 ? fisherYates([...words]) : []
  );

  // シャッフル済みワードキュー（ref — effects/callbacks 内でのみアクセス）
  const shuffledRef = useRef<WordEntry[]>(initialQueue);

  // 初期ワードのタイムリミット（ms）— secPerRomaji === 0 のとき制限なし（0 をセンチネルとして使用）
  const initialLimit = initialQueue[0] && config.secPerRomaji > 0
    ? Math.round(countRomajiLength(initialQueue[0].reading) * config.secPerRomaji * 1000)
    : 0;

  const [typedBuffer, setTypedBuffer] = useState("");
  const [score, setScore] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [startTime, setStartTime] = useState<number | undefined>();
  const [totalTimeRemainingMs, setTotalTimeRemainingMs] = useState(totalTimeLimitMs);
  const [wordTimeLimitMs, setWordTimeLimitMs] = useState(initialLimit);
  const [wordTimeRemainingMs, setWordTimeRemainingMs] = useState(initialLimit);
  const [isCleared, setIsCleared] = useState(false);

  // レンダーに必要な現在・次ワードを state として管理（ref の render-time 読み取りを回避）
  const [currentWord, setCurrentWord] = useState<WordEntry | undefined>(initialQueue[0]);
  const [nextWord, setNextWord] = useState<WordEntry | undefined>(initialQueue[1]);

  /**
   * 絶対時刻ベースのタイマー管理 ref。
   * vi.advanceTimersByTime() で複数コールバックが同期的に発火しても
   * Date.now() が正しく進むため、累積 setState に依存せず動作する。
   * queuePosRef は位置の primary source（re-render 不要なため state ではなく ref）。
   */
  const gameStartTimeRef = useRef<number>(0);
  const wordStartTimeRef = useRef<number>(0);
  const wordTimeLimitRef = useRef<number>(initialLimit);
  const queuePosRef = useRef<number>(0);

  /**
   * イベントハンドラ・インターバル内で最新の状態を読むための ref。
   * useCallback / setInterval の deps を空にして再登録を防ぐ。
   */
  const stateRef = useRef({
    typedBuffer,
    score,
    missCount,
    totalKeystrokes,
    wordsCompleted,
    startTime,
    isCleared,
    sfxEnabled,
    wordMissCount: 0,
    words,
    stageId,
    saveResult,
    config,
  });

  useEffect(() => {
    stateRef.current.typedBuffer = typedBuffer;
    stateRef.current.score = score;
    stateRef.current.missCount = missCount;
    stateRef.current.totalKeystrokes = totalKeystrokes;
    stateRef.current.wordsCompleted = wordsCompleted;
    stateRef.current.startTime = startTime;
    stateRef.current.isCleared = isCleared;
    stateRef.current.sfxEnabled = sfxEnabled;
    stateRef.current.words = words;
    stateRef.current.saveResult = saveResult;
    stateRef.current.config = config;
  });

  /**
   * 次のワードへ進む（ワード完了・タイムアウト共通）。
   * shuffledRef と位置・タイマー ref を直接更新し、新しいワード情報を返す。
   * キューの末尾に達した場合は再シャッフルして先頭に戻る。
   *
   * @param pos - 現在のキュー位置
   * @param allWords - 元のワードリスト（再シャッフル用）
   * @param now - 現在のタイムスタンプ（Date.now()）
   * @returns 次のキュー位置・タイムリミット・現在ワード・次ワード
   */
  const computeAdvance = (pos: number, allWords: WordEntry[], now: number): {
    nextPos: number;
    nextLimit: number;
    newCurrent: WordEntry | undefined;
    newNext: WordEntry | undefined;
  } => {
    let nextPos = pos + 1;
    if (nextPos >= shuffledRef.current.length) {
      shuffledRef.current = fisherYates([...allWords]);
      nextPos = 0;
    }
    const newCurrent = shuffledRef.current[nextPos];
    const newNext = shuffledRef.current[nextPos + 1];
    const nextLimit = newCurrent && stateRef.current.config.secPerRomaji > 0
      ? Math.round(countRomajiLength(newCurrent.reading) * stateRef.current.config.secPerRomaji * 1000)
      : 0;
    queuePosRef.current = nextPos;
    wordStartTimeRef.current = now;
    wordTimeLimitRef.current = nextLimit;
    return { nextPos, nextLimit, newCurrent, newNext };
  };

  // ゲームタイマー（100ms ごと）— 初回キー入力後に開始、クリアで停止
  useEffect(() => {
    if (!startTime || isCleared) return;

    const id = setInterval(() => {
      const r = stateRef.current;
      if (r.isCleared) return;

      const now = Date.now();
      // Date.now() ベースで計算することで fake timers でも正確に動作する
      const newTotal = Math.max(0, totalTimeLimitMs - (now - gameStartTimeRef.current));
      const newWordRemaining = Math.max(0, wordTimeLimitRef.current - (now - wordStartTimeRef.current));

      if (newTotal <= 0) {
        // 総制限時間切れ → ゲーム終了
        const finalAccuracy =
          r.totalKeystrokes === 0
            ? 100
            : Math.round(((r.totalKeystrokes - r.missCount) / r.totalKeystrokes) * 100);
        const stars = calcStars(finalAccuracy, r.missCount);
        r.saveResult(r.stageId, r.score, stars, finalAccuracy, r.missCount, totalTimeLimitMs, r.wordsCompleted);
        if (r.sfxEnabled) playClear();
        setTotalTimeRemainingMs(0);
        setIsCleared(true);
        return;
      }

      setTotalTimeRemainingMs(newTotal);

      if (wordTimeLimitRef.current > 0 && newWordRemaining <= 0) {
        // ワードタイムアウト → 減点して次のワードへ（secPerRomaji === 0 のモードはスキップ）
        const newScore = Math.max(0, r.score - TIMEOUT_PENALTY);
        const { nextLimit, newCurrent, newNext } = computeAdvance(queuePosRef.current, r.words, now);
        stateRef.current.wordMissCount = 0;
        if (r.sfxEnabled) playMiss();
        setScore(newScore);
        setTypedBuffer("");
        setWordTimeLimitMs(nextLimit);
        setWordTimeRemainingMs(nextLimit);
        setCurrentWord(newCurrent);
        setNextWord(newNext);
      } else {
        setWordTimeRemainingMs(newWordRemaining);
      }
    }, 100);

    return () => clearInterval(id);
  }, [startTime, isCleared, totalTimeLimitMs]);

  /**
   * キーボード入力を処理するイベントハンドラ。
   * 修飾キーや非単一文字は無視し、正解・ミス・ワード完了を判定して状態を更新する。
   * 初回キー入力でゲームタイマーを開始する。
   *
   * @param e - KeyboardEvent
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.length !== 1) return;

    const r = stateRef.current;
    if (r.isCleared) return;

    // effects/callbacks 内での shuffledRef アクセスはルール上問題なし
    const word = shuffledRef.current[queuePosRef.current];
    if (!word) return;

    e.preventDefault();

    const key = e.key.toLowerCase();
    const newBuffer = r.typedBuffer + key;

    // 初回キーでタイマー開始
    if (!r.startTime) {
      const now = Date.now();
      gameStartTimeRef.current = now;
      wordStartTimeRef.current = now;
      stateRef.current.startTime = now;
      setStartTime(now);
    }

    if (isPartialMatch(newBuffer, word.reading)) {
      setTotalKeystrokes((t) => t + 1);
      if (r.sfxEnabled) playBlockPlace();

      if (isExactMatch(newBuffer, word.reading)) {
        // ワード完了
        const wordScore = calcWordScore(stateRef.current.wordMissCount);
        stateRef.current.wordMissCount = 0;

        const now = Date.now();
        const { nextLimit, newCurrent, newNext } = computeAdvance(queuePosRef.current, r.words, now);
        setScore(r.score + wordScore);
        setWordsCompleted(r.wordsCompleted + 1);
        setTypedBuffer("");
        setWordTimeLimitMs(nextLimit);
        setWordTimeRemainingMs(nextLimit);
        setCurrentWord(newCurrent);
        setNextWord(newNext);
      } else {
        setTypedBuffer(newBuffer);
      }
    } else {
      // ミス
      setTotalKeystrokes((t) => t + 1);
      setMissCount((m) => m + 1);
      stateRef.current.wordMissCount += 1;
      if (r.sfxEnabled) playMiss();
    }
  }, []); // 安定したハンドラ：状態はすべて ref 経由で読む

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── 派生値 ──────────────────────────────────
  const displayPattern = currentWord
    ? (toRomaji(currentWord.reading).find((p) => p.startsWith(typedBuffer)) ??
       toRomaji(currentWord.reading)[0] ??
       "")
    : "";

  const accuracy =
    totalKeystrokes === 0
      ? 100
      : Math.round(((totalKeystrokes - missCount) / totalKeystrokes) * 100);

  return {
    currentWord,
    nextWord,
    typedBuffer,
    displayPattern,
    score,
    missCount,
    accuracy,
    wordsCompleted,
    totalWords: words.length,
    totalTimeRemainingMs,
    wordTimeRemainingMs,
    wordTimeLimitMs,
    isStarted: startTime !== undefined,
    isCleared,
  };
};
