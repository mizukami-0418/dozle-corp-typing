import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "入力のコツ",
  description:
    "ん・っ・拗音など、ドズル社タイピングでの入力のコツを解説します。",
};

export default function InputTipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
