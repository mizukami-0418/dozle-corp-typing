"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";

/**
 * 404 ページ。
 * 存在しない URL にアクセスした際に表示される。
 */
export default function NotFound() {
  return (
    <MinecraftBg>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 gap-6">
        {/* 404 表示 */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="text-7xl mb-4">💥</div>
          <h1
            className="text-6xl font-black mb-2"
            style={{
              color: "var(--color-brand-gold)",
              textShadow: "3px 3px 0 #000",
              fontFamily: "var(--font-zen-maru-gothic)",
            }}
          >
            404
          </h1>
          <p
            className="text-white font-black text-xl"
            style={{ textShadow: "1px 1px 0 #000" }}
          >
            このページは見つかりませんでした
          </p>
        </motion.div>

        {/* メッセージカード */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5 w-full max-w-sm text-center"
        >
          <p className="text-white/80 text-base leading-relaxed">
            クリーパーが爆発してページが吹き飛んだようです。
            <br />
            URLをご確認のうえ、トップページへお戻りください。
          </p>
        </motion.div>

        {/* トップへ戻るボタン */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 active:scale-95 transition-all border border-white/20"
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            ← トップへ戻る
          </Link>
        </motion.div>
      </div>
    </MinecraftBg>
  );
}
