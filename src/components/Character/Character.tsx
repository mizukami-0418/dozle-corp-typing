"use client";

/**
 * キャラクターコンポーネント。
 * アイドル時は y 軸上下アニメーション、クリア時は scale + rotate のお祝いアニメーション。
 */

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { CharacterKey } from "@/types";
import {
  CHARACTER_CONFIGS,
  getRandomCorrectMessage,
  getRandomClearedMessage,
} from "@/lib/characters";

type AnimationState = "idle" | "correct" | "cleared";

interface CharacterProps {
  characterKey: CharacterKey;
  animationState?: AnimationState;
}

export const Character = ({
  characterKey,
  animationState = "idle",
}: CharacterProps) => {
  const config = CHARACTER_CONFIGS[characterKey];

  /**
   * アイドルメッセージは 4 秒ごとに順番に切り替える。
   * setInterval のコールバック内（非同期）で setState するため
   * react-hooks/set-state-in-effect は対象外。
   */
  const [idleTick, setIdleTick] = useState(0);
  useEffect(() => {
    if (animationState !== "idle") return;
    const id = setInterval(() => setIdleTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, [animationState]);

  /**
   * メッセージをエフェクトなしで導出する。
   * animationState が変わるたびに useMemo が再計算される。
   */
  const message = useMemo(() => {
    if (animationState === "correct") return getRandomCorrectMessage(characterKey);
    if (animationState === "cleared") return getRandomClearedMessage(characterKey);
    const msgs = config.messages.idle;
    return msgs[idleTick % msgs.length];
  }, [animationState, characterKey, idleTick, config.messages.idle]);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 吹き出し */}
      <div
        className="relative bg-white rounded-xl px-4 py-2 text-sm font-bold max-w-[200px] text-center shadow-md"
        style={{ color: config.color }}
      >
        {message}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "8px solid white",
          }}
        />
      </div>

      {/* キャラクター本体 */}
      <motion.div
        className="flex flex-col items-center"
        animate={
          animationState === "cleared"
            ? { scale: [1, 1.3, 1.1, 1.3, 1], rotate: [0, -10, 10, -10, 0], y: [0, -20, 0, -20, 0] }
            : animationState === "correct"
            ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0], y: 0 }
            : { y: [0, -10, 0] }
        }
        transition={
          animationState === "idle"
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : animationState === "correct"
            ? { duration: 0.4, ease: "easeOut" }
            : { duration: 1.2, ease: "easeInOut" }
        }
      >
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-lg border-4"
          style={{
            backgroundColor: config.color + "33",
            borderColor: config.color,
          }}
        >
          {config.emoji}
        </div>

        <div
          className="mt-2 text-xs font-bold px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: config.color }}
        >
          {config.name}
        </div>
      </motion.div>
    </div>
  );
};
