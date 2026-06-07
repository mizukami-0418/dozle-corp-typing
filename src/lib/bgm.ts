/**
 * ゲーム中 BGM 再生モジュール。
 *
 * ノーマルモード（難易度別 5 曲）とバトルモード（ステージ別 6 曲）の
 * 音声ファイルを HTMLAudioElement でループ再生する。
 */

import type { BattleStageId, Difficulty } from "@/types";

// ──────────────────────────────────────────────────
// 音声ファイルベース再生
// ──────────────────────────────────────────────────

/** ノーマルモード 難易度別 BGM ファイルパス */
const BGM_FILE_PATHS: Record<Difficulty, string> = {
  cheat:   "/bgm/normal-cheat.mp3",
  normal:  "/bgm/normal-normal.mp3",
  hard:    "/bgm/normal-hard.mp3",
  kichiku: "/bgm/normal-kichiku.mp3",
  dozle:   "/bgm/normal-dozle.mp3",
};

/** バトルモード ステージ別 BGM ファイルパス */
const BATTLE_BGM_FILE_PATHS: Record<BattleStageId, string> = {
  "zombie":          "/bgm/battle-zombie.mp3",
  "drowned":         "/bgm/battle-drowned.mp3",
  "wither-skeleton": "/bgm/battle-wither-skeleton.mp3",
  "shulker":         "/bgm/battle-shulker.mp3",
  "ender-dragon":    "/bgm/battle-ender-dragon.mp3",
  "dozle-battle":    "/bgm/battle-dozle-battle.mp3",
};

/** ファイル再生時の音量 */
const FILE_VOLUME = 0.4;

/**
 * 音声ファイルをループ再生する。
 *
 * @param src - 音声ファイルの public パス
 * @returns 停止関数
 */
const playBgmFile = (src: string): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = FILE_VOLUME;
  void audio.play().catch(() => {});
  return () => {
    audio.pause();
    audio.currentTime = 0;
  };
};

// ──────────────────────────────────────────────────
// 公開 API
// ──────────────────────────────────────────────────

/**
 * 指定難易度の BGM をループ再生する。
 *
 * @param difficulty - 再生するトラックの難易度
 * @returns stopFn — 呼び出すと停止する関数
 */
export const playBgm = (difficulty: Difficulty): (() => void) =>
  playBgmFile(BGM_FILE_PATHS[difficulty]);

/**
 * 指定バトルステージの BGM をループ再生する。
 *
 * @param stageId - バトルステージ識別子
 * @returns stopFn — 呼び出すと停止する関数
 */
export const playBattleBgm = (stageId: BattleStageId): (() => void) =>
  playBgmFile(BATTLE_BGM_FILE_PATHS[stageId]);
