/**
 * ゲーム全体で使用する型定義。
 */

/** キャラクター識別子 */
export type CharacterKey =
  | "Dozle"
  | "Bonjour"
  | "Qnly"
  | "OrafKun"
  | "ooharaMEN";

/** 難易度（= ステージ識別子と一対一対応） */
export type Difficulty = "cheat" | "normal" | "hard" | "kichiku";

/** ステージ識別子 */
export type StageId = "cheat" | "normal" | "hard" | "kichiku";

/**
 * タイピング対象の1ワード。
 * display: 画面上部に表示するひらがな（または英語）
 * reading: ローマ字入力の正解文字列（複数パターンを romanizer が生成）
 */
export interface WordEntry {
  display: string;
  reading: string;
}

/** ステージ設定 */
export interface StageConfig {
  id: StageId;
  name: string;
  difficulty: Difficulty;
  words: WordEntry[];
}

/**
 * ゲームセッション中の状態。
 * Zustand ストアとカスタムフックで共有する。
 */
export interface GameState {
  currentStage: StageId | undefined;
  currentWordIndex: number;
  score: number;
  missCount: number;
  totalKeystrokes: number;
  startTime: number | undefined;
  isCleared: boolean;
}

/** リザルト画面に渡すデータ */
export interface ResultData {
  stageId: StageId;
  score: number;
  missCount: number;
  accuracy: number;
  elapsedMs: number;
  stars: number;
  isNewBest: boolean;
  wordsCompleted: number;
}

/** キャラクター情報 */
export interface CharacterConfig {
  key: CharacterKey;
  name: string;
  color: string;
  catchphrase: string;
  friend: string;
  /** 仮プレースホルダー絵文字（実画像差し替え前） */
  emoji: string;
  messages: {
    idle: string[];
    correct: string[];
    cleared: string[];
  };
}
