"use client";

/**
 * ゲーム中の HUD（スコア・進捗バー・ミス数）コンポーネント。
 */

interface HUDProps {
  score: number;
  wordIndex: number;
  totalWords: number;
  missCount: number;
  accuracy: number;
  wpm: number;
}

export const HUD = ({
  score,
  wordIndex,
  totalWords,
  missCount,
  accuracy,
  wpm,
}: HUDProps) => {
  const progress = totalWords > 0 ? (wordIndex / totalWords) * 100 : 0;

  return (
    <div className="w-full px-4 py-3 flex items-center gap-4">
      {/* スコア */}
      <div className="bg-black/60 rounded px-3 py-1 text-[color:var(--color-brand-gold)] font-mono text-lg font-bold min-w-[120px]">
        SCORE: {score.toLocaleString()}
      </div>

      {/* 進捗バー */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between text-white text-xs font-bold">
          <span>WORD</span>
          <span>
            {wordIndex} / {totalWords}
          </span>
        </div>
        <div className="w-full h-4 bg-black/40 rounded overflow-hidden border border-white/20">
          <div
            className="h-full rounded transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--color-brand-gold)",
            }}
          />
        </div>
      </div>

      {/* 正確率 */}
      <div className="bg-black/60 rounded px-3 py-1 text-white text-sm font-bold min-w-[80px] text-center">
        <div className="text-xs text-white/70">正確率</div>
        <div>{accuracy}%</div>
      </div>

      {/* WPM */}
      <div className="bg-black/60 rounded px-3 py-1 text-white text-sm font-bold min-w-[70px] text-center">
        <div className="text-xs text-white/70">WPM</div>
        <div>{wpm}</div>
      </div>

      {/* ミス数 */}
      <div className="bg-black/60 rounded px-3 py-1 text-sm font-bold min-w-[70px] text-center"
        style={{ color: missCount > 0 ? "var(--color-difficulty-hard)" : "white" }}
      >
        <div className="text-xs text-white/70">MISS</div>
        <div>{missCount}</div>
      </div>
    </div>
  );
};
