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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 空レイヤー */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#87CEEB" }}
      >
        {/* 雲（装飾） */}
        <div className="absolute top-8 left-12 opacity-80">
          <CloudBlock />
        </div>
        <div className="absolute top-16 left-48 opacity-60">
          <CloudBlock />
        </div>
        <div className="absolute top-6 right-24 opacity-70">
          <CloudBlock />
        </div>
        <div className="absolute top-20 right-64 opacity-50">
          <CloudBlock />
        </div>
      </div>

      {/* 草・土レイヤー（下部） */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* 草ブロック列 */}
        <div
          className="h-6 w-full"
          style={{ backgroundColor: "#5a8a3c" }}
        />
        {/* 土ブロック列 */}
        <div
          className="h-16 w-full"
          style={{ backgroundColor: "#7a5c38" }}
        />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10">{children}</div>
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
