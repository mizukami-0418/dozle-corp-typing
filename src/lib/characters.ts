/**
 * キャラクター設定データ。
 * 画像は仮プレースホルダー（素材が揃い次第差し替え）。
 */

import type { CharacterConfig, CharacterKey } from "@/types";

export const CHARACTER_CONFIGS: Record<CharacterKey, CharacterConfig> = {
  Dozle: {
    key: "Dozle",
    name: "ドズル",
    color: "#E53935",
    catchphrase: "ロジカルゴリラ社長",
    friend: "ビッグボス",
    emoji: "🦍",
    messages: {
      idle: [
        "がんばれ！",
        "ロジカルにいこう！",
        "ゴリラのパワーを信じろ！",
        "集中！集中！",
      ],
      correct: ["そうだ！", "ナイス！", "完璧だ！", "その調子！"],
      cleared: [
        "やったぞ！さすがだ！",
        "ロジカルゴリラ、完璧な仕事！",
        "ビッグボスも喜んでるぞ！",
      ],
    },
  },
  Bonjour: {
    key: "Bonjour",
    name: "ぼんじゅうる",
    color: "#7B1FA2",
    catchphrase: "（心やさしい）卑怯者",
    friend: "グラサンバード",
    emoji: "🍆",
    messages: {
      idle: [
        "ぼくが応援してあげるよ…",
        "グラサンバードも見てるよ！",
        "心はやさしいから許してね",
        "ちょっと卑怯な手を使っちゃう？",
      ],
      correct: ["やるじゃん！", "いいね！", "すごいすごい！", "さすが！"],
      cleared: [
        "やったー！ぼくも嬉しい！",
        "グラサンバードが拍手してるよ！",
        "卑怯な手は使わなかったね！",
      ],
    },
  },
  Qnly: {
    key: "Qnly",
    name: "おんりー",
    color: "#FDD835",
    catchphrase: "スピードスター",
    friend: "いなりー",
    emoji: "🍌",
    messages: {
      idle: [
        "速さが大事だよ！",
        "いなりーも応援してる！",
        "スピードスターを目指せ！",
        "もっと速く！",
      ],
      correct: ["速い！", "いい感じ！", "そのスピード！", "完璧！"],
      cleared: [
        "最高のスピードだった！",
        "いなりーが喜んでる！",
        "スピードスターになったね！",
      ],
    },
  },
  OrafKun: {
    key: "OrafKun",
    name: "おらふくん",
    color: "#0097A7",
    catchphrase: "あなたの心を狙い撃ち",
    friend: "雪だるまくん",
    emoji: "☃️",
    messages: {
      idle: [
        "あなたの心を狙い撃ちするよ！",
        "雪だるまくんも応援中！",
        "冷静にいこう！",
        "ゆっくり丁寧に！",
      ],
      correct: ["狙い通り！", "ナイスショット！", "完璧な一撃！", "いい感じ！"],
      cleared: [
        "心を狙い撃ち、成功！",
        "雪だるまくんと一緒に喜んでる！",
        "完璧なクリア！",
      ],
    },
  },
  ooharaMEN: {
    key: "ooharaMEN",
    name: "おおはらMEN",
    color: "#E91E8C",
    catchphrase: "ズボラな匠",
    friend: "MENフクロウ",
    emoji: "🐷",
    messages: {
      idle: [
        "まあ、適当にやろっか",
        "匠の技を見せてあげよう",
        "ズボラでもうまくいく！",
        "のんびりいこうよ",
      ],
      correct: [
        "おっ、やるじゃん",
        "まあまあだね",
        "それでいい！",
        "悪くない！",
      ],
      cleared: [
        "ズボラな匠の底力を見たか！",
        "まあ、うまくいったね",
        "案外できるもんだね！",
      ],
    },
  },
};

/** キャラクターキーの一覧 */
export const CHARACTER_KEYS: CharacterKey[] = [
  "Dozle",
  "Bonjour",
  "Qnly",
  "OrafKun",
  "ooharaMEN",
];

/** ランダムなアイドルメッセージを返す */
export const getRandomIdleMessage = (key: CharacterKey): string => {
  const msgs = CHARACTER_CONFIGS[key].messages.idle;
  return msgs[Math.floor(Math.random() * msgs.length)];
};

/** ランダムな正解メッセージを返す */
export const getRandomCorrectMessage = (key: CharacterKey): string => {
  const msgs = CHARACTER_CONFIGS[key].messages.correct;
  return msgs[Math.floor(Math.random() * msgs.length)];
};

/** ランダムなクリアメッセージを返す */
export const getRandomClearedMessage = (key: CharacterKey): string => {
  const msgs = CHARACTER_CONFIGS[key].messages.cleared;
  return msgs[Math.floor(Math.random() * msgs.length)];
};
