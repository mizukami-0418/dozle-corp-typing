"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";

interface Tip {
  rule: string;
  kana: string;
  patterns: string[];
}

const INPUT_TIPS: Tip[] = [
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
    rule: "長音符「ー」は −（ハイフン）キー",
    kana: "くりーぱー",
    patterns: ["kuri-pa-"],
  },
];

export default function InputTipsPage() {
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
          <div className="text-4xl mb-3">⌨️</div>
          <h1
            className="text-2xl font-black"
            style={{
              color: "var(--color-brand-gold)",
              textShadow: "2px 2px 0 #000",
              fontFamily: "var(--font-zen-maru-gothic)",
            }}
          >
            入力のコツ
          </h1>
        </motion.div>

        <div className="w-full max-w-lg flex flex-col gap-5">
          {/* コツ一覧 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5"
          >
            <div className="flex flex-col gap-5">
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

          {/* ローマ字対応一覧へのリンク */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => router.push("/how-to-play/romaji")}
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

        {/* 遊び方へ戻るボタン */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => router.push("/how-to-play")}
          className="px-6 py-2.5 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 active:scale-95 transition-all border border-white/20"
        >
          ← 遊び方へ戻る
        </motion.button>
      </div>
    </MinecraftBg>
  );
}
