"use client";

/**
 * ステージ選択カードコンポーネント。
 * 難易度カラー・ベストスコアを表示する。
 */

import { motion } from "framer-motion";
import type { Difficulty, StageConfig } from "@/types";
import { DIFFICULTY_CONFIG, DIFFICULTY_COLORS } from "@/lib/difficulty";

interface StageCardProps {
  stage: StageConfig;
  bestScore?: number;
  onSelect: (id: string) => void;
}


const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  cheat:   "CHEAT",
  normal:  "NORMAL",
  hard:    "HARD",
  kichiku: "鬼畜",
  dozle:   "ドズル社",
};

/** 難易度ごとのひらがな文字数目安ラベル */
const KANA_RANGE_LABELS: Record<Difficulty, string> = {
  cheat:   "2〜4文字",
  normal:  "5〜8文字",
  hard:    "9〜12文字",
  kichiku: "13文字以上",
  dozle:   "制限なし",
};

export const StageCard = ({
  stage,
  bestScore,
  onSelect,
}: StageCardProps) => {
  const color = DIFFICULTY_COLORS[stage.difficulty] ?? "#888";
  const label = DIFFICULTY_LABELS[stage.difficulty] ?? stage.difficulty.toUpperCase();
  const config = DIFFICULTY_CONFIG[stage.difficulty];
  const kanaRange = KANA_RANGE_LABELS[stage.difficulty] ?? "---";
  const secPerRomajiLabel =
    config.secPerRomaji === 0 ? "制限なし" : `${config.secPerRomaji}秒/文字`;

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
      <div className="text-white/60 text-xs mb-2">
        {stage.words.length} ワード
      </div>

      {/* テーマ */}
      <div className="text-white/70 text-xs mb-2 leading-snug">
        {stage.theme}
      </div>

      {/* ステージ説明 */}
      <div className="flex flex-col gap-0.5 mb-3">
        <div className="text-white/50 text-xs">
          ⏱ 制限時間：{config.totalSec}秒
        </div>
        <div className="text-white/50 text-xs">
          ⌨ 入力速度：{secPerRomajiLabel}
        </div>
        <div className="text-white/50 text-xs">
          あ 文字数目安：{kanaRange}
        </div>
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
