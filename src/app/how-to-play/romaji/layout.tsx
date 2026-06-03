import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ローマ字対応一覧",
  description:
    "ひらがなとローマ字の対応一覧表。清音・濁音・半濁音・拗音の入力パターンをまとめています。",
};

export default function RomajiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
