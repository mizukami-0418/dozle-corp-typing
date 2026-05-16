# ドズル社タイピング — 設計ドキュメント

> Claude Code での実装フェーズに向けた設計・仕様まとめ

---

## 1. プロジェクト概要

| 項目           | 内容                                                                        |
| -------------- | --------------------------------------------------------------------------- |
| プロジェクト名 | ドズル社タイピング                                                          |
| ジャンル       | タイピングゲーム（Webアプリ）                                               |
| ターゲット     | 一般向け（ドズル社ファン・日英混在）                                        |
| コンセプト     | ドズル社 × Minecraft をテーマにした、ゲーム性・楽しさ重視のタイピングゲーム |

---

## 2. 技術スタック

| カテゴリ       | 技術                     |
| -------------- | ------------------------ |
| フレームワーク | Next.js（App Router）    |
| 言語           | TypeScript               |
| スタイリング   | Tailwind CSS + shadcn/ui |
| アニメーション | Framer Motion            |
| 状態管理       | Zustand                  |
| データ保存     | ローカルストレージ       |
| デプロイ       | Vercel                   |

---

## 3. 機能仕様

### 3-1. ゲームモード

- **ステージクリア型**：ステージ内の全ワードを打ち切ったらクリア

### 3-2. 日本語入力方式

- **ひらがな表示 → ローマ字入力**
- 画面上部にひらがな（例：`ねこ`）を表示し、ローマ字（`neko`）で入力
- IME（変換）は使用しない
- 「ん」は `n` / `nn` どちらも正解とする

### 3-3. ステージ構成

難易度別に4段階。ステージロックなし・全難易度最初から選択可能。

| 難易度 | StageId    | カラー | ワード傾向                                       |
| ------ | ---------- | ------ | ------------------------------------------------ |
| CHEAT  | `cheat`    | 黄色   | ひらがな・日常単語・ドズル社関連の簡単な単語（44ワード）|
| NORMAL | `normal`   | 水色   | Minecraft用語・メンバー関連（29ワード）             |
| HARD   | `hard`     | 赤     | ドズル社の有名なセリフ・長文（10ワード）             |
| 鬼畜   | `kichiku`  | 紫     | 超難問（ワード追加予定）                            |

### 3-4. タイピングコンテンツ（ワード）テーマ

- Minecraft用語（例：クリーパー、エンダードラゴン、ダイヤモンド）
- ドズル社メンバー関連（名前・キャッチフレーズ・おともだち）
- 日常単語（CHEAT向け）
- ドズル社関連の簡単な単語（CHEAT向け）
- ドズル社の有名なセリフ・長文（HARD向け）

### 3-5. アニメーション演出

- タイピング正解時：`ParticleEffect`（12粒パーティクル、キャラカラー混合）
- ステージクリア時：`CelebrationEffect`（40粒コンフェッティ）＋クリアオーバーレイ（テキスト揺れ・スター順次ポップイン）
- キャラクターは常時アイドルアニメーション（y軸上下 Framer Motion）
- 画面遷移：`PageTransition`（opacity + y フェードイン、layout.tsx でラップ）

### 3-6. スコア・進捗保存

- **ローカルストレージ**を使用（サーバー不要）
- 保存内容：ベストスコア・クリア済みステージ・獲得スター数

---

## 4. キャラクター仕様

ゲーム開始前にプレイヤーがキャラクターを選択する。選択したキャラがゲーム中・リザルト画面に登場し、応援メッセージを表示する。

| メンバー     | CharacterKey | イメージカラー   | キャッチフレーズ     | おともだち     |
| ------------ | ------------ | ---------------- | -------------------- | -------------- |
| ドズル       | `Dozle`      | 赤 `#E53935`     | ロジカルゴリラ社長   | ビッグボス     |
| ぼんじゅうる | `Bonjour`    | 紫 `#7B1FA2`     | （心やさしい）卑怯者 | グラサンバード |
| おんりー     | `Qnly`       | 黄色 `#FDD835`   | スピードスター       | いなりー       |
| おらふくん   | `OrafKun`    | 水色 `#0097A7`   | あなたの心を狙い撃ち | 雪だるまくん   |
| おおはらMEN  | `ooharaMEN`  | ピンク `#E91E8C` | ズボラな匠           | MENフクロウ    |

---

## 5. 画面構成

### 5-1. 画面一覧

```
/               → トップメニュー画面
/stages         → ステージ選択画面
/game/[stage]   → ゲーム画面
/result         → リザルト画面
/how-to-play    → 遊び方（実装予定）
/settings       → 設定（実装予定）
/about          → ドズル社とは？（実装予定）
```

### 5-2. トップメニュー画面

- ドズル社ロゴ + 「OFFICIAL FAN GAME」サブロゴ
- Minecraft スタイルの4ボタンメニュー
  - ⚔️ ゲームスタート → `/stages`
  - 📖 遊び方 → `/how-to-play`
  - ⚙️ 設定 → `/settings`
  - 🦍 ドズル社とは？ → `/about`
- 背景：Minecraftスタイル（空・草・土）

### 5-3. ステージ選択画面

- ドズル社ロゴ + 「OFFICIAL FAN GAME」サブロゴ
- キャラクター選択（5人・メンバーカラーで表示）
- ステージカード一覧（2×2グリッド・難易度ごとに色分け・ロックなし）
- ベストスコア表示
- 背景：Minecraftスタイル（空・草・土）

### 5-5. ゲーム画面

- HUD：スコア / ステージ進捗バー / ミス数
- 選択キャラ表示（アイドルアニメーション + 応援セリフ）
- タイピングエリア：ひらがな表示 / 英語ヒント / ローマ字入力欄（打ち済み・現在・未入力を色分け）
- 次のワードプレビュー / 正確率表示
- 背景：Minecraftスタイル

### 5-6. リザルト画面

- STAGE CLEAR バッジ
- キャラのお祝いアニメーション + メンバーからのメッセージ
- 獲得スター（3段階）
- スコア / 正確率 / タイム
- NEW BEST SCORE 表示（更新時のみ）
- ボタン：「ステージへ戻る」「もう一度！」
- 背景：Minecraftスタイル

---

## 6. 推奨ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx               # トップメニュー画面
│   ├── stages/
│   │   └── page.tsx           # ステージ選択画面
│   ├── game/
│   │   └── [stage]/
│   │       └── page.tsx       # ゲーム画面
│   ├── result/
│   │   └── page.tsx           # リザルト画面
│   ├── how-to-play/
│   │   └── page.tsx           # 遊び方（実装予定）
│   ├── settings/
│   │   └── page.tsx           # 設定（実装予定）
│   └── about/
│       └── page.tsx           # ドズル社とは？（実装予定）
├── components/
│   ├── TypingArea/            # タイピング入力エリア
│   ├── Character/             # キャラクターコンポーネント（アニメーション含む）
│   ├── StageCard/             # ステージ選択カード
│   ├── HUD/                   # スコア・進捗表示
│   ├── MinecraftBg/           # Minecraftスタイル背景
│   ├── PageTransition.tsx     # ページ遷移アニメーションラッパー
│   └── effects/               # エフェクトコンポーネント群
│       ├── ParticleEffect.tsx # ワード正解時パーティクル
│       └── CelebrationEffect.tsx # クリア時コンフェッティ
├── lib/
│   ├── words.ts               # ステージ別ワードデータ
│   ├── romanizer.ts           # ひらがな → ローマ字変換ロジック
│   ├── storage.ts             # ローカルストレージ操作
│   ├── characters.ts          # キャラクター設定データ
│   └── sound.ts               # Web Audio API サウンド
├── hooks/
│   └── useTypingGame.ts       # ゲームロジック（カスタムフック）
├── store/
│   └── game-store.ts          # Zustand ストア定義
├── types/
│   └── index.ts               # 共通型定義
└── __tests__/
    ├── romanizer.test.ts      # romanizer ユニットテスト（32件）
    └── useTypingGame.test.ts  # フックテスト（13件）
```

---

## 7. 状態管理（Zustand）

`gameStore.ts` で管理する主な状態：

```ts
type GameStore = {
  // キャラ選択
  selectedCharacter: CharacterKey;
  setCharacter: (key: CharacterKey) => void;

  // ゲーム中
  currentStage: string;
  score: number;
  missCount: number;
  currentWordIndex: number;

  // ローカルストレージと同期
  bestScores: Record<string, number>;
  clearedStages: string[];
  starRecords: Record<string, number>;
};
```

---

## 8. ローマ字変換ロジック（romanizer.ts）

### 対応方針

- 清音・濁音・半濁音・拗音をすべてカバー
- 複数パターン許容（例：「し」→ `si` / `shi` どちらも正解）
- 「ん」→ `n` / `nn` どちらも正解
- 「っ」→ 次の子音を重ねる（例：「った」→ `tta`）

---

## 9. デザインガイドライン

### カラーパレット

| 用途                                 | カラー    |
| ------------------------------------ | --------- |
| ブランドゴールド（ロゴ・アクセント） | `#FFD700` |
| 背景：空                             | `#87CEEB` |
| 背景：草                             | `#5a8a3c` |
| 背景：土                             | `#7a5c38` |
| CHEAT                                | `#FDD835` |
| NORMAL                               | `#0097A7` |
| HARD                                 | `#E53935` |
| 鬼畜（KICHIKU）                      | `#7B1FA2` |

### フォント

- 日本語：`Zen Maru Gothic`（Google Fonts）
- ローマ字入力エリア：`monospace`

### アニメーション方針（Framer Motion）

- キャラ：`y` 軸上下でアイドル / クリア時 `scale` + `rotate`
- 正解時：パーティクルや光のエフェクト
- 画面遷移：`opacity` + `y` のフェードイン

---

## 10. デプロイ

- **Vercel** にデプロイ
- GitHub リポジトリと連携し、`git push` で自動デプロイ
- 無料プランで運用可能（サーバーサイド処理なし）

---

## 11. コーディング規約（TypeScript）

### 命名規則

| 対象                         | 規則                         | 例                              |
| ---------------------------- | ---------------------------- | ------------------------------- |
| 変数・関数                   | camelCase                    | `currentScore`, `calcWpm()`     |
| 型・インターフェース         | PascalCase                   | `GameState`, `StageConfig`      |
| 定数（不変）                 | UPPER_SNAKE_CASE             | `MAX_MISS_COUNT`                |
| コンポーネント               | PascalCase                   | `TypingArea`, `StageCard`       |
| カスタムフック               | `use` + PascalCase           | `useTypingGame`                 |
| Zustand ストア               | `use` + PascalCase + `Store` | `useGameStore`                  |
| ファイル名（コンポーネント） | PascalCase                   | `StageCard.tsx`                 |
| ファイル名（それ以外）       | kebab-case                   | `romanizer.ts`, `game-store.ts` |
| 型エクスポート               | `~Key` / `~Type` / `~Config` | `CharacterKey`, `StageConfig`   |

---

### ① `any` を禁止、`unknown` を使う

型安全性を守るため `any` は原則禁止。型が不明な場合は `unknown` を使い、型ガードで絞り込む。

```ts
// ❌
const data: any = fetchData();

// ✅
const data: unknown = fetchData();
```

### ② `type` と `interface` の使い分けを統一する

- オブジェクト型 → `interface`（拡張しやすいため）
- ユニオン型・関数型 → `type`

```ts
// オブジェクト型は interface
interface Stage {
  id: string;
  name: string;
  difficulty: Difficulty;
}

// ユニオン型・関数型は type
type Difficulty = "cheat" | "normal" | "hard" | "kichiku";
type RomajiConverter = (kana: string) => string;
```

### ④ Props は `interface` で明示定義する

コンポーネントの Props はインラインで書かず、必ず `interface` として定義する。

```ts
// ❌
const StageCard = ({ stage }: { stage: Stage }) => { ... };

// ✅
interface StageCardProps {
  stage: Stage;
  bestScore?: number;
  onSelect: (id: string) => void;
}

export const StageCard = ({ stage, bestScore, onSelect }: StageCardProps) => { ... };
```

### ⑤ `export default` より named export を使う

named export は IDE でのリネームやインポート追跡がしやすい。

```ts
// ❌
export default function StageCard() { ... }

// ✅
export const StageCard = () => { ... };
```

### ⑥ `null` を使わず `undefined` に統一する

JavaScriptでは `typeof null` が `"object"` を返すという言語仕様上のバグが存在する。`null` と `undefined` が混在するとチェックが複雑になるため、`undefined` に統一する。

```ts
// ❌ null と undefined が混在
const selectedStage: Stage | null = null;

// ✅ undefined に統一
const selectedStage: Stage | undefined = undefined;

// オプショナルチェーンも undefined を返すので相性がいい
const name = user?.profile?.name ?? "未設定";
```

> **例外**：`document.getElementById()` など DOM API が返す `null` はそのまま扱ってよい。

---

### コメント規約

ユーザー設定に従い、すべてのファイルに **Google スタイルの docstring** とインラインコメントを記載する。

```ts
/**
 * ひらがな文字列をローマ字に変換する。
 *
 * @param kana - 変換対象のひらがな文字列
 * @returns ローマ字文字列の候補リスト（複数パターン対応）
 * @example
 * toRomaji('ねこ') // => ['neko']
 * toRomaji('ん')   // => ['n', 'nn']
 */
export const toRomaji = (kana: string): string[] => { ... };
```

---

## 12. 実装済み機能まとめ

| フェーズ | 内容                                                   | 状態 |
| -------- | ------------------------------------------------------ | ---- |
| Phase 1  | 型定義・ワードデータ・romanizer・storage・Zustand      | 完了 |
| Phase 2  | `useTypingGame` フック                                 | 完了 |
| Phase 3  | 共通コンポーネント（Character / StageCard / TypingArea / HUD / MinecraftBg） | 完了 |
| Phase 4  | 3画面実装（ステージ選択 / ゲーム / リザルト）          | 完了 |
| Phase 5  | アニメーション・エフェクト（ParticleEffect / CelebrationEffect / PageTransition） | 完了 |
| Phase 6  | テスト・品質（romanizer 32件 / useTypingGame 13件）    | 完了 |
| Phase 7  | トップメニュー画面・難易度構成変更・追加画面スタブ     | 完了 |

## 13. 今後の実装予定

- **鬼畜ステージ**：ワード内容の追加（現在空配列）
- **遊び方ページ** (`/how-to-play`)：コンテンツ実装
- **設定ページ** (`/settings`)：コンテンツ実装
- **ドズル社とは？ページ** (`/about`)：コンテンツ実装
- **キャラクター画像**：仮絵文字から実画像へ差し替え

## 14. 今後の拡張候補（現時点では対象外）

- オンラインランキング（DB連携が必要）
- タイムアタックモード
- モバイル対応キーボード最適化
