import type { MetadataRoute } from "next";

/**
 * クローラー向け robots.txt を生成する。
 *
 * @returns robots.txt のルール定義
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://dozle-corp-typing.vercel.app/sitemap.xml",
  };
}
