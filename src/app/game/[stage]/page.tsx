"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";
import { HUD } from "@/components/HUD";
import { Character } from "@/components/Character";
import { TypingArea } from "@/components/TypingArea";
import { useTypingGame } from "@/hooks/useTypingGame";
import { getStageById } from "@/lib/words";
import { useGameStore } from "@/store/game-store";
import type { StageId } from "@/types";

type CharAnimState = "idle" | "correct" | "cleared";

export default function GamePage() {
  const params = useParams<{ stage: string }>();
  const router = useRouter();
  const { selectedCharacter } = useGameStore();

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
    wpm,
    wordIndex,
    totalWords,
    isStarted,
    isCleared,
  } = useTypingGame(stageId, stage?.words ?? []);

  // キャラクターのアニメーション状態管理
  const [charAnimState, setCharAnimState] = useState<CharAnimState>("idle");
  const prevWordIdxRef = useRef(wordIndex);

  useEffect(() => {
    if (isCleared) {
      const t = setTimeout(() => setCharAnimState("cleared"), 0);
      return () => clearTimeout(t);
    }
    const prev = prevWordIdxRef.current;
    prevWordIdxRef.current = wordIndex;
    if (wordIndex > prev) {
      const t1 = setTimeout(() => setCharAnimState("correct"), 0);
      const t2 = setTimeout(() => setCharAnimState("idle"), 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [wordIndex, isCleared]);

  // クリア後2秒でリザルト画面へ遷移
  useEffect(() => {
    if (!isCleared) return;
    const t = setTimeout(() => router.push("/result"), 2000);
    return () => clearTimeout(t);
  }, [isCleared, router]);

  // 存在しないステージへのアクセス
  if (!stage) {
    return (
      <MinecraftBg>
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
          <p className="text-white text-xl font-bold">ステージが見つかりません</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition"
          >
            ホームへ戻る
          </button>
        </div>
      </MinecraftBg>
    );
  }

  return (
    <MinecraftBg>
      <div className="min-h-screen flex flex-col">
        {/* HUD */}
        <HUD
          score={score}
          wordIndex={wordIndex}
          totalWords={totalWords}
          missCount={missCount}
          accuracy={accuracy}
          wpm={wpm}
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
          <div className="flex-1 w-full max-w-xl">
            <TypingArea
              currentWord={currentWord}
              nextWord={nextWord}
              typedBuffer={typedBuffer}
              displayPattern={displayPattern}
              accuracy={accuracy}
              isStarted={isStarted}
            />
          </div>
        </div>

        {/* ステージ名表示 */}
        <div className="text-center text-white/50 text-xs pb-4">
          {stage.name}
        </div>

        {/* クリアオーバーレイ */}
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
                <div
                  className="text-5xl font-black mb-2"
                  style={{
                    color: "var(--color-brand-gold)",
                    textShadow: "2px 2px 0 #000",
                  }}
                >
                  STAGE CLEAR!
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
