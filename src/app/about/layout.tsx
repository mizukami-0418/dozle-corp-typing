import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ドズル社とは？",
  description:
    "ドズル社の紹介・あゆみ・メンバー一覧・公式リンクをまとめたページです。",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
