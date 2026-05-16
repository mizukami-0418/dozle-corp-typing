"use client";

/**
 * ワード正解時に放射状パーティクルを発火するエフェクトコンポーネント。
 * trigger をインクリメントするたびに 12 個のドットが全方向へ飛び出す。
 *
 * @param trigger - インクリメントのたびに発火（初期値 0 は無視される）
 * @param accentColor - キャラクターカラーをアクセントとして使用
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const BASE_COLORS = [
  "#FFD700", "#4ade80", "#60a5fa", "#f472b6", "#fb923c", "#a78bfa",
];
const PARTICLE_COUNT = 12;

interface Particle {
  id: number;
  angle: number;
  color: string;
  distance: number;
}

interface ParticleEffectProps {
  trigger: number;
  accentColor?: string;
}

export const ParticleEffect = ({ trigger, accentColor }: ParticleEffectProps) => {
  const idCounterRef = useRef(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const colors = accentColor ? [accentColor, ...BASE_COLORS] : BASE_COLORS;

    const newParticles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      idCounterRef.current += 1;
      return {
        id: idCounterRef.current,
        angle: (360 / PARTICLE_COUNT) * i,
        color: colors[i % colors.length],
        distance: 60 + (i % 3) * 25,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    const ids = newParticles.map((p) => p.id);
    const t = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !ids.includes(p.id)));
    }, 750);

    return () => clearTimeout(t);
  }, [trigger, accentColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.distance;
        const y = Math.sin(rad) * p.distance;
        return (
          <motion.div
            key={p.id}
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: p.color }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x, y, scale: 0, opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
};
