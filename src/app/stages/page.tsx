"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";
import { StageCard } from "@/components/StageCard";
import { CHARACTER_KEYS, CHARACTER_CONFIGS } from "@/lib/characters";
import { STAGES } from "@/lib/words";
import { useGameStore } from "@/store/game-store";

export default function StagesPage() {
  const router = useRouter();
  const { selectedCharacter, setCharacter, bestScores, loadProgress } =
    useGameStore();

  const regularStages = STAGES.filter((s) => s.id !== "dozle");
  const dozleStage = STAGES.find((s) => s.id === "dozle");

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const handleStageSelect = (stageId: string) => {
    router.push(`/game/${stageId}`);
  };

  return (
    <MinecraftBg>
      <div className="min-h-screen flex flex-col items-center px-4 py-8 gap-8">
        {/* ロゴ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-4"
        >
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg"
            style={{
              color: "var(--color-brand-gold)",
              fontFamily: "var(--font-zen-maru-gothic)",
              textShadow: "2px 2px 0 #000, 4px 4px 0 rgba(0,0,0,0.3)",
            }}
          >
            ドズル社タイピング
          </h1>
          <p className="text-white/70 text-sm font-bold tracking-widest mt-1">
            UNOFFICIAL FAN GAME
          </p>
        </motion.div>

        {/* キャラクター選択 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <p className="text-white/80 text-sm font-bold text-center mb-3">
            キャラクターを選んでね！
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {CHARACTER_KEYS.map((key) => {
              const cfg = CHARACTER_CONFIGS[key];
              const isSelected = selectedCharacter === key;
              return (
                <button
                  key={key}
                  onClick={() => setCharacter(key)}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: isSelected ? cfg.color : "transparent",
                    backgroundColor: isSelected
                      ? cfg.color + "33"
                      : "rgba(0,0,0,0.4)",
                    boxShadow: isSelected ? `0 0 12px ${cfg.color}88` : "none",
                  }}
                >
                  <span className="text-3xl">{cfg.emoji}</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: isSelected ? cfg.color : "white" }}
                  >
                    {cfg.name}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ステージ一覧 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-full max-w-2xl pb-16"
        >
          <p className="text-white/80 text-sm font-bold text-center mb-4">
            ステージを選んでね！
          </p>
          {/* 通常ステージ（2×2 グリッド） */}
          <div className="grid grid-cols-2 gap-4">
            {regularStages.map((stage) => (
              <StageCard
                key={stage.id}
                stage={stage}
                bestScore={bestScores[stage.id]}
                onSelect={handleStageSelect}
              />
            ))}
          </div>

          {/* ドズル社モード（全幅・特別カード） */}
          {dozleStage && (
            <div className="mt-4">
              <StageCard
                stage={dozleStage}
                bestScore={bestScores[dozleStage.id]}
                onSelect={handleStageSelect}
              />
            </div>
          )}
        </motion.div>

        {/* トップへ戻るボタン */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 active:scale-95 transition-all border border-white/20"
        >
          ← トップへ戻る
        </motion.button>
      </div>
    </MinecraftBg>
  );
}
