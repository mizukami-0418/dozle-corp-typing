"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";

interface HistoryEvent {
  date: string;
  text: string;
}

interface HistoryEra {
  era: string;
  period: string;
  events: HistoryEvent[];
}

const HISTORY: HistoryEra[] = [
  {
    era: "創業・個人チャンネル時代",
    period: "2014〜2020年",
    events: [
      {
        date: "2014年8月",
        text: "リーダーのドズル氏が、大分大学医学部在学中に『クラッシュ・オブ・クラン』のゲーム実況を開始。",
      },
      {
        date: "2016年9月",
        text: "株式会社ドズルを設立し、プロのゲームクリエイターとしての活動を本格化させる。",
      },
      {
        date: "2019年4月",
        text: "現在の主力コンテンツとなる『マインクラフト』の実況を試験的に開始。",
      },
    ],
  },
  {
    era: "グループ結成・新体制の始動",
    period: "2021年",
    events: [
      {
        date: "2021年初頭",
        text: "「ぼんじゅうる」「おんりー」「おらふくん」「おおはらMEN」が徐々に合流し、現在の5人体制が確立する。",
      },
      {
        date: "2021年6月",
        text: "メインYouTubeチャンネル名を『ドズぼん・ザ・ゴールデン』から『ドズル社』へ改名。5人での「ドズル社」としてのブランドがスタート。",
      },
    ],
  },
  {
    era: "急成長・総合エンタメ企業へ",
    period: "2022年〜現在",
    events: [
      {
        date: "2022〜2023年",
        text: "「誰が見ても楽しめる」をモットーに、マイクラでの大規模企画やオリジナルストーリー動画を多数投稿。チャンネル登録者数が100万人を突破し、日本を代表するゲーム実況グループへと急成長。",
      },
      {
        date: "活動の拡大",
        text: "YouTubeでの毎日投稿だけでなく、オフィシャルグッズの販売、ポップアップストアの開催、企業との大規模コラボ（ほっかほっか亭とのキャンペーンなど）を積極的に展開。",
      },
      {
        date: "現在",
        text: "ドズル氏の経営者としての手腕も活かし、YouTubeにとどまらない総合的なエンターテインメント企業として成長を続けている。",
      },
    ],
  },
];

const ERA_COLORS = ["#FFD700", "#0097A7", "#E91E8C"];

export default function HistoryPage() {
  const router = useRouter();

  return (
    <MinecraftBg>
      <div className="min-h-screen flex flex-col items-center px-4 py-12 gap-6">

        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="text-5xl mb-3">📜</div>
          <h1
            className="text-3xl font-black"
            style={{
              color: "var(--color-brand-gold)",
              textShadow: "2px 2px 0 #000",
              fontFamily: "var(--font-zen-maru-gothic)",
            }}
          >
            ドズル社の歴史と変遷
          </h1>
        </motion.div>

        <div className="w-full max-w-lg flex flex-col gap-5">
          {HISTORY.map((era, eraIdx) => (
            <motion.div
              key={era.era}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + eraIdx * 0.1, duration: 0.4 }}
              className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5"
              style={{ borderColor: `${ERA_COLORS[eraIdx]}30` }}
            >
              {/* 時代ヘッダー */}
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-black text-xs font-black flex-shrink-0"
                  style={{ backgroundColor: ERA_COLORS[eraIdx] }}
                >
                  {eraIdx + 1}
                </span>
                <div>
                  <p className="font-black text-base" style={{ color: ERA_COLORS[eraIdx], fontFamily: "var(--font-zen-maru-gothic)" }}>
                    {era.era}
                  </p>
                  <p className="text-white/40 text-xs">{era.period}</p>
                </div>
              </div>

              {/* イベント一覧 */}
              <div className="flex flex-col gap-3 pl-2 border-l-2" style={{ borderColor: `${ERA_COLORS[eraIdx]}40` }}>
                {era.events.map((event) => (
                  <div key={event.date} className="pl-4">
                    <p className="text-xs font-bold mb-0.5" style={{ color: ERA_COLORS[eraIdx] }}>
                      {event.date}
                    </p>
                    <p className="text-white/80 text-base leading-relaxed">{event.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 戻るボタン */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => router.push("/about")}
          className="px-6 py-2.5 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 active:scale-95 transition-all border border-white/20"
        >
          ← ドズル社とは？へ戻る
        </motion.button>
      </div>
    </MinecraftBg>
  );
}
