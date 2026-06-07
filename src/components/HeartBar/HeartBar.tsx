"use client";

/**
 * バトルモード プレイヤーHP表示コンポーネント。
 * ハート10個で表現し、半ハート単位（1pt）で増減する。
 *
 * HP の対応：
 *   左のハートほど後から減る（右から左へ順に消えていく Minecraft スタイル）
 *   各ハート = 2pt / 半ハート = 1pt / 空ハート = 0pt
 */

import { motion } from "framer-motion";

interface HeartBarProps {
  playerHp: number;
}

type HeartState = "full" | "half" | "empty";

/**
 * ハートの状態を playerHp から計算する。
 * インデックス i（0=左端）の HP 範囲は i*2+1〜i*2+2。
 *
 * @param playerHp - 現在のプレイヤー HP（0〜20）
 * @returns 10個分のハート状態配列
 */
const calcHearts = (playerHp: number): HeartState[] =>
  Array.from({ length: 10 }, (_, i): HeartState => {
    if (playerHp >= i * 2 + 2) return "full";
    if (playerHp === i * 2 + 1) return "half";
    return "empty";
  });

const HEART_EMOJI: Record<HeartState, string> = {
  full: "❤️",
  half: "💔",
  empty: "🖤",
};

/**
 * プレイヤー HP をハート10個で表示するコンポーネント。
 *
 * @param playerHp - 現在のプレイヤー HP（0〜20）
 */
export const HeartBar = ({ playerHp }: HeartBarProps) => {
  const hearts = calcHearts(playerHp);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {hearts.map((state, i) => (
        <motion.span
          key={i}
          className="text-2xl leading-none select-none"
          animate={{ scale: state === "empty" ? 0.85 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {HEART_EMOJI[state]}
        </motion.span>
      ))}
    </div>
  );
};
