/**
 * ステージ別ワードデータ。
 * display: 画面表示用文字列、reading: ローマ字入力の基準読み、hint: 英語ヒント
 *
 * 難易度分類基準：reading のひらがな文字数
 *   cheat   : 2〜4 文字
 *   normal  : 5〜8 文字
 *   hard    : 9〜12 文字
 *   kichiku : 13 文字以上（カッコ・記号含む全文字が入力対象）
 *
 * ワード制限時間は別途ローマ字文字数 × 難易度係数で算出する。
 */

import type { StageConfig } from "@/types";

export const STAGES: StageConfig[] = [
  // ──────────────────────────────────────────
  // チート（ひらがな 2〜4 文字）
  // ──────────────────────────────────────────
  {
    id: "cheat",
    name: "チートステージ",
    difficulty: "cheat",
    words: [
      // 草原・動物系
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
      // 村人・アイテム系
      { display: "むら", reading: "むら", hint: "village" },
      { display: "いえ", reading: "いえ", hint: "house" },
      { display: "どあ", reading: "どあ", hint: "door" },
      { display: "まど", reading: "まど", hint: "window" },
      { display: "ベッド", reading: "べっど", hint: "bed" },
      { display: "つるはし", reading: "つるはし", hint: "pickaxe" },
      { display: "おの", reading: "おの", hint: "axe" },
      { display: "くわ", reading: "くわ", hint: "hoe" },
      { display: "たいまつ", reading: "たいまつ", hint: "torch" },
      { display: "さかな", reading: "さかな", hint: "fish" },
      { display: "パン", reading: "ぱん", hint: "bread" },
      { display: "りんご", reading: "りんご", hint: "apple" },
      { display: "にく", reading: "にく", hint: "meat" },
      { display: "にんじん", reading: "にんじん", hint: "carrot" },
      // Minecraft（短いもの）
      { display: "ネザー", reading: "ねざー", hint: "Nether" },
      { display: "ゾンビ", reading: "ぞんび", hint: "zombie" },
      { display: "ウィザー", reading: "うぃざー", hint: "Wither" },
      { display: "スポーン", reading: "すぽーん", hint: "spawn" },
      { display: "焼き肉", reading: "やきにく", hint: "yakiniku" },
      // ドズル社関連（短いもの）
      { display: "ドズル", reading: "どずる", hint: "Dozle" },
      { display: "おんりー", reading: "おんりー", hint: "Qnly" },
      { display: "おおはらMEN", reading: "おおはらMEN", hint: "ooharaMEN" },
      { display: "どずるしゃ", reading: "どずるしゃ", hint: "DozleCorp" },
      { display: "ゴリラ", reading: "ごりら", hint: "gorilla" },
      { display: "コラボ", reading: "こらぼ", hint: "collaboration" },
      { display: "いなりー", reading: "いなりー", hint: "Inaly" },
      { display: "仲間", reading: "なかま", hint: "friend" },
    ],
  },

  // ──────────────────────────────────────────
  // ノーマル（ひらがな 5〜8 文字）
  // ──────────────────────────────────────────
  {
    id: "normal",
    name: "ノーマルステージ",
    difficulty: "normal",
    words: [
      // Minecraft 用語
      { display: "クリーパー", reading: "くりーぱー", hint: "creeper" },
      { display: "エンダードラゴン", reading: "えんだーどらごん", hint: "Ender Dragon" },
      { display: "ダイヤモンド", reading: "だいやもんど", hint: "diamond" },
      { display: "エンドポータル", reading: "えんどぽーたる", hint: "End Portal" },
      { display: "スケルトン", reading: "すけるとん", hint: "skeleton" },
      { display: "エンダーマン", reading: "えんだーまん", hint: "Enderman" },
      { display: "レッドストーン", reading: "れっどすとーん", hint: "Redstone" },
      { display: "エンチャント", reading: "えんちゃんと", hint: "Enchant" },
      { display: "バイオーム", reading: "ばいおーむ", hint: "biome" },
      { display: "アドベンチャー", reading: "あどべんちゃー", hint: "adventure" },
      { display: "サバイバル", reading: "さばいばる", hint: "survival" },
      { display: "じゃがいも", reading: "じゃがいも", hint: "potato" },
      // ドズル社関連
      { display: "ぼんじゅうる", reading: "ぼんじゅうる", hint: "Bonjour" },
      { display: "おらふくん", reading: "おらふくん", hint: "Oraf-Kun" },
      { display: "ゆーちゅーぶ", reading: "ゆーちゅーぶ", hint: "YouTube" },
      { display: "まいんくらふと", reading: "まいんくらふと", hint: "Minecraft" },
      { display: "ビッグボス", reading: "びっぐぼす", hint: "Big Boss" },
      { display: "MENフクロウ", reading: "めんふくろう", hint: "MEN Owl" },
      { display: "スピードスター", reading: "すぴーどすたー", hint: "Speedstar" },
      { display: "ズボラな匠", reading: "ずぼらなたくみ", hint: "Lazy craftsman" },
      { display: "グラサンバード", reading: "ぐらさんばーど", hint: "Sunglasses Bird" },
      { display: "雪だるまくん", reading: "ゆきだるまくん", hint: "Yukidaruma-Kun" },
      { display: "おともだち", reading: "おともだち", hint: "friends" },
      { display: "ゲーミングハウス", reading: "げーみんぐはうす", hint: "Gaming House" },
      { display: "でぃすこーど", reading: "でぃすこーど", hint: "Discord" },
      { display: "あーかいぶ", reading: "あーかいぶ", hint: "archive" },
      { display: "おふぃしゃる", reading: "おふぃしゃる", hint: "official" },
    ],
  },

  // ──────────────────────────────────────────
  // ハード（ひらがな 9〜12 文字）
  // ──────────────────────────────────────────
  {
    id: "hard",
    name: "ハードステージ",
    difficulty: "hard",
    words: [
      { display: "ロジカルゴリラ社長", reading: "ろじかるごりらしゃちょう", hint: "Logical boss gorilla" },       // 12
      { display: "おまえはもうしんでいる", reading: "おまえはもうしんでいる", hint: "You are already dead" },     // 11
      { display: "えんだーどらごんをたおせ", reading: "えんだーどらごんをたおせ", hint: "Defeat the Ender Dragon" }, // 12
    ],
  },

  // ──────────────────────────────────────────
  // 鬼畜（ひらがな 13 文字以上・カッコ等含む全文字入力）
  // ──────────────────────────────────────────
  {
    id: "kichiku",
    name: "鬼畜ステージ",
    difficulty: "kichiku",
    words: [
      { display: "(心やさしい)卑怯者", reading: "(こころやさしい)ひきょうもの", hint: "Kindhearted coward" },                    // 13
      { display: "あなたの心を狙い撃ち", reading: "あなたのこころをねらいうち", hint: "Heart sniper" },                          // 13
      { display: "これがどずるしゃのちからだ", reading: "これがどずるしゃのちからだ", hint: "This is the power of DozleCorp" },   // 13
      { display: "まいんくらふとはじんせいだ", reading: "まいんくらふとはじんせいだ", hint: "Minecraft is life" },               // 13
      { display: "どずるしゃのどうがをみてくれ", reading: "どずるしゃのどうがをみてくれ", hint: "Please watch DozleCorp's videos" }, // 14
      { display: "おんりーのすぴーどはまじやばい", reading: "おんりーのすぴーどはまじやばい", hint: "Only's speed is seriously amazing" }, // 15
      { display: "おおはらめんのたくみわざをみよ", reading: "おおはらめんのたくみわざをみよ", hint: "Behold Ohara MEN's craftsmanship" }, // 15
      { display: "ぜんいんしゅうごうどずるしゃのじかんだ", reading: "ぜんいんしゅうごうどずるしゃのじかんだ", hint: "Everyone gather, it's DozleCorp time" }, // 19
      { display: "おらふくんのゆきだるまがかわいすぎる", reading: "おらふくんのゆきだるまがかわいすぎる", hint: "Orafu's snowman is too cute" }, // 18
      { display: "ぼんじゅうるはひきょうだけどこころはやさしい", reading: "ぼんじゅうるはひきょうだけどこころはやさしい", hint: "Bonjour is cowardly but kind-hearted" }, // 22
    ],
  },
];

/** ステージIDからステージ設定を取得する */
export const getStageById = (id: string): StageConfig | undefined =>
  STAGES.find((s) => s.id === id);
