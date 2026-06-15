"use client";

/**
 * バトルモード ステージ選択画面。
 * ステージを縦並びカードで表示し、クリア状況に応じてロック/解放を管理する。
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";
import { useGameStore } from "@/store/game-store";
import {
  BATTLE_STAGES,
  BATTLE_STAGE_ORDER,
  BATTLE_STAGE_COLORS,
} from "@/lib/battle-stages";
import type { BattleTimeRecord, BattleStageId } from "@/types";

/** クリアタイムを m:ss.xx 形式にフォーマットする */
const formatClearTime = (ms: number): string => {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${m}:${s.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
};

/** ISO 8601 日付を YYYY/MM/DD 形式にフォーマットする */
const formatDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
};

const RANK_ICONS = ["🥇", "🥈", "🥉", "4位", "5位"];

export default function BattlePage() {
  const router = useRouter();
  const { clearedBattleStages, battleTimeRecords, loadProgress } = useGameStore();
  const [recordsModalStageId, setRecordsModalStageId] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  /**
   * ステージが解放されているか判定する。
   * STAGE 1 は常時解放。それ以外は直前のステージがクリア済みであれば解放。
   */
  const isUnlocked = (stageId: string): boolean => {
    const idx = BATTLE_STAGE_ORDER.indexOf(stageId as (typeof BATTLE_STAGE_ORDER)[number]);
    if (idx === 0) return true;
    return clearedBattleStages.includes(BATTLE_STAGE_ORDER[idx - 1]);
  };

  const isCleared = (stageId: string): boolean =>
    clearedBattleStages.includes(stageId);

  return (
    <MinecraftBg>
      <div className="flex-1 flex flex-col items-center px-4 py-8 gap-8">
        {/* タイトル */}
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
            バトルモード
          </h1>
          <p className="text-white/70 text-sm font-bold tracking-widest mt-1">
            モンスターを倒してステージをクリアしよう！
          </p>
        </motion.div>

        {/* ステージカード一覧（縦並び） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full max-w-lg flex flex-col gap-4 pb-16"
        >
          {BATTLE_STAGES.map((stage, idx) => {
            const unlocked = isUnlocked(stage.id);
            const cleared = isCleared(stage.id);
            const color = BATTLE_STAGE_COLORS[stage.id];
            const stageRecords: BattleTimeRecord[] = battleTimeRecords[stage.id] ?? [];
            const bestTime = stageRecords[0]?.timeMs;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.08 }}
                whileHover={unlocked ? { scale: 1.02, y: -2 } : {}}
                whileTap={unlocked ? { scale: 0.98 } : {}}
                onClick={() => unlocked && router.push(`/battle/${stage.id}`)}
                className="relative w-full rounded-xl border-4 p-4 text-left transition-all shadow-lg"
                style={{
                  borderColor: unlocked ? color : "#555",
                  backgroundColor: unlocked ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.4)",
                  opacity: unlocked ? 1 : 0.6,
                  cursor: unlocked ? "pointer" : "not-allowed",
                }}
              >
                {/* ヘッダー行 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* ステージ名バッジ */}
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: unlocked ? color : "#555",
                        color: "#000",
                      }}
                    >
                      {stage.name}
                    </span>
                    {/* クリア済みチェック */}
                    {cleared && (
                      <span className="text-green-400 font-black text-sm">
                        ✓ クリア済み
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* ベストタイム */}
                    {bestTime !== undefined && (
                      <span
                        className="text-xs font-black"
                        style={{ color: "var(--color-brand-gold)", fontFamily: "monospace" }}
                      >
                        BEST {formatClearTime(bestTime)}
                      </span>
                    )}
                    {/* ロックアイコン */}
                    {!unlocked && (
                      <span className="text-2xl">🔒</span>
                    )}
                  </div>
                </div>

                {/* テーマ・舞台 */}
                <p
                  className="font-black text-lg mb-1"
                  style={{
                    color: unlocked ? color : "#888",
                    fontFamily: "var(--font-zen-maru-gothic)",
                  }}
                >
                  {stage.theme}
                </p>
                <p className="text-white/60 text-sm mb-3">
                  📍 {stage.setting}
                </p>

                {/* モンスター一覧（解放済みのみ表示） */}
                {unlocked && (
                  <div className="flex gap-1.5 flex-wrap">
                    {stage.monsters.map((m) => (
                      <span
                        key={m.id}
                        className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          backgroundColor: m.isBoss ? color + "33" : "rgba(255,255,255,0.1)",
                          border: `1px solid ${m.isBoss ? color : "rgba(255,255,255,0.2)"}`,
                          color: m.isBoss ? color : "rgba(255,255,255,0.7)",
                        }}
                      >
                        {m.emoji} {m.name}
                        {m.isBoss && " ★"}
                      </span>
                    ))}
                  </div>
                )}

                {/* 時間係数 */}
                {unlocked && (
                  <p className="text-white/40 text-xs mt-2">
                    ⏱ {stage.secPerRomaji}秒/文字 ／ {stage.kanaLengthMin}〜{stage.kanaLengthMax}文字
                  </p>
                )}

                {/* 記録を見るボタン（解放済み・記録あり） */}
                {unlocked && stageRecords.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecordsModalStageId(stage.id);
                    }}
                    className="mt-2 text-xs px-3 py-1 rounded-lg font-bold transition"
                    style={{
                      backgroundColor: color + "22",
                      border: `1px solid ${color}66`,
                      color,
                    }}
                  >
                    📊 記録を見る
                  </button>
                )}

                {/* ロック時のメッセージ */}
                {!unlocked && (
                  <p className="text-white/40 text-sm">
                    前のステージをクリアして解放しよう
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* 記録モーダル */}
        <AnimatePresence>
          {recordsModalStageId !== null && (() => {
            const modalStage = BATTLE_STAGES.find((s) => s.id === recordsModalStageId);
            const modalRecords: BattleTimeRecord[] = battleTimeRecords[recordsModalStageId] ?? [];
            const modalColor = BATTLE_STAGE_COLORS[recordsModalStageId as BattleStageId] ?? "#FFD700";
            return (
              <motion.div
                key="records-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                onClick={() => setRecordsModalStageId(null)}
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-full max-w-sm rounded-2xl border-2 p-6 flex flex-col gap-4"
                  style={{
                    backgroundColor: "rgba(10,10,20,0.97)",
                    borderColor: modalColor,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* ヘッダー */}
                  <div className="text-center">
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded"
                      style={{ backgroundColor: modalColor, color: "#000" }}
                    >
                      {modalStage?.name}
                    </span>
                    <p
                      className="font-black text-lg mt-1"
                      style={{
                        color: modalColor,
                        fontFamily: "var(--font-zen-maru-gothic)",
                      }}
                    >
                      クリアタイム記録
                    </p>
                  </div>

                  {/* ランキング */}
                  <div className="flex flex-col gap-2">
                    {modalRecords.map((record, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2 rounded-lg"
                        style={{
                          backgroundColor: i === 0 ? modalColor + "22" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${i === 0 ? modalColor + "66" : "rgba(255,255,255,0.1)"}`,
                        }}
                      >
                        <span
                          className="text-lg font-black w-8 text-center"
                          style={{ color: i === 0 ? modalColor : "rgba(255,255,255,0.5)" }}
                        >
                          {RANK_ICONS[i]}
                        </span>
                        <span
                          className="font-black text-xl flex-1 text-center"
                          style={{
                            fontFamily: "monospace",
                            color: i === 0 ? modalColor : "white",
                          }}
                        >
                          {formatClearTime(record.timeMs)}
                        </span>
                        <span className="text-white/40 text-xs w-24 text-right">
                          {formatDate(record.date)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 閉じるボタン */}
                  <button
                    onClick={() => setRecordsModalStageId(null)}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition"
                  >
                    閉じる
                  </button>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

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
