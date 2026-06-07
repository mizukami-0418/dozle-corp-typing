"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";

interface MenuItem {
  href: string;
  icon: string;
  label: string;
  desc: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    href: "/how-to-play/normal-mode",
    icon: "⏱️",
    label: "ノーマルモードの遊び方",
    desc: "基本ルール・難易度・スコア",
  },
  {
    href: "/how-to-play/battle-mode",
    icon: "⚔️",
    label: "バトルモードの遊び方",
    desc: "ステージ構成・HP仕様",
  },
  {
    href: "/how-to-play/input-tips",
    icon: "⌨️",
    label: "入力のコツ",
    desc: "ん・っ・拗音の打ち方",
  },
  {
    href: "/how-to-play/romaji",
    icon: "📝",
    label: "ローマ字対応一覧",
    desc: "清音・濁音・拗音・記号",
  },
];

export default function HowToPlayPage() {
  const router = useRouter();

  return (
    <MinecraftBg>
      <div className="min-h-screen flex flex-col items-center px-4 py-12 gap-8">
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

        {/* メニューグリッド */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-4">
          {MENU_ITEMS.map((item, i) => (
            <motion.button
              key={item.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(item.href)}
              className="bg-black/60 rounded-2xl border border-white/20 px-4 py-6 flex flex-col items-center gap-2 hover:bg-black/80 hover:border-white/40 transition-all text-center"
            >
              <span className="text-3xl">{item.icon}</span>
              <span
                className="text-white font-black text-sm leading-tight"
                style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
              >
                {item.label}
              </span>
              <span className="text-white/50 text-xs">{item.desc}</span>
            </motion.button>
          ))}
        </div>

        {/* トップへ戻るボタン */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 active:scale-95 transition-all border border-white/20"
        >
          ← トップへ戻る
        </motion.button>
      </div>
    </MinecraftBg>
  );
}
