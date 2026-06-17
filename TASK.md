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

- [x] 14-4. `MatcherState` インターフェース定義
  - `tokens`, `tokenIndex`, `typed`, `liveCandidates`, `committedRomaji`
- [x] 14-5. `createMatcher(kana: string): MatcherState` 実装
- [x] 14-6. `advance(state: MatcherState, key: string)` 実装
  - `typed + key` で候補を枝刈り
  - 戻り値：`{ status: 'ok' | 'complete' | 'miss', next?: MatcherState }`
- [x] 14-7. `advance` のユニットテスト追加（`romanizer.test.ts`）
  - 正解・ミス・完了・っ/ん の境界ケース
- [x] **Step 2 確認：`npm test` でテスト全件グリーン**

### Step 3 — `useTypingGame.ts` の改修

- [x] 14-8. `romajiPatterns` / `patternIdx` を `MatcherState` に置き換え
- [x] 14-9. キー入力処理を `advance()` ベースに書き換え
- [x] 14-10. 8パターン上限ハック（`toRomaji` の `MAX_PATTERNS` 制限）を削除
- [x] 14-11. `useTypingGame.test.ts` を新しい状態構造に合わせて更新
- [x] **Step 3 確認：`npm test` でテスト全件グリーン**

### Step 4 — `TypingArea.tsx` の表示ロジック修正

- [x] 14-12. 色分け表示（打ち済み・現在・未入力）を `MatcherState` から計算するよう変更
  - `committedRomaji` → 打ち済み（緑）
  - `liveCandidates[0]` の残り → 現在カーソル以降（白/グレー）
- [x] **Step 4 確認：`npm run dev` + ブラウザで打鍵確認（っ/ん/拗音の境界ケース重点確認）**

### Step 5〜7 — テスト・ビルド・デプロイ

- [x] 14-13. `npm test` 全件グリーン確認
- [x] 14-14. `npm run build` 型エラー・ビルドエラーなし確認
- [x] 14-15. `npm run lint` ESLint エラーなし確認
- [x] **Phase 14 完了チェック：build / lint / test → コミット → プッシュ → Vercel 自動デプロイ確認**

---

---

## Phase 15: バトルモード実装

### Step 1 — データ・型定義

- [x] 15-1. `src/types/index.ts` にバトルモード用型を追加
  - `BattleStageId`（`"zombie" | "drowned" | "wither-skeleton" | "shulker" | "ender-dragon" | "dozle-battle"`）
  - `BattleMonster`（`id`, `name`, `emoji`, `maxHp`）
  - `BattleStageConfig`（`id`, `name`, `minChars`, `maxChars`, `secPerRomaji`, `monsters`）
- [x] 15-2. `src/lib/battle-stages.ts` 作成
  - 6ステージ分のモンスターデータ定義（CLAUDE.md 3-7 参照）
  - ステージ設定（文字数範囲・時間係数・HP設定）
  - `getBattleWords(stageId, allWords)` 関数（ひらがな文字数でフィルタしてランダム返却）
  - `getBattleStageById(id)` 関数
- [x] 15-3. `src/store/game-store.ts` にバトル進捗を追加
  - `clearedBattleStages: string[]`
  - `saveBattleClear(stageId: string): void`
  - localStorage 読み書き対応
- [x] **Step 1 確認：`npm run build` 型エラーなし**

### Step 2 — バトルゲームロジック

- [x] 15-4. `src/hooks/useBattleGame.ts` 実装
  - プレイヤーHP管理（初期20pt・❤️10個・半ハート1pt単位）
  - モンスターHP管理（通常30/40/50・ボス40/50/70）
  - ワード出題（文字数フィルタ済みランダム・`createMatcher` で逐次マッチング）
  - タイプミス処理（プレイヤー -1pt）
  - タイムアウト処理（プレイヤー -2pt・次ワードへ）
  - 正解処理（モンスター -10pt・パーティクルトリガー）
  - モンスターHP0 → 撃破 → 次モンスターへ（5体目撃破でステージクリア）
  - ステージクリア → `saveBattleClear` 呼び出し
  - プレイヤーHP0 → ゲームオーバー
  - ワード別タイマー（`ローマ字文字数 × secPerRomaji`）
- [x] **Step 2 確認：`npm run build` 型エラーなし**

### Step 3 — UIコンポーネント

- [x] 15-5. `src/components/HeartBar/HeartBar.tsx` 実装
  - ハート10個を横並びで表示
  - 現在HPに応じて ❤️（満）/ 🖤（空）を切り替え
  - 半ハート（奇数pt）は半分赤の表示
  - ダメージ時のアニメーション（Framer Motion）
- [x] 15-6. `src/components/MonsterCard/MonsterCard.tsx` 実装
  - モンスター絵文字（約160×160px）
  - モンスター名表示
  - HPバー（赤・残りHP/最大HPで幅変化）
  - 撃破時アニメーション（フェードアウト・揺れ等）
- [x] **Step 3 確認：`npm run dev` でコンポーネント表示確認**

### Step 4 — トップメニュー更新

- [x] 15-7. `src/app/page.tsx` 更新
  - 「ゲームスタート」→「ノーマルモード」に変更
  - 「バトルモード」ボタン追加（`/battle` へ遷移）
  - レイアウト：2×2グリッド（ノーマル・バトル・遊び方・設定）+ 全幅1（ドズル社とは？）
- [x] **Step 4 確認：`npm run dev` でトップメニュー表示確認**

### Step 5 — バトルステージ選択画面

- [x] 15-8. `src/app/battle/page.tsx` 実装
  - ステージカード縦並び（6枚）
  - 解放済み：カード通常表示・クリック可
  - 未解放：グレーアウト＋🔒アイコン
  - クリア済み：✅ バッジ表示
  - `clearedBattleStages` を store から読み込んで表示制御
- [x] **Step 5 確認：`npm run dev` でステージ選択表示・ロック動作確認**

### Step 6 — バトルゲーム画面

- [x] 15-9. `src/app/battle/[stage]/page.tsx` 実装
  - ステージ名バッジ・何体目か表示（例：2/5）
  - `MonsterCard`（モンスター絵文字・名前・HPバー）
  - `HeartBar`（プレイヤーHP）
  - `TypingArea`（既存コンポーネント流用）
  - ワード別タイマーバー
  - `useBattleGame` フックと接続
  - ゲームオーバーオーバーレイ（GAME OVER テキスト・前ステージ名・戻るボタン）
  - ステージクリアオーバーレイ（STAGE CLEAR テキスト・次ステージへボタン）
  - `ParticleEffect` をモンスター撃破時にトリガー
- [x] **Step 6 確認：`npm run dev` で全ステージ通して動作確認**
  - HP増減・ゲームオーバー・ステージクリア・次ステージ解放

### Step 7 — テスト・ビルド・デプロイ

- [x] 15-10. `npm run build` 型エラー・ビルドエラーなし確認
- [x] 15-11. `npm run lint` ESLint エラーなし確認
- [x] 15-12. 全ステージ動作確認（ブラウザ手動テスト）
  - STAGE 1〜5・EXTRA 各ステージでゲームオーバー・クリアを確認
  - ステージ解放ロックの動作確認
  - localStorage への進捗保存・ページリロード後の保持確認
- [x] **Phase 15 完了チェック：build / lint → コミット → プッシュ → Vercel 自動デプロイ確認**

---

---

## Phase 16: バトルモード クリアタイム計測・記録機能

> ブランチ：`feat/battle-clear-time` を切って実装 → main にマージ

### Step 1 — 型定義追加

- [x] 16-1. `src/types/index.ts` にタイム記録用型を追加
  - `BattleTimeRecord { timeMs: number; date: string }`
  - `BattleTimeRecords = Record<string, BattleTimeRecord[]>`

### Step 2 — ストレージ関数追加

- [x] 16-2. `src/lib/storage.ts` に以下を追加
  - `loadBattleTimeRecords(): BattleTimeRecords` — localStorage から読み込み
  - `saveBattleTimeRecord(stageId, timeMs)` — 追加 → タイム昇順ソート → 5件超過分を切り捨て → 保存
  - `getBestBattleTime(stageId): number | undefined` — 1位タイムのみ返す
- [x] **Step 2 確認：`npm run build` 型エラーなし**

### Step 3 — Zustand ストア更新

- [x] 16-3. `src/store/game-store.ts` を更新
  - `battleTimeRecords: BattleTimeRecords` 状態追加
  - `saveBattleTime(stageId: string, timeMs: number): void` アクション追加
  - `loadProgress()` に `battleTimeRecords` の読み込みを追加
- [x] **Step 3 確認：`npm run build` 型エラーなし**

### Step 4 — useBattleGame にタイマー追加

- [x] 16-4. `src/hooks/useBattleGame.ts` を更新
  - 既存の `startTime` state を流用（初回キー入力時にセット）
  - ステージクリア確定（5体目撃破）時に `clearTimeMs = Date.now() - startTime` を計算
  - `clearTimeMs` を戻り値として返す
  - ゲームオーバー・リスタート時に `clearTimeMs` をリセット
- [x] **Step 4 確認：`npm run build` 型エラーなし**

### Step 5 — バトルゲーム画面でタイム保存・表示

- [x] 16-5. `src/app/battle/[stage]/page.tsx` を更新
  - クリアイベントで `saveBattleTime(stageId, clearTimeMs)` を呼び出す
  - クリアオーバーレイに今回のクリアタイム（`m:ss.xx` フォーマット）を表示
- [x] **Step 5 確認：`npm run dev` でクリアオーバーレイのタイム表示を確認**

### Step 6 — バトルステージ選択画面にベストタイム＋記録モーダル

- [x] 16-6. `src/app/battle/page.tsx` を更新
  - 各ステージカードに `BEST m:ss.xx` を表示（記録がある場合のみ）
  - 「記録を見る」ボタンを追加（記録がない場合は非表示）
  - 記録モーダルコンポーネントを追加
    - ステージ名ヘッダー
    - 🥇🥈🥉＋4位・5位のランキング（タイム＋日付）
    - 「閉じる」ボタン
- [x] **Step 6 確認：`npm run dev` でモーダル表示・ベストタイム表示を確認**

### Step 7 — テスト・ビルド・マージ

- [x] 16-7. `npm test` 既存テストが壊れていないか確認
- [x] 16-8. `npm run build` 型エラー・ビルドエラーなし確認
- [x] 16-9. `npm run lint` ESLint エラーなし確認
- [x] 16-10. 動作確認（ブラウザ手動テスト）
  - 各ステージでクリア → タイムが記録されること
  - ステージ選択画面にベストタイムが表示されること
  - 記録モーダルでベスト5が正しい順で表示されること
  - ゲームオーバー時にタイムが記録されないこと
  - ページリロード後も記録が保持されること
- [x] **Phase 16 完了チェック：`git checkout main && git merge feat/battle-clear-time && git push`**

---

---

## Phase 17: 最終コードレビュー

> ブランチ：`review/final-code-review` を切って実施 → 項目ごとにコミット → main にマージ
> レビュー → 問題があれば修正・なければ「問題なし」としてコミット

- [x] 17-1. **動作**：全画面・全フロー（ノーマル・バトル・結果・設定）の動作確認
- [x] 17-2. **ロジック**：ゲームロジック（スコア計算・HP計算・タイムアウト・ローマ字変換）の正確性検証
- [x] 17-3. **可読性・保守性**：命名規則・コメント・型定義・コードの一貫性チェック
- [x] 17-4. **パフォーマンス**：不要な再レンダリング・重い処理・メモリリーク・バンドルサイズ確認
- [x] 17-5. **セキュリティ**：XSS・localStorage の入力検証・外部依存のリスク確認
- [x] 17-6. **責任分離**：コンポーネント・フック・ストア・ユーティリティの役割境界チェック
- [x] 17-7. **依存関係**：package.json の不要パッケージ・バージョン固定・脆弱性確認
- [x] 17-8. **拡張性**：新ステージ・新モンスター・新キャラ追加時の影響範囲確認
- [x] 17-9. **SEO**：メタタグ・OGP・sitemap・robots・ページタイトルの網羅性確認
- [ ] **Phase 17 完了チェック：`git checkout main && git merge review/final-code-review && git push`**

---

## メモ

- **スコア調整**：TIMEOUT_PENALTY=30・ワードスコア最大100点の数値はプレイテスト後に調整予定
- **キャラクター画像**：素材が揃い次第差し替え（仮絵文字でまず実装済み）
- **バトルモード モンスター画像**：256×256px PNG、当面絵文字で代用・素材が揃い次第差し替え
- **バトルモード EXTRA モンスター画像**：`bonjour.png` 等5枚未追加（素材待ち）
- **CI/CD**：`main` ブランチへの push → Vercel が自動でビルド・デプロイ
