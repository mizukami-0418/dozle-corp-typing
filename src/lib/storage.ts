/**
 * ローカルストレージ操作ユーティリティ。
 * サーバーサイドレンダリング時は何もしない（typeof window チェック）。
 */

import type { CharacterKey, StageId, BattleTimeRecord, BattleTimeRecords } from "@/types";
import { CHARACTER_KEYS } from "@/lib/characters";

const KEYS = {
  BEST_SCORES: "dozle-typing:bestScores",
  CLEARED_STAGES: "dozle-typing:clearedStages",
  STAR_RECORDS: "dozle-typing:starRecords",
  SELECTED_CHARACTER: "dozle-typing:selectedCharacter",
  // 旧 soundEnabled キーをそのまま SFX 用として継続使用（既存データを維持）
  SFX_ENABLED: "dozle-typing:soundEnabled",
  BGM_ENABLED: "dozle-typing:bgmEnabled",
  CLEARED_BATTLE_STAGES: "dozle-typing:clearedBattleStages",
  BATTLE_TIME_RECORDS: "battleTimeRecords",
} as const;

const isBrowser = typeof window !== "undefined";

/**
 * ローカルストレージから JSON を安全に読み込む。
 * SSR 環境またはパースエラー時はフォールバック値を返す。
 *
 * @param key - ストレージキー
 * @param fallback - 読み込み失敗時のデフォルト値
 * @returns パースされた値、またはフォールバック値
 */
const readJson = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * ローカルストレージに JSON を書き込む。
 * SSR 環境またはストレージ容量超過時は何もしない。
 *
 * @param key - ストレージキー
 * @param value - 書き込む値
 */
const writeJson = <T>(key: string, value: T): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ストレージ容量超過などは無視
  }
};

// ──────────────────────────────────────────
// ベストスコア
// ──────────────────────────────────────────

/** ステージ別ベストスコアをすべて読み込む */
export const loadBestScores = (): Record<StageId, number> =>
  readJson<Record<StageId, number>>(KEYS.BEST_SCORES, {} as Record<StageId, number>);

/**
 * ベストスコアを更新する（現在値より高い場合のみ）。
 *
 * @returns 更新された場合 true（NEW BEST 表示に使用）
 */
export const saveBestScore = (stageId: StageId, score: number): boolean => {
  const scores = loadBestScores();
  const current = scores[stageId] ?? 0;
  if (score > current) {
    scores[stageId] = score;
    writeJson(KEYS.BEST_SCORES, scores);
    return true;
  }
  return false;
};

// ──────────────────────────────────────────
// クリア済みステージ
// ──────────────────────────────────────────

/** クリア済みステージIDリストを読み込む */
export const loadClearedStages = (): StageId[] =>
  readJson<StageId[]>(KEYS.CLEARED_STAGES, []);

/** ステージをクリア済みとして記録する */
export const markStageCleared = (stageId: StageId): void => {
  const cleared = loadClearedStages();
  if (!cleared.includes(stageId)) {
    cleared.push(stageId);
    writeJson(KEYS.CLEARED_STAGES, cleared);
  }
};


// ──────────────────────────────────────────
// スター記録
// ──────────────────────────────────────────

/** ステージ別スター数をすべて読み込む */
export const loadStarRecords = (): Record<StageId, number> =>
  readJson<Record<StageId, number>>(KEYS.STAR_RECORDS, {} as Record<StageId, number>);

/**
 * スター数を更新する（現在値より多い場合のみ）。
 */
export const saveStarRecord = (stageId: StageId, stars: number): void => {
  const records = loadStarRecords();
  const current = records[stageId] ?? 0;
  if (stars > current) {
    records[stageId] = stars;
    writeJson(KEYS.STAR_RECORDS, records);
  }
};

// ──────────────────────────────────────────
// 選択キャラクター
// ──────────────────────────────────────────

/** 選択中のキャラクターを読み込む（不正値は "Dozle" にフォールバック） */
export const loadSelectedCharacter = (): CharacterKey => {
  const val = readJson<string>(KEYS.SELECTED_CHARACTER, "Dozle");
  return (CHARACTER_KEYS as string[]).includes(val) ? (val as CharacterKey) : "Dozle";
};

/** 選択中のキャラクターを保存する */
export const saveSelectedCharacter = (key: CharacterKey): void => {
  writeJson(KEYS.SELECTED_CHARACTER, key);
};

// ──────────────────────────────────────────
// サウンド設定
// ──────────────────────────────────────────

/** タイピング効果音の有効フラグを読み込む（デフォルト: true） */
export const loadSfxEnabled = (): boolean =>
  readJson<boolean>(KEYS.SFX_ENABLED, true);

/** タイピング効果音の有効フラグを保存する */
export const saveSfxEnabled = (enabled: boolean): void => {
  writeJson(KEYS.SFX_ENABLED, enabled);
};

/** BGM の有効フラグを読み込む（デフォルト: true） */
export const loadBgmEnabled = (): boolean =>
  readJson<boolean>(KEYS.BGM_ENABLED, true);

/** BGM の有効フラグを保存する */
export const saveBgmEnabled = (enabled: boolean): void => {
  writeJson(KEYS.BGM_ENABLED, enabled);
};

// ──────────────────────────────────────────
// バトルモード クリア済みステージ
// ──────────────────────────────────────────

/** クリア済みバトルステージIDリストを読み込む */
export const loadClearedBattleStages = (): string[] =>
  readJson<string[]>(KEYS.CLEARED_BATTLE_STAGES, []);

/** バトルステージをクリア済みとして記録する */
export const markBattleStageCleared = (stageId: string): void => {
  const cleared = loadClearedBattleStages();
  if (!cleared.includes(stageId)) {
    cleared.push(stageId);
    writeJson(KEYS.CLEARED_BATTLE_STAGES, cleared);
  }
};

// ──────────────────────────────────────────
// バトルモード クリアタイム記録
// ──────────────────────────────────────────

/** ステージ別クリアタイム記録をすべて読み込む */
export const loadBattleTimeRecords = (): BattleTimeRecords =>
  readJson<BattleTimeRecords>(KEYS.BATTLE_TIME_RECORDS, {});

/**
 * クリアタイムを追加保存する（タイム昇順・最大5件）。
 *
 * @param stageId - バトルステージID
 * @param timeMs - クリアタイム（ミリ秒）
 */
export const saveBattleTimeRecord = (stageId: string, timeMs: number): void => {
  const records = loadBattleTimeRecords();
  const entry: BattleTimeRecord = { timeMs, date: new Date().toISOString() };
  const stageRecords = [...(records[stageId] ?? []), entry];
  stageRecords.sort((a, b) => a.timeMs - b.timeMs);
  records[stageId] = stageRecords.slice(0, 5);
  writeJson(KEYS.BATTLE_TIME_RECORDS, records);
};

/**
 * ステージのベストタイム（1位）を返す。記録なしは undefined。
 *
 * @param stageId - バトルステージID
 */
export const getBestBattleTime = (stageId: string): number | undefined =>
  loadBattleTimeRecords()[stageId]?.[0]?.timeMs;

// ──────────────────────────────────────────
// 全進捗リセット
// ──────────────────────────────────────────

/**
 * ゲーム進捗をすべて削除する（サウンド設定・キャラ選択は対象外）。
 * ノーマルモード・バトルモード両方の記録を消去する。
 */
export const resetProgress = (): void => {
  if (!isBrowser) return;
  [
    KEYS.BEST_SCORES,
    KEYS.CLEARED_STAGES,
    KEYS.STAR_RECORDS,
    KEYS.CLEARED_BATTLE_STAGES,
    KEYS.BATTLE_TIME_RECORDS,
  ].forEach((key) => localStorage.removeItem(key));
};
