import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ステージ選択",
  description:
    "難易度を選んでゲームスタート。チート・ノーマル・ハード・鬼畜・ドズル社モードの5ステージから選べます。",
};

export default function StagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
