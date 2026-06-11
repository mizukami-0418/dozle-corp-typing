"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";
import { Character } from "@/components/Character";
import { useGameStore } from "@/store/game-store";
import { getStageById } from "@/lib/words";

/** ミリ秒を M:SS 形式に変換する */
const formatTime = (ms: number): string => {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function ResultPage() {
  const router = useRouter();
  const { resultData, selectedCharacter } = useGameStore();

  // resultData がない場合（直接アクセスやリロード）はホームへ
  useEffect(() => {
    if (!resultData) {
      router.replace("/");
    }
  }, [resultData, router]);

  if (!resultData) return null;

  const stage = getStageById(resultData.stageId);
  const stars = resultData.stars;

  const handleRetry = () => {
    router.push(`/game/${resultData.stageId}`);
  };

  const handleBack = () => {
    router.push("/stages");
  };

  return (
    <MinecraftBg>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">
        {/* TIME UP バッジ */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="text-center"
        >
          <div
            className="text-4xl md:text-5xl font-black tracking-tight"
            style={{
              color: "var(--color-brand-gold)",
              textShadow: "2px 2px 0 #000, 4px 4px 0 rgba(0,0,0,0.3)",
            }}
          >
            TIME UP!
          </div>
          {stage && (
            <div className="text-white/70 text-sm mt-1">{stage.name}</div>
          )}
        </motion.div>

        {/* スター */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2"
        >
          {[1, 2, 3].map((n) => (
            <motion.span
              key={n}
              initial={{ scale: 0 }}
              animate={{ scale: n <= stars ? 1 : 0.6 }}
              transition={{ delay: 0.3 + n * 0.1, type: "spring" }}
              className="text-4xl"
              style={{ filter: n <= stars ? "none" : "grayscale(1) opacity(0.4)" }}
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>

        {/* キャラクター */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Character characterKey={selectedCharacter} animationState="cleared" />
        </motion.div>

        {/* スコアカード */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-sm bg-black/70 rounded-2xl border border-white/20 p-5 flex flex-col gap-3"
        >
          {/* スコア */}
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm font-bold">SCORE</span>
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-black font-mono"
                style={{ color: "var(--color-brand-gold)" }}
              >
                {resultData.score.toLocaleString()}
              </span>
              {resultData.isNewBest && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="text-xs font-black px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: "var(--color-brand-gold)",
                    color: "#000",
                  }}
                >
                  NEW BEST!
                </motion.span>
              )}
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* 詳細 */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-white/50 text-xs">正確率</div>
              <div
                className="text-lg font-bold"
                style={{
                  color:
                    resultData.accuracy >= 90
                      ? "#4ade80"
                      : resultData.accuracy >= 70
                      ? "var(--color-brand-gold)"
                      : "var(--color-difficulty-hard)",
                }}
              >
                {resultData.accuracy}%
              </div>
            </div>
            <div>
              <div className="text-white/50 text-xs">WORDS</div>
              <div className="text-lg font-bold" style={{ color: "var(--color-brand-gold)" }}>
                {resultData.wordsCompleted}
              </div>
            </div>
            <div>
              <div className="text-white/50 text-xs">MISS</div>
              <div
                className="text-lg font-bold"
                style={{
                  color:
                    resultData.missCount === 0
                      ? "#4ade80"
                      : "var(--color-difficulty-hard)",
                }}
              >
                {resultData.missCount}
              </div>
            </div>
            <div>
              <div className="text-white/50 text-xs">TIME</div>
              <div className="text-lg font-bold text-white font-mono">
                {formatTime(resultData.elapsedMs)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ボタン */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3"
        >
          <button
            onClick={handleBack}
            className="px-5 py-2.5 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 active:scale-95 transition-all border border-white/20"
          >
            ステージへ戻る
          </button>
          <button
            onClick={handleRetry}
            className="px-5 py-2.5 rounded-xl font-black text-black active:scale-95 transition-all"
            style={{ backgroundColor: "var(--color-brand-gold)" }}
          >
            もう一度！
          </button>
        </motion.div>
      </div>
    </MinecraftBg>
  );
}
