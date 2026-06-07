import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "バトルモードの遊び方",
  description:
    "ドズル社タイピング バトルモードのルール・ステージ構成・HP仕様を解説します。",
};

export default function BattleModeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
