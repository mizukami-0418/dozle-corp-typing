/**
 * romanizer.ts のユニットテスト。
 * toRomaji / isPartialMatch / isExactMatch の各ケースを網羅的に検証する。
 */

import { describe, it, expect } from "vitest";
import {
  toRomaji,
  isPartialMatch,
  isExactMatch,
  tokenizeKana,
  createMatcher,
  advance,
  type MatcherState,
} from "@/lib/romanizer";

// ── toRomaji ──────────────────────────────────────────────────────────────

describe("toRomaji", () => {
  describe("清音・基本変換", () => {
    it("ねこ → neko", () => {
      expect(toRomaji("ねこ")).toContain("neko");
    });

    it("いぬ → inu", () => {
      expect(toRomaji("いぬ")).toContain("inu");
    });

    it("あいうえお → aiueo", () => {
      expect(toRomaji("あいうえお")).toContain("aiueo");
    });
  });

  describe("複数パターン許容", () => {
    it("し → si と shi どちらも含む", () => {
      const result = toRomaji("し");
      expect(result).toContain("si");
      expect(result).toContain("shi");
    });

    it("ち → ti と chi どちらも含む", () => {
      const result = toRomaji("ち");
      expect(result).toContain("ti");
      expect(result).toContain("chi");
    });

    it("つ → tu と tsu どちらも含む", () => {
      const result = toRomaji("つ");
      expect(result).toContain("tu");
      expect(result).toContain("tsu");
    });

    it("ふ → fu と hu どちらも含む", () => {
      const result = toRomaji("ふ");
      expect(result).toContain("fu");
      expect(result).toContain("hu");
    });
  });

  describe("「ん」の処理", () => {
    it("単独の ん → n と nn どちらも含む", () => {
      const result = toRomaji("ん");
      expect(result).toContain("n");
      expect(result).toContain("nn");
    });

    it("ん + 子音（か）→ nka または nnka", () => {
      const result = toRomaji("んか");
      // n か nn のどちらかが先頭に来るパターンが存在する
      expect(result.some((p) => p === "nka" || p === "nnka")).toBe(true);
    });

    it("ん + 母音（あ）→ na と nna どちらも含む", () => {
      const result = toRomaji("んあ");
      expect(result).toContain("nna");
      expect(result).toContain("na");
    });
  });

  describe("「っ」の処理", () => {
    it("った → tta", () => {
      expect(toRomaji("った")).toContain("tta");
    });

    it("っか → kka", () => {
      expect(toRomaji("っか")).toContain("kka");
    });

    it("っさ → ssa", () => {
      expect(toRomaji("っさ")).toContain("ssa");
    });

    it("にっき → nikki", () => {
      expect(toRomaji("にっき")).toContain("nikki");
    });
  });

  describe("拗音", () => {
    it("しゃ → sya と sha どちらも含む", () => {
      const result = toRomaji("しゃ");
      expect(result).toContain("sya");
      expect(result).toContain("sha");
    });

    it("ちゃ → tya と cha どちらも含む", () => {
      const result = toRomaji("ちゃ");
      expect(result).toContain("tya");
      expect(result).toContain("cha");
    });

    it("じゃ → zya と ja どちらも含む", () => {
      const result = toRomaji("じゃ");
      expect(result).toContain("zya");
      expect(result).toContain("ja");
    });

    it("じゃじゃ → jaja を含む（パターン上限で切り捨てられない）", () => {
      expect(toRomaji("じゃじゃ")).toContain("jaja");
    });

    it("きゅ → kyu", () => {
      expect(toRomaji("きゅ")).toContain("kyu");
    });

    it("ふぁ → fa と fwa どちらも含む", () => {
      const result = toRomaji("ふぁ");
      expect(result).toContain("fa");
      expect(result).toContain("fwa");
    });

    it("ふぃ → fi と fwi どちらも含む", () => {
      const result = toRomaji("ふぃ");
      expect(result).toContain("fi");
      expect(result).toContain("fwi");
    });

    it("ふぇ → fe と fwe どちらも含む", () => {
      const result = toRomaji("ふぇ");
      expect(result).toContain("fe");
      expect(result).toContain("fwe");
    });

    it("ふぉ → fo と fwo どちらも含む", () => {
      const result = toRomaji("ふぉ");
      expect(result).toContain("fo");
      expect(result).toContain("fwo");
    });

    it("ふゅ → fyu を含む", () => {
      expect(toRomaji("ふゅ")).toContain("fyu");
    });

    it("ふゃ → fya を含む", () => {
      expect(toRomaji("ふゃ")).toContain("fya");
    });

    it("ふょ → fyo を含む", () => {
      expect(toRomaji("ふょ")).toContain("fyo");
    });

    it("ふぅ → fwu を含む", () => {
      expect(toRomaji("ふぅ")).toContain("fwu");
    });

    it("ゔぁ → va を含む", () => {
      expect(toRomaji("ゔぁ")).toContain("va");
    });

    it("ゔ → vu を含む", () => {
      expect(toRomaji("ゔ")).toContain("vu");
    });
  });

  describe("ASCII 混在", () => {
    it("ASCII 文字はそのままパススルー（小文字化）", () => {
      expect(toRomaji("a")).toContain("a");
      expect(toRomaji("Z")).toContain("z");
    });
  });

  describe("長音・記号", () => {
    it("ー → -", () => {
      expect(toRomaji("ー")).toContain("-");
    });
  });

  describe("空文字", () => {
    it("空文字 → 空配列", () => {
      expect(toRomaji("")).toEqual([]);
    });
  });
});

// ── tokenizeKana ──────────────────────────────────────────────────────────

describe("tokenizeKana", () => {
  describe("通常清音", () => {
    it("ねこ → 2トークン、kana と candidates が正しい", () => {
      const result = tokenizeKana("ねこ");
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ kana: "ね", candidates: ["ne"] });
      expect(result[1]).toEqual({ kana: "こ", candidates: ["ko"] });
    });

    it("複数パターン：し → candidates に si と shi を含む", () => {
      const [token] = tokenizeKana("し");
      expect(token.kana).toBe("し");
      expect(token.candidates).toContain("si");
      expect(token.candidates).toContain("shi");
    });
  });

  describe("拗音", () => {
    it("しゃ → 1トークン、kana が 2文字で candidates に sya と sha を含む", () => {
      const result = tokenizeKana("しゃ");
      expect(result).toHaveLength(1);
      expect(result[0].kana).toBe("しゃ");
      expect(result[0].candidates).toContain("sya");
      expect(result[0].candidates).toContain("sha");
    });

    it("にっき → っ の前後でトークン境界が正しく分かれる", () => {
      const result = tokenizeKana("にっき");
      expect(result).toHaveLength(3);
      expect(result[0].kana).toBe("に");
      expect(result[1].kana).toBe("っ");
      expect(result[2].kana).toBe("き");
    });
  });

  describe("「っ」の処理", () => {
    it("っ + 清音（った）→ っ の candidates が ['t']", () => {
      const result = tokenizeKana("った");
      expect(result).toHaveLength(2);
      expect(result[0].kana).toBe("っ");
      expect(result[0].candidates).toEqual(["t"]);
      expect(result[1].candidates).toContain("ta");
    });

    it("っ + 拗音（っきゃ）→ っ の candidates が ['k']", () => {
      const result = tokenizeKana("っきゃ");
      expect(result).toHaveLength(2);
      expect(result[0].kana).toBe("っ");
      expect(result[0].candidates).toEqual(["k"]);
      expect(result[1].kana).toBe("きゃ");
    });

    it("っ + 複数パターン子音（っし）→ candidates が ['s']（si/shi 共通先頭）", () => {
      const result = tokenizeKana("っし");
      expect(result[0].candidates).toEqual(["s"]);
    });

    it("っ 語末（後続なし）→ candidates が ['ltu', 'xtu']", () => {
      const [token] = tokenizeKana("っ");
      expect(token.kana).toBe("っ");
      expect(token.candidates).toEqual(["ltu", "xtu"]);
    });
  });

  describe("「ん」の処理", () => {
    it("ん + 子音（んか）→ n と nn どちらも candidates に含む", () => {
      const result = tokenizeKana("んか");
      expect(result[0].kana).toBe("ん");
      expect(result[0].candidates).toContain("n");
      expect(result[0].candidates).toContain("nn");
    });

    it("ん + 母音（んあ）→ candidates は ['n', 'nn']（常に両方許容）", () => {
      const result = tokenizeKana("んあ");
      expect(result[0].kana).toBe("ん");
      expect(result[0].candidates).toContain("n");
      expect(result[0].candidates).toContain("nn");
    });

    it("ん 語末（後続なし）→ n と nn どちらも含む", () => {
      const [token] = tokenizeKana("ん");
      expect(token.candidates).toContain("n");
      expect(token.candidates).toContain("nn");
    });

    it("ん + な行（んな）→ 複合トークン kana='んな', candidates=['nna','nnna']", () => {
      const result = tokenizeKana("んな");
      expect(result).toHaveLength(1);
      expect(result[0].kana).toBe("んな");
      expect(result[0].candidates).toEqual(["nna", "nnna"]);
    });

    it("ん + な行（んに）→ 複合トークン kana='んに', candidates=['nni','nnni']", () => {
      const result = tokenizeKana("んに");
      expect(result).toHaveLength(1);
      expect(result[0].kana).toBe("んに");
      expect(result[0].candidates).toEqual(["nni", "nnni"]);
    });

    it("ん + な行（んの）→ 複合トークン kana='んの', candidates=['nno','nnno']", () => {
      const result = tokenizeKana("んの");
      expect(result).toHaveLength(1);
      expect(result[0].kana).toBe("んの");
      expect(result[0].candidates).toEqual(["nno", "nnno"]);
    });

    it("きんにくきんにく → んに が複合トークン化される", () => {
      const result = tokenizeKana("きんにくきんにく");
      const nniTokens = result.filter((t) => t.kana === "んに");
      expect(nniTokens).toHaveLength(2);
      nniTokens.forEach((t) => {
        expect(t.candidates).toContain("nni");
        expect(t.candidates).toContain("nnni");
      });
    });
  });

  describe("記号・ASCII 混在", () => {
    it("ASCII 文字（大文字）→ 小文字化して kana はそのまま保持", () => {
      const [token] = tokenizeKana("A");
      expect(token.kana).toBe("A");
      expect(token.candidates).toEqual(["a"]);
    });

    it("句読点（、）→ {kana:'、', candidates:[',']}", () => {
      const [token] = tokenizeKana("、");
      expect(token).toEqual({ kana: "、", candidates: [","] });
    });
  });

  describe("空文字", () => {
    it("空文字 → []", () => {
      expect(tokenizeKana("")).toEqual([]);
    });
  });
});

// ── isPartialMatch ────────────────────────────────────────────────────────

describe("isPartialMatch", () => {
  it("先頭が一致すれば true（ ne / ねこ）", () => {
    expect(isPartialMatch("ne", "ねこ")).toBe(true);
  });

  it("完全一致でも true（neko / ねこ）", () => {
    expect(isPartialMatch("neko", "ねこ")).toBe(true);
  });

  it("一致しない文字列は false（x / ねこ）", () => {
    expect(isPartialMatch("x", "ねこ")).toBe(false);
  });

  it("パターンより長い文字列は false", () => {
    expect(isPartialMatch("nekoo", "ねこ")).toBe(false);
  });

  it("空文字は任意パターンに一致（先頭が空文字）", () => {
    // すべての文字列は空文字で始まる
    expect(isPartialMatch("", "ねこ")).toBe(true);
  });

  it("複数パターンのどれかに一致すれば true（si / し）", () => {
    expect(isPartialMatch("si", "し")).toBe(true);
    expect(isPartialMatch("sh", "し")).toBe(true);
  });
});

// ── isExactMatch ──────────────────────────────────────────────────────────

describe("isExactMatch", () => {
  it("完全一致で true（neko / ねこ）", () => {
    expect(isExactMatch("neko", "ねこ")).toBe(true);
  });

  it("部分一致のみでは false（ne / ねこ）", () => {
    expect(isExactMatch("ne", "ねこ")).toBe(false);
  });

  it("別パターンでも完全一致なら true（shi / し）", () => {
    expect(isExactMatch("shi", "し")).toBe(true);
    expect(isExactMatch("si", "し")).toBe(true);
  });

  it("不一致は false", () => {
    expect(isExactMatch("neka", "ねこ")).toBe(false);
  });

  it("「ん」単独 → n でも nn でも true", () => {
    expect(isExactMatch("n", "ん")).toBe(true);
    expect(isExactMatch("nn", "ん")).toBe(true);
  });
});

// ── createMatcher / advance ───────────────────────────────────────────────

/** advance の戻り値から next を取り出すヘルパー（miss は例外） */
const nextOf = (r: ReturnType<typeof advance>): MatcherState => {
  if (r.status === "miss") throw new Error("unexpected miss");
  return r.next;
};

describe("createMatcher", () => {
  it("初期状態が正しく設定される（ねこ）", () => {
    const state = createMatcher("ねこ");
    expect(state.tokenIndex).toBe(0);
    expect(state.typed).toBe("");
    expect(state.liveCandidates).toEqual(["ne"]);
    expect(state.committedRomaji).toBe("");
    expect(state.tokens).toHaveLength(2);
  });
});

describe("advance", () => {
  describe("通常入力", () => {
    it("正解キー → status: ok、typed が進む", () => {
      const state = createMatcher("ねこ");
      const result = advance(state, "n");
      expect(result.status).toBe("ok");
      expect(nextOf(result).typed).toBe("n");
    });

    it("トークン完了 → 次のトークンへ遷移", () => {
      const state = createMatcher("ねこ");
      const after_ne = nextOf(advance(nextOf(advance(state, "n")), "e"));
      expect(after_ne.tokenIndex).toBe(1);
      expect(after_ne.typed).toBe("");
      expect(after_ne.liveCandidates).toEqual(["ko"]);
      expect(after_ne.committedRomaji).toBe("ne");
    });

    it("全トークン完了 → status: complete", () => {
      const state = createMatcher("ね");
      const result = advance(nextOf(advance(state, "n")), "e");
      expect(result.status).toBe("complete");
    });

    it("不正解キー → status: miss", () => {
      const state = createMatcher("ねこ");
      expect(advance(state, "x").status).toBe("miss");
    });
  });

  describe("複数パターン枝刈り", () => {
    it("し + s → si と shi どちらも生き残る", () => {
      const result = advance(createMatcher("し"), "s");
      expect(result.status).toBe("ok");
      expect(nextOf(result).liveCandidates).toContain("si");
      expect(nextOf(result).liveCandidates).toContain("shi");
    });

    it("し + s + h → shi のみ残る", () => {
      const s1 = nextOf(advance(createMatcher("し"), "s"));
      const result = advance(s1, "h");
      expect(result.status).toBe("ok");
      expect(nextOf(result).liveCandidates).toEqual(["shi"]);
    });

    it("し + s + i → complete（si パターンで完了）", () => {
      const s1 = nextOf(advance(createMatcher("し"), "s"));
      expect(advance(s1, "i").status).toBe("complete");
    });
  });

  describe("「っ」の処理", () => {
    it("っか → k で っ 完了・次トークン（か）へ", () => {
      const result = advance(createMatcher("っか"), "k");
      expect(result.status).toBe("ok");
      const next = nextOf(result);
      expect(next.tokenIndex).toBe(1);
      expect(next.committedRomaji).toBe("k");
    });

    it("っか → k + k + a で complete（kka）", () => {
      let state = createMatcher("っか");
      state = nextOf(advance(state, "k")); // っ complete
      state = nextOf(advance(state, "k")); // ka 途中
      expect(advance(state, "a").status).toBe("complete");
    });
  });

  describe("「ん」の処理", () => {
    it("んか → n 単打では確定しない（nn もまだ生き残り）", () => {
      const result = advance(createMatcher("んか"), "n");
      expect(result.status).toBe("ok");
      const next = nextOf(result);
      expect(next.tokenIndex).toBe(0); // まだ ん トークン
      expect(next.liveCandidates).toContain("n");
      expect(next.liveCandidates).toContain("nn");
    });

    it("んか → n + k で auto-commit（n で ん 確定・k は か へ）", () => {
      const s1 = nextOf(advance(createMatcher("んか"), "n"));
      const result = advance(s1, "k");
      expect(result.status).toBe("ok");
      const next = nextOf(result);
      expect(next.tokenIndex).toBe(1);
      expect(next.committedRomaji).toBe("n");
      expect(next.typed).toBe("k");
    });

    it("んか → n + n で nn 確定・次トークン か へ", () => {
      const s1 = nextOf(advance(createMatcher("んか"), "n"));
      const result = advance(s1, "n");
      expect(result.status).toBe("ok");
      const next = nextOf(result);
      expect(next.tokenIndex).toBe(1);
      expect(next.committedRomaji).toBe("nn");
    });

    it("んあ → n 単打は ok（まだ ん トークン）", () => {
      const result = advance(createMatcher("んあ"), "n");
      expect(result.status).toBe("ok");
      expect(nextOf(result).tokenIndex).toBe(0); // まだ ん トークン
    });

    it("んあ → n + a で auto-commit して complete（n 単打 → a で ん確定 + あ確定）", () => {
      const s1 = nextOf(advance(createMatcher("んあ"), "n"));
      const result = advance(s1, "a");
      expect(result.status).toBe("complete");
    });

    it("んあ → nn で ん 確定", () => {
      const s1 = nextOf(advance(createMatcher("んあ"), "n"));
      const result = advance(s1, "n");
      expect(result.status).toBe("ok");
      expect(nextOf(result).tokenIndex).toBe(1); // あ トークンへ
    });

    it("語末の ん → n 単打で complete（nn を待たない）", () => {
      expect(advance(createMatcher("ん"), "n").status).toBe("complete");
    });

    it("語末の ん → みかん の最後の n で complete", () => {
      let state = createMatcher("みかん");
      state = nextOf(advance(state, "m"));
      state = nextOf(advance(state, "i"));
      state = nextOf(advance(state, "k"));
      state = nextOf(advance(state, "a"));
      expect(advance(state, "n").status).toBe("complete");
    });

    it("んに → nni で complete（複合トークン・短縮入力）", () => {
      let state = createMatcher("んに");
      state = nextOf(advance(state, "n"));
      state = nextOf(advance(state, "n"));
      expect(advance(state, "i").status).toBe("complete");
    });

    it("んに → nnni で complete（複合トークン・長縮入力）", () => {
      let state = createMatcher("んに");
      state = nextOf(advance(state, "n"));
      state = nextOf(advance(state, "n"));
      state = nextOf(advance(state, "n"));
      expect(advance(state, "i").status).toBe("complete");
    });

    it("きんにく → k+i+n+n+i+k+u で complete", () => {
      let state = createMatcher("きんにく");
      for (const key of ["k", "i", "n", "n", "i", "k"]) {
        state = nextOf(advance(state, key));
      }
      expect(advance(state, "u").status).toBe("complete");
    });
  });
});
