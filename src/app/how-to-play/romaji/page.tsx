"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MinecraftBg } from "@/components/MinecraftBg";

/** かなセルの型（null は空マス） */
interface KanaCell {
  kana: string;
  /** 複数パターンは " / " 区切りで記述 */
  romaji: string;
}

type KanaRow = (KanaCell | null)[];

// ──────────────────────────────────────────────
// 清音（50音）
// ──────────────────────────────────────────────

/** 段ヘッダー（あ〜お） */
const DAN_HEADERS = ["あ", "い", "う", "え", "お"];

/** 行ラベル（あ行〜わ行） */
const SEION_ROWS: { label: string; cells: KanaRow }[] = [
  {
    label: "あ行",
    cells: [
      { kana: "あ", romaji: "a" },
      { kana: "い", romaji: "i" },
      { kana: "う", romaji: "u" },
      { kana: "え", romaji: "e" },
      { kana: "お", romaji: "o" },
    ],
  },
  {
    label: "か行",
    cells: [
      { kana: "か", romaji: "ka" },
      { kana: "き", romaji: "ki" },
      { kana: "く", romaji: "ku" },
      { kana: "け", romaji: "ke" },
      { kana: "こ", romaji: "ko" },
    ],
  },
  {
    label: "さ行",
    cells: [
      { kana: "さ", romaji: "sa" },
      { kana: "し", romaji: "si / shi" },
      { kana: "す", romaji: "su" },
      { kana: "せ", romaji: "se" },
      { kana: "そ", romaji: "so" },
    ],
  },
  {
    label: "た行",
    cells: [
      { kana: "た", romaji: "ta" },
      { kana: "ち", romaji: "ti / chi" },
      { kana: "つ", romaji: "tu / tsu" },
      { kana: "て", romaji: "te" },
      { kana: "と", romaji: "to" },
    ],
  },
  {
    label: "な行",
    cells: [
      { kana: "な", romaji: "na" },
      { kana: "に", romaji: "ni" },
      { kana: "ぬ", romaji: "nu" },
      { kana: "ね", romaji: "ne" },
      { kana: "の", romaji: "no" },
    ],
  },
  {
    label: "は行",
    cells: [
      { kana: "は", romaji: "ha" },
      { kana: "ひ", romaji: "hi" },
      { kana: "ふ", romaji: "fu / hu" },
      { kana: "へ", romaji: "he" },
      { kana: "ほ", romaji: "ho" },
    ],
  },
  {
    label: "ま行",
    cells: [
      { kana: "ま", romaji: "ma" },
      { kana: "み", romaji: "mi" },
      { kana: "む", romaji: "mu" },
      { kana: "め", romaji: "me" },
      { kana: "も", romaji: "mo" },
    ],
  },
  {
    label: "や行",
    cells: [
      { kana: "や", romaji: "ya" },
      null,
      { kana: "ゆ", romaji: "yu" },
      null,
      { kana: "よ", romaji: "yo" },
    ],
  },
  {
    label: "ら行",
    cells: [
      { kana: "ら", romaji: "ra" },
      { kana: "り", romaji: "ri" },
      { kana: "る", romaji: "ru" },
      { kana: "れ", romaji: "re" },
      { kana: "ろ", romaji: "ro" },
    ],
  },
  {
    label: "わ行",
    cells: [
      { kana: "わ", romaji: "wa" },
      null,
      null,
      null,
      { kana: "を", romaji: "wo" },
    ],
  },
];

// ──────────────────────────────────────────────
// 濁音・半濁音
// ──────────────────────────────────────────────

const DAKUON_ROWS: { label: string; cells: KanaRow }[] = [
  {
    label: "が行",
    cells: [
      { kana: "が", romaji: "ga" },
      { kana: "ぎ", romaji: "gi" },
      { kana: "ぐ", romaji: "gu" },
      { kana: "げ", romaji: "ge" },
      { kana: "ご", romaji: "go" },
    ],
  },
  {
    label: "ざ行",
    cells: [
      { kana: "ざ", romaji: "za" },
      { kana: "じ", romaji: "zi / ji" },
      { kana: "ず", romaji: "zu" },
      { kana: "ぜ", romaji: "ze" },
      { kana: "ぞ", romaji: "zo" },
    ],
  },
  {
    label: "だ行",
    cells: [
      { kana: "だ", romaji: "da" },
      { kana: "ぢ", romaji: "di" },
      { kana: "づ", romaji: "du" },
      { kana: "で", romaji: "de" },
      { kana: "ど", romaji: "do" },
    ],
  },
  {
    label: "ば行",
    cells: [
      { kana: "ば", romaji: "ba" },
      { kana: "び", romaji: "bi" },
      { kana: "ぶ", romaji: "bu" },
      { kana: "べ", romaji: "be" },
      { kana: "ぼ", romaji: "bo" },
    ],
  },
  {
    label: "ぱ行",
    cells: [
      { kana: "ぱ", romaji: "pa" },
      { kana: "ぴ", romaji: "pi" },
      { kana: "ぷ", romaji: "pu" },
      { kana: "ぺ", romaji: "pe" },
      { kana: "ぽ", romaji: "po" },
    ],
  },
];

// ──────────────────────────────────────────────
// 拗音
// ──────────────────────────────────────────────

interface YouonRow {
  base: string;
  ya: string;
  yu: string;
  yo: string;
}

const YOUON_ROWS: YouonRow[] = [
  { base: "き", ya: "kya", yu: "kyu", yo: "kyo" },
  { base: "し", ya: "sya / sha", yu: "syu / shu", yo: "syo / sho" },
  { base: "ち", ya: "tya / cha", yu: "tyu / chu", yo: "tyo / cho" },
  { base: "に", ya: "nya", yu: "nyu", yo: "nyo" },
  { base: "ひ", ya: "hya", yu: "hyu", yo: "hyo" },
  { base: "み", ya: "mya", yu: "myu", yo: "myo" },
  { base: "り", ya: "rya", yu: "ryu", yo: "ryo" },
  { base: "ぎ", ya: "gya", yu: "gyu", yo: "gyo" },
  {
    base: "じ",
    ya: "zya / ja / jya",
    yu: "zyu / ju / jyu",
    yo: "zyo / jo / jyo",
  },
  { base: "び", ya: "bya", yu: "byu", yo: "byo" },
  { base: "ぴ", ya: "pya", yu: "pyu", yo: "pyo" },
];

// ──────────────────────────────────────────────
// 特殊・記号
// ──────────────────────────────────────────────

interface SpecialRow {
  kana: string;
  romaji: string;
  note?: string;
}

const SPECIAL_ROWS: SpecialRow[] = [
  { kana: "ん", romaji: "n / nn", note: "次が母音・な行のときは nn" },
  { kana: "っ", romaji: "次の子音を重ねる", note: "例：きって → kitte" },
  { kana: "ー", romaji: "-", note: "長音符（ハイフンキー）" },
  { kana: "、", romaji: "," },
  { kana: "。", romaji: "." },
  { kana: "「", romaji: "[" },
  { kana: "」", romaji: "]" },
  { kana: "・", romaji: "/", note: "中点" },
];

// ──────────────────────────────────────────────
// 共通コンポーネント
// ──────────────────────────────────────────────

/**
 * かなセルを表示するコンポーネント。
 * 複数ローマ字パターンは黄色で強調、"/" は区切りとして薄く表示。
 */
const KanaCellView = ({ cell }: { cell: KanaCell }) => {
  const parts = cell.romaji.split(" / ");
  const isMulti = parts.length > 1;

  return (
    <div className="flex flex-col items-center py-2 px-1 min-w-0">
      <span
        className="text-xl font-bold text-white leading-none mb-1"
        style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
      >
        {cell.kana}
      </span>
      <span className="font-mono text-center leading-tight text-sm break-all">
        {parts.map((p, i) => (
          <span key={p}>
            {i > 0 && <span className="text-white/60"> / </span>}
            <span className={isMulti ? "text-yellow-300" : "text-green-400"}>
              {p}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
};

/** かな一覧グリッド（清音・濁音用） */
const KanaGrid = ({
  rows,
  showDanHeader = false,
}: {
  rows: { label: string; cells: KanaRow }[];
  showDanHeader?: boolean;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs border-collapse">
      {showDanHeader && (
        <thead>
          <tr>
            <th className="text-white/60 text-xs font-normal pb-1 pr-1 text-right w-10" />
            {DAN_HEADERS.map((d) => (
              <th
                key={d}
                className="text-white/60 text-xs font-normal pb-1 text-center"
                style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-t border-white/5">
            <td
              className="text-white/60 text-xs pr-2 text-right align-middle w-10 whitespace-nowrap"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              {row.label}
            </td>
            {row.cells.map((cell, i) => (
              <td key={i} className="text-center align-middle">
                {cell ? <KanaCellView cell={cell} /> : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** セクションカード */
const SectionCard = ({
  title,
  delay,
  children,
}: {
  title: string;
  delay: number;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-black/60 rounded-2xl border border-white/20 px-6 py-5"
  >
    <h2
      className="text-white font-black text-xl mb-4"
      style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
    >
      {title}
    </h2>
    {children}
  </motion.div>
);

// ──────────────────────────────────────────────
// ページ本体
// ──────────────────────────────────────────────

export default function RomajiTablePage() {
  const router = useRouter();

  return (
    <MinecraftBg>
      <div className="min-h-screen flex flex-col items-center px-4 py-12 gap-6">
        {/* タイトル */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="text-4xl mb-3">📝</div>
          <h1
            className="text-2xl font-black"
            style={{
              color: "var(--color-brand-gold)",
              textShadow: "2px 2px 0 #000",
              fontFamily: "var(--font-zen-maru-gothic)",
            }}
          >
            ローマ字対応一覧
          </h1>
          <p className="text-black text-sm mt-1">
            黄色は複数パターンあり（どれを入力しても正解）
          </p>
        </motion.div>

        <div className="w-full max-w-lg flex flex-col gap-5">
          {/* 清音 */}
          <SectionCard title="清音（50音）" delay={0.1}>
            <KanaGrid rows={SEION_ROWS} showDanHeader />
          </SectionCard>

          {/* 濁音・半濁音 */}
          <SectionCard title="濁音・半濁音" delay={0.2}>
            <KanaGrid rows={DAKUON_ROWS} />
          </SectionCard>

          {/* 拗音 */}
          <SectionCard title="拗音" delay={0.3}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="text-white/60 font-normal pb-1 pr-2 text-right w-10" />
                    {["〜ゃ", "〜ゅ", "〜ょ"].map((h) => (
                      <th
                        key={h}
                        className="text-white/60 font-normal pb-1 text-center"
                        style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {YOUON_ROWS.map((row) => (
                    <tr key={row.base} className="border-t border-white/5">
                      <td
                        className="text-white/60 text-xs pr-2 text-right align-middle w-10"
                        style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
                      >
                        {row.base}〜
                      </td>
                      {[row.ya, row.yu, row.yo].map((r) => {
                        const parts = r.split(" / ");
                        const isMulti = parts.length > 1;
                        return (
                          <td
                            key={r}
                            className="text-center align-middle py-2 px-1"
                          >
                            <span className="font-mono text-sm leading-tight break-all">
                              {parts.map((p, i) => (
                                <span key={p}>
                                  {i > 0 && (
                                    <span className="text-white/60"> / </span>
                                  )}
                                  <span
                                    className={
                                      isMulti
                                        ? "text-yellow-300"
                                        : "text-green-400"
                                    }
                                  >
                                    {p}
                                  </span>
                                </span>
                              ))}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* 特殊・記号 */}
          <SectionCard title="特殊・記号" delay={0.4}>
            <table className="w-full text-base border-collapse">
              <tbody>
                {SPECIAL_ROWS.map((row) => (
                  <tr key={row.kana} className="border-t border-white/5">
                    <td
                      className="py-2.5 pr-3 font-bold text-white text-xl w-8 text-center align-middle"
                      style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
                    >
                      {row.kana}
                    </td>
                    <td className="py-2.5 pr-3 align-middle">
                      <span className="font-mono text-yellow-300 text-sm">
                        {row.romaji}
                      </span>
                    </td>
                    <td className="py-2.5 text-white/60 text-sm align-middle">
                      {row.note ?? ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>

        {/* 遊び方へ戻るボタン */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => router.push("/how-to-play")}
          className="px-6 py-2.5 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 active:scale-95 transition-all border border-white/20"
        >
          ← 遊び方へ戻る
        </motion.button>
      </div>
    </MinecraftBg>
  );
}
