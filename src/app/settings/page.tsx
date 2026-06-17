"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MinecraftBg } from "@/components/MinecraftBg";
import { useGameStore } from "@/store/game-store";
import { resetProgress } from "@/lib/storage";

/** カードのフェードインアニメーション */
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.4 },
  }),
};

interface ToggleRowProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

/** ON/OFF トグル行コンポーネント */
const ToggleRow = ({ label, description, enabled, onToggle }: ToggleRowProps) => (
  <div className="flex items-center justify-between gap-4">
    <div className="min-w-0">
      <p className="text-white font-bold text-base">{label}</p>
      <p className="text-white/50 text-sm mt-0.5">{description}</p>
    </div>
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <button
        onClick={onToggle}
        aria-label={enabled ? `${label}をオフにする` : `${label}をオンにする`}
        className="relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none"
        style={{
          backgroundColor: enabled ? "#4ade80" : "#374151",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
        }}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
          style={{ left: enabled ? "calc(100% - 28px)" : "4px" }}
        />
      </button>
      <span
        className="text-xs font-bold"
        style={{ color: enabled ? "#4ade80" : "#9ca3af" }}
      >
        {enabled ? "ON" : "OFF"}
      </span>
    </div>
  </div>
);

export default function SettingsPage() {
  const router = useRouter();
  const sfxEnabled = useGameStore((s) => s.sfxEnabled);
  const toggleSfx = useGameStore((s) => s.toggleSfx);
  const bgmEnabled = useGameStore((s) => s.bgmEnabled);
  const toggleBgm = useGameStore((s) => s.toggleBgm);
  const loadProgress = useGameStore((s) => s.loadProgress);

  const [showConfirm, setShowConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  /** ノーマル・バトル両モードの進捗を全削除して Zustand ストアと同期 */
  const handleReset = () => {
    resetProgress();
    loadProgress();
    setShowConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <MinecraftBg>
      <div className="flex-1 flex flex-col items-center px-4 py-12 gap-6">

        {/* タイトル */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="text-5xl mb-3">⚙️</div>
          <h1
            className="text-3xl font-black"
            style={{
              color: "var(--color-brand-gold)",
              textShadow: "2px 2px 0 #000",
              fontFamily: "var(--font-zen-maru-gothic)",
            }}
          >
            設定
          </h1>
        </motion.div>

        <div className="w-full max-w-md flex flex-col gap-5">

          {/* Card 1: サウンド */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5"
          >
            <h2
              className="text-white font-black text-xl mb-4"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              🔊 サウンド
            </h2>

            <div className="flex flex-col gap-5">
              <ToggleRow
                label="BGM"
                description="ゲーム中に流れる音楽"
                enabled={bgmEnabled}
                onToggle={toggleBgm}
              />
              <div className="border-t border-white/10" />
              <ToggleRow
                label="タイピング音"
                description="正解・ミス・クリア時の効果音"
                enabled={sfxEnabled}
                onToggle={toggleSfx}
              />
            </div>
          </motion.div>

          {/* Card 2: データ管理 */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5"
          >
            <h2
              className="text-white font-black text-xl mb-4"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              🗑️ データ管理
            </h2>

            <div className="flex flex-col gap-3">
              <div>
                <p className="text-white font-bold text-base">プレイデータをリセット</p>
                <p className="text-white/50 text-sm mt-0.5">
                  ベストスコア・スター・クリア記録をすべて削除します
                </p>
              </div>

              <AnimatePresence mode="wait">
                {resetDone ? (
                  <motion.p
                    key="done"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-green-400 font-bold text-sm text-center py-2"
                  >
                    ✓ リセットしました
                  </motion.p>
                ) : showConfirm ? (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-900/40 border border-red-500/40 rounded-xl p-4 flex flex-col gap-3"
                  >
                    <p className="text-red-300 text-sm font-bold text-center">
                      本当にリセットしますか？<br />
                      <span className="font-normal text-white/60">この操作は元に戻せません</span>
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 py-2 rounded-lg bg-white/10 text-white/80 font-bold text-sm hover:bg-white/20 transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex-1 py-2 rounded-lg bg-red-600 text-white font-black text-sm hover:bg-red-500 transition-colors"
                      >
                        リセット実行
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowConfirm(true)}
                    className="w-full py-2.5 rounded-xl border border-red-500/50 text-red-400 font-bold text-base hover:bg-red-900/30 transition-colors"
                  >
                    リセットする
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* トップへ戻るボタン */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 active:scale-95 transition-all border border-white/20"
        >
          ← トップへ戻る
        </motion.button>
      </div>
    </MinecraftBg>
  );
}
