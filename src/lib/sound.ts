/**
 * Web Audio API によるサウンド生成。
 * 音声ファイル不要・著作権フリーでマイクラ風のブロック設置音を再現する。
 */

let _ctx: AudioContext | undefined;

/** AudioContext を遅延初期化する（ユーザー操作後に呼ばれることが前提） */
const getCtx = (): AudioContext | undefined => {
  if (typeof window === "undefined") return undefined;
  if (!_ctx) {
    _ctx = new AudioContext();
  }
  // ブラウザがサスペンドした場合は再開する
  if (_ctx.state === "suspended") {
    void _ctx.resume();
  }
  return _ctx;
};

/**
 * マイクラのブロック設置音風サウンドを再生する。
 * 短いノイズバーストをローパスフィルタで丸め、素早く減衰させる。
 */
export const playBlockPlace = (): void => {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.09;
  const bufferSize = Math.floor(ctx.sampleRate * duration);

  // ホワイトノイズバッファ生成
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // 指数的に減衰するホワイトノイズ
    data[i] = (Math.random() * 2 - 1) * Math.exp((-i / bufferSize) * 10);
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  // ローパスフィルタで「コツン」感を出す
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, now);
  filter.frequency.exponentialRampToValueAtTime(300, now + duration);
  filter.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(now);
};

/**
 * ミス入力時の短いエラー音を再生する。
 * 低周波の矩形波で「ブッ」という感じ。
 */
export const playMiss = (): void => {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.08);
};

/**
 * ステージクリア時のファンファーレ風サウンドを再生する。
 */
export const playClear = (): void => {
  const ctx = getCtx();
  if (!ctx) return;

  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const start = ctx.currentTime + i * 0.12;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.3);
  });
};
