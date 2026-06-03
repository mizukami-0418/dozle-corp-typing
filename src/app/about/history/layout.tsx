import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ドズル社の歴史と変遷",
  description:
    "ドズル社の創設から現在までの歴史を時代別タイムラインで振り返ります。",
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
