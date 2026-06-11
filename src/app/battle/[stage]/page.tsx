"use client";

/**
 * バトルモード ゲーム画面。
 * useBattleGame フックを使い、モンスターを順番に撃破してステージクリアを目指す。
 */

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MinecraftBg } from "@/components/MinecraftBg";
import { TypingArea } from "@/components/TypingArea";
import { HeartBar } from "@/components/HeartBar";
import { MonsterCard } from "@/components/MonsterCard";
import { ParticleEffect } from "@/components/effects";
import { useBattleGame } from "@/hooks/useBattleGame";
import { useBattleBgm } from "@/hooks/useBgm";
import { useGameStore } from "@/store/game-store";
import { CHARACTER_CONFIGS } from "@/lib/characters";
import {
  getBattleStageById,
  BATTLE_STAGE_ORDER,
  BATTLE_STAGE_COLORS,
} from "@/lib/battle-stages";
import type { BattleStageId } from "@/types";

export default function BattleGamePage() {
  const params = useParams<{ stage: string }>();
  const router = useRouter();
  const { selectedCharacter, loadProgress, bgmEnabled } = useGameStore();

  const stageId = params.stage as BattleStageId;
  const stage = getBattleStageById(stageId);
  const stageColor = BATTLE_STAGE_COLORS[stageId] ?? "#FFD700";
  const accentColor = CHARACTER_CONFIGS[selectedCharacter]?.color ?? "#FFD700";

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const {
    currentWord,
    matcherState,
    wordTimeRemainingMs,
    wordTimeLimitMs,
    monsterIndex,
    monsterCount,
    currentMonster,
    monsterHp,
    playerHp,
    phase,
    missCount,
    wordsCompleted,
    accuracy,
    isStarted,
  } = useBattleGame(stageId);

  useBattleBgm(
    stageId,
    isStarted && phase !== "stage-clear" && phase !== "game-over" && bgmEnabled,
  );

  // 撃破オーバーレイ画像エラー（モンスター切替時にリセット）
  const [defeatImgError, setDefeatImgError] = useState(false);
  useEffect(() => {
    setTimeout(() => setDefeatImgError(false), 0);
  }, [monsterIndex]);

  // ワード正解時にパーティクルを発火（game/[stage]/page.tsx と同パターン）
  const [correctCount, setCorrectCount] = useState(0);
  const prevWordsCompletedRef = useRef(wordsCompleted);
  useEffect(() => {
    const prev = prevWordsCompletedRef.current;
    prevWordsCompletedRef.current = wordsCompleted;
    if (wordsCompleted > prev) {
      setTimeout(() => setCorrectCount((n) => n + 1), 0);
    }
  }, [wordsCompleted]);

  // 終了確認ダイアログ
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  // ESC キーでダイアログ開閉
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "playing") {
        setShowQuitDialog((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase]);

  // stage-clear 後 3 秒でバトル選択画面へ
  useEffect(() => {
    if (phase !== "stage-clear") return;
    const t = setTimeout(() => router.push("/battle"), 3000);
    return () => clearTimeout(t);
  }, [phase, router]);

  // ステージ未発見
  if (!stage) {
    return (
      <MinecraftBg>
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-white text-xl font-bold">
            ステージが見つかりません
          </p>
          <button
            onClick={() => router.push("/battle")}
            className="px-6 py-2 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition"
          >
            バトル選択へ戻る
          </button>
        </div>
      </MinecraftBg>
    );
  }

  // 次ステージ（stage-clear 後の遷移先）
  const stageIdx = BATTLE_STAGE_ORDER.indexOf(stageId);
  const nextStageId = BATTLE_STAGE_ORDER[stageIdx + 1] as BattleStageId | undefined;

  // ワードタイマーの割合（0〜1）
  const wordTimerRatio =
    wordTimeLimitMs > 0 ? wordTimeRemainingMs / wordTimeLimitMs : 1;
  const timerColor =
    wordTimerRatio > 0.4
      ? "#22c55e"
      : wordTimerRatio > 0.2
        ? "#f59e0b"
        : "#ef4444";

  return (
    <MinecraftBg>
      {/* パーティクルエフェクト */}
      <ParticleEffect trigger={correctCount} accentColor={accentColor} />

      <div className="flex-1 flex flex-col">
        {/* ── トップバー ── */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-white/10"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black px-2 py-0.5 rounded"
              style={{ backgroundColor: stageColor, color: "#000" }}
            >
              {stage.name}
            </span>
            <span className="text-white/80 text-sm font-bold">
              {stage.theme}
            </span>
          </div>
          <span className="text-white font-black text-lg">
            {monsterIndex + 1}
            <span className="text-white/50 font-bold text-sm"> / {monsterCount}</span>
          </span>
        </div>

        {/* ── メインコンテンツ ── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-4">
          {/* モンスターエリア */}
          {currentMonster && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${monsterIndex}-${currentMonster.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <MonsterCard
                  monster={currentMonster}
                  currentHp={monsterHp}
                  accentColor={stageColor}
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* プレイヤー HP */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-white/60 text-xs font-bold">プレイヤー HP</p>
            <HeartBar playerHp={playerHp} />
          </div>

          {/* ワードタイマーバー */}
          <div className="w-full max-w-xl">
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${wordTimerRatio * 100}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
                style={{ backgroundColor: timerColor }}
              />
            </div>
          </div>

          {/* タイピングエリア */}
          <div className="w-full max-w-xl">
            <TypingArea
              currentWord={currentWord}
              nextWord={undefined}
              matcherState={matcherState}
              accuracy={accuracy}
              isStarted={isStarted}
            />
          </div>

          {/* やめるボタン */}
          <div className="flex justify-end w-full max-w-xl">
            <button
              onClick={() => setShowQuitDialog(true)}
              className="px-4 py-1.5 rounded-lg bg-black/60 border border-white/30 text-white/80 text-sm font-bold hover:bg-red-900/70 hover:border-red-400/60 hover:text-white transition"
            >
              ✕ ゲームをやめる
            </button>
          </div>
        </div>
      </div>

      {/* ── 終了確認ダイアログ ── */}
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
              <p className="text-white/50 text-sm">進捗は保存されません</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => router.push("/battle")}
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

      {/* ── 撃破オーバーレイ ── */}
      <AnimatePresence>
        {phase === "monster-defeated" && currentMonster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-center"
            >
              <div className="mb-3 flex justify-center">
                {!defeatImgError ? (
                  <Image
                    src={`/images/monsters/${currentMonster.id}.png`}
                    alt={currentMonster.name}
                    width={120}
                    height={120}
                    className="object-contain"
                    style={{ imageRendering: "pixelated" }}
                    onError={() => setDefeatImgError(true)}
                  />
                ) : (
                  <span className="text-7xl leading-none">{currentMonster.emoji}</span>
                )}
              </div>
              <motion.div
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 0.4, repeat: Infinity }}
                className="text-4xl font-black"
                style={{
                  color: stageColor,
                  textShadow: `2px 2px 0 #000, 0 0 20px ${stageColor}88`,
                  fontFamily: "var(--font-zen-maru-gothic)",
                }}
              >
                撃破！
              </motion.div>
              <p className="text-white/80 font-bold mt-2">
                {currentMonster.name} を倒した！
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ゲームオーバーオーバーレイ ── */}
      <AnimatePresence>
        {phase === "game-over" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-center flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-6xl font-black"
                style={{
                  color: "#ef4444",
                  textShadow: "3px 3px 0 #000, 0 0 30px #ef444488",
                  fontFamily: "var(--font-zen-maru-gothic)",
                }}
              >
                GAME OVER
              </motion.div>
              <p className="text-white/70 text-sm font-bold">
                {stage.name} からやり直し
              </p>
              <p className="text-white/50 text-xs">
                ミス数: {missCount}
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => router.push(`/battle/${stageId}`)}
                  className="px-6 py-3 rounded-xl font-black text-white transition"
                  style={{
                    backgroundColor: "#ef4444",
                    boxShadow: "0 4px 0 #991b1b",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ef4444";
                  }}
                >
                  もう一度！
                </button>
                <button
                  onClick={() => router.push("/battle")}
                  className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition"
                >
                  選択へ戻る
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ステージクリアオーバーレイ ── */}
      <AnimatePresence>
        {phase === "stage-clear" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-center flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-5xl font-black"
                style={{
                  color: "var(--color-brand-gold)",
                  textShadow: "2px 2px 0 #000, 0 0 20px rgba(255,215,0,0.6)",
                  fontFamily: "var(--font-zen-maru-gothic)",
                }}
              >
                STAGE CLEAR!
              </motion.div>
              <p className="text-white/80 font-bold">
                {stage.name} クリア！
              </p>
              <div className="flex justify-center gap-1 mb-1">
                {stage.monsters.map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <p className="text-white/50 text-sm animate-pulse">
                3秒後にステージ選択へ…
              </p>
              <div className="flex gap-3">
                {nextStageId && (
                  <button
                    onClick={() => router.push(`/battle/${nextStageId}`)}
                    className="px-6 py-3 rounded-xl font-black text-black transition"
                    style={{ backgroundColor: "var(--color-brand-gold)" }}
                  >
                    次のステージへ →
                  </button>
                )}
                <button
                  onClick={() => router.push("/battle")}
                  className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition"
                >
                  ステージ選択へ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MinecraftBg>
  );
}
