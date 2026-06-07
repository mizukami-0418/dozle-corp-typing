"use client";

/**
 * バトルモード モンスター表示コンポーネント。
 * モンスター画像（PNG）を優先表示し、未配置の場合は絵文字にフォールバックする。
 */

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { BattleMonster } from "@/types";

interface MonsterCardProps {
  monster: BattleMonster;
  currentHp: number;
  /** ステージテーマカラー（HP バー・ボスバッジに使用） */
  accentColor: string;
}

/**
 * モンスターの絵文字・名前・HP バーを表示するコンポーネント。
 *
 * @param monster - モンスター定義（絵文字・名前・maxHp・isBoss）
 * @param currentHp - 現在の HP（0〜maxHp）
 * @param accentColor - ステージテーマカラー
 */
export const MonsterCard = ({ monster, currentHp, accentColor }: MonsterCardProps) => {
  const hpRatio = Math.max(0, currentHp / monster.maxHp);
  const hpColor =
    hpRatio > 0.5 ? "#ef4444" : hpRatio > 0.25 ? "#f97316" : "#dc2626";

  // 画像ロード失敗時に emoji へフォールバック
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* ボスバッジ */}
      {monster.isBoss && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="px-3 py-0.5 rounded-full text-xs font-black tracking-widest"
          style={{ backgroundColor: accentColor, color: "#000" }}
        >
          BOSS
        </motion.div>
      )}

      {/* モンスター画像 / 絵文字フォールバック */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="select-none"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }}
      >
        {!imgError ? (
          <Image
            src={`/images/monsters/${monster.id}.png`}
            alt={monster.name}
            width={160}
            height={160}
            className="object-contain"
            style={{ imageRendering: "pixelated" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-[160px] leading-none">{monster.emoji}</span>
        )}
      </motion.div>

      {/* モンスター名 */}
      <p
        className="text-white font-black text-xl tracking-wide"
        style={{
          fontFamily: "var(--font-zen-maru-gothic)",
          textShadow: "1px 1px 0 #000, 2px 2px 0 rgba(0,0,0,0.4)",
        }}
      >
        {monster.name}
      </p>

      {/* HP バー */}
      <div className="w-56 flex flex-col gap-1">
        <div className="flex justify-between text-xs font-mono text-white/70">
          <span>HP</span>
          <span>
            {currentHp} / {monster.maxHp}
          </span>
        </div>
        <div className="w-full h-4 bg-black/60 rounded-full border border-white/20 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${hpRatio * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ backgroundColor: hpColor }}
          />
        </div>
      </div>
    </div>
  );
};
