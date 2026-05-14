/**
 * ひらがな → ローマ字変換モジュール。
 * 複数入力パターンを許容し、IME を使わずにローマ字入力できるようにする。
 */

/** 1音節のひらがな → 受け入れ可能なローマ字パターンのマッピング */
const KANA_MAP: Record<string, string[]> = {
  // 清音
  あ: ["a"],
  い: ["i"],
  う: ["u"],
  え: ["e"],
  お: ["o"],
  か: ["ka"],
  き: ["ki"],
  く: ["ku"],
  け: ["ke"],
  こ: ["ko"],
  さ: ["sa"],
  し: ["si", "shi"],
  す: ["su"],
  せ: ["se"],
  そ: ["so"],
  た: ["ta"],
  ち: ["ti", "chi"],
  つ: ["tu", "tsu"],
  て: ["te"],
  と: ["to"],
  な: ["na"],
  に: ["ni"],
  ぬ: ["nu"],
  ね: ["ne"],
  の: ["no"],
  は: ["ha"],
  ひ: ["hi"],
  ふ: ["fu", "hu"],
  へ: ["he"],
  ほ: ["ho"],
  ま: ["ma"],
  み: ["mi"],
  む: ["mu"],
  め: ["me"],
  も: ["mo"],
  や: ["ya"],
  ゆ: ["yu"],
  よ: ["yo"],
  ら: ["ra"],
  り: ["ri"],
  る: ["ru"],
  れ: ["re"],
  ろ: ["ro"],
  わ: ["wa"],
  ゐ: ["wi"],
  ゑ: ["we"],
  を: ["wo"],
  // 濁音
  が: ["ga"],
  ぎ: ["gi"],
  ぐ: ["gu"],
  げ: ["ge"],
  ご: ["go"],
  ざ: ["za"],
  じ: ["zi", "ji"],
  ず: ["zu"],
  ぜ: ["ze"],
  ぞ: ["zo"],
  だ: ["da"],
  ぢ: ["di"],
  づ: ["du"],
  で: ["de"],
  ど: ["do"],
  ば: ["ba"],
  び: ["bi"],
  ぶ: ["bu"],
  べ: ["be"],
  ぼ: ["bo"],
  // 半濁音
  ぱ: ["pa"],
  ぴ: ["pi"],
  ぷ: ["pu"],
  ぺ: ["pe"],
  ぽ: ["po"],
  // 拗音（ki 系）
  きゃ: ["kya"],
  きゅ: ["kyu"],
  きょ: ["kyo"],
  // 拗音（si 系）
  しゃ: ["sya", "sha"],
  しゅ: ["syu", "shu"],
  しょ: ["syo", "sho"],
  // 拗音（ti 系）
  ちゃ: ["tya", "cha"],
  ちゅ: ["tyu", "chu"],
  ちょ: ["tyo", "cho"],
  // 拗音（ni 系）
  にゃ: ["nya"],
  にゅ: ["nyu"],
  にょ: ["nyo"],
  // 拗音（hi 系）
  ひゃ: ["hya"],
  ひゅ: ["hyu"],
  ひょ: ["hyo"],
  // 拗音（mi 系）
  みゃ: ["mya"],
  みゅ: ["myu"],
  みょ: ["myo"],
  // 拗音（ri 系）
  りゃ: ["rya"],
  りゅ: ["ryu"],
  りょ: ["ryo"],
  // 拗音（gi 系）
  ぎゃ: ["gya"],
  ぎゅ: ["gyu"],
  ぎょ: ["gyo"],
  // 拗音（zi/ji 系）
  じゃ: ["zya", "ja", "jya"],
  じゅ: ["zyu", "ju", "jyu"],
  じょ: ["zyo", "jo", "jyo"],
  // 拗音（bi 系）
  びゃ: ["bya"],
  びゅ: ["byu"],
  びょ: ["byo"],
  // 拗音（pi 系）
  ぴゃ: ["pya"],
  ぴゅ: ["pyu"],
  ぴょ: ["pyo"],
  // 小文字単独
  ぁ: ["la", "xa"],
  ぃ: ["li", "xi"],
  ぅ: ["lu", "xu"],
  ぇ: ["le", "xe"],
  ぉ: ["lo", "xo"],
  ゃ: ["lya", "xya"],
  ゅ: ["lyu", "xyu"],
  ょ: ["lyo", "xyo"],
  っ: ["ltu", "xtu"],
  // 長音
  "ー": ["-"],
  // 句読点・記号
  "、": [","],
  "。": ["."],
  "「": ["["],
  "」": ["]"],
};

/**
 * 2文字の拗音キーのセット（変換時に先読みで使用）。
 * KANA_MAP のキーのうち 2 文字のものを収集する。
 */
const TWO_CHAR_KEYS = new Set(
  Object.keys(KANA_MAP).filter((k) => k.length === 2)
);

/**
 * ひらがな文字列を解析し、各音節ごとのローマ字パターン配列を返す。
 *
 * @param kana - ひらがな文字列（ASCII 文字が混在してもよい）
 * @returns 音節ごとのローマ字候補配列のリスト
 * @example
 * tokenize('ねこ') // => [['ne'], ['ko']]
 * tokenize('しゃ') // => [['sya', 'sha']]
 */
const tokenize = (kana: string): string[][] => {
  const tokens: string[][] = [];
  let i = 0;

  while (i < kana.length) {
    const ch = kana[i];

    // ASCII 文字はそのまま1文字として扱う
    if (/[a-zA-Z0-9 !?.,\-]/.test(ch)) {
      tokens.push([ch.toLowerCase()]);
      i++;
      continue;
    }

    // 「っ」の特殊処理：次音節の先頭子音のみを push（次音節は通常通り処理させる）
    // 例: "っか" → ["k"] を push し、続けて "か" → ["ka"] を push → 結合で "kka"
    if (ch === "っ") {
      const next2 = kana.slice(i + 1, i + 3);
      const next1 = kana[i + 1];

      if (next2 && TWO_CHAR_KEYS.has(next2)) {
        const nextPatterns = KANA_MAP[next2] ?? [];
        const firstConsonants = [...new Set(nextPatterns.map((p) => p[0]))];
        tokens.push(firstConsonants.length > 0 ? firstConsonants : ["l", "x"]);
      } else if (next1 && KANA_MAP[next1]) {
        const nextPatterns = KANA_MAP[next1];
        const firstConsonants = [...new Set(nextPatterns.map((p) => p[0]))];
        tokens.push(firstConsonants.length > 0 ? firstConsonants : ["l", "x"]);
      } else {
        // 後続音なし（語末の「っ」など）
        tokens.push(["ltu", "xtu"]);
      }
      i++;
      continue;
    }

    // 「ん」の特殊処理：n / nn どちらも正解
    if (ch === "ん") {
      const next = kana[i + 1];
      // 次が母音や「な行」の場合は nn を要求（n だと次音節の一部になるため）
      if (next && /[あいうえおなにぬねのa-n]/.test(next)) {
        tokens.push(["nn"]);
      } else {
        tokens.push(["n", "nn"]);
      }
      i++;
      continue;
    }

    // 2文字拗音（先読み）
    const twoChar = kana.slice(i, i + 2);
    if (TWO_CHAR_KEYS.has(twoChar)) {
      tokens.push(KANA_MAP[twoChar]);
      i += 2;
      continue;
    }

    // 1文字ひらがな
    if (KANA_MAP[ch]) {
      tokens.push(KANA_MAP[ch]);
      i++;
      continue;
    }

    // 未対応文字はそのまま（スペースなど）
    tokens.push([ch]);
    i++;
  }

  return tokens;
};

/**
 * ひらがな文字列をローマ字パターンのリストに変換する。
 * 組み合わせ爆発を防ぐため、最大 4 パターンに制限する。
 *
 * @param kana - 変換対象のひらがな文字列
 * @returns ローマ字文字列の候補リスト
 * @example
 * toRomaji('ねこ')  // => ['neko']
 * toRomaji('し')    // => ['si', 'shi']
 * toRomaji('ん')    // => ['n', 'nn']
 */
export const toRomaji = (kana: string): string[] => {
  const tokens = tokenize(kana);
  if (tokens.length === 0) return [];

  // 各トークンの候補を組み合わせて生成（最大 4 パターン）
  let results = tokens[0];
  for (let i = 1; i < tokens.length; i++) {
    const next = tokens[i];
    const combined: string[] = [];
    for (const r of results) {
      for (const n of next) {
        combined.push(r + n);
        if (combined.length >= 8) break;
      }
      if (combined.length >= 8) break;
    }
    results = combined;
  }

  return results;
};

/**
 * 入力済みローマ字が正解パターンのいずれかの先頭と一致するか確認する。
 * タイピング途中の逐次検証に使用する。
 *
 * @param typed - ユーザーが入力済みの文字列
 * @param kana - 正解のひらがな文字列
 * @returns マッチする場合 true
 */
export const isPartialMatch = (typed: string, kana: string): boolean => {
  const patterns = toRomaji(kana);
  return patterns.some((p) => p.startsWith(typed));
};

/**
 * 入力済みローマ字が正解パターンのいずれかと完全一致するか確認する。
 *
 * @param typed - ユーザーが入力済みの文字列
 * @param kana - 正解のひらがな文字列
 * @returns 完全一致する場合 true
 */
export const isExactMatch = (typed: string, kana: string): boolean => {
  const patterns = toRomaji(kana);
  return patterns.some((p) => p === typed);
};
