/**
 * バトルモード ステージ・モンスター定義。
 * CLAUDE.md §3-7 の仕様に基づく。
 */

import type { BattleStageConfig, BattleStageId, WordEntry } from "@/types";
import { STAGES } from "@/lib/words";

/** CLAUDE.md §3-7 HP仕様に基づくモンスターHP定数 */
const MONSTER_HP = {
  normal: { stage12: 30, stage34: 40, stage5Extra: 50 },
  boss:   { stage12: 40, stage34: 50, stage5Extra: 70 },
} as const;

/**
 * ひらがな・長音符のみを文字数としてカウントする。
 * ASCII文字（MEN等）はカウント対象外（CLAUDE.md §3-3 難易度分類基準に準拠）。
 *
 * @param reading - ワードの reading フィールド
 * @returns ひらがな文字数
 */
const countKana = (reading: string): number =>
  [...reading].filter((c) => /[ぁ-ゖー]/.test(c)).length;

export const BATTLE_STAGES: BattleStageConfig[] = [
  {
    id: "zombie",
    name: "STAGE 1",
    theme: "ゾンビ（初級）",
    setting: "草原・村の夜",
    secPerRomaji: 1.5,
    kanaLengthMin: 1,
    kanaLengthMax: 4,
    monsters: [
      { id: "zombie",         name: "ゾンビ",     emoji: "🧟", maxHp: MONSTER_HP.normal.stage12, isBoss: false },
      { id: "zombie-villager",name: "村人ゾンビ", emoji: "🧟", maxHp: MONSTER_HP.normal.stage12, isBoss: false },
      { id: "spider",         name: "くも",       emoji: "🕷️",  maxHp: MONSTER_HP.normal.stage12, isBoss: false },
      { id: "creeper",        name: "クリーパー", emoji: "💚", maxHp: MONSTER_HP.normal.stage12, isBoss: false },
      { id: "skeleton",       name: "スケルトン", emoji: "💀", maxHp: MONSTER_HP.boss.stage12,   isBoss: true  },
    ],
  },
  {
    id: "drowned",
    name: "STAGE 2",
    theme: "ドラウンド（中級）",
    setting: "海・川",
    secPerRomaji: 1.3,
    kanaLengthMin: 4,
    kanaLengthMax: 6,
    monsters: [
      { id: "drowned",  name: "ドラウンド",   emoji: "🧟", maxHp: MONSTER_HP.normal.stage12, isBoss: false },
      { id: "witch",    name: "ウィッチ",     emoji: "🧙", maxHp: MONSTER_HP.normal.stage12, isBoss: false },
      { id: "pillager", name: "ピリジャー",   emoji: "🏹", maxHp: MONSTER_HP.normal.stage12, isBoss: false },
      { id: "stray",    name: "ストレイ",     emoji: "🩻", maxHp: MONSTER_HP.normal.stage12, isBoss: false },
      { id: "ravager",  name: "ラヴェジャー", emoji: "🐗", maxHp: MONSTER_HP.boss.stage12,   isBoss: true  },
    ],
  },
  {
    id: "wither-skeleton",
    name: "STAGE 3",
    theme: "ウィザスケ（上級）",
    setting: "ネザー要塞",
    secPerRomaji: 1.1,
    kanaLengthMin: 6,
    kanaLengthMax: 8,
    monsters: [
      { id: "piglin",          name: "ピグリン",           emoji: "🐷", maxHp: MONSTER_HP.normal.stage34, isBoss: false },
      { id: "ghast",           name: "ガスト",             emoji: "👻", maxHp: MONSTER_HP.normal.stage34, isBoss: false },
      { id: "hoglin",          name: "ホグリン",           emoji: "🐗", maxHp: MONSTER_HP.normal.stage34, isBoss: false },
      { id: "blaze",           name: "ブレイズ",           emoji: "🔥", maxHp: MONSTER_HP.normal.stage34, isBoss: false },
      { id: "wither-skeleton", name: "ウィザースケルトン", emoji: "💀", maxHp: MONSTER_HP.boss.stage34,   isBoss: true  },
    ],
  },
  {
    id: "shulker",
    name: "STAGE 4",
    theme: "シュルカー（超上級）",
    setting: "エンドシティ",
    secPerRomaji: 0.9,
    kanaLengthMin: 8,
    kanaLengthMax: 10,
    monsters: [
      { id: "shulker",    name: "シュルカー",       emoji: "📦", maxHp: MONSTER_HP.normal.stage34, isBoss: false },
      { id: "enderman",   name: "エンダーマン",     emoji: "🖤", maxHp: MONSTER_HP.normal.stage34, isBoss: false },
      { id: "phantom",    name: "ファントム",       emoji: "🦇", maxHp: MONSTER_HP.normal.stage34, isBoss: false },
      { id: "evoker",     name: "エヴォーカー",     emoji: "🧙", maxHp: MONSTER_HP.normal.stage34, isBoss: false },
      { id: "vindicator", name: "ヴィンジケイター", emoji: "⚔️",  maxHp: MONSTER_HP.boss.stage34,   isBoss: true  },
    ],
  },
  {
    id: "ender-dragon",
    name: "STAGE 5",
    theme: "エンドラ（BOSS）",
    setting: "ジ・エンド",
    secPerRomaji: 0.8,
    kanaLengthMin: 10,
    kanaLengthMax: 12,
    monsters: [
      { id: "piglin-brute",   name: "ピグリンブルート",     emoji: "🐷", maxHp: MONSTER_HP.normal.stage5Extra, isBoss: false },
      { id: "elder-guardian", name: "エルダーガーディアン", emoji: "🐟", maxHp: MONSTER_HP.normal.stage5Extra, isBoss: false },
      { id: "warden",         name: "ウォーデン",           emoji: "🦾", maxHp: MONSTER_HP.normal.stage5Extra, isBoss: false },
      { id: "wither",         name: "ウィザー",             emoji: "☠️",  maxHp: MONSTER_HP.normal.stage5Extra, isBoss: false },
      { id: "ender-dragon",   name: "エンダードラゴン",     emoji: "🐉", maxHp: MONSTER_HP.boss.stage5Extra,   isBoss: true  },
    ],
  },
  {
    id: "dozle-battle",
    name: "EXTRA",
    theme: "ドズル社",
    setting: "ドズル社HQ",
    secPerRomaji: 0.7,
    kanaLengthMin: 12,
    kanaLengthMax: 15,
    monsters: [
      { id: "bonjour",    name: "ぼんじゅうる", emoji: "🐦", maxHp: MONSTER_HP.normal.stage5Extra, isBoss: false },
      { id: "oraf",       name: "おらふくん",   emoji: "⛄", maxHp: MONSTER_HP.normal.stage5Extra, isBoss: false },
      { id: "dozle",      name: "ドズル",       emoji: "🦍", maxHp: MONSTER_HP.normal.stage5Extra, isBoss: false },
      { id: "oohara-men", name: "おおはらMEN",  emoji: "🦉", maxHp: MONSTER_HP.normal.stage5Extra, isBoss: false },
      { id: "qnly",       name: "おんりー",     emoji: "🦊", maxHp: MONSTER_HP.boss.stage5Extra,   isBoss: true  },
    ],
  },
];

/** バトルステージの解放順序（Stage 1 は常時解放、以降は順番クリアで解放） */
export const BATTLE_STAGE_ORDER: BattleStageId[] = [
  "zombie",
  "drowned",
  "wither-skeleton",
  "shulker",
  "ender-dragon",
  "dozle-battle",
];

/** ノーマルモード全ステージのワードを結合したプール */
const ALL_WORDS: WordEntry[] = STAGES.flatMap((s) => s.words);

/**
 * バトルステージに対応するワードをひらがな文字数でフィルターして返す。
 *
 * @param stageId - バトルステージ識別子
 * @returns 対象ワードリスト（シャッフルなし）
 */
export const getWordsForBattleStage = (stageId: BattleStageId): WordEntry[] => {
  const stage = BATTLE_STAGES.find((s) => s.id === stageId);
  if (!stage) return [];
  const { kanaLengthMin, kanaLengthMax } = stage;
  return ALL_WORDS.filter((w) => {
    const len = countKana(w.reading);
    return len >= kanaLengthMin && len <= kanaLengthMax;
  });
};

/**
 * バトルステージIDからステージ設定を取得する。
 *
 * @param id - バトルステージ識別子
 * @returns ステージ設定、または undefined
 */
export const getBattleStageById = (id: string): BattleStageConfig | undefined =>
  BATTLE_STAGES.find((s) => s.id === id);
