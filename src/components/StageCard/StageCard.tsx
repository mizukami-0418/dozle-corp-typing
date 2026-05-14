"use client";

/**
 * ステージ選択カードコンポーネント。
 * 難易度カラー・鍵マーク（未解放）・ベストスコアを表示する。
 */

import { motion } from "framer-motion";
import type { StageConfig } from "@/types";

interface StageCardProps {
  stage: StageConfig;
  isLocked: boolean;
  bestScore?: number;
  onSelect: (id: string) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#FDD835",
  normal: "#0097A7",
  hard: "#E53935",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "EASY",
  normal: "NORMAL",
  hard: "HARD",
};

export const StageCard = ({
  stage,
  isLocked,
  bestScore,
  onSelect,
}: StageCardProps) => {
  const color = DIFFICULTY_COLORS[stage.difficulty];
  const label = DIFFICULTY_LABELS[stage.difficulty];

  return (
    <motion.button
      whileHover={isLocked ? {} : { scale: 1.04, y: -4 }}
      whileTap={isLocked ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={() => !isLocked && onSelect(stage.id)}
      className={`
        relative w-full rounded-xl border-4 p-4 text-left transition-shadow
        ${isLocked
          ? "opacity-60 cursor-not-allowed border-gray-500 bg-gray-800/70"
          : "cursor-pointer shadow-lg hover:shadow-xl bg-black/60"
        }
      `}
      style={{ borderColor: isLocked ? undefined : color }}
      aria-disabled={isLocked}
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
      {!isLocked && (
        <div className="text-xs font-mono" style={{ color }}>
          BEST:{" "}
          {bestScore !== undefined && bestScore > 0
            ? bestScore.toLocaleString()
            : "---"}
        </div>
      )}

      {/* 鍵マーク */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
          <span className="text-4xl opacity-60">🔒</span>
        </div>
      )}
    </motion.button>
  );
};
