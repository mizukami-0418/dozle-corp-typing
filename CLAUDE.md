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

- **時間制スコアアタック型**：難易度ごとの制限時間内にできるだけ多くのワードを打つ
- ワードごとに制限時間あり（超過すると自動的に次のワードへ）
- 制限時間が来るまでワードをループして出題し続ける
- 回答中に制限時間を超えたワードはスコアに含まない（減点のみ）

### 3-2. 日本語入力方式

- **ひらがな表示 → ローマ字入力**
- 画面上部にひらがな（例：`ねこ`）を表示し、ローマ字（`neko`）で入力
- IME（変換）は使用しない
- 「ん」は `n` / `nn` どちらも正解とする

### 3-3. ステージ構成

難易度別に4段階 + ドズル社専用モード1種。ステージロックなし・全難易度最初から選択可能。

| 難易度         | StageId   | カラー     | 制限時間 | ひらがな文字数 | 速度（秒/ローマ字1文字） | ワード数 |
| -------------- | --------- | ---------- | -------- | -------------- | ------------------------ | -------- |
| CHEAT          | `cheat`   | 黄色       | 60 秒    | 2〜4 文字      | 1.0 秒                   | 61       |
| NORMAL         | `normal`  | 水色       | 90 秒    | 5〜8 文字      | 0.65 秒                  | 105      |
| HARD           | `hard`    | 赤         | 120 秒   | 9〜12 文字     | 0.4 秒                   | 49       |
| 鬼畜           | `kichiku` | 紫         | 150 秒   | 13 文字以上    | 0.25 秒                  | 40       |
| ドズル社モード | `dozle`   | ピンク     | 180 秒   | 制限なし       | なし（タイムアウトなし）  | 197      |

**ワード制限時間の計算式：** `ローマ字文字数 × 速度係数（秒）`
- 例：チートで「inu」（ローマ字3文字）→ 3 × 1.0 = 3 秒
- カッコ・ASCII文字を含む場合はそれも入力対象・文字数に含む
- `secPerRomaji: 0` はワード制限時間なしのセンチネル値（`useTypingGame` でタイムアウト処理をスキップ）

**難易度分類基準：** `reading` フィールドのひらがな文字数で決定
- 長音符（ー）・小文字（ゃ・っ等）もそれぞれ1文字としてカウント
- ASCII文字（MEN等）はカウント対象外
- ドズル社モードは文字数による分類なし（全ドズル社関連ワードを横断出題）

### 3-4. タイピングコンテンツ（ワード）テーマ

| 難易度         | 内容 |
| -------------- | ---- |
| CHEAT          | 草原・動物・村人アイテム・短いMinecraft用語（ネザー・ゾンビ等）・短いドズル社関連 |
| NORMAL         | Minecraft用語（クリーパー・エンダードラゴン等）・ドズル社メンバー名・関連ワード・名言 |
| HARD           | ドズル社関連の長めのフレーズ・名言・Minecraftネタ（9〜12ひらがな文字） |
| 鬼畜           | ドズル社の有名なセリフ・長文・記号付き全文入力（13文字以上） |
| ドズル社モード | 各難易度の「ドズル社関連」セクションのワードを全難易度横断で出題（`DOZLE_WORDS` 197ワード） |

### 3-5. アニメーション演出

- タイピング正解時：`ParticleEffect`（12粒パーティクル、キャラカラー混合）
- タイムアップ時：`CelebrationEffect`（40粒コンフェッティ）＋ TIME UP オーバーレイ（テキスト揺れ・スター順次ポップイン）
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
/how-to-play         → 遊び方
/how-to-play/romaji  → ローマ字対応一覧表
/settings            → 設定
/about               → ドズル社とは？
/about/history       → ドズル社の歴史と変遷（詳細タイムライン）
```

### 5-2. トップメニュー画面

- ドズル社ロゴ + 「UNOFFICIAL FAN GAME」サブロゴ
- Minecraft スタイルの4ボタンメニュー
  - ⚔️ ゲームスタート → `/stages`
  - 📖 遊び方 → `/how-to-play`
  - ⚙️ 設定 → `/settings`
  - 🦍 ドズル社とは？ → `/about`
- バージョン表示（v1.0.0）の下に開発者メッセージカード
  - `✉ 開発者からのメッセージ(ドズル社応援隊)` ラベル + 本文
- 背景：Minecraftスタイル（空・草・土）

### 5-3. ステージ選択画面

- ドズル社ロゴ + 「UNOFFICIAL FAN GAME」サブロゴ
- キャラクター選択（5人・メンバーカラーで表示）
- ステージカード一覧（2×2グリッド・難易度ごとに色分け・ロックなし）
- ベストスコア表示
- 背景：Minecraftスタイル（空・草・土）

### 5-5. ゲーム画面

- HUD：スコア / 総残り時間カウントダウン / ワード別タイマーバー / 正確率 / ミス数
- 選択キャラ表示（アイドルアニメーション）
- タイピングエリア：ステージ名バッジ（難易度カラーの丸ピル型）/ ひらがな表示 / ローマ字入力欄（打ち済み・現在・未入力を色分け）
- TypingArea 右下に「✕ ゲームをやめる」ボタン（確認ダイアログあり・ESC キー対応）
- 次のワードプレビュー / 正確率表示
- タイムアップ時オーバーレイ（TIME UP! テキスト・ワード完了数・スター表示）
- 背景：Minecraftスタイル

### 5-6. リザルト画面

- TIME UP! バッジ
- キャラのお祝いアニメーション
- 獲得スター（3段階）
- スコア / 正確率 / WORDS（完了ワード数）/ MISS / TIME
- NEW BEST! 表示（更新時のみ）
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
│   │   ├── page.tsx           # 遊び方
│   │   └── romaji/
│   │       └── page.tsx       # ローマ字対応一覧表
│   ├── settings/
│   │   └── page.tsx           # 設定（BGM/SFX トグル・データリセット）
│   └── about/
│       ├── page.tsx           # ドズル社とは？（概要・あゆみ・メンバー・公式リンク）
│       └── history/
│           └── page.tsx       # ドズル社の歴史と変遷（詳細タイムライン）
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
│   ├── difficulty.ts          # 難易度別定数（制限時間・速度係数・TIMEOUT_PENALTY）
│   ├── storage.ts             # ローカルストレージ操作
│   ├── characters.ts          # キャラクター設定データ
│   ├── sound.ts               # Web Audio API タイピング効果音
│   └── bgm.ts                 # Web Audio API BGM（難易度別メロディ・ループ再生）
├── hooks/
│   ├── useTypingGame.ts       # ゲームロジック（カスタムフック）
│   └── useBgm.ts              # BGM 再生フック（difficulty + active フラグ）
├── store/
│   └── game-store.ts          # Zustand ストア定義
├── types/
│   └── index.ts               # 共通型定義
└── __tests__/
    ├── romanizer.test.ts      # romanizer ユニットテスト（32件）
    └── useTypingGame.test.ts  # フックテスト（14件）
```

---

## 7. 状態管理（Zustand）

`game-store.ts` で管理する主な状態：

```ts
interface GameStore {
  // キャラ選択
  selectedCharacter: CharacterKey;
  setCharacter: (key: CharacterKey) => void;

  // ゲーム中の状態（GameState 型）
  gameState: GameState;
  setGameState: (state: Partial<GameState>) => void;
  resetGameState: (stageId: StageId) => void;

  // リザルトデータ（タイムアップ時にセット → リザルト画面で参照）
  resultData: ResultData | undefined;
  setResultData: (data: ResultData) => void;

  // サウンド設定（BGM と SFX を独立して管理）
  sfxEnabled: boolean;    // タイピング効果音（旧 soundEnabled キーを継続使用）
  toggleSfx: () => void;
  bgmEnabled: boolean;    // ゲーム中 BGM
  toggleBgm: () => void;

  // ローカルストレージと同期
  bestScores: Record<string, number>;
  clearedStages: StageId[];
  starRecords: Record<string, number>;
  loadProgress: () => void;

  // タイムアップ時の一括保存（ベストスコア・スター・resultData を更新）
  saveResult: (
    stageId: StageId,
    score: number,
    stars: number,
    accuracy: number,
    missCount: number,
    elapsedMs: number,
    wordsCompleted: number
  ) => boolean; // isNewBest を返す
}
```

---

## 8. ローマ字変換ロジック（romanizer.ts）

### 対応方針

- 清音・濁音・半濁音・拗音をすべてカバー
- 複数パターン許容（例：「し」→ `si` / `shi` どちらも正解）
- 「ん」→ `n` / `nn` どちらも正解
- 「っ」→ 次の子音を重ねる（例：「った」→ `tta`）
- 句読点・記号のマッピング（`reading` に使用可）：
  - `、` → `,`
  - `。` → `.`
  - `「` → `[`
  - `」` → `]`
  - `・` → `/`（日本語キーボードの `/` キーに対応）
  - `〜`（全角波ダッシュ）は `reading` では使用禁止。代わりに `~`（半角チルダ）を使う
- KANA_MAP 未登録の文字（`~`・`(`・`)` 等）はトークナイザーのフォールバックでそのまま1文字のトークンとして処理される（プレイヤーが対応キーを直接入力）

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
| ドズル社モード（DOZLE）              | `#FF69B4` |

### フッター（MinecraftBg）

全画面共通で土ブロック列にフッターを表示。

- 背景：`#7a5c38`（土ブロック色）
- テキスト：`text-sm text-black/80` / monospace
- 内容：`© {年} tomo Web Studio . All rights reserved.`

### フォント

- 日本語：`Zen Maru Gothic`（Google Fonts）
- ローマ字入力エリア：`monospace`

**ローマ字入力欄のフォントサイズ（`getRomajiStyle` in `TypingArea.tsx`）**

`displayPattern`（実際に入力するローマ字）の文字数で切り替える：

| ローマ字文字数 | フォントサイズ | letterSpacing |
| -------------- | -------------- | ------------- |
| ≤ 20           | 2.0rem         | 0.18em        |
| ≤ 26           | 1.75rem        | 0.1em         |
| > 26           | 1.75rem        | 0.06em        |

### アニメーション方針（Framer Motion）

- キャラ：`y` 軸上下でアイドル / クリア時 `scale` + `rotate`
- 正解時：パーティクルや光のエフェクト
- 画面遷移：`opacity` + `y` のフェードイン

---

## 10. デプロイ

- **Vercel** にデプロイ
- GitHub リポジトリと連携し、`git push` で自動デプロイ
- 無料プランで運用可能（サーバーサイド処理なし）

### 開発環境

- Node.js バージョンを `.nvmrc`（`20`）で固定
- 作業前に `nvm use` を実行して v20 に切り替えること
- v21 以降では `next` / `eslint` の内部 `semver` モジュールが非互換でビルド・lint が失敗する

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
| Phase 6  | テスト・品質（romanizer 32件 / useTypingGame 14件）    | 完了 |
| Phase 7  | トップメニュー画面・難易度構成変更・追加画面（遊び方 / 設定 / ドズル社とは？）実装 | 完了 |
| Phase 8  | 時間制ゲームモード（総制限時間・ワードタイムアウト・ループ出題・スコア再設計） | 完了 |
| Phase 9  | ドズル社モード（文字数制限なし・ワード制限時間なし・180 秒・197 ワード） | 完了 |
| Phase 10 | UI 調整（フッター・ステージ名バッジ・UNOFFICIAL 変更・開発者メッセージ）  | 完了 |

### Phase 9 主な実装内容

- `Difficulty` / `StageId` に `"dozle"` を追加
- `DOZLE_WORDS`（197 ワード）を `words.ts` に独立エクスポートし、`STAGES` に `dozle` ステージとして追加
- `difficulty.ts`：`dozle: { totalSec: 180, secPerRomaji: 0 }` — `secPerRomaji: 0` をワード制限なしのセンチネルとして使用
- `useTypingGame`：`wordTimeLimitRef.current > 0` のときのみタイムアウト処理を実行
- `HUD`：`wordTimeLimitMs === 0` のとき WORD TIMER バーを非表示・∞ 表示に切替
- `bgm.ts`：`dozle` 用トラックを追加（95 BPM・G メジャーペンタトニック・明るいお祭り風）
- ステージ選択画面：通常 4 ステージを 2×2 グリッド、ドズル社モードを全幅の特別カードとして下部に表示

### Phase 7 主な実装内容

- `/how-to-play`：4カード構成（基本ルール・入力のコツ・難易度一覧・スコア）+ ローマ字一覧サブページ
- `/settings`：BGM / SFX 独立トグル・データリセット機能
  - サウンド設定を `soundEnabled` 単一から `sfxEnabled`（旧キー継承）+ `bgmEnabled` に分離
  - BGM は `src/lib/bgm.ts` で Web Audio API による難易度別メロディをループ生成、`useBgm` フックで制御
- `/about`：ドズル社紹介・あゆみ（3時代概要）・メンバー一覧（公式サイトへ外部リンク）・公式 YouTube リンク
  - メンバーリンク先：`https://www.dozle.jp/members/{slug}/`（新タブで開く）
  - 「詳しいあゆみ」→ `/about/history` へリンク
- `/about/history`：3時代の詳細タイムライン（各時代を色分けカード＋縦線で表示）

### Phase 10 主な実装内容

- `MinecraftBg`：土ブロック列にフッター（著作権表示）を追加
- `game/[stage]/page.tsx`：ステージ名を難易度カラーの丸ピル型バッジに変更・TypingArea 上部へ移動
- ドズル社モードのテーマカラーをゴールド（`#FFD700`）→ ピンク（`#FF69B4`）に変更
  - 変更箇所：`StageCard.tsx` / `game/[stage]/page.tsx` / `how-to-play/page.tsx`
- 「OFFICIAL FAN GAME」→「UNOFFICIAL FAN GAME」に修正（`page.tsx` / `stages/page.tsx`）
- トップページに開発者メッセージカードを追加（バージョン表示の下）

## 13. 今後の実装予定

- **キャラクター画像**：仮絵文字から実画像へ差し替え
- **スコア数値調整**：TIMEOUT_PENALTY・ワードスコアはプレイテスト後に要チューニング

## 14. 今後の拡張候補（現時点では対象外）

- オンラインランキング（DB連携が必要）
- タイムアタックモード
- モバイル対応キーボード最適化
