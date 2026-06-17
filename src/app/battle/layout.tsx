import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "バトルモード",
  description:
    "6つのステージでモンスターを撃破していくHP制バトルモード。STAGE 1 のゾンビから EXTRA のドズル社まで全ステージ制覇を目指そう！",
};

export default function BattleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
