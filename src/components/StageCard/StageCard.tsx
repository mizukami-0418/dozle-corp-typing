"use client";

/**
 * ステージ選択カードコンポーネント。
 * 難易度カラー・ベストスコアを表示する。
 */

import { motion } from "framer-motion";
import type { StageConfig } from "@/types";

interface StageCardProps {
  stage: StageConfig;
  bestScore?: number;
  onSelect: (id: string) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  cheat: "#FDD835",
  normal: "#0097A7",
  hard: "#E53935",
  kichiku: "#7B1FA2",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  cheat: "CHEAT",
  normal: "NORMAL",
  hard: "HARD",
  kichiku: "鬼畜",
};

export const StageCard = ({
  stage,
  bestScore,
  onSelect,
}: StageCardProps) => {
  const color = DIFFICULTY_COLORS[stage.difficulty] ?? "#888";
  const label = DIFFICULTY_LABELS[stage.difficulty] ?? stage.difficulty.toUpperCase();

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(stage.id)}
      className="relative w-full rounded-xl border-4 p-4 text-left transition-shadow cursor-pointer shadow-lg hover:shadow-xl bg-black/60"
      style={{ borderColor: color }}
    >
      {/* 難易度バッジ */}
      <div
        className="inline-block text-xs font-black px-2 py-0.5 rounded mb-2"
        style={{ backgroundColor: color, color: "#000" }}
      >
        {label}
      </div>

      {/* ステージ名 */}
      <div className="text-white font-bold text-base leading-tight mb-2">
        {stage.name}
      </div>

      {/* ワード数 */}
      <div className="text-white/60 text-xs mb-3">
        {stage.words.length} ワード
      </div>

      {/* ベストスコア */}
      <div className="text-xs font-mono" style={{ color }}>
        BEST:{" "}
        {bestScore !== undefined && bestScore > 0
          ? bestScore.toLocaleString()
          : "---"}
      </div>
    </motion.button>
  );
};
