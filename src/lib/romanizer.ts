/**
 * ひらがな → ローマ字変換モジュール。
 * 複数入力パターンを許容し、IME を使わずにローマ字入力できるようにする。
 */

/**
 * ひらがな1トークン（1〜2文字）とそのローマ字候補の対。
 * Phase 14 の逐次マッチング（Matcher）で使用する。
 */
export interface KanaToken {
  /** このトークンが対応するひらがな（通常1文字、拗音は2文字） */
  kana: string;
  /** このトークンで受け入れ可能なローマ字候補 */
  candidates: string[];
}

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
  // 拗音（zi/ji 系）— jya/jyu/jyo は組み合わせ爆発防止のため除外
  じゃ: ["ja", "zya"],
  じゅ: ["ju", "zyu"],
  じょ: ["jo", "zyo"],
  // 拗音（bi 系）
  びゃ: ["bya"],
  びゅ: ["byu"],
  びょ: ["byo"],
  // 拗音（pi 系）
  ぴゃ: ["pya"],
  ぴゅ: ["pyu"],
  ぴょ: ["pyo"],
  // 拗音（fu 系）
  ふぁ: ["fa", "fwa"],
  ふぃ: ["fi", "fwi"],
  ふぅ: ["fwu"],
  ふぇ: ["fe", "fwe"],
  ふぉ: ["fo", "fwo"],
  ふゃ: ["fya"],
  ふゅ: ["fyu"],
  ふょ: ["fyo"],
  // 拗音（va 系）
  ゔぁ: ["va"],
  ゔぃ: ["vi"],
  ゔ: ["vu"],
  ゔぇ: ["ve"],
  ゔぉ: ["vo"],
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
  ー: ["-"],
  // 句読点・記号
  "、": [","],
  "。": ["."],
  "「": ["["],
  "」": ["]"],
  "・": ["/"],
};

/**
 * 2文字の拗音キーのセット（変換時に先読みで使用）。
 * KANA_MAP のキーのうち 2 文字のものを収集する。
 */
const TWO_CHAR_KEYS = new Set(
  Object.keys(KANA_MAP).filter((k) => k.length === 2),
);

/**
 * ひらがな文字列をトークン列に分解する。
 * 各トークンはひらがな（1〜2文字）とローマ字候補の対。
 * 拗音は2文字で1トークン、「っ」は次トークンの先頭子音を候補として持つ。
 *
 * @param kana - ひらがな文字列（ASCII 文字が混在してもよい）
 * @returns KanaToken の配列
 * @example
 * tokenizeKana('ねこ') // => [{kana:'ね', candidates:['ne']}, {kana:'こ', candidates:['ko']}]
 * tokenizeKana('しゃ') // => [{kana:'しゃ', candidates:['sya','sha']}]
 * tokenizeKana('った') // => [{kana:'っ', candidates:['t']}, {kana:'た', candidates:['ta']}]
 */
export const tokenizeKana = (kana: string): KanaToken[] => {
  const tokens: KanaToken[] = [];
  let i = 0;

  while (i < kana.length) {
    const ch = kana[i];

    // ASCII 文字はそのまま1文字として扱う
    if (/[a-zA-Z0-9 !?.,\-]/.test(ch)) {
      tokens.push({ kana: ch, candidates: [ch.toLowerCase()] });
      i++;
      continue;
    }

    // 「っ」の特殊処理：次音節の先頭子音のみを候補として生成
    if (ch === "っ") {
      const next2 = kana.slice(i + 1, i + 3);
      const next1 = kana[i + 1];

      if (next2 && TWO_CHAR_KEYS.has(next2)) {
        const nextPatterns = KANA_MAP[next2] ?? [];
        const firstConsonants = [...new Set(nextPatterns.map((p) => p[0]))];
        tokens.push({ kana: ch, candidates: firstConsonants.length > 0 ? firstConsonants : ["l", "x"] });
      } else if (next1 && KANA_MAP[next1]) {
        const nextPatterns = KANA_MAP[next1];
        const firstConsonants = [...new Set(nextPatterns.map((p) => p[0]))];
        tokens.push({ kana: ch, candidates: firstConsonants.length > 0 ? firstConsonants : ["l", "x"] });
      } else {
        // 後続音なし（語末の「っ」など）
        tokens.push({ kana: ch, candidates: ["ltu", "xtu"] });
      }
      i++;
      continue;
    }

    // 「ん」の特殊処理：次が母音や「な行」の場合は nn を強制
    if (ch === "ん") {
      const next = kana[i + 1];
      if (next && /[あいうえおなにぬねのa-n]/.test(next)) {
        tokens.push({ kana: ch, candidates: ["nn"] });
      } else {
        tokens.push({ kana: ch, candidates: ["n", "nn"] });
      }
      i++;
      continue;
    }

    // 2文字拗音（先読み）
    const twoChar = kana.slice(i, i + 2);
    if (TWO_CHAR_KEYS.has(twoChar)) {
      tokens.push({ kana: twoChar, candidates: KANA_MAP[twoChar] });
      i += 2;
      continue;
    }

    // 1文字ひらがな
    if (KANA_MAP[ch]) {
      tokens.push({ kana: ch, candidates: KANA_MAP[ch] });
      i++;
      continue;
    }

    // 未対応文字はそのまま（スペースなど）
    tokens.push({ kana: ch, candidates: [ch] });
    i++;
  }

  return tokens;
};

/**
 * ひらがな文字列を解析し、各音節ごとのローマ字パターン配列を返す。
 * 内部的に tokenizeKana に委譲する。
 *
 * @param kana - ひらがな文字列（ASCII 文字が混在してもよい）
 * @returns 音節ごとのローマ字候補配列のリスト
 */
const tokenize = (kana: string): string[][] =>
  tokenizeKana(kana).map((t) => t.candidates);

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

  // 各トークンの候補を組み合わせて生成
  let results = tokens[0];
  for (let i = 1; i < tokens.length; i++) {
    const next = tokens[i];
    const combined: string[] = [];
    for (const r of results) {
      for (const n of next) {
        combined.push(r + n);
      }
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

/**
 * reading のローマ字換算文字数（最短パターン）を返す。
 * ワード別タイムアウト計算に使用する。
 *
 * @param reading - ひらがな・ASCII 混在文字列
 * @returns 最短ローマ字パターンの文字数
 */
export const countRomajiLength = (reading: string): number => {
  const patterns = toRomaji(reading);
  if (patterns.length === 0) return reading.length;
  return Math.min(...patterns.map((p) => p.length));
};

// ── Matcher ───────────────────────────────────────────────────────────────

/**
 * 逐次マッチングの状態。
 * 1キー入力のたびに advance() で新しい状態に遷移する。
 */
export interface MatcherState {
  tokens: KanaToken[];
  tokenIndex: number;
  /** 現在トークン内で入力済みの文字列 */
  typed: string;
  /** 現在トークンの生き残り候補 */
  liveCandidates: string[];
  /** 確定済みのローマ字（表示用） */
  committedRomaji: string;
}

/**
 * advance() の戻り値。
 * - ok: 入力を受理（ゲーム続行）
 * - complete: 全トークン消費（ワード完了）
 * - miss: 不正解（状態変化なし）
 */
export type AdvanceResult =
  | { status: "ok"; next: MatcherState }
  | { status: "complete"; next: MatcherState }
  | { status: "miss" };

/**
 * ひらがな文字列からマッチャーの初期状態を生成する。
 *
 * @param kana - ひらがな・ASCII 混在文字列
 * @returns 初期 MatcherState
 */
export const createMatcher = (kana: string): MatcherState => {
  const tokens = tokenizeKana(kana);
  return {
    tokens,
    tokenIndex: 0,
    typed: "",
    liveCandidates: tokens[0]?.candidates ?? [],
    committedRomaji: "",
  };
};

/**
 * トークンを確定し、次のトークンへ遷移した結果を返す内部ヘルパー。
 */
const advanceToken = (
  tokens: KanaToken[],
  completedIndex: number,
  newCommittedRomaji: string,
): AdvanceResult => {
  const nextIndex = completedIndex + 1;
  if (nextIndex >= tokens.length) {
    return {
      status: "complete",
      next: {
        tokens,
        tokenIndex: nextIndex,
        typed: "",
        liveCandidates: [],
        committedRomaji: newCommittedRomaji,
      },
    };
  }
  return {
    status: "ok",
    next: {
      tokens,
      tokenIndex: nextIndex,
      typed: "",
      liveCandidates: tokens[nextIndex].candidates,
      committedRomaji: newCommittedRomaji,
    },
  };
};

/**
 * 1キー入力を受け取り、マッチャーの状態を進める。
 *
 * 「ん」の auto-commit: typed が既に exact match の状態で候補が全滅した場合、
 * typed でトークンを確定し、入力キーを次のトークンで再試行する。
 * これにより「んか」の `n` → `k` の入力で `n` が自動確定される。
 *
 * @param state - 現在の MatcherState
 * @param key - 入力された1文字（小文字）
 * @returns AdvanceResult
 */
export const advance = (state: MatcherState, key: string): AdvanceResult => {
  const { tokens, tokenIndex, typed, liveCandidates, committedRomaji } = state;
  const newTyped = typed + key;

  const survivors = liveCandidates.filter((c) => c.startsWith(newTyped));

  if (survivors.length > 0) {
    const hasExact = survivors.some((c) => c === newTyped);
    const hasLonger = survivors.some((c) => c.length > newTyped.length);

    // 完全一致のみ残った、または語末トークンで完全一致 → トークン確定
    // 語末の「ん」は nn を待たず n 単打で完了させる
    const isLastToken = tokenIndex === tokens.length - 1;
    if (hasExact && (!hasLonger || isLastToken)) {
      return advanceToken(tokens, tokenIndex, committedRomaji + newTyped);
    }

    // まだ候補が残っている（例：n で ん/nn どちらも生存中）
    return {
      status: "ok",
      next: { ...state, typed: newTyped, liveCandidates: survivors },
    };
  }

  // 候補が全滅。typed が既に exact match なら auto-commit して次トークンで再試行
  // （例：「んか」で n 入力済みのあとに k → n で ん を確定し k を か で受理）
  if (liveCandidates.some((c) => c === typed)) {
    const nextIndex = tokenIndex + 1;
    if (nextIndex >= tokens.length) return { status: "miss" };

    const nextSurvivors = tokens[nextIndex].candidates.filter((c) =>
      c.startsWith(key),
    );
    if (nextSurvivors.length === 0) return { status: "miss" };

    const newCommitted = committedRomaji + typed;
    const nextHasExact = nextSurvivors.some((c) => c === key);
    const nextHasLonger = nextSurvivors.some((c) => c.length > key.length);

    if (nextHasExact && !nextHasLonger) {
      return advanceToken(tokens, nextIndex, newCommitted + key);
    }
    return {
      status: "ok",
      next: {
        tokens,
        tokenIndex: nextIndex,
        typed: key,
        liveCandidates: nextSurvivors,
        committedRomaji: newCommitted,
      },
    };
  }

  return { status: "miss" };
};
