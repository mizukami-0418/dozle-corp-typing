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
export type Difficulty = "cheat" | "normal" | "hard" | "kichiku" | "dozle";

/** ステージ識別子（Difficulty と1対1対応） */
export type StageId = Difficulty;

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
  /** ステージに登場するワードのテーマ説明 */
  theme: string;
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

/** バトルモード ステージ識別子 */
export type BattleStageId =
  | "zombie"
  | "drowned"
  | "wither-skeleton"
  | "shulker"
  | "ender-dragon"
  | "dozle-battle";

/**
 * バトルモードに登場するモンスター1体の定義。
 * maxHp はモンスターの初期HP（ワード正解で -10pt）。
 */
export interface BattleMonster {
  id: string;
  name: string;
  /** 当面の仮プレースホルダー絵文字（実画像差し替え前） */
  emoji: string;
  maxHp: number;
  isBoss: boolean;
}

/** バトルモード ステージ設定 */
export interface BattleStageConfig {
  id: BattleStageId;
  /** 表示名（例: "STAGE 1"） */
  name: string;
  theme: string;
  /** 舞台の説明（例: "草原・村の夜"） */
  setting: string;
  /** ワード制限時間係数（ローマ字1文字あたりの秒数） */
  secPerRomaji: number;
  /** 対象ワードのひらがな文字数（下限、含む） */
  kanaLengthMin: number;
  /** 対象ワードのひらがな文字数（上限、含む） */
  kanaLengthMax: number;
  /** 登場モンスター5体（5体目がボス） */
  monsters: BattleMonster[];
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
