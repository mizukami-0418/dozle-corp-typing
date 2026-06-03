import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "設定",
  description:
    "BGM・効果音のオン/オフ切り替えやゲームデータのリセットができます。",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
