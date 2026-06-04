/**
 * romanizer.ts のユニットテスト。
 * toRomaji / isPartialMatch / isExactMatch の各ケースを網羅的に検証する。
 */

import { describe, it, expect } from "vitest";
import { toRomaji, isPartialMatch, isExactMatch } from "@/lib/romanizer";

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

    it("ん + 母音（あ）→ nn を強制（nna のみ）", () => {
      const result = toRomaji("んあ");
      // 母音の前は nn のみ
      expect(result).toContain("nna");
      expect(result).not.toContain("na");
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

    it("ふぁ → fa / fula / fuxa どれも含む", () => {
      const result = toRomaji("ふぁ");
      expect(result).toContain("fa");
      expect(result).toContain("fula");
      expect(result).toContain("fuxa");
    });

    it("ふぃ → fi / fuli / fuxi どれも含む", () => {
      const result = toRomaji("ふぃ");
      expect(result).toContain("fi");
      expect(result).toContain("fuli");
      expect(result).toContain("fuxi");
    });

    it("ふぇ → fe / fule / fuxe どれも含む", () => {
      const result = toRomaji("ふぇ");
      expect(result).toContain("fe");
      expect(result).toContain("fule");
      expect(result).toContain("fuxe");
    });

    it("ふぉ → fo / fulo / fuxo どれも含む", () => {
      const result = toRomaji("ふぉ");
      expect(result).toContain("fo");
      expect(result).toContain("fulo");
      expect(result).toContain("fuxo");
    });

    it("ふゅ → fyu / fulyu / fuxyu どれも含む", () => {
      const result = toRomaji("ふゅ");
      expect(result).toContain("fyu");
      expect(result).toContain("fulyu");
      expect(result).toContain("fuxyu");
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
