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

## メモ

- **ハードのワード不足**：現在3ワードのみ。120秒の制限時間に対して大幅に不足するため追加が必要（9〜12ひらがな文字のワード）
- **スコア調整**：TIMEOUT_PENALTY=30・ワードスコア最大100点の数値はプレイテスト後に調整予定
- **キャラクター画像**：素材が揃い次第差し替え（仮絵文字でまず実装済み）
- **CI/CD**：`main` ブランチへの push → Vercel が自動でビルド・デプロイ
