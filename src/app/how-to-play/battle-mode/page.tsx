"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";
import { BATTLE_STAGE_COLORS } from "@/lib/battle-stages";

interface StageRow {
  name: string;
  theme: string;
  chars: string;
  sec: string;
  color: string;
}

const STAGE_ROWS: StageRow[] = [
  {
    name: "STAGE 1",
    theme: "ゾンビ（初級）",
    chars: "〜4文字",
    sec: "1.3秒/文字",
    color: BATTLE_STAGE_COLORS["zombie"],
  },
  {
    name: "STAGE 2",
    theme: "ドラウンド（中級）",
    chars: "4〜6文字",
    sec: "1.1秒/文字",
    color: BATTLE_STAGE_COLORS["drowned"],
  },
  {
    name: "STAGE 3",
    theme: "ウィザスケ（上級）",
    chars: "6〜8文字",
    sec: "0.9秒/文字",
    color: BATTLE_STAGE_COLORS["wither-skeleton"],
  },
  {
    name: "STAGE 4",
    theme: "シュルカー（超上級）",
    chars: "8〜10文字",
    sec: "0.7秒/文字",
    color: BATTLE_STAGE_COLORS["shulker"],
  },
  {
    name: "STAGE 5",
    theme: "エンドラ（BOSS）",
    chars: "10〜12文字",
    sec: "0.6秒/文字",
    color: BATTLE_STAGE_COLORS["ender-dragon"],
  },
  {
    name: "EXTRA",
    theme: "ドズル社",
    chars: "12〜15文字",
    sec: "0.5秒/文字",
    color: BATTLE_STAGE_COLORS["dozle-battle"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.4 },
  }),
};

export default function BattleModePage() {
  const router = useRouter();

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
          <div className="text-4xl mb-3">⚔️</div>
          <h1
            className="text-2xl font-black"
            style={{
              color: "var(--color-brand-gold)",
              textShadow: "2px 2px 0 #000",
              fontFamily: "var(--font-zen-maru-gothic)",
            }}
          >
            バトルモードの遊び方
          </h1>
        </motion.div>

        <div className="w-full max-w-lg flex flex-col gap-5">
          {/* 基本ルール */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5"
          >
            <h2
              className="text-white font-black text-xl mb-3"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              ⚔️ 基本ルール
            </h2>
            <ul className="text-white/80 text-base flex flex-col gap-2">
              <li>・ 6ステージ（STAGE 1〜5 + EXTRA）を順番に攻略します</li>
              <li>
                ・ 各ステージに
                <span className="text-yellow-300 font-bold">5体</span>
                のモンスターが登場し、順番に撃破します
              </li>
              <li>
                ・ ワード正解 → モンスターに{" "}
                <span className="text-green-400 font-bold">ダメージ</span>
              </li>
              <li>
                ・ タイプミス・タイムアウト → プレイヤーが{" "}
                <span className="text-red-400 font-bold">ダメージ</span>
              </li>
              <li>
                ・ プレイヤーHPが0になると
                <span className="text-red-400 font-bold">ゲームオーバー</span>
                （ステージ最初から再開）
              </li>
            </ul>
          </motion.div>

          {/* ステージ一覧 */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5"
          >
            <h2
              className="text-white font-black text-xl mb-3"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              🗺️ ステージ一覧
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/40 text-xs border-b border-white/10">
                    <th className="text-left pb-2 font-bold">ステージ</th>
                    <th className="text-left pb-2 font-bold">テーマ</th>
                    <th className="text-center pb-2 font-bold">文字数</th>
                    <th className="text-right pb-2 font-bold whitespace-nowrap">
                      ワード制限
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {STAGE_ROWS.map((s) => (
                    <tr
                      key={s.name}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td
                        className="py-2.5 font-black whitespace-nowrap"
                        style={{ color: s.color }}
                      >
                        {s.name}
                      </td>
                      <td className="py-2.5 text-white/80 text-xs">
                        {s.theme}
                      </td>
                      <td className="py-2.5 text-center text-white/80 text-xs whitespace-nowrap">
                        {s.chars}
                      </td>
                      <td className="py-2.5 text-right text-white/80 font-mono text-xs">
                        {s.sec}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-white/40 text-xs leading-relaxed">
              ★ STAGE 1
              は最初から解放。各ステージをクリアすると次のステージが解放されます。
            </p>
          </motion.div>

          {/* HP・ダメージ */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5"
          >
            <h2
              className="text-white font-black text-xl mb-3"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              ❤️ HP・ダメージ
            </h2>

            <p className="text-white/40 text-xs mb-2">プレイヤー</p>
            <div className="flex flex-col gap-1.5 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white/80">初期HP</span>
                <span className="text-white font-bold">❤️×10（20pt）</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">タイプミス</span>
                <span className="text-red-400 font-bold">−1pt（半ハート）</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">タイムアウト</span>
                <span className="text-red-400 font-bold">
                  −2pt（ハート1個）
                </span>
              </div>
            </div>

            <p className="text-white/40 text-xs mb-2">モンスター</p>
            <div className="flex flex-col gap-1.5 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white/80">ワード正解</span>
                <span className="text-green-400 font-bold">−10pt</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <p className="text-white/40 text-xs mb-2">モンスター最大HP</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/40 text-xs border-b border-white/10">
                    <th className="text-left pb-1 font-bold">ステージ</th>
                    <th className="text-center pb-1 font-bold">通常</th>
                    <th className="text-right pb-1 font-bold">ボス（5体目）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-1.5 text-white/80">STAGE 1〜2</td>
                    <td className="py-1.5 text-center text-white/80">30pt</td>
                    <td className="py-1.5 text-right text-white/80">40pt</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-1.5 text-white/80">STAGE 3〜4</td>
                    <td className="py-1.5 text-center text-white/80">40pt</td>
                    <td className="py-1.5 text-right text-white/80">50pt</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-white/80">STAGE 5・EXTRA</td>
                    <td className="py-1.5 text-center text-white/80">50pt</td>
                    <td className="py-1.5 text-right text-white/80">70pt</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* 遊び方へ戻るボタン */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => router.push("/how-to-play")}
          className="px-6 py-2.5 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 active:scale-95 transition-all border border-white/20"
        >
          ← 遊び方へ戻る
        </motion.button>
      </div>
    </MinecraftBg>
  );
}
