"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";
import { HUD } from "@/components/HUD";
import { Character } from "@/components/Character";
import { TypingArea } from "@/components/TypingArea";
import { ParticleEffect, CelebrationEffect } from "@/components/effects";
import { useTypingGame } from "@/hooks/useTypingGame";
import { useBgm } from "@/hooks/useBgm";
import { getStageById } from "@/lib/words";
import { DIFFICULTY_COLORS } from "@/lib/difficulty";
import { useGameStore } from "@/store/game-store";
import { CHARACTER_CONFIGS } from "@/lib/characters";
import type { StageId } from "@/types";

type CharAnimState = "idle" | "correct" | "cleared";

export default function GamePage() {
  const params = useParams<{ stage: string }>();
  const router = useRouter();
  const { selectedCharacter, bgmEnabled } = useGameStore();

  const stageId = params.stage as StageId;
  const stage = getStageById(stageId);

  const {
    currentWord,
    nextWord,
    typedBuffer,
    displayPattern,
    score,
    missCount,
    accuracy,
    wordsCompleted,
    totalTimeRemainingMs,
    wordTimeRemainingMs,
    wordTimeLimitMs,
    isStarted,
    isCleared,
  } = useTypingGame(stageId, stage?.words ?? []);

  // キャラクターのアニメーション状態管理
  const [charAnimState, setCharAnimState] = useState<CharAnimState>("idle");
  // ワード正解ごとにインクリメント → ParticleEffect が発火する
  const [correctCount, setCorrectCount] = useState(0);
  const prevWordsCompletedRef = useRef(wordsCompleted);

  useEffect(() => {
    if (isCleared) {
      setTimeout(() => {
        setCharAnimState("cleared");
        setCorrectCount((n) => n + 1);
      }, 0);
      return;
    }
    const prev = prevWordsCompletedRef.current;
    prevWordsCompletedRef.current = wordsCompleted;
    if (wordsCompleted > prev) {
      const t1 = setTimeout(() => {
        setCharAnimState("correct");
        setCorrectCount((n) => n + 1);
      }, 0);
      const t2 = setTimeout(() => setCharAnimState("idle"), 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [wordsCompleted, isCleared]);

  const accentColor = CHARACTER_CONFIGS[selectedCharacter]?.color ?? "#FFD700";

  const difficultyColor =
    stage ? (DIFFICULTY_COLORS[stage.difficulty] ?? "#FFD700") : "#FFD700";

  // ゲーム開始後・クリア前・BGM有効時にBGMを再生
  useBgm(stageId, isStarted && !isCleared && bgmEnabled);

  // 終了確認ダイアログの表示状態
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  // ESC キーで確認ダイアログを開閉する
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCleared) {
        setShowQuitDialog((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCleared]);

  // タイムアップ後 2 秒でリザルト画面へ遷移
  useEffect(() => {
    if (!isCleared) return;
    const t = setTimeout(() => router.push("/result"), 2000);
    return () => clearTimeout(t);
  }, [isCleared, router]);

  if (!stage) {
    return (
      <MinecraftBg>
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
          <p className="text-white text-xl font-bold">
            ステージが見つかりません
          </p>
          <button
            onClick={() => router.push("/stages")}
            className="px-6 py-2 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition"
          >
            ステージへ戻る
          </button>
        </div>
      </MinecraftBg>
    );
  }

  return (
    <MinecraftBg>
      {/* ワード正解パーティクル */}
      <ParticleEffect trigger={correctCount} accentColor={accentColor} />

      {/* タイムアップコンフェッティ */}
      <CelebrationEffect active={isCleared} />

      <div className="min-h-screen flex flex-col">
        {/* HUD */}
        <HUD
          score={score}
          totalTimeRemainingMs={totalTimeRemainingMs}
          wordTimeRemainingMs={wordTimeRemainingMs}
          wordTimeLimitMs={wordTimeLimitMs}
          missCount={missCount}
          accuracy={accuracy}
        />

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-6">
          {/* キャラクター */}
          <div className="flex-shrink-0">
            <Character
              characterKey={selectedCharacter}
              animationState={charAnimState}
            />
          </div>

          {/* タイピングエリア */}
          <div className="flex-1 w-full max-w-xl flex flex-col gap-3">
            {/* ステージ名 */}
            <div className="text-center pb-1">
              <span
                className="inline-block text-sm font-bold px-4 py-1 rounded-full border"
                style={{
                  color: difficultyColor,
                  borderColor: difficultyColor + "80",
                  backgroundColor: difficultyColor + "18",
                  fontFamily: "var(--font-zen-maru-gothic)",
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                {stage.name}
              </span>
            </div>
            <TypingArea
              currentWord={currentWord}
              nextWord={nextWord}
              typedBuffer={typedBuffer}
              displayPattern={displayPattern}
              accuracy={accuracy}
              isStarted={isStarted}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowQuitDialog(true)}
                className="px-4 py-1.5 rounded-lg bg-black/60 border border-white/30 text-white/80 text-sm font-bold hover:bg-red-900/70 hover:border-red-400/60 hover:text-white transition"
                aria-label="ゲームを終了する"
              >
                ✕ ゲームをやめる
              </button>
            </div>
          </div>
        </div>

        {/* 終了確認ダイアログ */}
        <AnimatePresence>
          {showQuitDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-gray-900 border border-white/20 rounded-2xl px-8 py-6 flex flex-col items-center gap-5 min-w-[280px]"
              >
                <p className="text-white font-bold text-lg">
                  ゲームを終了しますか？
                </p>
                <p className="text-white/50 text-sm">スコアは保存されません</p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => router.push("/stages")}
                    className="flex-1 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold transition"
                  >
                    やめる
                  </button>
                  <button
                    onClick={() => setShowQuitDialog(false)}
                    className="flex-1 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition"
                  >
                    続ける
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* タイムアップオーバーレイ */}
        <AnimatePresence>
          {isCleared && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-5xl font-black mb-2"
                  style={{
                    color: "var(--color-brand-gold)",
                    textShadow: "2px 2px 0 #000, 0 0 20px rgba(255,215,0,0.6)",
                  }}
                >
                  TIME UP!
                </motion.div>
                <div className="text-white/80 text-lg font-bold mb-3">
                  {wordsCompleted} ワード クリア！
                </div>
                <div className="flex justify-center gap-2 mb-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="text-3xl"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.3 + i * 0.15,
                        type: "spring",
                        stiffness: 300,
                        damping: 12,
                      }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
                <div className="text-white/70 text-sm animate-pulse">
                  リザルト画面へ移動中…
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MinecraftBg>
  );
}
