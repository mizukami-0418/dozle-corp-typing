import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "遊び方",
  description:
    "ドズル社タイピングの遊び方。ルール・入力のコツ・難易度一覧・スコア計算をわかりやすく解説します。",
};

export default function HowToPlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
