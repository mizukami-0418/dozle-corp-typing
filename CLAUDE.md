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

#### ノーマルモード（時間制スコアアタック型）
- 難易度ごとの制限時間内にできるだけ多くのワードを打つ
- ワードごとに制限時間あり（超過すると自動的に次のワードへ）
- 制限時間が来るまでワードをループして出題し続ける
- 回答中に制限時間を超えたワードはスコアに含まない（減点のみ）

#### バトルモード（HP制バトル型）
- 6ステージ（STAGE 1〜5 + EXTRA）を順番に攻略する
- 各ステージに5体のモンスターが登場し、順番に撃破する
- ワード正解 → モンスターにダメージ、タイプミス・タイムアウト → プレイヤーがダメージ
- プレイヤーHP0でゲームオーバー（前ステージ先頭から再開）

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

### 3-6. スコア仕様（ノーマルモード）

- **ワードスコア**：`Math.max(10, romLen * 10 - wordMiss * 10)`（ローマ字文字数ベース）
- **正確率ボーナス**：ゲーム終了時に累計スコアへ乗算（95%以上→×1.3 / 90%以上→×1.2 / 80%以上→×1.1 / それ未満→×1.0）
- **タイムアウト減点**：`TIMEOUT_PENALTY`（`difficulty.ts` で定義）
- **進捗保存**：ローカルストレージ（ベストスコア・クリア済みステージ・獲得スター数）

### 3-7. バトルモード仕様

#### ステージ構成

| ステージ | ID | テーマ | 舞台 | ひらがな文字数 | 時間係数（秒/ローマ字1文字） |
| --- | --- | --- | --- | --- | --- |
| STAGE 1 | `zombie` | ゾンビ（初級） | 草原・村の夜 | 〜4文字 | 1.1秒 |
| STAGE 2 | `drowned` | ドラウンド（中級） | 海・川 | 4〜6文字 | 0.9秒 |
| STAGE 3 | `wither-skeleton` | ウィザスケ（上級） | ネザー要塞 | 6〜8文字 | 0.7秒 |
| STAGE 4 | `shulker` | シュルカー（超上級） | エンドシティ | 8〜10文字 | 0.55秒 |
| STAGE 5 | `ender-dragon` | エンドラ（BOSS） | ジ・エンド | 10〜12文字 | 0.45秒 |
| EXTRA | `dozle-battle` | ドズル社 | ドズル社HQ | 12〜15文字 | 0.35秒 |

#### 登場モンスター

| ステージ | 1体目 | 2体目 | 3体目 | 4体目 | 5体目（ボス） |
| --- | --- | --- | --- | --- | --- |
| STAGE 1 | ゾンビ | 村人ゾンビ | くも | クリーパー | スケルトン |
| STAGE 2 | ドラウンド | ウィッチ | ピリジャー | ストレイ | ラヴェジャー |
| STAGE 3 | ピグリン | ガスト | ホグリン | ブレイズ | ウィザースケルトン |
| STAGE 4 | シュルカー | エンダーマン | ファントム | エヴォーカー | ヴィンジケイター |
| STAGE 5 | ピグリンブルート | エルダーガーディアン | ウォーデン | ウィザー | エンダードラゴン |
| EXTRA | ぼんじゅうる | おらふくん | ドズル | おおはらMEN | おんりー |

#### HP・ダメージ仕様

| 対象 | 値 |
| --- | --- |
| プレイヤー初期HP | 20pt（ハート10個・半ハート1pt） |
| タイプミス | プレイヤーに -1pt（半ハート） |
| タイムアウト | プレイヤーに -2pt（ハート1個） |
| ワード正解 | モンスターに -10pt |

**モンスターHP：**

| ステージ | 通常（1〜4体目） | ボス（5体目） |
| --- | --- | --- |
| STAGE 1〜2 | 30 | 40 |
| STAGE 3〜4 | 40 | 50 |
| STAGE 5・EXTRA | 50 | 70 |

#### ステージ解放・ゲームオーバー

- Stage 1 は常時解放。Stage N クリアで Stage N+1 解放（EXTRA は Stage 5 クリアで解放）
- 進捗はローカルストレージに保存
- ゲームオーバー（HP0）→ 前ステージ先頭から再開（Stage 1 でゲームオーバー → Stage 1 から）

#### モンスター画像

- サイズ：256×256px（PNG・背景透過）
- 表示サイズ：約160×160px（CSS）
- 配置先：`public/images/monsters/{id}.png`
- 画像がない場合は絵文字フォールバックが表示される

| ステージ | ファイル名 | 実装済み |
| --- | --- | --- |
| STAGE 1 | `zombie.png` / `zombie-villager.png` / `spider.png` / `creeper.png` / `skeleton.png` | ✅ |
| STAGE 2 | `drowned.png` / `witch.png` / `pillager.png` / `stray.png` / `ravager.png` | ✅ |
| STAGE 3 | `piglin.png` / `ghast.png` / `hoglin.png` / `blaze.png` / `wither-skeleton.png` | ✅ |
| STAGE 4 | `shulker.png` / `enderman.png` / `phantom.png` / `evoker.png` / `vindicator.png` | ✅ |
| STAGE 5 | `piglin-brute.png` / `elder-guardian.png` / `warden.png` / `wither.png` / `ender-dragon.png` | ✅ |
| EXTRA | `bonjour.png` / `oraf.png` / `dozle.png` / `oohara-men.png` / `qnly.png` | |

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
/stages         → ノーマルモード ステージ選択画面
/game/[stage]   → ノーマルモード ゲーム画面
/result         → ノーマルモード リザルト画面
/battle         → バトルモード ステージ選択画面
/battle/[stage] → バトルモード ゲーム画面
/how-to-play         → 遊び方
/how-to-play/romaji  → ローマ字対応一覧表
/settings            → 設定
/about               → ドズル社とは？
/about/history       → ドズル社の歴史と変遷（詳細タイムライン）
```

### 5-2. トップメニュー画面

- ドズル社ロゴ + 「UNOFFICIAL FAN GAME」サブロゴ
- Minecraft スタイルの5ボタンメニュー（2×2グリッド + 全幅1）
  - ⏱️ ノーマルモード → `/stages`
  - ⚔️ バトルモード → `/battle`
  - 📖 遊び方 → `/how-to-play`
  - ⚙️ 設定 → `/settings`
  - 🦍 ドズル社とは？ → `/about`（全幅・下部）
- バージョン表示（v1.0.0）の下に開発者メッセージカード
- 背景：Minecraftスタイル（空・草・土）

### 5-3. ステージ選択画面

- ドズル社ロゴ + 「UNOFFICIAL FAN GAME」サブロゴ
- キャラクター選択（5人・メンバーカラーで表示）
- ステージカード一覧（2×2グリッド・難易度ごとに色分け・ロックなし）、ドズル社モードは全幅で下部に表示
- ベストスコア表示
- 背景：Minecraftスタイル（空・草・土）

### 5-4. ゲーム画面

- HUD：スコア / 総残り時間カウントダウン / ワード別タイマーバー / 正確率 / ミス数
- 選択キャラ表示（アイドルアニメーション）
- タイピングエリア：ステージ名バッジ（難易度カラーの丸ピル型）/ ひらがな表示 / ローマ字入力欄（打ち済み・現在・未入力を色分け）
- TypingArea 右下に「✕ ゲームをやめる」ボタン（確認ダイアログあり・ESC キー対応）
- 次のワードプレビュー / 正確率表示
- タイムアップ時オーバーレイ（TIME UP! テキスト・ワード完了数・スター表示）
- 背景：Minecraftスタイル

### 5-5. リザルト画面（ノーマルモード）

- TIME UP! バッジ
- キャラのお祝いアニメーション
- 獲得スター（3段階）
- スコア / 正確率 / WORDS（完了ワード数）/ MISS / TIME
- NEW BEST! 表示（更新時のみ）
- ボタン：「ステージへ戻る」「もう一度！」
- 背景：Minecraftスタイル

### 5-6. バトルモード ステージ選択画面

- ステージカード一覧（縦並び）
- 未解放ステージはグレーアウト＋鍵アイコン
- クリア済みステージはチェックマーク
- 背景：Minecraftスタイル

### 5-7. バトルモード ゲーム画面

- **上部**：ステージ名 / 何体目か（例：2/5）
- **モンスターエリア**：モンスター絵文字（256px）/ モンスター名 / HPバー（赤）
- **プレイヤーHPエリア**：ハート10個（半分ずつ増減、❤️🖤で表現）
- **タイピングエリア**：既存 TypingArea コンポーネントを流用
- **タイマーバー**：ワード別制限時間
- ゲームオーバーオーバーレイ（GAME OVER テキスト・前ステージ名表示）
- 撃破オーバーレイ（モンスター討伐時エフェクト）
- 背景：Minecraftスタイル

---

## 6. ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx               # トップメニュー画面
│   ├── stages/page.tsx        # ノーマルモード ステージ選択画面
│   ├── game/[stage]/page.tsx  # ノーマルモード ゲーム画面
│   ├── result/page.tsx        # ノーマルモード リザルト画面
│   ├── battle/
│   │   ├── page.tsx           # バトルモード ステージ選択画面
│   │   └── [stage]/page.tsx   # バトルモード ゲーム画面
│   ├── how-to-play/           # 遊び方 + romaji/ サブページ
│   ├── settings/page.tsx      # 設定（BGM/SFX トグル・データリセット）
│   └── about/                 # ドズル社とは？ + history/ サブページ
├── components/
│   ├── TypingArea/            # タイピング入力エリア
│   ├── Character/             # キャラクターコンポーネント（アニメーション含む）
│   ├── StageCard/             # ステージ選択カード
│   ├── HUD/                   # スコア・進捗表示
│   ├── HeartBar/              # バトルモード プレイヤーHP（ハート表示）
│   ├── MonsterCard/           # バトルモード モンスター表示・HPバー
│   ├── MinecraftBg/           # Minecraftスタイル背景
│   ├── PageTransition.tsx     # ページ遷移アニメーションラッパー
│   └── effects/               # ParticleEffect / CelebrationEffect
├── lib/
│   ├── words.ts               # ノーマルモード ステージ別ワードデータ
│   ├── battle-stages.ts       # バトルモード ステージ・モンスター定義
│   ├── romanizer.ts           # ひらがな → ローマ字変換ロジック
│   ├── difficulty.ts          # 難易度別定数（制限時間・速度係数・TIMEOUT_PENALTY）
│   ├── storage.ts             # ローカルストレージ操作
│   ├── characters.ts          # キャラクター設定データ
│   ├── sound.ts               # Web Audio API タイピング効果音
│   └── bgm.ts                 # Web Audio API BGM（難易度別メロディ・ループ再生）
├── hooks/
│   ├── useTypingGame.ts       # ノーマルモード ゲームロジック
│   ├── useBattleGame.ts       # バトルモード ゲームロジック
│   └── useBgm.ts              # BGM 再生フック
├── store/game-store.ts        # Zustand ストア定義
├── types/index.ts             # 共通型定義
└── __tests__/
    ├── romanizer.test.ts      # romanizer ユニットテスト
    └── useTypingGame.test.ts  # フックテスト（14件）
```

---

## 7. 状態管理（Zustand）

`game-store.ts` で管理する主な状態：

```ts
interface GameStore {
  selectedCharacter: CharacterKey;
  setCharacter: (key: CharacterKey) => void;

  resultData: ResultData | undefined;
  setResultData: (data: ResultData) => void;

  sfxEnabled: boolean;    // タイピング効果音（旧 soundEnabled キーを継続使用）
  toggleSfx: () => void;
  bgmEnabled: boolean;
  toggleBgm: () => void;

  bestScores: Record<string, number>;
  clearedStages: StageId[];
  starRecords: Record<string, number>;
  loadProgress: () => void;

  saveResult: (
    stageId: StageId,
    score: number,
    stars: number,
    accuracy: number,
    missCount: number,
    elapsedMs: number,
    wordsCompleted: number
  ) => boolean; // isNewBest を返す

  // バトルモード進捗
  clearedBattleStages: string[];
  saveBattleClear: (stageId: string) => void;
}
```

---

## 8. ローマ字変換ロジック（romanizer.ts）

- 清音・濁音・半濁音・拗音をすべてカバー
- 複数パターン許容（例：「し」→ `si` / `shi` どちらも正解）
- 「ん」→ `n` / `nn` どちらも正解
- 「っ」→ 次の子音を重ねる（例：「った」→ `tta`）
- 「じゃ/じゅ/じょ」→ `ja/zya`（`jya` は除外）— 連続入力時のパターン爆発防止
- ふ行拗音：`fa/fwa`（ふぁ）/ `fya`（ふゃ）/ `fyu`（ふゅ）等
- ゔ行：`va/vi/vu/ve/vo`
- 句読点・記号のマッピング（`reading` に使用可）：
  - `、` → `,` / `。` → `.` / `「` → `[` / `」` → `]` / `・` → `/`
  - `〜`（全角波ダッシュ）は `reading` では使用禁止。代わりに `~`（半角チルダ）を使う
- KANA_MAP 未登録の文字（`~`・`(`・`)` 等）はフォールバックでそのまま1文字のトークンとして処理される
- `toRomaji` のパターン数制限は撤廃済み（逐次マッチングにより組み合わせ爆発は発生しない）
- **ん の改善（Phase 14）**：
  - ん + 母音（あ〜お）：candidates `["n","nn"]` で auto-commit 対応（`n` 単打 + 次母音で確定）
  - ん + な行（な〜の）：複合トークン化（例：「んに」→ `["nni","nnni"]`）により `nni`/`nnni` 両入力を許容

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

- **Vercel** にデプロイ（GitHub 連携・`git push` で自動デプロイ）
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

### 型・構造ルール

- **① `any` 禁止**：型不明の場合は `unknown` を使い、型ガードで絞り込む
- **② `type` と `interface` の使い分け**：オブジェクト型 → `interface`、ユニオン型・関数型 → `type`
- **③ Props は `interface` で明示定義**：コンポーネントの Props はインラインで書かず必ず `interface` として定義する
- **④ named export を使う**：`export default` は避ける（IDE でのリネーム・インポート追跡のため）
- **⑤ `null` 禁止・`undefined` に統一**：DOM API が返す `null` のみ例外

### コメント規約

すべてのファイルに **Google スタイルの docstring** とインラインコメントを記載する。

```ts
/**
 * ひらがな文字列をローマ字に変換する。
 *
 * @param kana - 変換対象のひらがな文字列
 * @returns ローマ字文字列の候補リスト（複数パターン対応）
 * @example
 * toRomaji('ねこ') // => ['neko']
 */
export const toRomaji = (kana: string): string[] => { ... };
```

---

## 12. 今後の実装予定

- **バトルモード**：実装中（仕様確定済み・3-7 参照）
- **キャラクター画像**：仮絵文字から実画像へ差し替え
- **バトルモード モンスター画像**：256×256px PNG、当面絵文字で代用

## 13. 今後の拡張候補（現時点では対象外）

- オンラインランキング（DB連携が必要）
- タイムアタックモード
- モバイル対応キーボード最適化
