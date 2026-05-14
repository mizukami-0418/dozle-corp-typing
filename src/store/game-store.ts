/**
 * Zustand グローバルストア。
 * キャラクター選択・ゲーム進行状態・ローカルストレージ同期を管理する。
 */

import { create } from "zustand";
import type { CharacterKey, GameState, StageId } from "@/types";
import {
  loadBestScores,
  loadClearedStages,
  loadStarRecords,
  loadSelectedCharacter,
  saveBestScore,
  markStageCleared,
  saveStarRecord,
  saveSelectedCharacter,
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
  // ローカルストレージと同期するデータ
  // ──────────────────────────────────────────
  bestScores: Record<string, number>;
  clearedStages: StageId[];
  starRecords: Record<string, number>;

  /** ローカルストレージからすべての進捗を読み込む */
  loadProgress: () => void;

  /**
   * ステージクリア時の一括保存。
   * ベストスコア・クリア記録・スター数を更新する。
   * @returns isNewBest — ベストスコア更新フラグ
   */
  saveResult: (stageId: StageId, score: number, stars: number) => boolean;
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

  loadProgress: () => {
    set({
      bestScores: loadBestScores(),
      clearedStages: loadClearedStages(),
      starRecords: loadStarRecords(),
    });
  },

  saveResult: (stageId, score, stars) => {
    const isNewBest = saveBestScore(stageId, score);
    markStageCleared(stageId);
    saveStarRecord(stageId, stars);
    // ストア内のキャッシュも更新
    const { bestScores, starRecords, clearedStages } = get();
    set({
      bestScores: { ...bestScores, [stageId]: Math.max(bestScores[stageId] ?? 0, score) },
      starRecords: { ...starRecords, [stageId]: Math.max(starRecords[stageId] ?? 0, stars) },
      clearedStages: clearedStages.includes(stageId)
        ? clearedStages
        : [...clearedStages, stageId],
    });
    return isNewBest;
  },
}));
