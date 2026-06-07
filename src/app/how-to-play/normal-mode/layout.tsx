import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ノーマルモードの遊び方",
  description:
    "ドズル社タイピング ノーマルモードのルール・難易度・スコア計算を解説します。",
};

export default function NormalModeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
