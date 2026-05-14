"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";
import { StageCard } from "@/components/StageCard";
import { CHARACTER_KEYS, CHARACTER_CONFIGS } from "@/lib/characters";
import { STAGES } from "@/lib/words";
import { useGameStore } from "@/store/game-store";
import type { StageId } from "@/types";

/** ステージが解放済みか判定する */
const isUnlocked = (
  unlockReq: StageId | undefined,
  cleared: StageId[]
): boolean => {
  if (!unlockReq) return true;
  return cleared.includes(unlockReq);
};

const DIFFICULTY_LABELS = {
  easy: "EASY",
  normal: "NORMAL",
  hard: "HARD",
} as const;

const DIFFICULTY_COLORS = {
  easy: "#FDD835",
  normal: "#0097A7",
  hard: "#E53935",
} as const;

export default function HomePage() {
  const router = useRouter();
  const { selectedCharacter, setCharacter, clearedStages, bestScores, loadProgress } =
    useGameStore();

  // ローカルストレージから進捗を読み込む
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const handleStageSelect = (stageId: string) => {
    router.push(`/game/${stageId}`);
  };

  const groupedStages = {
    easy: STAGES.filter((s) => s.difficulty === "easy"),
    normal: STAGES.filter((s) => s.difficulty === "normal"),
    hard: STAGES.filter((s) => s.difficulty === "hard"),
  } as const;

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
            OFFICIAL FAN GAME
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
                    boxShadow: isSelected
                      ? `0 0 12px ${cfg.color}88`
                      : "none",
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
          className="w-full max-w-2xl flex flex-col gap-6 pb-16"
        >
          {(["easy", "normal", "hard"] as const).map((diff) => (
            <div key={diff}>
              {/* 難易度ヘッダー */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="px-3 py-1 rounded font-black text-sm text-black"
                  style={{ backgroundColor: DIFFICULTY_COLORS[diff] }}
                >
                  {DIFFICULTY_LABELS[diff]}
                </div>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              {/* ステージカード */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {groupedStages[diff].map((stage) => {
                  const locked = !isUnlocked(stage.unlockRequirement, clearedStages);
                  return (
                    <StageCard
                      key={stage.id}
                      stage={stage}
                      isLocked={locked}
                      bestScore={bestScores[stage.id]}
                      onSelect={handleStageSelect}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </MinecraftBg>
  );
}
