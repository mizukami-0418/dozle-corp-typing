"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";

/**
 * 難易度一覧テーブルのデータ。
 * difficulty.ts の DIFFICULTY_CONFIG と同期させること。
 */
const DIFFICULTIES = [
  { name: "CHEAT", time: "60秒", chars: "2〜4文字", color: "#FDD835" },
  { name: "NORMAL", time: "90秒", chars: "5〜8文字", color: "#0097A7" },
  { name: "HARD", time: "120秒", chars: "9〜12文字", color: "#E53935" },
  { name: "鬼畜", time: "150秒", chars: "13文字以上", color: "#7B1FA2" },
  { name: "ドズル社", time: "180秒", chars: "制限なし", color: "#FF69B4", special: true },
];

/**
 * 入力のコツセクション — 表示するルールと入力例。
 */
const INPUT_TIPS = [
  {
    rule: "「ん」は n か nn どちらでも正解",
    kana: "ほん",
    patterns: ["hon", "honn"],
  },
  {
    rule: "複数のローマ字パターンが使える文字あり",
    kana: "しろ",
    patterns: ["siro", "shiro"],
  },
  {
    rule: "「っ」は次の文字の子音を重ねる",
    kana: "きって",
    patterns: ["kitte"],
  },
  {
    rule: "長音符「ー」は − （ハイフン）キー",
    kana: "くりーぱー",
    patterns: ["kuri-pa-"],
  },
];

/** カードのフェードインアニメーション */
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.4 },
  }),
};

export default function HowToPlayPage() {
  const router = useRouter();

  return (
    <MinecraftBg>
      <div className="min-h-screen flex flex-col items-center px-4 py-12 gap-6">

        {/* タイトル */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="text-5xl mb-3">📖</div>
          <h1
            className="text-3xl font-black"
            style={{
              color: "var(--color-brand-gold)",
              textShadow: "2px 2px 0 #000",
              fontFamily: "var(--font-zen-maru-gothic)",
            }}
          >
            遊び方
          </h1>
        </motion.div>

        <div className="w-full max-w-lg flex flex-col gap-5">

          {/* Card 1: 基本ルール */}
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
              <li>・ IME（変換）は使わず、入力欄に表示される<span className="text-yellow-300 font-bold">ローマ字</span>をそのまま打ち込んでください</li>
              <li>・ 制限時間内にできるだけ多くのワードを入力してスコアを稼ごう！</li>
              <li>・ ワードごとにも制限時間があり、超えると次のワードへ自動で進みます（減点あり）</li>
            </ul>
          </motion.div>

          {/* Card 2: 入力のコツ */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5"
          >
            <h2
              className="text-white font-black text-xl mb-4"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              ⌨️ 入力のコツ
            </h2>
            <div className="flex flex-col gap-4">
              {INPUT_TIPS.map((tip) => (
                <div key={tip.kana}>
                  <p className="text-white/80 text-base mb-1.5">{tip.rule}</p>
                  <div className="bg-white/5 rounded-lg px-4 py-2 font-mono text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-white/40">{tip.kana} →</span>
                    {tip.patterns.map((p, i) => (
                      <span key={p} className="flex items-center gap-2">
                        {i > 0 && <span className="text-white/30">または</span>}
                        <span className="text-green-400">{p}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 3: 難易度一覧 */}
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
              🏆 難易度一覧
            </h2>
            <table className="w-full text-base">
              <thead>
                <tr className="text-white/40 text-sm border-b border-white/10">
                  <th className="text-left pb-2 font-bold">難易度</th>
                  <th className="text-center pb-2 font-bold">制限時間</th>
                  <th className="text-right pb-2 font-bold">読みの文字数</th>
                </tr>
              </thead>
              <tbody>
                {DIFFICULTIES.map((d) => (
                  <tr key={d.name} className={`border-b border-white/5 last:border-0 ${"special" in d && d.special ? "bg-yellow-500/5" : ""}`}>
                    <td
                      className="py-2.5 font-black"
                      style={{ color: d.color }}
                    >
                      {d.name}
                      {"special" in d && d.special && (
                        <span className="ml-1.5 text-xs font-bold text-yellow-400/70">★特別</span>
                      )}
                    </td>
                    <td className="py-2.5 text-center text-white/80">{d.time}</td>
                    <td className="py-2.5 text-right text-white/80">{d.chars}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-white/40 text-xs leading-relaxed">
              ★ ドズル社ステージはワードごとの制限時間がなく、全難易度のドズル社関連ワード（197語）をループ出題します。
            </p>
          </motion.div>

          {/* Card 4: スコア */}
          <motion.div
            custom={3}
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
              <li>・ ワードを完了するとスコアが加算されます（最大 100点 / ワード）</li>
              <li>・ ミスが多いほど得点が下がります（ミス1回 −10点）</li>
              <li>・ ワード制限時間を超えると <span className="text-red-400 font-bold">−30点</span></li>
            </ul>
            <div className="border-t border-white/10 pt-3">
              <p className="text-white/40 text-sm mb-2">スター獲得条件</p>
              <div className="flex flex-col gap-1 text-base">
                <div className="flex items-center gap-2">
                  <span>⭐⭐⭐</span>
                  <span className="text-white/70">正確率 90% 以上 ＆ ミス 3回以下</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⭐⭐</span>
                  <span className="text-white/70">正確率 75% 以上 ＆ ミス 10回以下</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⭐</span>
                  <span className="text-white/70">それ以外</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ローマ字対応一覧へのリンク */}
          <motion.button
            custom={4}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            onClick={() => router.push("/how-to-play/romaji")}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-black/40 rounded-2xl border border-white/20 px-6 py-4 text-white/70 hover:text-white hover:bg-black/60 transition-all flex items-center justify-between"
          >
            <span
              className="font-bold"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              📝 ローマ字対応一覧を見る
            </span>
            <span className="text-lg">→</span>
          </motion.button>
        </div>

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
