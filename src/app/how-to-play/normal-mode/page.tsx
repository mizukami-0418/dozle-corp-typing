"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";
import { DIFFICULTY_COLORS } from "@/lib/difficulty";

interface DifficultyRow {
  name: string;
  time: string;
  chars: string;
  secPerRomaji: string;
  color: string;
  special?: boolean;
}

const DIFFICULTIES: DifficultyRow[] = [
  { name: "CHEAT",    time: "60秒",  chars: "2〜4文字",   secPerRomaji: "1.0秒",  color: DIFFICULTY_COLORS.cheat   },
  { name: "NORMAL",   time: "90秒",  chars: "5〜8文字",   secPerRomaji: "0.65秒", color: DIFFICULTY_COLORS.normal  },
  { name: "HARD",     time: "120秒", chars: "9〜12文字",  secPerRomaji: "0.4秒",  color: DIFFICULTY_COLORS.hard    },
  { name: "鬼畜",     time: "150秒", chars: "13文字以上", secPerRomaji: "0.25秒", color: DIFFICULTY_COLORS.kichiku },
  { name: "ドズル社", time: "180秒", chars: "制限なし",   secPerRomaji: "なし",   color: DIFFICULTY_COLORS.dozle, special: true },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.4 },
  }),
};

export default function NormalModePage() {
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
          <div className="text-4xl mb-3">⏱️</div>
          <h1
            className="text-2xl font-black"
            style={{
              color: "var(--color-brand-gold)",
              textShadow: "2px 2px 0 #000",
              fontFamily: "var(--font-zen-maru-gothic)",
            }}
          >
            ノーマルモードの遊び方
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
              🎮 基本ルール
            </h2>
            <ul className="text-white/80 text-base flex flex-col gap-2">
              <li>・ 画面に<span className="text-yellow-300 font-bold">ワード</span>が表示されます（ひらがな・カタカナ・漢字・英字など）</li>
              <li>・ IME（変換）は使わず、入力欄のローマ字をそのまま打ち込んでください</li>
              <li>・ 制限時間内にできるだけ多くのワードを入力してスコアを稼ごう！</li>
              <li>・ ワードごとにも制限時間があり、超えると次のワードへ自動で進みます（<span className="text-red-400">減点あり</span>）</li>
              <li>・ ドズル社モードはワードごとの制限時間がありません</li>
            </ul>
          </motion.div>

          {/* 難易度一覧 */}
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
              🏆 難易度一覧
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/40 text-xs border-b border-white/10">
                    <th className="text-left pb-2 font-bold">難易度</th>
                    <th className="text-center pb-2 font-bold">制限時間</th>
                    <th className="text-center pb-2 font-bold">文字数</th>
                    <th className="text-right pb-2 font-bold whitespace-nowrap">ワード制限</th>
                  </tr>
                </thead>
                <tbody>
                  {DIFFICULTIES.map((d) => (
                    <tr key={d.name} className="border-b border-white/5 last:border-0">
                      <td className="py-2.5 font-black" style={{ color: d.color }}>
                        {d.name}
                        {d.special === true && (
                          <span className="ml-1.5 text-xs font-bold text-yellow-400/70">★特別</span>
                        )}
                      </td>
                      <td className="py-2.5 text-center text-white/80">{d.time}</td>
                      <td className="py-2.5 text-center text-white/80">{d.chars}</td>
                      <td className="py-2.5 text-right text-white/80 font-mono text-xs">{d.secPerRomaji}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-white/40 text-xs leading-relaxed">
              ★ ドズル社ステージはワードごとの制限時間がなく、全難易度のドズル社関連ワード（197語）をループ出題します。
            </p>
          </motion.div>

          {/* スコア */}
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
              ⭐ スコア
            </h2>
            <ul className="text-white/80 text-base flex flex-col gap-2 mb-4">
              <li>・ ワードを完了するとスコアが加算されます（最大 <span className="text-yellow-300 font-bold">100点</span> / ワード）</li>
              <li>・ ミスが多いほど得点が下がります（ミス1回 <span className="text-red-400 font-bold">−10点</span>）</li>
              <li>・ ワード制限時間を超えると <span className="text-red-400 font-bold">−30点</span></li>
            </ul>
            <div className="border-t border-white/10 pt-3">
              <p className="text-white/40 text-sm mb-2">スター獲得条件（正確率）</p>
              <div className="flex flex-col gap-1.5 text-base">
                <div className="flex items-center gap-2">
                  <span>⭐⭐⭐</span>
                  <span className="text-white/70">90% 以上</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⭐⭐</span>
                  <span className="text-white/70">75% 以上</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⭐</span>
                  <span className="text-white/70">それ未満</span>
                </div>
              </div>
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
