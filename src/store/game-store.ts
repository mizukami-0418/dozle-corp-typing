/**
 * Zustand グローバルストア。
 * キャラクター選択・ゲーム進行状態・ローカルストレージ同期を管理する。
 */

import { create } from "zustand";
import type { CharacterKey, GameState, ResultData, StageId } from "@/types";
import {
  loadBestScores,
  loadClearedStages,
  loadStarRecords,
  loadSelectedCharacter,
  loadSfxEnabled,
  loadBgmEnabled,
  saveBestScore,
  markStageCleared,
  saveStarRecord,
  saveSelectedCharacter,
  saveSfxEnabled,
  saveBgmEnabled,
} from "@/lib/storage";

interface GameStore {
  // ──────────────────────────────────────────
  // キャラクター選択
  // ──────────────────────────────────────────
  selectedCharacter: CharacterKey;
  setCharacter: (key: CharacterKey) => void;

  // ──────────────────────────────────────────
  // ゲーム中の状態
  // ──────────────────────────────────────────
  gameState: GameState;
  setGameState: (state: Partial<GameState>) => void;
  resetGameState: (stageId: StageId) => void;

  // ──────────────────────────────────────────
  // リザルトデータ（クリア時にセット → リザルト画面で参照）
  // ──────────────────────────────────────────
  resultData: ResultData | undefined;
  setResultData: (data: ResultData) => void;

  // ──────────────────────────────────────────
  // サウンド設定
  // ──────────────────────────────────────────
  sfxEnabled: boolean;
  toggleSfx: () => void;
  bgmEnabled: boolean;
  toggleBgm: () => void;

  // ──────────────────────────────────────────
  // ローカルストレージと同期するデータ
  // ──────────────────────────────────────────
  bestScores: Record<string, number>;
  clearedStages: StageId[];
  starRecords: Record<string, number>;

  /** ローカルストレージからすべての進捗を読み込む */
  loadProgress: () => void;

  /**
   * ステージクリア時の一括保存。
   * ベストスコア・クリア記録・スター数を更新し、resultData をセットする。
   * @returns isNewBest — ベストスコア更新フラグ
   */
  saveResult: (
    stageId: StageId,
    score: number,
    stars: number,
    accuracy: number,
    missCount: number,
    elapsedMs: number,
    wordsCompleted: number
  ) => boolean;
}

const INITIAL_GAME_STATE: GameState = {
  currentStage: undefined,
  currentWordIndex: 0,
  score: 0,
  missCount: 0,
  totalKeystrokes: 0,
  startTime: undefined,
  isCleared: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  selectedCharacter: loadSelectedCharacter(),
  gameState: INITIAL_GAME_STATE,
  resultData: undefined,
  sfxEnabled: loadSfxEnabled(),
  bgmEnabled: loadBgmEnabled(),
  bestScores: {},
  clearedStages: [],
  starRecords: {},

  setCharacter: (key) => {
    saveSelectedCharacter(key);
    set({ selectedCharacter: key });
  },

  setGameState: (partial) =>
    set((state) => ({
      gameState: { ...state.gameState, ...partial },
    })),

  resetGameState: (stageId) =>
    set({
      gameState: {
        ...INITIAL_GAME_STATE,
        currentStage: stageId,
        startTime: Date.now(),
      },
    }),

  setResultData: (data) => set({ resultData: data }),

  toggleSfx: () => {
    const next = !get().sfxEnabled;
    saveSfxEnabled(next);
    set({ sfxEnabled: next });
  },

  toggleBgm: () => {
    const next = !get().bgmEnabled;
    saveBgmEnabled(next);
    set({ bgmEnabled: next });
  },

  loadProgress: () => {
    set({
      bestScores: loadBestScores(),
      clearedStages: loadClearedStages(),
      starRecords: loadStarRecords(),
    });
  },

  saveResult: (stageId, score, stars, accuracy, missCount, elapsedMs, wordsCompleted) => {
    const isNewBest = saveBestScore(stageId, score);
    markStageCleared(stageId);
    saveStarRecord(stageId, stars);

    const { bestScores, starRecords, clearedStages } = get();
    const resultData: ResultData = {
      stageId,
      score,
      stars,
      accuracy,
      missCount,
      elapsedMs,
      isNewBest,
      wordsCompleted,
    };

    set({
      resultData,
      bestScores: {
        ...bestScores,
        [stageId]: Math.max(bestScores[stageId] ?? 0, score),
      },
      starRecords: {
        ...starRecords,
        [stageId]: Math.max(starRecords[stageId] ?? 0, stars),
      },
      clearedStages: clearedStages.includes(stageId)
        ? clearedStages
        : [...clearedStages, stageId],
    });

    return isNewBest;
  },
}));
