import type { NextConfig } from "next";

/** セキュリティヘッダー（全ルート共通） */
const securityHeaders = [
  // クリックジャッキング防止：同一オリジンのみ iframe 許可
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // MIME スニッフィング防止
  { key: "X-Content-Type-Options", value: "nosniff" },
  // リファラー情報を最小限に制限
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // カメラ・マイク・位置情報へのアクセスを禁止
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
