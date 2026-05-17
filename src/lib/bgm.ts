/**
 * Web Audio API によるゲーム中BGM生成。
 * 難易度ごとに異なるメロディを 8bit チップチューン風に再生する。
 */

import type { Difficulty } from "@/types";

let _ctx: AudioContext | undefined;

/** AudioContext を遅延初期化する */
const getCtx = (): AudioContext | undefined => {
  if (typeof window === "undefined") return undefined;
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === "suspended") void _ctx.resume();
  return _ctx;
};

/** 音量（SFXより控えめに設定） */
const BGM_VOLUME = 0.06;

// ──────────────────────────────────────────────────
// 音符周波数テーブル（Hz）
// ──────────────────────────────────────────────────

const N = {
  E4:  329.63,
  F4:  349.23,
  G4:  392.00,
  A4:  440.00,
  B4:  493.88,
  C5:  523.25,
  D5:  587.33,
  E5:  659.25,
  F5:  698.46,
  G5:  783.99,
  _:   0, // 休符
} as const;

// ──────────────────────────────────────────────────
// 難易度別トラック定義
// ──────────────────────────────────────────────────

interface BgmTrack {
  notes: number[];
  /** 1音符あたりの長さ（秒） */
  noteDur: number;
  /** 音符末尾の無音比率（アーティキュレーション） */
  silenceRatio: number;
  wave: OscillatorType;
}

const TRACKS: Record<Difficulty, BgmTrack> = {
  /**
   * CHEAT — 80 BPM / 8分音符 0.375s
   * のんびりした Minecraft 昼間風ループ（C メジャーペンタトニック）
   */
  cheat: {
    notes: [
      N.C5, N.E5, N.G5, N.E5, N.C5, N.A4, N.G4, N._,
      N.G4, N.A4, N.C5, N.E5, N.G5, N.E5, N.C5, N._,
    ],
    noteDur: 0.375,
    silenceRatio: 0.12,
    wave: "triangle",
  },

  /**
   * NORMAL — 110 BPM / 8分音符 0.273s
   * 軽快でポップなメロディ（C メジャースケール）
   */
  normal: {
    notes: [
      N.C5, N.D5, N.E5, N.G5, N.E5, N.D5, N.C5, N._,
      N.G4, N.A4, N.B4, N.C5, N.B4, N.A4, N.G4, N._,
    ],
    noteDur: 0.273,
    silenceRatio: 0.10,
    wave: "triangle",
  },

  /**
   * HARD — 150 BPM / 8分音符 0.2s
   * 緊張感のある速いメロディ（A ナチュラルマイナー）
   */
  hard: {
    notes: [
      N.A4, N.B4, N.C5, N.D5, N.E5, N.D5, N.C5, N.B4,
      N.A4, N.G4, N.F4, N.E4, N.F4, N.G4, N.A4, N._,
    ],
    noteDur: 0.2,
    silenceRatio: 0.08,
    wave: "square",
  },

  /**
   * 鬼畜 — 190 BPM / 8分音符 0.158s
   * 激しく追い詰める高速ループ（C ペンタトニック 上下）
   */
  kichiku: {
    notes: [
      N.G5, N.E5, N.C5, N.A4, N.G4, N.E4, N.G4, N.A4,
      N.C5, N.E5, N.G5, N.E5, N.C5, N.A4, N.G4, N._,
    ],
    noteDur: 0.158,
    silenceRatio: 0.06,
    wave: "square",
  },
};

// ──────────────────────────────────────────────────
// 再生・停止
// ──────────────────────────────────────────────────

/**
 * 指定難易度の BGM をループ再生する。
 * 返り値の関数を呼ぶとフェードアウトして停止する。
 *
 * @param difficulty - 再生するトラックの難易度
 * @returns stopFn — 呼び出すとフェードアウト停止する関数
 */
export const playBgm = (difficulty: Difficulty): (() => void) => {
  const ctx = getCtx();
  if (!ctx) return () => {};

  const track = TRACKS[difficulty];
  let stopped = false;

  // 全ループで共有するマスターゲイン（フェードアウト制御用）
  const master = ctx.createGain();
  master.gain.value = BGM_VOLUME;
  master.connect(ctx.destination);

  /**
   * 1ループ分のノートをスケジュールし、ループ終了時刻を返す。
   */
  const scheduleLoop = (startTime: number): number => {
    let t = startTime;

    for (const freq of track.notes) {
      if (freq > 0) {
        const osc = ctx.createOscillator();
        osc.type = track.wave;
        osc.frequency.value = freq;

        const noteGain = ctx.createGain();
        const soundEnd = t + track.noteDur * (1 - track.silenceRatio);

        // アタック → サステイン → リリース
        noteGain.gain.setValueAtTime(0, t);
        noteGain.gain.linearRampToValueAtTime(1, t + 0.01);
        noteGain.gain.setValueAtTime(1, soundEnd - 0.01);
        noteGain.gain.linearRampToValueAtTime(0, soundEnd);

        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(t);
        osc.stop(soundEnd);
      }
      t += track.noteDur;
    }

    return t; // このループの終了時刻
  };

  /**
   * ループを再帰的にスケジュールする。
   * 次のループは現在ループ終了の 0.2 秒前にスケジュールする（ルックアヘッド）。
   */
  const runLoop = (startTime: number) => {
    if (stopped) return;
    const endTime = scheduleLoop(startTime);
    const lookaheadMs = Math.max(0, (endTime - ctx.currentTime - 0.2) * 1000);
    setTimeout(() => runLoop(endTime), lookaheadMs);
  };

  runLoop(ctx.currentTime + 0.05);

  return () => {
    stopped = true;
    const now = ctx.currentTime;
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 0.5);
    setTimeout(() => master.disconnect(), 600);
  };
};
