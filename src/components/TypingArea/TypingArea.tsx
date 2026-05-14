"use client";

/**
 * タイピング入力エリアコンポーネント。
 * ひらがな表示・英語ヒント・ローマ字入力欄（打ち済み/現在/未入力を色分け）を表示する。
 */

import { motion, AnimatePresence } from "framer-motion";
import type { WordEntry } from "@/types";

interface TypingAreaProps {
  currentWord: WordEntry | undefined;
  nextWord: WordEntry | undefined;
  typedBuffer: string;
  displayPattern: string;
  accuracy: number;
  isStarted: boolean;
}

export const TypingArea = ({
  currentWord,
  nextWord,
  typedBuffer,
  displayPattern,
  accuracy,
  isStarted,
}: TypingAreaProps) => {
  if (!currentWord) return null;

  const typedPart = displayPattern.slice(0, typedBuffer.length);
  const currentChar = displayPattern[typedBuffer.length] ?? "";
  const remainingPart = displayPattern.slice(typedBuffer.length + 1);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* メインカード */}
      <div className="bg-black/70 rounded-2xl border-2 border-white/20 p-6 shadow-2xl">

        {/* ひらがな表示 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.display}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="text-center mb-2"
          >
            <span
              className="text-4xl font-bold"
              style={{ fontFamily: "var(--font-zen-maru-gothic)", color: "var(--color-brand-gold)" }}
            >
              {currentWord.display}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* 英語ヒント */}
        {currentWord.hint && (
          <div className="text-center text-white/50 text-sm mb-4">
            {currentWord.hint}
          </div>
        )}

        {/* ローマ字入力欄 */}
        <div className="bg-black/50 rounded-xl p-4 font-mono text-2xl tracking-widest text-center border border-white/10">
          {/* 打ち済み */}
          <span className="text-green-400">{typedPart}</span>
          {/* 現在入力すべき文字（カーソル） */}
          <span
            className="relative text-white"
          >
            <span className="relative z-10">{currentChar}</span>
            <motion.span
              className="absolute inset-0 rounded"
              style={{ backgroundColor: "var(--color-brand-gold)" }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </span>
          {/* 未入力 */}
          <span className="text-white/30">{remainingPart}</span>
        </div>

        {/* 未入力表示（ゲーム開始前） */}
        {!isStarted && (
          <div className="text-center text-white/50 text-sm mt-3 animate-pulse">
            キーを押してスタート！
          </div>
        )}

        {/* 正確率バー */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-white/60 text-xs font-bold w-16">正確率</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${accuracy}%`,
                backgroundColor:
                  accuracy >= 90
                    ? "#4ade80"
                    : accuracy >= 70
                    ? "var(--color-brand-gold)"
                    : "var(--color-difficulty-hard)",
              }}
            />
          </div>
          <span className="text-white/80 text-xs font-mono w-12 text-right">
            {accuracy}%
          </span>
        </div>
      </div>

      {/* 次のワードプレビュー */}
      {nextWord && (
        <div className="mt-3 text-center text-white/40 text-sm">
          <span className="text-white/30">NEXT: </span>
          <span className="text-white/50 font-bold">{nextWord.display}</span>
          {nextWord.hint && (
            <span className="text-white/30 ml-2">({nextWord.hint})</span>
          )}
        </div>
      )}
    </div>
  );
};
