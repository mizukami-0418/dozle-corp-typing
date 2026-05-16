/**
 * ステージ別ワードデータ。
 * display: 画面表示用ひらがな、reading: ローマ字入力の基準読み、hint: 英語ヒント
 *
 * 難易度は4段階（cheat / normal / hard / kichiku）、各難易度1ステージ。
 * ステージロックなし・全難易度最初から選択可能。
 */

import type { StageConfig } from "@/types";

export const STAGES: StageConfig[] = [
  // ──────────────────────────────────────────
  // チート
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
      { display: "じゃがいも", reading: "じゃがいも", hint: "potato" },
      // ドズル社関連（簡単）
      { display: "ドズル", reading: "どずる", hint: "Dozle" },
      { display: "ぼんじゅうる", reading: "ぼんじゅうる", hint: "Bonjour" },
      { display: "おんりー", reading: "おんりー", hint: "Qnly" },
      { display: "おらふくん", reading: "おらふくん", hint: "Oraf-Kun" },
      { display: "おおはらMEN", reading: "おおはらMEN", hint: "ooharaMEN" },
      { display: "どずるしゃ", reading: "どずるしゃ", hint: "DozleCorp" },
      { display: "ゆーちゅーぶ", reading: "ゆーちゅーぶ", hint: "YouTube" },
      { display: "まいんくらふと", reading: "まいんくらふと", hint: "Minecraft" },
      { display: "ゴリラ", reading: "ごりら", hint: "gorilla" },
      { display: "ビッグボス", reading: "びっぐぼす", hint: "Big Boss" },
      { display: "コラボ", reading: "こらぼ", hint: "collaboration" },
      { display: "いなりー", reading: "いなりー", hint: "Inaly" },
      { display: "MENフクロウ", reading: "めんふくろう", hint: "MEN Owl" },
      { display: "仲間", reading: "なかま", hint: "friend" },
    ],
  },

  // ──────────────────────────────────────────
  // ノーマル
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
      // ドズル社関連（中級）
      { display: "ロジカルゴリラ社長", reading: "ろじかるごりらしゃちょう", hint: "Logical boss gorilla" },
      { display: "スピードスター", reading: "すぴーどすたー", hint: "Speedstar" },
      { display: "ズボラな匠", reading: "ずぼらなたくみ", hint: "Lazy craftsman" },
      { display: "(心やさしい)卑怯者", reading: "(こころやさしい)ひきょうもの", hint: "Kindhearted coward" },
      { display: "あなたの心を狙い撃ち", reading: "あなたのこころをねらいうち", hint: "Heart sniper" },
      { display: "グラサンバード", reading: "ぐらさんばーど", hint: "Sunglasses Bird" },
      { display: "いなりー", reading: "いなりー", hint: "Inari" },
      { display: "雪だるまくん", reading: "ゆきだるまくん", hint: "Yukidaruma-Kun" },
      { display: "おともだち", reading: "おともだち", hint: "friends" },
      { display: "ゲーミングハウス", reading: "げーみんぐはうす", hint: "Gaming House" },
      { display: "焼き肉", reading: "やきにく", hint: "yakiniku" },
      { display: "でぃすこーど", reading: "でぃすこーど", hint: "Discord" },
      { display: "あーかいぶ", reading: "あーかいぶ", hint: "archive" },
      { display: "おふぃしゃる", reading: "おふぃしゃる", hint: "official" },
    ],
  },

  // ──────────────────────────────────────────
  // ハード
  // ──────────────────────────────────────────
  {
    id: "hard",
    name: "ハードステージ",
    difficulty: "hard",
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

  // ──────────────────────────────────────────
  // 鬼畜（ワードは後で追加）
  // ──────────────────────────────────────────
  {
    id: "kichiku",
    name: "鬼畜ステージ",
    difficulty: "kichiku",
    words: [],
  },
];

/** ステージIDからステージ設定を取得する */
export const getStageById = (id: string): StageConfig | undefined =>
  STAGES.find((s) => s.id === id);
