/**
 * ステージ別ワードデータ。
 * display: 画面表示用ひらがな、reading: ローマ字入力の基準読み、hint: 英語ヒント
 */

import type { StageConfig } from "@/types";

export const STAGES: StageConfig[] = [
  // ──────────────────────────────────────────
  // EASY: 草原ステージ
  // ──────────────────────────────────────────
  {
    id: "grassland",
    name: "草原ステージ",
    difficulty: "easy",
    words: [
      { display: "ねこ", reading: "ねこ", hint: "cat" },
      { display: "いぬ", reading: "いぬ", hint: "dog" },
      { display: "そら", reading: "そら", hint: "sky" },
      { display: "くさ", reading: "くさ", hint: "grass" },
      { display: "はな", reading: "はな", hint: "flower" },
      { display: "たいよう", reading: "たいよう", hint: "sun" },
      { display: "つき", reading: "つき", hint: "moon" },
      { display: "みず", reading: "みず", hint: "water" },
      { display: "やま", reading: "やま", hint: "mountain" },
      { display: "かわ", reading: "かわ", hint: "river" },
      { display: "もり", reading: "もり", hint: "forest" },
      { display: "とり", reading: "とり", hint: "bird" },
      { display: "うま", reading: "うま", hint: "horse" },
      { display: "ひつじ", reading: "ひつじ", hint: "sheep" },
      { display: "ぶた", reading: "ぶた", hint: "pig" },
    ],
  },

  // ──────────────────────────────────────────
  // EASY: 村人ステージ
  // ──────────────────────────────────────────
  {
    id: "villager",
    name: "村人ステージ",
    difficulty: "easy",
    unlockRequirement: "grassland",
    words: [
      { display: "むら", reading: "むら", hint: "village" },
      { display: "いえ", reading: "いえ", hint: "house" },
      { display: "どあ", reading: "どあ", hint: "door" },
      { display: "まど", reading: "まど", hint: "window" },
      { display: "ベッド", reading: "べっど", hint: "bed" },
      { display: "つるはし", reading: "つるはし", hint: "pickaxe" },
      { display: "おのー", reading: "おの", hint: "axe" },
      { display: "くわ", reading: "くわ", hint: "hoe" },
      { display: "たいまつ", reading: "たいまつ", hint: "torch" },
      { display: "さかな", reading: "さかな", hint: "fish" },
      { display: "パン", reading: "ぱん", hint: "bread" },
      { display: "りんご", reading: "りんご", hint: "apple" },
      { display: "にく", reading: "にく", hint: "meat" },
      { display: "にんじん", reading: "にんじん", hint: "carrot" },
      { display: "じゃがいも", reading: "じゃがいも", hint: "potato" },
    ],
  },

  // ──────────────────────────────────────────
  // EASY: ドズル社チートステージ
  // ──────────────────────────────────────────
  {
    id: "dozle-cheat",
    name: "ドズル社チートステージ",
    difficulty: "easy",
    unlockRequirement: "villager",
    words: [
      { display: "どずる", reading: "どずる", hint: "Dozle" },
      { display: "ぼんじゅうる", reading: "ぼんじゅうる", hint: "Bonjour" },
      { display: "おんりー", reading: "おんりー", hint: "Only" },
      { display: "おらふ", reading: "おらふ", hint: "Orafu" },
      { display: "おおはら", reading: "おおはら", hint: "Ohara" },
      { display: "どずるしゃ", reading: "どずるしゃ", hint: "DozleCorp" },
      { display: "ゆーちゅーぶ", reading: "ゆーちゅーぶ", hint: "YouTube" },
      { display: "まいんくらふと", reading: "まいんくらふと", hint: "Minecraft" },
      { display: "ごりら", reading: "ごりら", hint: "gorilla" },
      { display: "びっぐぼす", reading: "びっぐぼす", hint: "Big Boss" },
      { display: "すぴーど", reading: "すぴーど", hint: "speed" },
      { display: "ゆき", reading: "ゆき", hint: "snow" },
      { display: "きつね", reading: "きつね", hint: "fox" },
      { display: "ちーむ", reading: "ちーむ", hint: "team" },
      { display: "なかま", reading: "なかま", hint: "friend" },
    ],
  },

  // ──────────────────────────────────────────
  // NORMAL: マイクラステージ
  // ──────────────────────────────────────────
  {
    id: "minecraft",
    name: "マイクラステージ",
    difficulty: "normal",
    unlockRequirement: "dozle-cheat",
    words: [
      { display: "クリーパー", reading: "くりーぱー", hint: "creeper" },
      { display: "エンダードラゴン", reading: "えんだーどらごん", hint: "Ender Dragon" },
      { display: "ダイヤモンド", reading: "だいやもんど", hint: "diamond" },
      { display: "ネザー", reading: "ねざー", hint: "Nether" },
      { display: "エンドポータル", reading: "えんどぽーたる", hint: "End Portal" },
      { display: "スケルトン", reading: "すけるとん", hint: "skeleton" },
      { display: "ゾンビ", reading: "ぞんび", hint: "zombie" },
      { display: "エンダーマン", reading: "えんだーまん", hint: "Enderman" },
      { display: "ウィザー", reading: "うぃざー", hint: "Wither" },
      { display: "レッドストーン", reading: "れっどすとーん", hint: "Redstone" },
      { display: "エンチャント", reading: "えんちゃんと", hint: "Enchant" },
      { display: "スポーン", reading: "すぽーん", hint: "spawn" },
      { display: "バイオーム", reading: "ばいおーむ", hint: "biome" },
      { display: "アドベンチャー", reading: "あどべんちゃー", hint: "adventure" },
      { display: "サバイバル", reading: "さばいばる", hint: "survival" },
    ],
  },

  // ──────────────────────────────────────────
  // NORMAL: ドズル社ステージ
  // ──────────────────────────────────────────
  {
    id: "dozle-normal",
    name: "ドズル社ステージ",
    difficulty: "normal",
    unlockRequirement: "minecraft",
    words: [
      { display: "ろじかるごりらしゃちょう", reading: "ろじかるごりらしゃちょう", hint: "Logical Gorilla President" },
      { display: "すぴーどすたー", reading: "すぴーどすたー", hint: "Speed Star" },
      { display: "ずぼらなたくみ", reading: "ずぼらなたくみ", hint: "Lazy Craftsman" },
      { display: "こころやさしいひきょうもの", reading: "こころやさしいひきょうもの", hint: "Kind Coward" },
      { display: "あなたのこころをねらいうち", reading: "あなたのこころをねらいうち", hint: "Aiming at Your Heart" },
      { display: "ぐらさんばーど", reading: "ぐらさんばーど", hint: "Sunglasses Bird" },
      { display: "いなりー", reading: "いなりー", hint: "Inari" },
      { display: "ゆきだるまくん", reading: "ゆきだるまくん", hint: "Snowman" },
      { display: "おともだち", reading: "おともだち", hint: "friends" },
      { display: "げーみんぐはうす", reading: "げーみんぐはうす", hint: "Gaming House" },
      { display: "やきにく", reading: "やきにく", hint: "yakiniku" },
      { display: "でぃすこーど", reading: "でぃすこーど", hint: "Discord" },
      { display: "こらぼ", reading: "こらぼ", hint: "collab" },
      { display: "あーかいぶ", reading: "あーかいぶ", hint: "archive" },
      { display: "おふぃしゃる", reading: "おふぃしゃる", hint: "official" },
    ],
  },

  // ──────────────────────────────────────────
  // HARD: ドズル社鬼畜ステージ
  // ──────────────────────────────────────────
  {
    id: "dozle-hard",
    name: "ドズル社鬼畜ステージ",
    difficulty: "hard",
    unlockRequirement: "dozle-normal",
    words: [
      { display: "おまえはもうしんでいる", reading: "おまえはもうしんでいる", hint: "You are already dead" },
      { display: "これがどずるしゃのちからだ", reading: "これがどずるしゃのちからだ", hint: "This is the power of DozleCorp" },
      { display: "ぼんじゅうるはひきょうだけどこころはやさしい", reading: "ぼんじゅうるはひきょうだけどこころはやさしい", hint: "Bonjour is cowardly but kind-hearted" },
      { display: "おんりーのすぴーどはまじやばい", reading: "おんりーのすぴーどはまじやばい", hint: "Only's speed is seriously amazing" },
      { display: "おらふくんのゆきだるまがかわいすぎる", reading: "おらふくんのゆきだるまがかわいすぎる", hint: "Orafu's snowman is too cute" },
      { display: "おおはらめんのたくみわざをみよ", reading: "おおはらめんのたくみわざをみよ", hint: "Behold Ohara MEN's craftsmanship" },
      { display: "どずるしゃのどうがをみてくれ", reading: "どずるしゃのどうがをみてくれ", hint: "Please watch DozleCorp's videos" },
      { display: "まいんくらふとはじんせいだ", reading: "まいんくらふとはじんせいだ", hint: "Minecraft is life" },
      { display: "えんだーどらごんをたおせ", reading: "えんだーどらごんをたおせ", hint: "Defeat the Ender Dragon" },
      { display: "ぜんいんしゅうごうどずるしゃのじかんだ", reading: "ぜんいんしゅうごうどずるしゃのじかんだ", hint: "Everyone gather, it's DozleCorp time" },
    ],
  },
];

/** ステージIDからステージ設定を取得する */
export const getStageById = (id: string): StageConfig | undefined =>
  STAGES.find((s) => s.id === id);
