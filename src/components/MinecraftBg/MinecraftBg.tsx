"use client";

/**
 * Minecraft スタイルの背景コンポーネント。
 * 空・草・土の3層構造をピクセルアート調で表現する。
 */

interface MinecraftBgProps {
  children: React.ReactNode;
}

export const MinecraftBg = ({ children }: MinecraftBgProps) => {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#87CEEB" }}
    >
      {/* 雲（装飾） */}
      <div className="absolute top-8 left-12 opacity-80 pointer-events-none">
        <CloudBlock />
      </div>
      <div className="absolute top-16 left-48 opacity-60 pointer-events-none">
        <CloudBlock />
      </div>
      <div className="absolute top-6 right-24 opacity-70 pointer-events-none">
        <CloudBlock />
      </div>
      <div className="absolute top-20 right-64 opacity-50 pointer-events-none">
        <CloudBlock />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>

      {/* フッター（草・土） */}
      <footer>
        {/* 草ブロック列 */}
        <div className="h-6 w-full" style={{ backgroundColor: "#5a8a3c" }} />
        {/* 土ブロック列 */}
        <div
          className="h-16 w-full flex items-center justify-center"
          style={{ backgroundColor: "#7a5c38" }}
        >
          <span
            className="text-sm text-black/80"
            style={{ fontFamily: "monospace" }}
          >
            &copy; {new Date().getFullYear()} tomo Web Studio . All rights
            reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

/** ピクセル風の雲ブロック */
const CloudBlock = () => (
  <div className="flex flex-col gap-0">
    <div className="flex">
      <div className="w-8 h-8 bg-white opacity-90" />
      <div className="w-8 h-8 bg-white opacity-90" />
      <div className="w-8 h-8 bg-white opacity-90" />
    </div>
    <div className="flex">
      <div className="w-8 h-8 bg-white opacity-90" />
      <div className="w-8 h-8 bg-white opacity-90" />
      <div className="w-8 h-8 bg-white opacity-90" />
      <div className="w-8 h-8 bg-white opacity-90" />
      <div className="w-8 h-8 bg-white opacity-90" />
    </div>
    <div className="flex">
      <div className="w-8 h-8 bg-white opacity-90" />
      <div className="w-8 h-8 bg-white opacity-90" />
      <div className="w-8 h-8 bg-white opacity-90" />
    </div>
  </div>
);
