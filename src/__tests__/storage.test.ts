/**
 * storage.ts のユニットテスト。
 * バトルモード クリアタイム記録関連の関数を検証する。
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  loadBattleTimeRecords,
  saveBattleTimeRecord,
  getBestBattleTime,
} from "@/lib/storage";

// ── セットアップ ────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

// ── テスト ──────────────────────────────────────────────────────────────────

describe("loadBattleTimeRecords", () => {
  it("記録がない場合は空オブジェクトを返す", () => {
    expect(loadBattleTimeRecords()).toEqual({});
  });

  it("保存済みデータを正しく読み込む", () => {
    localStorage.setItem(
      "battleTimeRecords",
      JSON.stringify({ zombie: [{ timeMs: 5000, date: "2024-01-01T00:00:00.000Z" }] })
    );
    const records = loadBattleTimeRecords();
    expect(records.zombie).toHaveLength(1);
    expect(records.zombie[0].timeMs).toBe(5000);
  });

  it("localStorage が壊れていてもクラッシュせず空オブジェクトを返す", () => {
    localStorage.setItem("battleTimeRecords", "invalid json{{{");
    expect(loadBattleTimeRecords()).toEqual({});
  });
});

describe("saveBattleTimeRecord", () => {
  it("記録を保存して読み込める", () => {
    saveBattleTimeRecord("zombie", 12345);
    const records = loadBattleTimeRecords();
    expect(records.zombie).toHaveLength(1);
    expect(records.zombie[0].timeMs).toBe(12345);
  });

  it("date フィールドが ISO 8601 形式で保存される", () => {
    saveBattleTimeRecord("zombie", 1000);
    const entry = loadBattleTimeRecords().zombie[0];
    expect(() => new Date(entry.date)).not.toThrow();
    expect(new Date(entry.date).toISOString()).toBe(entry.date);
  });

  it("複数回保存するとタイム昇順にソートされる", () => {
    saveBattleTimeRecord("zombie", 9000);
    saveBattleTimeRecord("zombie", 3000);
    saveBattleTimeRecord("zombie", 6000);
    const times = loadBattleTimeRecords().zombie.map((r) => r.timeMs);
    expect(times).toEqual([3000, 6000, 9000]);
  });

  it("6件目以降は切り捨てられ最大5件を保持する", () => {
    for (let i = 1; i <= 6; i++) {
      saveBattleTimeRecord("zombie", i * 1000);
    }
    expect(loadBattleTimeRecords().zombie).toHaveLength(5);
  });

  it("6件超でもタイムが遅い方から切り捨てられる（上位5件を保持）", () => {
    // 遅い順に追加しても上位5件が残る
    for (let i = 10; i >= 1; i--) {
      saveBattleTimeRecord("zombie", i * 1000);
    }
    const times = loadBattleTimeRecords().zombie.map((r) => r.timeMs);
    expect(times).toEqual([1000, 2000, 3000, 4000, 5000]);
  });

  it("ステージが異なる記録は独立して保存される", () => {
    saveBattleTimeRecord("zombie", 5000);
    saveBattleTimeRecord("drowned", 8000);
    const records = loadBattleTimeRecords();
    expect(records.zombie).toHaveLength(1);
    expect(records.drowned).toHaveLength(1);
    expect(records.zombie[0].timeMs).toBe(5000);
    expect(records.drowned[0].timeMs).toBe(8000);
  });
});

describe("getBestBattleTime", () => {
  it("記録がない場合は undefined を返す", () => {
    expect(getBestBattleTime("zombie")).toBeUndefined();
  });

  it("ステージに対応する記録がない場合は undefined を返す", () => {
    saveBattleTimeRecord("drowned", 5000);
    expect(getBestBattleTime("zombie")).toBeUndefined();
  });

  it("1件のみの場合はその timeMs を返す", () => {
    saveBattleTimeRecord("zombie", 7000);
    expect(getBestBattleTime("zombie")).toBe(7000);
  });

  it("複数件ある場合は最小タイム（1位）を返す", () => {
    saveBattleTimeRecord("zombie", 9000);
    saveBattleTimeRecord("zombie", 3000);
    saveBattleTimeRecord("zombie", 6000);
    expect(getBestBattleTime("zombie")).toBe(3000);
  });
});
