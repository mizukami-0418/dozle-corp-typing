"use client";

/**
 * ステージクリア時の祝福エフェクトコンポーネント。
 * active が true になった瞬間、紙吹雪（コンフェッティ）が画面上部から降り注ぐ。
 * z-40 なのでクリアオーバーレイ（z-50）の背後に描画される。
 *
 * @param active - true になった瞬間にコンフェッティを発火する
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CONFETTI_COLORS = [
  "#FFD700", "#E53935", "#7B1FA2", "#FDD835",
  "#0097A7", "#E91E8C", "#4ade80", "#60a5fa",
];
const CONFETTI_COUNT = 40;

interface Confetti {
  id: number;
  x: number;
  color: string;
  width: number;
  height: number;
  delay: number;
  duration: number;
  rotateDir: 1 | -1;
  isCircle: boolean;
}

interface CelebrationEffectProps {
  active: boolean;
}

export const CelebrationEffect = ({ active }: CelebrationEffectProps) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    if (!active) return;

    // Math.random は useEffect 内（クライアントのみ）なので SSR セーフ
    const items: Confetti[] = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      width: 8 + Math.floor(Math.random() * 3) * 4,
      height: 6 + Math.floor(Math.random() * 5) * 2,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 1.0,
      rotateDir: Math.random() > 0.5 ? 1 : -1,
      isCircle: Math.random() > 0.5,
    }));

    // setTimeout に包んでコールバック内 setState にする（react-hooks/set-state-in-effect 対応）
    const t1 = setTimeout(() => setConfetti(items), 0);
    // 全アニメーション完了後に片付け（最長 duration + delay ≈ 3.3s にバッファ）
    const t2 = setTimeout(() => setConfetti([]), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {confetti.map((c) => (
        <motion.div
          key={c.id}
          className={c.isCircle ? "rounded-full" : ""}
          style={{
            position: "absolute",
            left: `${c.x}%`,
            top: -20,
            width: c.width,
            height: c.height,
            backgroundColor: c.color,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: "110vh",
            rotate: c.rotateDir * 540,
            opacity: [1, 1, 0.6, 0],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
};
