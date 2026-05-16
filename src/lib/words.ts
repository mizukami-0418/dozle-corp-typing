/**
 * ステージ別ワードデータ。
 * display: 画面表示用文字列、reading: ローマ字入力の基準読み
 *
 * 難易度分類基準：reading のひらがな文字数
 *   cheat   : 2〜4 文字
 *   normal  : 5〜8 文字
 *   hard    : 9〜12 文字
 *   kichiku : 13 文字以上（カッコ・記号含む全文字が入力対象）
 *
 * ワード制限時間は別途ローマ字文字数 × 難易度係数で算出する。
 */

import type { StageConfig } from "@/types";

export const STAGES: StageConfig[] = [
  // ──────────────────────────────────────────
  // チート（ひらがな 2〜4 文字）
  // ──────────────────────────────────────────
  {
    id: "cheat",
    name: "チートステージ",
    difficulty: "cheat",
    words: [
      // 草原・動物系
      { display: "ねこ", reading: "ねこ" },
      { display: "いぬ", reading: "いぬ" },
      { display: "そら", reading: "そら" },
      { display: "くさ", reading: "くさ" },
      { display: "はな", reading: "はな" },
      { display: "たいよう", reading: "たいよう" },
      { display: "つき", reading: "つき" },
      { display: "みず", reading: "みず" },
      { display: "やま", reading: "やま" },
      { display: "かわ", reading: "かわ" },
      { display: "もり", reading: "もり" },
      { display: "とり", reading: "とり" },
      { display: "うま", reading: "うま" },
      { display: "ひつじ", reading: "ひつじ" },
      { display: "ぶた", reading: "ぶた" },
      // 村人・アイテム系
      { display: "むら", reading: "むら" },
      { display: "いえ", reading: "いえ" },
      { display: "どあ", reading: "どあ" },
      { display: "まど", reading: "まど" },
      { display: "ベッド", reading: "べっど" },
      { display: "つるはし", reading: "つるはし" },
      { display: "おの", reading: "おの" },
      { display: "くわ", reading: "くわ" },
      { display: "たいまつ", reading: "たいまつ" },
      { display: "さかな", reading: "さかな" },
      { display: "パン", reading: "ぱん" },
      { display: "りんご", reading: "りんご" },
      { display: "にく", reading: "にく" },
      { display: "にんじん", reading: "にんじん" },
      // Minecraft（短いもの）
      { display: "ネザー", reading: "ねざー" },
      { display: "ゾンビ", reading: "ぞんび" },
      { display: "ウィザー", reading: "うぃざー" },
      { display: "スポーン", reading: "すぽーん" },
      { display: "焼き肉", reading: "やきにく" },
      // ドズル社関連（短いもの）
      { display: "ドズル", reading: "どずる" },
      { display: "おんりー", reading: "おんりー" },
      { display: "ドズル社", reading: "どずるしゃ" },
      { display: "ゴリラ", reading: "ごりら" },
      { display: "コラボ", reading: "こらぼ" },
      { display: "いなりー", reading: "いなりー" },
      { display: "仲間", reading: "なかま" },
      // ドズル社関連（新規追加）
      { display: "賭博", reading: "とばく" },
      { display: "うまい！", reading: "うまい!" },
      { display: "鉄千", reading: "てつせん" },
      { display: "絆", reading: "きずな" },
      { display: "8・8のMEN", reading: "8/8のMEN" },
      { display: "ペロおじ", reading: "ぺろおじ" },
      { display: "マイゴー", reading: "まいごー" },
      { display: "すずMEN", reading: "すずMEN" },
      { display: "いまおみ", reading: "いまおみ" },
      { display: "足元TNT", reading: "あしもとTNT" },
      { display: "いいね〜！", reading: "いいね~!" },
      { display: "やだぁ！", reading: "やだぁ!" },
      { display: "ムーして", reading: "むーして" },
      { display: "ここやね", reading: "ここやね" },
      { display: "カビゴ", reading: "かびご" },
      { display: "BONさん", reading: "BONさん" },
      { display: "MEN爺", reading: "MENじい" },
      { display: "ダブスイ", reading: "だぶすい" },
      { display: "ネコおじ", reading: "ねこおじ" },
      { display: "黒じい", reading: "くろじい" },
    ],
  },

  // ──────────────────────────────────────────
  // ノーマル（ひらがな 5〜8 文字）
  // ──────────────────────────────────────────
  {
    id: "normal",
    name: "ノーマルステージ",
    difficulty: "normal",
    words: [
      // Minecraft 用語
      { display: "クリーパー", reading: "くりーぱー" },
      {
        display: "エンダードラゴン",
        reading: "えんだーどらごん",
      },
      { display: "ダイヤモンド", reading: "だいやもんど" },
      {
        display: "エンドポータル",
        reading: "えんどぽーたる",
      },
      { display: "スケルトン", reading: "すけるとん" },
      { display: "エンダーマン", reading: "えんだーまん" },
      {
        display: "レッドストーン",
        reading: "れっどすとーん",
      },
      { display: "エンチャント", reading: "えんちゃんと" },
      { display: "バイオーム", reading: "ばいおーむ" },
      {
        display: "アドベンチャー",
        reading: "あどべんちゃー",
      },
      { display: "サバイバル", reading: "さばいばる" },
      { display: "じゃがいも", reading: "じゃがいも" },
      // ドズル社関連
      { display: "ぼんじゅうる", reading: "ぼんじゅうる" },
      { display: "おらふくん", reading: "おらふくん" },
      { display: "ユーチューブ", reading: "ゆーちゅーぶ" },
      {
        display: "マインクラフト",
        reading: "まいんくらふと",
      },
      { display: "ビッグボス", reading: "びっぐぼす" },
      { display: "MENフクロウ", reading: "MENふくろう" },
      {
        display: "スピードスター",
        reading: "すぴーどすたー",
      },
      {
        display: "ズボラな匠",
        reading: "ずぼらなたくみ",
      },
      {
        display: "グラサンバード",
        reading: "ぐらさんばーど",
      },
      {
        display: "雪だるまくん",
        reading: "ゆきだるまくん",
      },
      { display: "おともだち", reading: "おともだち" },
      {
        display: "ゲーミングハウス",
        reading: "げーみんぐはうす",
      },
      { display: "ディスコード", reading: "でぃすこーど" },
      { display: "アーカイブ", reading: "あーかいぶ" },
      { display: "オフィシャル", reading: "おふぃしゃる" },
      { display: "おおはらMEN", reading: "おおはらMEN" },
      // ドズル社関連（新規追加）
      { display: "ライジングサン", reading: "らいじんぐさん" },
      { display: "我無職ぞ", reading: "われむしょくぞ" },
      { display: "チャリーン", reading: "ちゃりーん" },
      { display: "美化しとんな", reading: "びかしとんな" },
      { display: "マローダー以下", reading: "まろーだーいか" },
      { display: "粉しいたけ", reading: "こなしいたけ" },
      { display: "ご武運を", reading: "ごぶうんを" },
      { display: "それでいうと", reading: "それでいうと" },
      { display: "ドズってる", reading: "どずってる" },
      { display: "おらこちゃん", reading: "おらこちゃん" },
      { display: "ウォーキング・B", reading: "うぉーきんぐ/B" },
      { display: "ビクトリー！", reading: "びくとりー!" },
      { display: "天秤くーー", reading: "てんびんくーー" },
      { display: "ロッキーくん", reading: "ろっきーくん" },
      { display: "おらふくんさん", reading: "おらふくんさん" },
      { display: "おんりーママ", reading: "おんりーまま" },
      { display: "CRコケコッコ", reading: "CRこけこっこ" },
      { display: "ドズル社TV", reading: "どずるしゃTV" },
      { display: "ドズルロス", reading: "どずるろす" },
      { display: "ドズぴ、おらぷ", reading: "どずぴ,おらぷ" },
      { display: "ありがたんじろう", reading: "ありがたんじろう" },
      { display: "鬼畜企画", reading: "きちくきかく" },
      { display: "かなちいです", reading: "かなちいです" },
      { display: "歯茎を見せるな", reading: "はぐきをみせるな" },
      { display: "急がばナナメ", reading: "いそがばななめ" },
      { display: "本かもわからん", reading: "ほんかもわからん" },
      { display: "週5焼肉", reading: "しゅう5やきにく" },
      { display: "分からんかぁ", reading: "わからんかぁ" },
      { display: "〇〇ですがな！", reading: "まるまるですがな!" },
      { display: "パンちぎりますね", reading: "ぱんちぎりますね" },
      { display: "ぼんさんぽ", reading: "ぼんさんぽ" },
      { display: "僕ぼっク", reading: "ぼくぼっく" },
      { display: "ビート板太郎", reading: "びーとばんたろう" },
      { display: "オデオコッタ", reading: "おでおこった" },
      { display: "ラビットドズル", reading: "らびっとどずる" },
      { display: "やさぐれおんりー", reading: "やさぐれおんりー" },
      { display: "健気ポイント", reading: "けなげぽいんと" },
      { display: "歯茎代行", reading: "はぐきだいこう" },
      { display: "マッスルだぞ", reading: "まっするだぞ" },
      { display: "おんりー22歳", reading: "おんりー22さい" },
      { display: "ハムスターがいる", reading: "はむすたーがいる" },
      { display: "ビンとカーン！", reading: "びんとかーん!" },
      { display: "じゃがいもから！", reading: "じゃがいもから!" },
      { display: "マグロだねぇ！", reading: "まぐろだねぇ!" },
      { display: "グッジョイ！", reading: "ぐっじょい!" },
      { display: "フライエッグ", reading: "ふらいえっぐ" },
      { display: "ワオキツネザル", reading: "わおきつねざる" },
      { display: "死亡確定", reading: "しぼうかくてい" },
      { display: "はよ見ろやぁ", reading: "はよみろやぁ" },
      { display: "おんメモリー", reading: "おんめもりー" },
      { display: "見るかもわからん", reading: "みるかもわからん" },
      { display: "こんちゃっちゃ", reading: "こんちゃっちゃ" },
      { display: "はよ来いやぁ", reading: "はよこいやぁ" },
      { display: "おらリッシュ", reading: "おらりっしゅ" },
      { display: "次は・・・はたらく？", reading: "つぎは///はたらく?" },
      { display: "スパイボーイズ", reading: "すぱいぼーいず" },
      { display: "ナマケモノドズル", reading: "なまけものどずる" },
      { display: "オッケケノケー", reading: "おっけけのけー" },
      { display: "ドズルない", reading: "どずるない" },
      { display: "りーの一族", reading: "りーのいちぞく" },
      { display: "揚げ足トリオ", reading: "あげあしとりお" },
      { display: "マジレスカナブン", reading: "まじれすかなぶん" },
      { display: "あ〜いつさくらんぼ〜！", reading: "あ~いつさくらんぼ~!" },
      { display: "おいちゃん", reading: "おいちゃん" },
      { display: "週3馬刺し", reading: "しゅう3ばさし" },
      { display: "お賃金", reading: "おちんぎん" },
      { display: "ズライオン", reading: "ずらいおん" },
      { display: "歯茎トリオ", reading: "はぐきとりお" },
      { display: "ほぼおんりー", reading: "ほぼおんりー" },
      { display: "スパイスボーイズ", reading: "すぱいすぼーいず" },
      { display: "筋肉筋肉", reading: "きんにくきんにく" },
      { display: "OKパスタまかセロリ", reading: "OKぱすたまかせろり" },
      { display: "ダチョウは2度刺す！", reading: "だちょうは2どさす!" },
      { display: "不安煽り虫", reading: "ふあんあおりむし" },
      { display: "ハンバーーーグ！", reading: "はんばーーーぐ!" },
      { display: "ひとつと半！", reading: "ひとつとはん!" },
      { display: "そろそろするか・・・", reading: "そろそろするか///" },
    ],
  },

  // ──────────────────────────────────────────
  // ハード（ひらがな 9〜12 文字）
  // ──────────────────────────────────────────
  {
    id: "hard",
    name: "ハードステージ",
    difficulty: "hard",
    words: [
      {
        display: "ロジカルゴリラ社長",
        reading: "ろじかるごりらしゃちょう",
      }, // 12
      {
        display: "おまえはもうしんでいる",
        reading: "おまえはもうしんでいる",
      }, // 11
      {
        display: "エンダードラゴンを倒せ!",
        reading: "えんだーどらごんをたおせ!",
      }, // 12
      // ドズル社関連（新規追加）
      { display: "じゃじゃーんすっぞ", reading: "じゃじゃーんすっぞ" }, // 9
      { display: "改造ファンカーゴ", reading: "かいぞうふぁんかーご" }, // 10
      { display: "ベットベットパタパッタ", reading: "べっとべっとぱたぱった" }, // 11
      { display: "誰でもできますねぇ", reading: "だれでもできますねぇ" }, // 10
      { display: "ちょいちょいクラロワ", reading: "ちょいちょいくらろわ" }, // 10
      {
        display: "ドズル・ゴリラ・ゴリラ・ドズル",
        reading: "どずる/ごりら/ごりら/どずる",
      }, // 12
      { display: "高圧洗浄", reading: "こうあつせんじょう" }, // 9
      { display: "俺じゃなきゃ死んでたぞ", reading: "おれじゃなきゃしんでたぞ" }, // 12
      { display: "無敵のぼんじゅうる", reading: "むてきのぼんじゅうる" }, // 10
      {
        display: "ドズンゲリオン　発進!",
        reading: "どずんげりおんはっしん!",
      }, // 11
      { display: "お嬢様鬼ごっこ", reading: "おじょうさまおにごっこ" }, // 11
      { display: "こ、この声は神様!", reading: "こ,このこえはかみさま!" }, // 10
      { display: "クッキークリッカー", reading: "くっきーくりっかー" }, // 9
      { display: "おデブに感謝しな", reading: "おでぶにかんしゃしな" }, // 10
      { display: "ネザー生まれエンド育ち", reading: "ねざーうまれえんどそだち" }, // 12
      {
        display: "マイクラバーサス無双MVP",
        reading: "まいくらばーさすむそうMVP",
      }, // 11
      { display: "俺だったら死んでたぞ", reading: "おれだったらしんでたぞ" }, // 11
      { display: "モツですホルモンです", reading: "もつですほるもんです" }, // 10
      { display: "カロリー爆弾喰らえ!", reading: "かろりーばくだんくらえ!" }, // 11
      { display: "小太り三人衆", reading: "こぶとりさんにんしゅう" }, // 11
      { display: "大富豪おじいちゃん", reading: "だいふごうおじいちゃん" }, // 11
      { display: "プロマインクラフター", reading: "ぷろまいんくらふたー" }, // 10
      { display: "今回の骸は!", reading: "こんかいのむくろは!" }, // 9
      { display: "ハムスター先輩", reading: "はむすたーせんぱい" }, // 9
      { display: "凡人かぼんじゅうるか", reading: "ぼんじんかぼんじゅうるか" }, // 12
      { display: "ヘッドにキャロット", reading: "へっどにきゃろっと" }, // 9
      { display: "不死的ピョン人形", reading: "ふしてきぴょんにんぎょう" }, // 12
      { display: "ちょろちょろドズル", reading: "ちょろちょろどずる" }, // 9
      { display: "ドズル社スクランブル", reading: "どずるしゃすくらんぶる" }, // 11
      {
        display: "おんりー100万人達成",
        reading: "おんりー100まんにんたっせい",
      }, // 11
      { display: "自由の中の不自由", reading: "じゆうのなかのふじゆう" }, // 11
      { display: "龍の尻尾みたい!", reading: "りゅうのしっぽみたい!" }, // 10
      { display: "恋愛はパチンコ", reading: "れんあいはぱちんこ" }, // 9
      { display: "おらふくんは悪くないよ", reading: "おらふくんはわるくないよ" }, // 12
      { display: "ひまわり耐久", reading: "ひまわりたいきゅう" }, // 9
      { display: "ドズル社最高!", reading: "どずるしゃさいこう!" }, // 9
      { display: "全肯定男の子", reading: "ぜんこうていおとこのこ" }, // 11
      { display: "マイゴット少年", reading: "まいごっとしょうねん" }, // 10
      { display: "かずのこ大好きマン", reading: "かずのこだいすきまん" }, // 10
      { display: "セミさんが永ミーン", reading: "せみさんがえいみーん" }, // 10
      { display: "おじさん間引き事件", reading: "おじさんまびきじけん" }, // 10
      { display: "ノンデリおらふくん", reading: "のんでりおらふくん" }, // 9
      { display: "ひみつのしーでござるよ", reading: "ひみつのしーでござるよ" }, // 11
      { display: "ぼんさん何してんすか", reading: "ぼんさんなにしてんすか" }, // 11
      { display: "切り抜きかもわからん", reading: "きりぬきかもわからん" }, // 10
      { display: "誰でも見れますねぇ", reading: "だれでもみれますねえ" }, // 10
    ],
  },

  // ──────────────────────────────────────────
  // 鬼畜（ひらがな 13 文字以上・カッコ等含む全文字入力）
  // ──────────────────────────────────────────
  {
    id: "kichiku",
    name: "鬼畜ステージ",
    difficulty: "kichiku",
    words: [
      {
        display: "(心やさしい)卑怯者",
        reading: "(こころやさしい)ひきょうもの",
      }, // 13
      {
        display: "あなたの心を狙い撃ち",
        reading: "あなたのこころをねらいうち",
      }, // 13
      {
        display: "これがドズル社の力だ",
        reading: "これがどずるしゃのちからだ",
      }, // 13
      {
        display: "マインクラフトは人生だ",
        reading: "まいんくらふとはじんせいだ",
      }, // 13
      {
        display: "ドズル社の動画をみてくれ",
        reading: "どずるしゃのどうがをみてくれ",
      }, // 14
      {
        display: "おんりーのスピードはまじやばい",
        reading: "おんりーのすぴーどはまじやばい",
      }, // 15
      {
        display: "おおはらMENの匠の技をみよ",
        reading: "おおはらMENのたくみわざをみよ",
      }, // 15
      {
        display: "全員集合!ドズル社の時間だ!",
        reading: "ぜんいんしゅうごう!どずるしゃのじかんだ!",
      }, // 19
      {
        display: "おらふくんの雪だるまがかわいすぎる",
        reading: "おらふくんのゆきだるまがかわいすぎる",
      }, // 18
      {
        display: "ぼんじゅうるは卑怯だけど心はやさしい",
        reading: "ぼんじゅうるはひきょうだけどこころはやさしい",
      }, // 22
      // ドズル社関連（新規追加）
      {
        display: "お前牛乳俺ダイヤ",
        reading: "おまえぎゅうにゅうおれだいや",
      }, // 14
      {
        display: "拙者そんなものには媚びん!",
        reading: "せっしゃそんなものにはこびん!",
      }, // 14
      {
        display: "俺の引越しセンター返せよ!",
        reading: "おれのひっこしせんたーかえせよ!",
      }, // 15
      {
        display: "一旦八本一旦木綿",
        reading: "いったんはっぽんいったんもめん",
      }, // 15
      {
        display: "これね、ミキプルーンの苗木",
        reading: "これね,みきぷるーんのなえぎ",
      }, // 13
      {
        display: "チューリップを抜いたからには命をかけろよ",
        reading: "ちゅーりっぷをぬいたからにはいのちをかけろよ",
      }, // 22
      {
        display: "エンドラの首は俺のもんだぁ!",
        reading: "えんどらのくびはおれのもんだぁ!",
      }, // 15
      {
        display: "ってドズルさんが言ってました",
        reading: "ってどずるさんがいってました",
      }, // 14
      {
        display: "焦げじゃねぇブリュレって呼べ",
        reading: "こげじゃねぇぶりゅれってよべ",
      }, // 14
      {
        display: "今日もマッチョが売れないわ",
        reading: "きょうもまっちょがうれないわ",
      }, // 14
      {
        display: "ちょっとした重大発表",
        reading: "ちょっとしたじゅうだいはっぴょう",
      }, // 16
      {
        display: "手持ちは少なく心は広く",
        reading: "てもちはすくなくこころはひろく",
      }, // 15
      {
        display: "いつものことじゃないですか",
        reading: "いつものことじゃないですか",
      }, // 13
      {
        display: "ドズル社カスタマーサポートです",
        reading: "どずるしゃかすたまーさぽーとです",
      }, // 16
      {
        display: "マリーザ生きててくれてありがとう",
        reading: "まりーざいきててくれてありがとう",
      }, // 16
      {
        display: "エンドラ倒す方が簡単じゃない？",
        reading: "えんどらたおすほうがかんたんじゃない?",
      }, // 18
      {
        display: "空気清浄機ウィーン!",
        reading: "くうきせいじょうきうぃーん!",
      }, // 13
      {
        display: "地球だってちょっと楕円だから",
        reading: "ちきゅうだってちょっとだえんだから",
      }, // 17
      {
        display: "チームの失敗は成長に繋がらない",
        reading: "ちーむのしっぱいはせいちょうにつながらない",
      }, // 21
      {
        display: "僕はあなたのお母さんではありませんよ!",
        reading: "ぼくはあなたのおかあさんではありませんよ!",
      }, // 20
      {
        display: "こいつの性格終わってやがる!",
        reading: "こいつのせいかくおわってやがる!",
      }, // 15
      {
        display: "配信界の下ネタ自動販売機",
        reading: "はいしんかいのしもねたじどうはんばいき",
      }, // 19
      {
        display: "あなたがいるところが中心",
        reading: "あなたがいるところがちゅうしん",
      }, // 15
      {
        display: "安心安全信頼実績 預けるだけで幸福を",
        reading: "あんしんあんぜんしんらいじっせきあずけるだけでこうふくを",
      }, // 27
      {
        display: "お前遊びとちゃうぞ真剣にやれよ",
        reading: "おまえあそびとちゃうぞしんけんにやれよ",
      }, // 19
      {
        display: "抱いた事ねえだろ、ドズルをよ",
        reading: "だいたことねえだろ,どずるをよ",
      }, // 14
      {
        display: "パスポートの有効期限切れてました",
        reading: "ぱすぽーとのゆうこうきげんきれてました",
      }, // 19
      {
        display: "セミと雪女のラブロマンスやめて",
        reading: "せみとゆきおんなのらぶろまんすやめて",
      }, // 18
      {
        display: "ぼんじゅうるぼんじゅうるだどーもです",
        reading: "ぼんじゅうるぼんじゅうるだどーもです",
      }, // 18
      {
        display: "はーいおつです、おおはらです",
        reading: "はーいおつです,おおはらです",
      }, // 13
    ],
  },
];

/** ステージIDからステージ設定を取得する */
export const getStageById = (id: string): StageConfig | undefined =>
  STAGES.find((s) => s.id === id);
