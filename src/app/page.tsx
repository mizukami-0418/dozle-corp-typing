"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";

interface MenuButton {
  label: string;
  emoji: string;
  href: string;
}

/** 2×2 グリッドに並べる4ボタン */
const GRID_BUTTONS: MenuButton[] = [
  { label: "ノーマルモード", emoji: "⏱️", href: "/stages"      },
  { label: "バトルモード",   emoji: "⚔️", href: "/battle"      },
  { label: "遊び方",         emoji: "📖", href: "/how-to-play" },
  { label: "設定",           emoji: "⚙️", href: "/settings"    },
];

/** 全幅で下部に表示する1ボタン */
const FULL_BUTTON: MenuButton = {
  label: "ドズル社とは？", emoji: "🦍", href: "/about",
};

export default function TopPage() {
  const router = useRouter();

  return (
    <MinecraftBg>
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-10">
        {/* タイトル */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1
            className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-lg"
            style={{
              color: "var(--color-brand-gold)",
              fontFamily: "var(--font-zen-maru-gothic)",
              textShadow: "3px 3px 0 #000, 5px 5px 0 rgba(0,0,0,0.3)",
            }}
          >
            ドズル社タイピング
          </h1>
          <p className="text-white/70 text-sm font-bold tracking-widest mt-2">
            UNOFFICIAL FAN GAME
          </p>
        </motion.div>

        {/* メニューボタン */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          {/* 2×2 グリッド */}
          <div className="grid grid-cols-2 gap-3">
            {GRID_BUTTONS.map((btn, i) => (
              <motion.button
                key={btn.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(btn.href)}
                className="relative w-full py-5 font-black text-base text-white tracking-wide"
                style={{
                  backgroundColor: "#6b7280",
                  boxShadow:
                    "inset -4px -4px 0 #374151, inset 4px 4px 0 #9ca3af, 0 4px 0 #000",
                  border: "2px solid #000",
                  fontFamily: "var(--font-zen-maru-gothic)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#9ca3af";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#6b7280";
                }}
              >
                <div className="text-2xl mb-1">{btn.emoji}</div>
                {btn.label}
              </motion.button>
            ))}
          </div>

          {/* 全幅ボタン（ドズル社とは？） */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(FULL_BUTTON.href)}
            className="relative w-full py-4 font-black text-lg text-white tracking-wide"
            style={{
              backgroundColor: "#6b7280",
              boxShadow:
                "inset -4px -4px 0 #374151, inset 4px 4px 0 #9ca3af, 0 4px 0 #000",
              border: "2px solid #000",
              fontFamily: "var(--font-zen-maru-gothic)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#6b7280";
            }}
          >
            <span className="mr-2">{FULL_BUTTON.emoji}</span>
            {FULL_BUTTON.label}
          </motion.button>
        </motion.div>

        {/* バージョン表示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-black/50 text-xs">v1.0.0</p>

          {/* 作者からのメッセージ */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="w-full max-w-xs text-center px-6 py-4 rounded-2xl border border-yellow-400/30"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          >
            {/* ラベル */}
            <p className="text-yellow-300/80 text-xs font-bold tracking-widest mb-3">
              ✉ 開発者からのメッセージ(ドズル社応援隊)
            </p>

            {/* メッセージ本文 */}
            <p
              className="text-white text-base font-bold leading-loose"
              style={{
                fontFamily: "var(--font-zen-maru-gothic)",
                textShadow: "0 1px 6px rgba(0,0,0,0.6)",
              }}
            >
              ドズル社を大好きな
              <br />
              子供たちが
              <br />
              タイピングを
              <br />
              楽しめるように 💛
            </p>
          </motion.div>
        </motion.div>
      </div>
    </MinecraftBg>
  );
}
