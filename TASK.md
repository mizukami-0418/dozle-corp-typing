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
  - EASY：草原・村人ステージ（ひらがな・日常単語）
  - EASY：ドズル社チートステージ（ドズル社関連の簡単な単語）
  - NORMAL：マイクラ・ドズル社ステージ（Minecraft用語・メンバー関連）
  - HARD：ドズル社鬼畜ステージ（ドズル社の有名なセリフ・長文）
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
  - アイドルアニメーション（y軸上下 / Framer Motion）
  - クリア時アニメーション（scale + rotate）
  - 応援メッセージ表示
  - キャラクターごとの画像・カラー対応
- [x] 3-2. `StageCard` コンポーネント（`src/components/StageCard/`）
  - 難易度カラー表示
  - 鍵マーク（未解放ステージ）
  - ベストスコア表示
  - クリック選択
- [x] 3-3. `TypingArea` コンポーネント（`src/components/TypingArea/`）
  - ひらがな表示
  - 英語ヒント表示
  - ローマ字入力欄（打ち済み / 現在 / 未入力を色分け）
  - 次のワードプレビュー
  - 正確率表示
- [x] 3-4. `HUD` コンポーネント（`src/components/HUD/`）
  - スコア表示
  - ステージ進捗バー
  - ミス数表示
- [x] 3-5. Minecraft スタイル背景コンポーネント（`src/components/MinecraftBg/`）
  - 空 / 草 / 土のブロック背景
- [x] **Phase 3 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 4: 画面実装

- [x] 4-1. ステージ選択画面（`src/app/page.tsx`）
  - ドズル社ロゴ +「OFFICIAL FAN GAME」サブロゴ
  - キャラクター選択（5人）
  - ステージカード一覧
  - Minecraft スタイル背景
- [x] 4-2. ゲーム画面（`src/app/game/[stage]/page.tsx`）
  - HUD 配置
  - キャラクター表示・アニメーション
  - TypingArea 配置
  - `useTypingGame` フック接続
  - ステージクリア → リザルト画面への遷移
- [x] 4-3. リザルト画面（`src/app/result/page.tsx`）
  - STAGE CLEAR バッジ
  - キャラお祝いアニメーション + メッセージ
  - 獲得スター（3段階）
  - スコア / 正確率 / タイム
  - NEW BEST SCORE 表示（更新時のみ）
  - 「ステージへ戻る」「もう一度！」ボタン
  - ローカルストレージへの保存処理
- [x] **Phase 4 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 5: アニメーション・エフェクト

- [x] 5-1. タイピング正解時エフェクト（パーティクル or 光）
- [x] 5-2. 画面遷移アニメーション（opacity + y のフェードイン）
- [x] 5-3. ステージクリア時お祝いエフェクト
- [x] **Phase 5 完了チェック：build / dev / lint → コミット → プッシュ**

---

## Phase 6: テスト・品質

- [ ] 6-1. `romanizer.ts` のユニットテスト
- [ ] 6-2. `useTypingGame` フックのテスト
- [ ] 6-3. 動作確認（全ステージ・全キャラクター）
- [ ] 6-4. TypeScript 型チェック通過（`tsc --noEmit`）
- [ ] 6-5. ESLint / Prettier 通過
- [ ] **Phase 6 完了チェック：build / dev / lint → コミット → プッシュ**

---

## メモ

- **解放条件**：前のステージクリアで次が解放（ローカルストレージで管理）
- **スター評価基準**：未定（ミス数またはタイムで決定予定）
- **キャラクター画像**：素材が揃い次第差し替え（仮画像でまず実装）
- **CI/CD**：`main` ブランチへの push → Vercel が自動でビルド・デプロイ
