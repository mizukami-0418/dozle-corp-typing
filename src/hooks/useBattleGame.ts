"use client";

/**
 * バトルモードのゲームロジックを管理するカスタムフック。
 * HP制バトル型：5体のモンスターを順番に撃破してステージクリアを目指す。
 *
 * - ワード正解でモンスターに -10pt
 * - タイプミスでプレイヤーに -1pt、タイムアウトで -2pt
 * - モンスターHP 0 → 1.5秒後に次のモンスターへ自動移行
 * - プレイヤーHP 0 → ゲームオーバー
 * - 5体全撃破 → ステージクリア・進捗保存
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { BattleStageId, BattleMonster, WordEntry } from "@/types";
import {
  createMatcher,
  advance,
  countRomajiLength,
  type MatcherState,
} from "@/lib/romanizer";
import { playBlockPlace, playMiss, playClear } from "@/lib/sound";
import { useGameStore } from "@/store/game-store";
import { getBattleStageById, getWordsForBattleStage } from "@/lib/battle-stages";

/** バトルモードのゲームフェーズ */
export type BattlePhase =
  | "playing"
  | "monster-defeated"
  | "stage-clear"
  | "game-over";

export interface UseBattleGameReturn {
  currentWord: WordEntry | undefined;
  matcherState: MatcherState;
  typedBuffer: string;
  displayPattern: string;
  wordTimeRemainingMs: number;
  wordTimeLimitMs: number;
  monsterIndex: number;
  monsterCount: number;
  currentMonster: BattleMonster | undefined;
  monsterHp: number;
  playerHp: number;
  phase: BattlePhase;
  missCount: number;
  wordsCompleted: number;
  accuracy: number;
  isStarted: boolean;
  reset: () => void;
}

/** プレイヤー初期HP（ハート10個 = 半ハート20個分） */
export const PLAYER_INITIAL_HP = 20;

const MONSTER_DAMAGE = 10;
const PLAYER_MISS_DAMAGE = 1;
const PLAYER_TIMEOUT_DAMAGE = 2;
/** 撃破オーバーレイ表示後、次モンスターへ移行するまでの待機時間（ms） */
const MONSTER_DEFEAT_DELAY_MS = 1500;

/**
 * Fisher-Yates アルゴリズムで配列をシャッフルする。
 *
 * @param arr - シャッフル対象の配列
 * @returns シャッフルされた新しい配列（元配列は変更しない）
 */
const fisherYates = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * バトルモードのゲームロジックを管理するカスタムフック。
 *
 * @param stageId - プレイ対象のバトルステージID
 * @returns バトルゲームの表示・状態に必要な値一式（{@link UseBattleGameReturn}）
 */
export const useBattleGame = (stageId: BattleStageId): UseBattleGameReturn => {
  const { sfxEnabled, saveBattleClear } = useGameStore();
  const stage = getBattleStageById(stageId);
  const words = getWordsForBattleStage(stageId);

  // ── 初期値計算 ──────────────────────────────────────────────────────────────
  const [initialWords] = useState<WordEntry[]>(() =>
    words.length > 0 ? fisherYates([...words]) : []
  );
  const shuffledRef = useRef<WordEntry[]>(initialWords);

  const firstWord = initialWords[0];
  const firstMonster = stage?.monsters[0];
  const initialLimit =
    firstWord && stage && stage.secPerRomaji > 0
      ? Math.round(
          countRomajiLength(firstWord.reading) * stage.secPerRomaji * 1000
        )
      : 0;

  // ── State ───────────────────────────────────────────────────────────────────
  const [matcherState, setMatcherState] = useState<MatcherState>(() =>
    createMatcher(firstWord?.reading ?? "")
  );
  const [currentWord, setCurrentWord] = useState<WordEntry | undefined>(
    firstWord
  );
  const [wordTimeLimitMs, setWordTimeLimitMs] = useState(initialLimit);
  const [wordTimeRemainingMs, setWordTimeRemainingMs] = useState(initialLimit);
  const [monsterIndex, setMonsterIndex] = useState(0);
  const [monsterHp, setMonsterHp] = useState(firstMonster?.maxHp ?? 0);
  const [playerHp, setPlayerHp] = useState(PLAYER_INITIAL_HP);
  const [phase, setPhase] = useState<BattlePhase>("playing");
  const [missCount, setMissCount] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState<number | undefined>();

  // ── Refs（レンダーに不要 or effects/callbacks 内での最新値読み取り用） ────────
  const queuePosRef = useRef(0);
  const wordStartTimeRef = useRef(0);
  const wordTimeLimitRef = useRef(initialLimit);

  /**
   * イベントハンドラ・インターバル内で最新の状態を読むための ref。
   * useCallback / setInterval の deps を空にして再登録を防ぐ。
   */
  const stateRef = useRef({
    matcherState,
    monsterIndex,
    monsterHp,
    playerHp,
    phase,
    missCount,
    wordsCompleted,
    startTime,
    sfxEnabled,
    saveBattleClear,
    words,
    stage,
  });

  useEffect(() => {
    stateRef.current.matcherState = matcherState;
    stateRef.current.monsterIndex = monsterIndex;
    stateRef.current.monsterHp = monsterHp;
    stateRef.current.playerHp = playerHp;
    stateRef.current.phase = phase;
    stateRef.current.missCount = missCount;
    stateRef.current.wordsCompleted = wordsCompleted;
    stateRef.current.startTime = startTime;
    stateRef.current.sfxEnabled = sfxEnabled;
    stateRef.current.saveBattleClear = saveBattleClear;
    stateRef.current.words = words;
    stateRef.current.stage = stage;
  });

  // ── 次ワードへ進む共通処理 ────────────────────────────────────────────────
  /**
   * キューを1つ進めて次のワードと制限時間を返す。
   * キュー末尾に達した場合は再シャッフルして先頭へ戻る。
   * wordStartTimeRef・wordTimeLimitRef も同時に更新する。
   *
   * @param now - 現在のタイムスタンプ（Date.now()）
   * @returns 次のワードとその制限時間（ms）
   */
  const computeNextWord = (
    now: number
  ): { newWord: WordEntry | undefined; nextLimit: number } => {
    let nextPos = queuePosRef.current + 1;
    if (nextPos >= shuffledRef.current.length) {
      shuffledRef.current = fisherYates([...stateRef.current.words]);
      nextPos = 0;
    }
    queuePosRef.current = nextPos;
    wordStartTimeRef.current = now;
    const newWord = shuffledRef.current[nextPos];
    const s = stateRef.current;
    const nextLimit =
      newWord && s.stage && s.stage.secPerRomaji > 0
        ? Math.round(
            countRomajiLength(newWord.reading) * s.stage.secPerRomaji * 1000
          )
        : 0;
    wordTimeLimitRef.current = nextLimit;
    return { newWord, nextLimit };
  };

  // ── モンスター撃破後の次モンスターへの移行 ───────────────────────────────
  /**
   * 指定インデックスのモンスターへ移行する。
   * インデックスがモンスター数以上の場合はステージクリア処理を行う。
   *
   * @param nextMonsterIdx - 次のモンスターの 0-based インデックス
   */
  const handleMonsterDefeated = useCallback(
    (nextMonsterIdx: number) => {
      const s = stateRef.current;
      if (!s.stage) return;

      if (nextMonsterIdx >= s.stage.monsters.length) {
        // 全モンスター撃破 → ステージクリア
        s.saveBattleClear(stageId);
        if (s.sfxEnabled) playClear();
        setPhase("stage-clear");
        return;
      }

      // 次モンスターのセットアップ
      const nextMonster = s.stage.monsters[nextMonsterIdx];
      const now = Date.now();
      const { newWord, nextLimit } = computeNextWord(now);

      setMonsterIndex(nextMonsterIdx);
      setMonsterHp(nextMonster.maxHp);
      setCurrentWord(newWord);
      setMatcherState(createMatcher(newWord?.reading ?? ""));
      setWordTimeLimitMs(nextLimit);
      setWordTimeRemainingMs(nextLimit);
      setPhase("playing");
    },
    [stageId]
  );

  // ── モンスター撃破後 1.5 秒で自動移行 ────────────────────────────────────
  useEffect(() => {
    if (phase !== "monster-defeated") return;
    const id = setTimeout(() => {
      handleMonsterDefeated(stateRef.current.monsterIndex + 1);
    }, MONSTER_DEFEAT_DELAY_MS);
    return () => clearTimeout(id);
  }, [phase, handleMonsterDefeated]);

  // ── ワードタイマー（100ms ごと） ─────────────────────────────────────────
  useEffect(() => {
    if (
      !startTime ||
      phase === "stage-clear" ||
      phase === "game-over" ||
      phase === "monster-defeated"
    )
      return;

    const id = setInterval(() => {
      const s = stateRef.current;
      if (s.phase !== "playing") return;

      const now = Date.now();
      const newWordRemaining = Math.max(
        0,
        wordTimeLimitRef.current - (now - wordStartTimeRef.current)
      );

      if (wordTimeLimitRef.current > 0 && newWordRemaining <= 0) {
        // タイムアウト → プレイヤー -2pt
        const newPlayerHp = Math.max(0, s.playerHp - PLAYER_TIMEOUT_DAMAGE);
        if (s.sfxEnabled) playMiss();

        if (newPlayerHp <= 0) {
          setPlayerHp(0);
          setPhase("game-over");
          return;
        }

        const { newWord, nextLimit } = computeNextWord(now);
        setPlayerHp(newPlayerHp);
        setCurrentWord(newWord);
        setMatcherState(createMatcher(newWord?.reading ?? ""));
        setWordTimeLimitMs(nextLimit);
        setWordTimeRemainingMs(nextLimit);
      } else {
        setWordTimeRemainingMs(newWordRemaining);
      }
    }, 100);

    return () => clearInterval(id);
  }, [startTime, phase]);

  // ── キーボード入力ハンドラ ─────────────────────────────────────────────────
  /**
   * キーボード入力を処理するイベントハンドラ。
   * playing フェーズ以外の入力は無視する。
   * 初回キー入力でタイマーを開始する。
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.length !== 1) return;

    const s = stateRef.current;
    if (s.phase !== "playing") return;
    if (!shuffledRef.current[queuePosRef.current]) return;

    e.preventDefault();

    const key = e.key.toLowerCase();

    // 初回キーでタイマー開始
    if (!s.startTime) {
      const now = Date.now();
      wordStartTimeRef.current = now;
      stateRef.current.startTime = now;
      setStartTime(now);
    }

    const result = advance(s.matcherState, key);
    setTotalKeystrokes((t) => t + 1);

    if (result.status === "miss") {
      // タイプミス → プレイヤー -1pt
      const newPlayerHp = Math.max(0, s.playerHp - PLAYER_MISS_DAMAGE);
      setMissCount((m) => m + 1);
      if (s.sfxEnabled) playMiss();

      if (newPlayerHp <= 0) {
        setPlayerHp(0);
        setPhase("game-over");
      } else {
        setPlayerHp(newPlayerHp);
      }
    } else if (result.status === "complete") {
      // ワード正解 → モンスター -10pt
      if (s.sfxEnabled) playBlockPlace();
      setWordsCompleted((w) => w + 1);

      const newMonsterHp = Math.max(0, s.monsterHp - MONSTER_DAMAGE);

      if (newMonsterHp <= 0) {
        // モンスター撃破 → monster-defeated フェーズへ（useEffect で自動移行）
        setMonsterHp(0);
        setPhase("monster-defeated");
      } else {
        // 同一モンスター継続・次ワードへ
        setMonsterHp(newMonsterHp);
        const now = Date.now();
        const { newWord, nextLimit } = computeNextWord(now);
        setCurrentWord(newWord);
        setMatcherState(createMatcher(newWord?.reading ?? ""));
        setWordTimeLimitMs(nextLimit);
        setWordTimeRemainingMs(nextLimit);
      }
    } else {
      // 入力受理（途中）
      if (s.sfxEnabled) playBlockPlace();
      setMatcherState(result.next);
    }
  }, []); // 状態はすべて ref 経由で読むため deps は空

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── ゲームリセット ───────────────────────────────────────────────────────────
  /**
   * ゲーム状態を初期値に戻す。「もう一度！」ボタンから呼ぶ。
   * 同一ページに留まったままワード・HP・フェーズをすべてリセットする。
   */
  const reset = useCallback(() => {
    const newWords = fisherYates([...stateRef.current.words]);
    shuffledRef.current = newWords;
    queuePosRef.current = 0;
    wordStartTimeRef.current = 0;

    const firstW = newWords[0];
    const firstM = stateRef.current.stage?.monsters[0];
    const s = stateRef.current.stage;
    const limit =
      firstW && s && s.secPerRomaji > 0
        ? Math.round(countRomajiLength(firstW.reading) * s.secPerRomaji * 1000)
        : 0;

    wordTimeLimitRef.current = limit;

    setMatcherState(createMatcher(firstW?.reading ?? ""));
    setCurrentWord(firstW);
    setWordTimeLimitMs(limit);
    setWordTimeRemainingMs(limit);
    setMonsterIndex(0);
    setMonsterHp(firstM?.maxHp ?? 0);
    setPlayerHp(PLAYER_INITIAL_HP);
    setPhase("playing");
    setMissCount(0);
    setWordsCompleted(0);
    setTotalKeystrokes(0);
    setStartTime(undefined);
  }, []); // stateRef.current 経由で読むため deps は空

  // ── 派生値 ─────────────────────────────────────────────────────────────────
  const accuracy =
    totalKeystrokes === 0
      ? 100
      : Math.round(((totalKeystrokes - missCount) / totalKeystrokes) * 100);

  const typedBuffer = matcherState.committedRomaji + matcherState.typed;
  const displayPattern =
    matcherState.committedRomaji +
    (matcherState.liveCandidates[0] ?? "") +
    matcherState.tokens
      .slice(matcherState.tokenIndex + 1)
      .map((t) => t.candidates[0])
      .join("");

  return {
    currentWord,
    matcherState,
    typedBuffer,
    displayPattern,
    wordTimeRemainingMs,
    wordTimeLimitMs,
    monsterIndex,
    monsterCount: stage?.monsters.length ?? 0,
    currentMonster: stage?.monsters[monsterIndex],
    monsterHp,
    playerHp,
    phase,
    missCount,
    wordsCompleted,
    accuracy,
    isStarted: startTime !== undefined,
    reset,
  };
};
