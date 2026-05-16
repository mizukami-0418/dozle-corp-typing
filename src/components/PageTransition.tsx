"use client";

/**
 * ページ遷移アニメーションラッパー。
 * ルートが変わるたびに opacity + y のフェードインを適用する。
 * layout.tsx の children を包むことで全画面に一括適用できる。
 */

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
};
