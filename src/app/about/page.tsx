"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";
import { CHARACTER_KEYS, CHARACTER_CONFIGS } from "@/lib/characters";

/** メンバーキー → 公式サイトメンバーページURL */
const MEMBER_URLS: Record<string, string> = {
  Dozle: "https://www.dozle.jp/members/dozle/",
  Bonjour: "https://www.dozle.jp/members/bonjour/",
  Qnly: "https://www.dozle.jp/members/qnly/",
  OrafKun: "https://www.dozle.jp/members/oraf-kun/",
  ooharaMEN: "https://www.dozle.jp/members/ooharamen/",
};

/** カードのフェードインアニメーション */
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.4 },
  }),
};

export default function AboutPage() {
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
          <div className="text-5xl mb-3">🦍</div>
          <h1
            className="text-3xl font-black"
            style={{
              color: "var(--color-brand-gold)",
              textShadow: "2px 2px 0 #000",
              fontFamily: "var(--font-zen-maru-gothic)",
            }}
          >
            ドズル社とは？
          </h1>
        </motion.div>

        <div className="w-full max-w-lg flex flex-col gap-5">
          {/* ドズル社紹介 */}
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
              🎮 ドズル社について
            </h2>
            <p className="text-white/80 text-base leading-relaxed">
              ドズル社は、ドズルを中心とした5人組のゲーム系YouTubeグループです。
              Minecraftをはじめ、さまざまなゲームコンテンツを毎日配信しており、
              独特のキャラクターとチームワークで多くのファンから愛されています。
            </p>
            <br />
            <motion.a
              custom={3}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              href="https://www.dozle.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/20 bg-red-900/30 hover:bg-red-900/50 transition-colors text-white font-black text-base"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              <span className="text-xl">▶</span>
              ドズル社公式サイトへ
            </motion.a>
            <br />
            <motion.a
              custom={3}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              href="https://www.youtube.com/@dozle"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/20 bg-red-900/30 hover:bg-red-900/50 transition-colors text-white font-black text-base"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              <span className="text-xl">▶</span>
              ドズル社公式YouTubeチャンネルへ
            </motion.a>
          </motion.div>

          {/* あゆみ */}
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
              📜 あゆみ
            </h2>
            <ol className="flex flex-col gap-4">
              {[
                {
                  period: "2014〜2020年",
                  phase: "創業・個人チャンネル時代",
                  text: "ドズル氏が大分大学在学中にゲーム実況を開始。2016年に株式会社ドズルを設立し、2019年からマインクラフト実況をスタート。",
                },
                {
                  period: "2021年",
                  phase: "グループ結成・新体制の始動",
                  text: "現在のメンバーが合流し5人体制が確立。2021年6月にチャンネル名を『ドズル社』へ改名し、グループとしての活動がスタート。",
                },
                {
                  period: "2022年〜現在",
                  phase: "急成長・総合エンタメ企業へ",
                  text: "チャンネル登録者200万人突破。グッズ販売・ポップアップストア・企業コラボなど、YouTubeの枠を超えた総合エンターテインメント企業として成長中。",
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-black text-xs font-black"
                      style={{ backgroundColor: "var(--color-brand-gold)" }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold mb-0.5">{item.period}</p>
                    <p className="text-yellow-300 font-bold text-sm mb-0.5">
                      {item.phase}
                    </p>
                    <p className="text-white/80 text-base leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex justify-end">
              <a
                href="/about/history"
                className="text-sm font-bold text-white/50 hover:text-white/80 transition-colors"
              >
                詳しいあゆみはこちら →
              </a>
            </div>
          </motion.div>

          {/* メンバー一覧 */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5"
          >
            <h2
              className="text-white font-black text-xl mb-4"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              👥 メンバー
            </h2>
            <div className="flex flex-col gap-2">
              {CHARACTER_KEYS.map((key) => {
                const config = CHARACTER_CONFIGS[key];
                const url = MEMBER_URLS[key];
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-left group"
                  >
                    <span className="text-2xl">{config.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-black text-base"
                        style={{ color: config.color }}
                      >
                        {config.name}
                      </p>
                      <p className="text-white/50 text-sm truncate">
                        {config.catchphrase}
                      </p>
                    </div>
                    <span className="text-white/30 group-hover:text-white/60 transition-colors text-sm">
                      公式サイトメンバーページへ→
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* ファンゲーム注記 */}
          <motion.p
            custom={4}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="text-black text-xs text-center leading-relaxed px-2"
          >
            このゲームはドズル社の非公式ファンゲームです。
            ドズル社を応援しているファンによって制作されております。
            みんなでドズル社を盛り上げていきましょう！
          </motion.p>
        </div>

        {/* トップへ戻るボタン */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 active:scale-95 transition-all border border-white/20"
        >
          ← トップへ戻る
        </motion.button>
      </div>
    </MinecraftBg>
  );
}
