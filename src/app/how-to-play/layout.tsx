import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "遊び方",
  description:
    "ドズル社タイピングの遊び方。ノーマルモード・バトルモードのルール・入力のコツ・ローマ字対応一覧を解説します。",
};

export default function HowToPlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
