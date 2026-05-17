"use client";

/**
 * ゲーム中 BGM を制御するカスタムフック。
 * active が true になると指定難易度の BGM を開始し、
 * false になるとフェードアウトして停止する。
 */

import { useEffect } from "react";
import type { Difficulty } from "@/types";
import { playBgm } from "@/lib/bgm";

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
