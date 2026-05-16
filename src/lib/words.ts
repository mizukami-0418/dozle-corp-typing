/**
 * ステージ別ワードデータ。
 * display: 画面表示用文字列、reading: ローマ字入力の基準読み
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
      { display: "ねこ", reading: "ねこ" },
      { display: "いぬ", reading: "いぬ" },
      { display: "そら", reading: "そら" },
      { display: "くさ", reading: "くさ" },
      { display: "はな", reading: "はな" },
      { display: "たいよう", reading: "たいよう" },
      { display: "つき", reading: "つき" },
      { display: "みず", reading: "みず" },
      { display: "やま", reading: "やま" },
      { display: "かわ", reading: "かわ" },
      { display: "もり", reading: "もり" },
      { display: "とり", reading: "とり" },
      { display: "うま", reading: "うま" },
      { display: "ひつじ", reading: "ひつじ" },
      { display: "ぶた", reading: "ぶた" },
      // 村人・アイテム系
      { display: "むら", reading: "むら" },
      { display: "いえ", reading: "いえ" },
      { display: "どあ", reading: "どあ" },
      { display: "まど", reading: "まど" },
      { display: "ベッド", reading: "べっど" },
      { display: "つるはし", reading: "つるはし" },
      { display: "おの", reading: "おの" },
      { display: "くわ", reading: "くわ" },
      { display: "たいまつ", reading: "たいまつ" },
      { display: "さかな", reading: "さかな" },
      { display: "パン", reading: "ぱん" },
      { display: "りんご", reading: "りんご" },
      { display: "にく", reading: "にく" },
      { display: "にんじん", reading: "にんじん" },
      // Minecraft（短いもの）
      { display: "ネザー", reading: "ねざー" },
      { display: "ゾンビ", reading: "ぞんび" },
      { display: "ウィザー", reading: "うぃざー" },
      { display: "スポーン", reading: "すぽーん" },
      { display: "焼き肉", reading: "やきにく" },
      // ドズル社関連（短いもの）
      { display: "ドズル", reading: "どずる" },
      { display: "おんりー", reading: "おんりー" },
      { display: "ドズル社", reading: "どずるしゃ" },
      { display: "ゴリラ", reading: "ごりら" },
      { display: "コラボ", reading: "こらぼ" },
      { display: "いなりー", reading: "いなりー" },
      { display: "仲間", reading: "なかま" },
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
      { display: "クリーパー", reading: "くりーぱー" },
      {
        display: "エンダードラゴン",
        reading: "えんだーどらごん",
      },
      { display: "ダイヤモンド", reading: "だいやもんど" },
      {
        display: "エンドポータル",
        reading: "えんどぽーたる",
      },
      { display: "スケルトン", reading: "すけるとん" },
      { display: "エンダーマン", reading: "えんだーまん" },
      {
        display: "レッドストーン",
        reading: "れっどすとーん",
      },
      { display: "エンチャント", reading: "えんちゃんと" },
      { display: "バイオーム", reading: "ばいおーむ" },
      {
        display: "アドベンチャー",
        reading: "あどべんちゃー",
      },
      { display: "サバイバル", reading: "さばいばる" },
      { display: "じゃがいも", reading: "じゃがいも" },
      // ドズル社関連
      { display: "ぼんじゅうる", reading: "ぼんじゅうる" },
      { display: "おらふくん", reading: "おらふくん" },
      { display: "ユーチューブ", reading: "ゆーちゅーぶ" },
      {
        display: "マインクラフト",
        reading: "まいんくらふと",
      },
      { display: "ビッグボス", reading: "びっぐぼす" },
      { display: "MENフクロウ", reading: "めんふくろう" },
      {
        display: "スピードスター",
        reading: "すぴーどすたー",
      },
      {
        display: "ズボラな匠",
        reading: "ずぼらなたくみ",
      },
      {
        display: "グラサンバード",
        reading: "ぐらさんばーど",
      },
      {
        display: "雪だるまくん",
        reading: "ゆきだるまくん",
      },
      { display: "おともだち", reading: "おともだち" },
      {
        display: "ゲーミングハウス",
        reading: "げーみんぐはうす",
      },
      { display: "ディスコード", reading: "でぃすこーど" },
      { display: "アーカイブ", reading: "あーかいぶ" },
      { display: "オフィシャル", reading: "おふぃしゃる" },
      { display: "おおはらMEN", reading: "おおはらMEN" },
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
      {
        display: "ロジカルゴリラ社長",
        reading: "ろじかるごりらしゃちょう",
      }, // 12
      {
        display: "おまえはもうしんでいる",
        reading: "おまえはもうしんでいる",
      }, // 11
      {
        display: "エンダードラゴンを倒せ!",
        reading: "えんだーどらごんをたおせ!",
      }, // 12
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
      {
        display: "(心やさしい)卑怯者",
        reading: "(こころやさしい)ひきょうもの",
      }, // 13
      {
        display: "あなたの心を狙い撃ち",
        reading: "あなたのこころをねらいうち",
      }, // 13
      {
        display: "これがドズル社の力だ",
        reading: "これがどずるしゃのちからだ",
      }, // 13
      {
        display: "マインクラフトは人生だ",
        reading: "まいんくらふとはじんせいだ",
      }, // 13
      {
        display: "ドズル社の動画をみてくれ",
        reading: "どずるしゃのどうがをみてくれ",
      }, // 14
      {
        display: "おんりーのスピードはまじやばい",
        reading: "おんりーのすぴーどはまじやばい",
      }, // 15
      {
        display: "おおはらMENの匠の技をみよ",
        reading: "おおはらMENのたくみわざをみよ",
      }, // 15
      {
        display: "全員集合!ドズル社の時間だ!",
        reading: "ぜんいんしゅうごう!どずるしゃのじかんだ!",
      }, // 19
      {
        display: "おらふくんの雪だるまがかわいすぎる",
        reading: "おらふくんのゆきだるまがかわいすぎる",
      }, // 18
      {
        display: "ぼんじゅうるは卑怯だけど心はやさしい",
        reading: "ぼんじゅうるはひきょうだけどこころはやさしい",
      }, // 22
    ],
  },
];

/** ステージIDからステージ設定を取得する */
export const getStageById = (id: string): StageConfig | undefined =>
  STAGES.find((s) => s.id === id);
