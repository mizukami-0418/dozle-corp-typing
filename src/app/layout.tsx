import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dozle-corp-typing.toamoku.net"),
  title: {
    default: "ドズル社タイピング",
    template: "%s | ドズル社タイピング",
  },
  description:
    "ドズル社 × Minecraft をテーマにしたタイピングゲーム。チート・ノーマル・ハード・鬼畜・ドズル社モードの5難易度で遊べるファンゲームです。",
  openGraph: {
    title: "ドズル社タイピング",
    description:
      "ドズル社 × Minecraft をテーマにしたタイピングゲーム。チート・ノーマル・ハード・鬼畜・ドズル社モードの5難易度で遊べるファンゲームです。",
    url: "https://dozle-corp-typing.toamoku.net",
    siteName: "ドズル社タイピング",
    images: [{ url: "/ogp.png", width: 1731, height: 909 }],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ドズル社タイピング",
    description:
      "ドズル社 × Minecraft をテーマにしたタイピングゲーム。チート・ノーマル・ハード・鬼畜・ドズル社モードの5難易度で遊べるファンゲームです。",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenMaruGothic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
