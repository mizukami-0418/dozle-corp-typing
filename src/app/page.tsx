"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";

interface MenuButton {
  label: string;
  emoji: string;
  href: string;
  color: string;
}

const MENU_BUTTONS: MenuButton[] = [
  {
    label: "ゲームスタート",
    emoji: "⚔️",
    href: "/stages",
    color: "#5a8a3c",
  },
  {
    label: "遊び方",
    emoji: "📖",
    href: "/how-to-play",
    color: "#0097A7",
  },
  {
    label: "設定",
    emoji: "⚙️",
    href: "/settings",
    color: "#7B1FA2",
  },
  {
    label: "ドズル社とは？",
    emoji: "🦍",
    href: "/about",
    color: "#E53935",
  },
];

export default function TopPage() {
  const router = useRouter();

  return (
    <MinecraftBg>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-10">

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
            OFFICIAL FAN GAME
          </p>
        </motion.div>

        {/* メニューボタン */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          {MENU_BUTTONS.map((btn, i) => (
            <motion.button
              key={btn.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(btn.href)}
              className="relative w-full py-4 font-black text-lg text-white tracking-wide"
              style={{
                backgroundColor: "#6b7280",
                boxShadow:
                  "inset -4px -4px 0 #374151, inset 4px 4px 0 #9ca3af, 0 4px 0 #000",
                border: "2px solid #000",
                fontFamily: "var(--font-zen-maru-gothic)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#9ca3af";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#6b7280";
              }}
            >
              <span className="mr-2">{btn.emoji}</span>
              {btn.label}
            </motion.button>
          ))}
        </motion.div>

        {/* バージョン表示 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/30 text-xs"
        >
          v1.0.0
        </motion.p>

      </div>
    </MinecraftBg>
  );
}
