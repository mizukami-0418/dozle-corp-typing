/**
 * 難易度別ゲームパラメータ定義。
 *
 * totalSec     : ステージ制限時間（秒）
 * secPerRomaji : ワード制限時間の係数（ローマ字1文字あたりの秒数）
 *
 * ワード制限時間 = ceil(ローマ字文字数 × secPerRomaji) 秒
 */

import type { Difficulty } from "@/types";

export interface DifficultyConfig {
  totalSec: number;
  secPerRomaji: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  cheat:   { totalSec: 60,  secPerRomaji: 1.0  },
  normal:  { totalSec: 90,  secPerRomaji: 0.65 },
  hard:    { totalSec: 120, secPerRomaji: 0.4  },
  kichiku: { totalSec: 150, secPerRomaji: 0.25 },
  // secPerRomaji: 0 はワード制限時間なしを示すセンチネル値
  dozle:   { totalSec: 180, secPerRomaji: 0    },
};

/** タイムアウト時の減点（スコアの下限は 0） */
export const TIMEOUT_PENALTY = 30;
