"use client";

/**
 * ゲーム中の HUD（スコア・残り時間・ワードタイマー・ミス数）コンポーネント。
 */

interface HUDProps {
  score: number;
  totalTimeRemainingMs: number;
  wordTimeRemainingMs: number;
  wordTimeLimitMs: number;
  missCount: number;
  accuracy: number;
}

const formatSeconds = (ms: number): string =>
  String(Math.max(0, Math.ceil(ms / 1000)));

export const HUD = ({
  score,
  totalTimeRemainingMs,
  wordTimeRemainingMs,
  wordTimeLimitMs,
  missCount,
  accuracy,
}: HUDProps) => {
  const wordProgress =
    wordTimeLimitMs > 0 ? Math.max(0, wordTimeRemainingMs / wordTimeLimitMs) : 1;

  const timeColor =
    totalTimeRemainingMs <= 10_000
      ? "var(--color-difficulty-hard)"
      : totalTimeRemainingMs <= 20_000
      ? "var(--color-brand-gold)"
      : "#4ade80";

  const wordBarColor =
    wordProgress <= 0.25
      ? "var(--color-difficulty-hard)"
      : wordProgress <= 0.5
      ? "var(--color-brand-gold)"
      : "#4ade80";

  return (
    <div className="w-full px-4 py-3 flex items-center gap-3">
      {/* スコア */}
      <div className="bg-black/60 rounded px-3 py-1 text-[color:var(--color-brand-gold)] font-mono text-lg font-bold min-w-[130px]">
        SCORE: {score.toLocaleString()}
      </div>

      {/* 総残り時間 */}
      <div className="bg-black/60 rounded px-3 py-1 text-center min-w-[72px]">
        <div className="text-white/60 text-xs font-bold">残り時間</div>
        <div
          className="text-xl font-black font-mono leading-tight"
          style={{ color: timeColor }}
        >
          {formatSeconds(totalTimeRemainingMs)}s
        </div>
      </div>

      {/* ワード別タイマーバー */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between text-white/60 text-xs font-bold">
          <span>WORD TIMER</span>
          <span>{formatSeconds(wordTimeRemainingMs)}s</span>
        </div>
        <div className="w-full h-4 bg-black/40 rounded overflow-hidden border border-white/20">
          <div
            className="h-full rounded"
            style={{
              width: `${wordProgress * 100}%`,
              backgroundColor: wordBarColor,
              transition: "width 0.1s linear, background-color 0.3s",
            }}
          />
        </div>
      </div>

      {/* 正確率 */}
      <div className="bg-black/60 rounded px-3 py-1 text-white text-sm font-bold min-w-[80px] text-center">
        <div className="text-xs text-white/70">正確率</div>
        <div>{accuracy}%</div>
      </div>

      {/* ミス数 */}
      <div
        className="bg-black/60 rounded px-3 py-1 text-sm font-bold min-w-[70px] text-center"
        style={{ color: missCount > 0 ? "var(--color-difficulty-hard)" : "white" }}
      >
        <div className="text-xs text-white/70">MISS</div>
        <div>{missCount}</div>
      </div>

    </div>
  );
};
