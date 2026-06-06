# TASK.md — ドズル社タイピング 実装タスク一覧

## 進捗凡例

- `[ ]` 未着手
- `[~]` 作業中
- `[x]` 完了

## フェーズ完了時のルール

各 Phase の全タスク完了後、以下を必ず実行する。
エラーがなければコミット → プッシュ（CI/CD により Vercel へ自動デプロイ）。

```
npm run build   # ビルドエラーチェック
npm run dev     # 開発サーバー起動・動作確認
npm run lint    # ESLint チェック
```

---

## Phase 0: プロジェクトセットアップ

- [x] 0-1. Next.js プロジェクト作成（App Router / TypeScript）
- [x] 0-2. 依存パッケージのインストール
  - `tailwindcss` / `shadcn/ui`
  - `framer-motion`
  - `zustand`
- [x] 0-3. Google Fonts（Zen Maru Gothic）設定（`layout.tsx`）
- [x] 0-4. Tailwind のカラーパレット・フォント設定（`globals.css` に @theme で定義）
- [x] 0-5. グローバルスタイル整備（`globals.css`）
- [x] 0-6. ディレクトリ構成の作成（`src/` 以下の骨格）
- [x] 0-7. GitHub リポジトリ作成・初回プッシュ
- [x] 0-8. Vercel プロジェクト作成・GitHub リポジトリ連携
- [x] 0-9. `main` ブランチへの push で自動デプロイされることを確認
- [x] **Phase 0 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 1: データ定義・ロジック層

- [x] 1-1. 型定義ファイル作成（`src/types/index.ts`）
  - `CharacterKey`, `Difficulty`, `Stage`, `StageConfig`, `GameState`, `WordEntry`
- [x] 1-2. ワードデータ作成（`src/lib/words.ts`）
- [x] 1-3. ローマ字変換ロジック実装（`src/lib/romanizer.ts`）
  - 清音・濁音・半濁音・拗音すべてカバー
  - 複数パターン許容（`si` / `shi` など）
  - 「ん」→ `n` / `nn` 両対応
  - 「っ」→ 次子音を重ねる（例：`tta`）
- [x] 1-4. ローカルストレージ操作実装（`src/lib/storage.ts`）
  - ベストスコア / クリア済みステージ / 獲得スター数の読み書き
- [x] 1-5. Zustand ストア定義（`src/store/game-store.ts`）
  - `selectedCharacter`, `currentStage`, `score`, `missCount`, `currentWordIndex`
  - `bestScores`, `clearedStages`, `starRecords`
  - ローカルストレージとの同期
- [x] **Phase 1 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 2: カスタムフック

- [x] 2-1. `useTypingGame` フック実装（`src/hooks/useTypingGame.ts`）
  - キーボード入力のキャプチャ
  - 正解／ミス判定
  - ワード進行管理（次のワードへの遷移）
  - スコア・ミス数の更新
  - ステージクリア検知
  - 正確率（accuracy）計算
  - WPM 計算
- [x] **Phase 2 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 3: 共通コンポーネント

- [x] 3-1. `Character` コンポーネント（`src/components/Character/`）
- [x] 3-2. `StageCard` コンポーネント（`src/components/StageCard/`）
- [x] 3-3. `TypingArea` コンポーネント（`src/components/TypingArea/`）
- [x] 3-4. `HUD` コンポーネント（`src/components/HUD/`）
- [x] 3-5. Minecraft スタイル背景コンポーネント（`src/components/MinecraftBg/`）
- [x] **Phase 3 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 4: 画面実装

- [x] 4-1. ステージ選択画面（`src/app/stages/page.tsx`）
- [x] 4-2. ゲーム画面（`src/app/game/[stage]/page.tsx`）
- [x] 4-3. リザルト画面（`src/app/result/page.tsx`）
- [x] **Phase 4 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 5: アニメーション・エフェクト

- [x] 5-1. タイピング正解時エフェクト（`ParticleEffect`：12粒パーティクル）
- [x] 5-2. 画面遷移アニメーション（`PageTransition`：opacity + y フェードイン）
- [x] 5-3. ステージクリア時お祝いエフェクト（`CelebrationEffect`：40粒コンフェッティ）
- [x] **Phase 5 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 6: テスト・品質

- [x] 6-1. `romanizer.ts` のユニットテスト（32テスト）
- [x] 6-2. `useTypingGame` フックのテスト（14テスト）
- [x] 6-3. 動作確認（全ステージ・全キャラクター）※ dev サーバーで手動確認
- [x] 6-4. TypeScript 型チェック通過（`tsc --noEmit`）
- [x] 6-5. ESLint / Prettier 通過
- [x] **Phase 6 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 7: 構成変更・追加画面

- [x] 7-1. トップメニュー画面実装（`/page.tsx`）
  - ゲームスタート / 遊び方 / 設定 / ドズル社とは？の4ボタン
  - Minecraft スタイルボタン
- [x] 7-2. 難易度・ステージ構成変更
  - チート / ノーマル / ハード / 鬼畜の4難易度に統合
  - ステージロック廃止・全難易度最初から選択可能
  - ステージ選択画面を2×2グリッドに変更
- [x] 7-3. ワードをひらがな文字数で難易度別に再分類
  - cheat：2〜4文字（42ワード）
  - normal：5〜8文字（27ワード）
  - hard：9〜12文字（3ワード・追加予定）
  - kichiku：13文字以上（10ワード）
- [x] 7-4. 遊び方・設定・ドズル社とは？のスタブページ実装
  - `/how-to-play`・`/settings`・`/about` に「準備中」プレースホルダー
- [x] 7-5. 遊び方（`/how-to-play`）コンテンツ実装
- [x] 7-6. 設定（`/settings`）コンテンツ実装
- [x] 7-7. ドズル社とは？（`/about`）コンテンツ実装
- [x] **Phase 7 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 8: 時間制ゲームモード実装

- [x] 8-1. 難易度別定数定義（制限時間・速度係数）`src/lib/difficulty.ts`
  - cheat：60秒・1.0秒/文字
  - normal：90秒・0.65秒/文字
  - hard：120秒・0.4秒/文字
  - kichiku：150秒・0.25秒/文字
- [x] 8-2. ワード別タイムアウト計算（ローマ字文字数 × 速度係数）`countRomajiLength()` 追加
- [x] 8-3. 総制限時間カウントダウン・ゲーム終了処理実装
- [x] 8-4. タイムアウト時の自動ワード切り替え実装（TIMEOUT_PENALTY = 30点減点）
- [x] 8-5. ループ出題実装（ワードを使い切ったらシャッフルして継続）
- [x] 8-6. スコア計算の再設計・実装（ワード完了＋タイムアウト減点）
- [x] 8-7. HUD 更新（総残り時間・ワード制限時間バーの表示）
- [x] 8-8. リザルト画面の更新（TIME UP 表示・WORDS stat 対応）
- [x] 8-9. `useTypingGame` フックのテスト更新（時間制対応・14テスト）
- [x] **Phase 8 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 9: ドズル社モード実装

- [x] 9-1. `Difficulty` / `StageId` に `"dozle"` を追加（`src/types/index.ts`）
- [x] 9-2. `DOZLE_WORDS`（197ワード）を `words.ts` に独立エクスポート・`STAGES` に `dozle` ステージ追加
- [x] 9-3. `difficulty.ts` に `dozle: { totalSec: 180, secPerRomaji: 0 }` を追加
  - `secPerRomaji: 0` をワード制限時間なしのセンチネル値として使用
- [x] 9-4. `useTypingGame`：`wordTimeLimitRef.current > 0` のときのみタイムアウト処理を実行
- [x] 9-5. `HUD`：`wordTimeLimitMs === 0` のとき WORD TIMER バーを非表示・∞ 表示に切替
- [x] 9-6. `bgm.ts`：`dozle` 用トラック追加（95 BPM・G メジャーペンタトニック・明るいお祭り風）
- [x] 9-7. ステージ選択画面：通常4ステージを2×2グリッド、ドズル社モードを全幅の特別カードとして下部に表示
- [x] **Phase 9 完了チェック：build / dev / lint → コミット → プッシュ**

---

---

## Phase 11: ステージ選択画面 — ステージ説明の追加（次回実装予定）

- [x] 11-1. `StageCard` コンポーネントにステージ説明を追加
  - 制限時間（例：60秒）
  - 1文字あたりの入力時間制限（例：1.0秒/文字）※ドズル社モードは「制限なし」
  - ひらがな文字数の目安（例：2〜4文字）
- [x] 11-2. `StageConfig` 型に `theme` フィールドを追加し、`words.ts` の各ステージ定義に記述（`StageCard` で表示）
- **Phase 11 完了チェック：build / dev / lint → コミット → プッシュ**

---

---

## Phase 12: SEO 対策（作業中）

1ステップずつビルド確認しながら進める方針。

- [x] 12-1. favicon 配置
  - `src/app/icon.jpg`（1254×1254px）を配置（Next.js 自動認識形式）
  - `src/app/favicon.ico`（誤配置の JPEG）を削除
  - ビルド確認済み → コミット・プッシュ済み
- [x] 12-2. `layout.tsx`：OGP・Twitter Card・title テンプレート追加 → ビルド確認 → コミット
- [x] 12-3. `robots.ts` 作成 → ビルド確認 → コミット
- [x] 12-4. `sitemap.ts` 作成 → ビルド確認 → コミット
- [x] 12-5. 各ページ `layout.tsx` 新規作成（ページ別タイトル）→ ビルド確認 → コミット
  - `stages/layout.tsx`
  - `how-to-play/layout.tsx`
  - `how-to-play/romaji/layout.tsx`
  - `settings/layout.tsx`
  - `about/layout.tsx`
  - `about/history/layout.tsx`
- [x] 12-6. `public/ogp.png` 配置 → ビルド確認 → コミット
- [x] **Phase 12 完了チェック：build / lint → コミット → プッシュ**

---

---

## Phase 13: スター判定の見直し

- [x] 13-1. `calcStars` を正確率のみの単軸に変更（`useTypingGame.ts`）
  - 変更前：`accuracy >= 90 && missCount <= 3` → ★3 / `accuracy >= 75 && missCount <= 10` → ★2
  - 変更後：`accuracy >= 90` → ★3 / `accuracy >= 75` → ★2 / それ未満 → ★1
  - 関数シグネチャから `missCount` 引数を削除
- [x] **Phase 13 完了チェック：build / lint → コミット → プッシュ**

---

## Phase 14: 文字単位の逐次マッチングに正誤判定を再構築

全パターン事前生成方式（最大8パターン上限あり）を廃止し、1文字ずつリアルタイムに照合する方式に変更する。

### Step 1 — `romanizer.ts` にトークン分解 API を追加

- [x] 14-1. `KanaToken` インターフェース定義（`kana: string`, `candidates: string[]`）
- [x] 14-2. `tokenizeKana(kana: string): KanaToken[]` 実装
  - 拗音（きゃ等）は2文字で1トークン
  - 「っ」は次トークンの先頭子音を参照して候補生成（`tt`/`kk` 等）
  - 「ん」は次トークンの先頭が母音/n なら `nn` 必須、それ以外は `n` も可
- [x] 14-3. `tokenizeKana` のユニットテスト追加（`romanizer.test.ts`）
  - 通常清音・拗音・っ・ん・記号の境界ケース
- [x] **Step 1 確認：`npm test` でテスト全件グリーン**

### Step 2 — `Matcher` を実装（`romanizer.ts` 内）

- [ ] 14-4. `MatcherState` インターフェース定義
  - `tokens`, `tokenIndex`, `typed`, `liveCandidates`, `committedRomaji`
- [ ] 14-5. `createMatcher(kana: string): MatcherState` 実装
- [ ] 14-6. `advance(state: MatcherState, key: string)` 実装
  - `typed + key` で候補を枝刈り
  - 戻り値：`{ status: 'ok' | 'complete' | 'miss', next?: MatcherState }`
- [ ] 14-7. `advance` のユニットテスト追加（`romanizer.test.ts`）
  - 正解・ミス・完了・っ/ん の境界ケース
- [ ] **Step 2 確認：`npm test` でテスト全件グリーン**

### Step 3 — `useTypingGame.ts` の改修

- [ ] 14-8. `romajiPatterns` / `patternIdx` を `MatcherState` に置き換え
- [ ] 14-9. キー入力処理を `advance()` ベースに書き換え
- [ ] 14-10. 8パターン上限ハック（`toRomaji` の `MAX_PATTERNS` 制限）を削除
- [ ] 14-11. `useTypingGame.test.ts` を新しい状態構造に合わせて更新
- [ ] **Step 3 確認：`npm test` でテスト全件グリーン**

### Step 4 — `TypingArea.tsx` の表示ロジック修正

- [ ] 14-12. 色分け表示（打ち済み・現在・未入力）を `MatcherState` から計算するよう変更
  - `committedRomaji` → 打ち済み（緑）
  - `liveCandidates[0]` の残り → 現在カーソル以降（白/グレー）
- [ ] **Step 4 確認：`npm run dev` + ブラウザで打鍵確認（っ/ん/拗音の境界ケース重点確認）**

### Step 5〜7 — テスト・ビルド・デプロイ

- [ ] 14-13. `npm test` 全件グリーン確認
- [ ] 14-14. `npm run build` 型エラー・ビルドエラーなし確認
- [ ] 14-15. `npm run lint` ESLint エラーなし確認
- [ ] **Phase 14 完了チェック：build / lint / test → コミット → プッシュ → Vercel 自動デプロイ確認**

---

## メモ

- **スコア調整**：TIMEOUT_PENALTY=30・ワードスコア最大100点の数値はプレイテスト後に調整予定
- **キャラクター画像**：素材が揃い次第差し替え（仮絵文字でまず実装済み）
- **CI/CD**：`main` ブランチへの push → Vercel が自動でビルド・デプロイ
