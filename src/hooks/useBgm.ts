"use client";

/**
 * ゲーム中 BGM を制御するカスタムフック。
 * active が true になると指定難易度の BGM を開始し、
 * false になるとフェードアウトして停止する。
 */

import { useEffect } from "react";
import type { BattleStageId, Difficulty } from "@/types";
import { playBattleBgm, playBgm } from "@/lib/bgm";

/**
 * @param difficulty - 再生する難易度トラック
 * @param active     - true のとき BGM を再生する（isStarted && !isCleared && bgmEnabled）
 */
export const useBgm = (difficulty: Difficulty, active: boolean): void => {
  useEffect(() => {
    if (!active) return;
    const stop = playBgm(difficulty);
    return stop;
  }, [active, difficulty]);
};

/**
 * @param stageId - バトルステージ識別子
 * @param active  - true のとき BGM を再生する
 */
export const useBattleBgm = (stageId: BattleStageId, active: boolean): void => {
  useEffect(() => {
    if (!active) return;
    const stop = playBattleBgm(stageId);
    return stop;
  }, [active, stageId]);
};
