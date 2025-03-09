import { AppSettings } from '@/lib/types';
import { 
  DEFAULT_SETTINGS, 
  GRAPHIC_RECORDING_PRESET,
  TEXTBOOK_PRESET,
  MAGAZINE_PRESET,
  HANDWRITTEN_PRESET,
  MINIMALIST_PRESET,
  CHILDREN_BOOK_PRESET,
  INFOGRAPHIC_PRESET,
  TECH_PRESET,
  POP_ART_PRESET
} from './constants';

export interface StyleDefinition {
  key: string;         // システム内部での識別子
  displayName: string; // 表示名
  description: string; // スタイルの説明
  prompt: string;      // AIプロンプト
  preset: Partial<AppSettings>; // 適用するプリセット
}

// グラレコ系のプリセットをベースにビジネス向けにカスタマイズ
const GRAPHIC_RECORDING_BUSINESS_PRESET: Partial<AppSettings> = {
  ...GRAPHIC_RECORDING_PRESET,
  // ビジネス向けにプリセットをカスタマイズする項目があれば上書き
};

// グラレコ系のプリセットをベースにアニメーション向けにカスタマイズ
const GRAPHIC_RECORDING_ANIMATION_PRESET: Partial<AppSettings> = {
  ...GRAPHIC_RECORDING_PRESET,
  // アニメーション向けにプリセットをカスタマイズする項目があれば上書き
};

// すべてのスタイル定義を一箇所で管理
export const STYLE_DEFINITIONS: { [key: string]: StyleDefinition } = {
  // 標準
  standard: {
    key: 'standard',
    displayName: '標準',
    description: '標準的なWebデザイン',
    prompt: '標準的なWebデザイン。シンプルで読みやすいレイアウトにしてください。',
    preset: DEFAULT_SETTINGS
  },
  
  // グラレコシリーズ
  graphicRecordingNormal: {
    key: 'graphicRecordingNormal',
    displayName: 'グラレコ-ノーマル',
    description: '標準的なグラフィックレコーディングスタイル',
    prompt: `# グラフィックレコーディング風インフォグラフィック変換プロンプト V2
## 目的
以下の内容を、超一流デザイナーが作成したような、日本語で完璧なグラフィックレコーディング風のHTMLインフォグラフィックに変換してください。情報設計とビジュアルデザインの両面で最高水準を目指します。
手書き風の図形やFont Awesomeアイコンを大きく活用して内容を視覚的かつ直感的に表現します。

## デザイン仕様
### 1. カラースキーム
<palette>
<color name='MysticLibrary-1' rgb='2E578C' r='46' g='87' b='140' />
<color name='MysticLibrary-2' rgb='182D40' r='24' g='45' b='64' />
<color name='MysticLibrary-3' rgb='BF807A' r='191' g='128' b='122' />
<color name='MysticLibrary-4' rgb='592A2A' r='89' g='42' b='42' />
<color name='MysticLibrary-5' rgb='F2F2F2' r='242' g='242' b='242' />
</palette>
### 2. グラフィックレコーディング要素
- 左上から右へ、上から下へと情報を順次配置
- 日本語の手書き風フォントの使用（Yomogi, Zen Kurenaido, Kaisei Decol）
- 手描き風の囲み線、矢印、バナー、吹き出し
- テキストと視覚要素（Font Awesomeアイコン、シンプルな図形）の組み合わせ
- Font Awesomeアイコンは各セクションの内容を表現するものを大きく（2x〜3x）表示
- キーワードごとに関連するFont Awesomeアイコンを隣接配置
- キーワードの強調（色付き下線、マーカー効果、Font Awesomeによる装飾）
- 関連する概念を線や矢印で接続し、接続部にもFont Awesomeアイコン（fa-arrow-right, fa-connection等）を挿入
- Font Awesomeアニメーション効果（fa-beat, fa-bounce, fa-fade, fa-flip, fa-shake, fa-spin）を適切に活用
- 重要なポイントには「fa-circle-exclamation」や「fa-lightbulb」などのアイコンを目立つ大きさで配置
- 数値やデータには「fa-chart-line」や「fa-percent」などの関連アイコンを添える
- 感情や状態を表すには表情アイコン（fa-face-smile, fa-face-frown等）を活用
- アイコンにホバー効果（色変化、サイズ変化）を付与
- 背景にはFont Awesomeの薄いパターンを配置（fa-shapes等を透過度を下げて配置）
### 3. アニメーション効果
- Font Awesomeアイコンに連動するアニメーション（fa-beat, fa-bounce, fa-fade等）
- 重要キーワード出現時のハイライト効果（グラデーション変化）
- 接続線や矢印の流れるようなアニメーション
- アイコンの回転・拡大縮小アニメーション（特に注目させたい箇所）
- 背景グラデーションの緩やかな変化
- スクロールに連動した要素の出現効果
- クリック/タップでアイコンが反応する効果
### 4. タイポグラフィ
- タイトル：32px、グラデーション効果、太字、Font Awesomeアイコンを左右に配置
- サブタイトル：16px、#475569、関連するFont Awesomeアイコンを添える
- セクション見出し：18px、# 1e40af、左側にFont Awesomeアイコンを必ず配置し、アイコンにはアニメーション効果
- 本文：14px、#334155、行間1.4、重要キーワードには関連するFont Awesomeアイコンを小さく添える
- フォント指定：
<style>
@ import url('https ://fonts.googleapis.com/css2?family=Kaisei+Decol&family=Yomogi&family=Zen+Kurenaido&display=swap');
@ import url('https ://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>
### 5. レイアウト
- ヘッダー：左揃えタイトル（大きなFont Awesomeアイコンを添える）＋右揃え日付/出典
- 3カラム構成：左側33%、中央33%、右側33%
- カード型コンポーネント：白背景、角丸12px、微細シャドウ、右上にFont Awesomeアイコンを配置
- セクション間の適切な余白と階層構造（階層を示すFont Awesomeアイコンを活用）
- 適切にグラスモーフィズムを活用（背後にぼかしたFont Awesomeアイコンを配置）
- 横幅は100%
- 重要な要素は中央寄り、補足情報は周辺部に配置
## グラフィックレコーディング表現技法
- テキストと視覚要素のバランスを重視（文字情報の50%以上をFont Awesomeアイコンで視覚的に補完）
- キーワードを囲み線や色で強調し、関連するFont Awesomeアイコンを必ず添える
- 概念ごとに最適なFont Awesomeアイコンを選定（抽象的な概念には複数の関連アイコンを組み合わせて表現）
- 数値データは簡潔なグラフや図表で表現し、データ種類に応じたFont Awesomeアイコン（fa-chart-pie, fa-chart-column等）を配置
- 接続線や矢印で情報間の関係性を明示し、関係性の種類に応じたアイコン（fa-link, fa-code-branch等）を添える
- 余白を効果的に活用して視認性を確保（余白にも薄いFont Awesomeパターンを配置可）
- コントラストと色の使い分けでメリハリを付け、カラースキームに沿ったアイコン色を活用
## Font Awesomeアイコン活用ガイドライン
- 概念カテゴリー別の推奨アイコン：
- 時間・順序：fa-clock, fa-hourglass, fa-calendar, fa-timeline
- 場所・位置：fa-location-dot, fa-map, fa-compass, fa-globe
- 人物・組織：fa-user, fa-users, fa-building, fa-sitemap
- 行動・活動：fa-person-running, fa-gears, fa-hammer, fa-rocket
- 思考・アイデア：fa-brain, fa-lightbulb, fa-thought-bubble, fa-comments
- 感情・状態：fa-face-smile, fa-face-sad-tear, fa-heart, fa-temperature-half
- 成長・変化：fa-seedling, fa-arrow-trend-up, fa-chart-line, fa-diagram-project
- 問題・課題：fa-triangle-exclamation, fa-circle-question, fa-bug, fa-ban
- 解決・成功：fa-check, fa-trophy, fa-handshake, fa-key
- アイコンサイズの使い分け：
- 主要概念：3x（fa-3x）
- 重要キーワード：2x（fa-2x）
- 補足情報：1x（標準サイズ）
- 装飾的要素：lg（fa-lg）
- アニメーション効果の適切な使い分け：
- 注目喚起：fa-beat, fa-shake
- 継続的プロセス：fa-spin, fa-pulse
- 状態変化：fa-flip, fa-fade
- 新規情報：fa-bounce
## 全体的な指針
- 読み手が自然に視線を移動できる配置（Font Awesomeアイコンで視線誘導）
- 情報の階層と関連性を視覚的に明確化（階層ごとにアイコンのサイズや色を変える）
- 手書き風の要素とFont Awesomeアイコンを組み合わせて親しみやすさとプロフェッショナル感を両立
- 大きなFont Awesomeアイコンを活用した視覚的な記憶に残るデザイン（各セクションに象徴的なアイコンを配置）
- フッターに出典情報と関連するFont Awesomeアイコン（fa-book, fa-citation等）を明記`,
    preset: GRAPHIC_RECORDING_PRESET
  },
  graphicRecordingBusiness: {
    key: 'graphicRecordingBusiness',
    displayName: 'グラレコ-ビジネス',
    description: 'ビジネス向けのグラフィックレコーディング',
    prompt: `ビジネス向けのグラフィックレコーディング。プロフェッショナルな雰囲気で、データと指標を視覚的に表現してください。
## デザイン仕様 
### 1. カラースキーム
<palette> <color name='ファッション-1' rgb='593C47' r='89' g='59' b='70' /> <color name='ファッション-2' rgb='F2E63D' r='242' g='230' b='60' /> <color name='ファッション-3' rgb='F2C53D' r='242' g='196' b='60' /> <color name='ファッション-4' rgb='F25C05' r='242' g='91' b='4' /> <color name='ファッション-5' rgb='F24405' r='242' g='68' b='4' /> </palette>
### 2. グラフィックレコーディング要素 
- 左上から右へ、上から下へと情報を順次配置 
- 日本語の手書き風フォントの使用（Yomogi, Zen Kurenaido, Kaisei Decol） 
- 手描き風の囲み線、矢印、バナー、吹き出し 
- テキストと視覚要素（アイコン、シンプルな図形、イラスト）の組み合わせ 
- キーワードの強調（色付き下線、マーカー効果） 
- 関連する概念を線や矢印で接続 
- イラストや絵文字やアイコンを効果的に配置（✏️📌📝🔍📊など） 
- 図形やイラストはベクトルデザインとする
### 3. タイポグラフィ 
- タイトル：32px、グラデーション効果、太字 
- サブタイトル：16px、#475569 
- セクション見出し：18px、#1e40af、アイコン付き 
- 本文：14px、#334155、行間1.4 
- フォント指定： <style> @import url('https://fonts.googleapis.com/css2?family=Kaisei+Decol&family=Yomogi&family=Zen+Kurenaido&display=swap'); </style>
### 4. レイアウト 
- ヘッダー：左揃えタイトル
- 各ページは16：9の比率のスライド構成とする
- １ページに収まらないときは複数ページで構成する
- レスポンシブデザインとする
- 横幅は100%とする
- カード型コンポーネント：白背景、角丸12px、微細シャドウ 
- セクション間の適切な余白と階層構造 
- 適切にグラスモーフィズムを活用 
## グラフィックレコーディング表現技法 
- テキストと視覚要素のバランスを重視 
- キーワードを囲み線や色で強調 
- 簡易的なアイコンや図形で概念を視覚化 
- 数値データは簡潔なグラフや図表で表現 
- 接続線や矢印で情報間の関係性を明示 
- 余白を効果的に活用して視認性を確保 

## 全体的な指針 
- 読み手が自然に視線を移動できる配置 
- 情報の階層と関連性を視覚的に明確化 
- 手書き風の要素で親しみやすさを演出 
- 視覚的な記憶に残るデザイン 
- フッターに出典情報を明記`,
    preset: GRAPHIC_RECORDING_BUSINESS_PRESET
  },
  graphicRecordingAnimation: {
    key: 'graphicRecordingAnimation',
    displayName: 'グラレコ-アニメーション',
    description: 'アニメーション要素を含むグラフィックレコーディング',
    prompt: `
## 目的
  以下の内容を、超一流デザイナーが作成したような、日本語で完璧なグラフィックレコーディング風のHTMLインフォグラフィックに変換してください。情報設計とビジュアルデザインの両面で最高水準を目指します
  手書き風の図形やアイコンを活用して内容を視覚的に表現します。
## デザイン仕様
### 1. カラースキーム
  <palette>
  <color name='ファッション-1' rgb='593C47' r='89' g='59' b='70' />
  <color name='ファッション-2' rgb='F2E63D' r='242' g='230' b='60' />
  <color name='ファッション-3' rgb='F2C53D' r='242' g='196' b='60' />
  <color name='ファッション-4' rgb='F25C05' r='242' g='91' b='4' />
  <color name='ファッション-5' rgb='F24405' r='242' g='68' b='4' />
  </palette>
### 2. グラフィックレコーディング要素
- 左上から右へ、上から下へと情報を順次配置
- 日本語の手書き風フォントの使用（Yomogi, Zen Kurenaido, Kaisei Decol）
- 手描き風の囲み線、矢印、バナー、吹き出し
- テキストと視覚要素（アイコン、シンプルな図形）の組み合わせ
- キーワードの強調（色付き下線、マーカー効果）
- 関連する概念を線や矢印で接続
- 絵文字やアイコンを効果的に配置（✏️📌📝🔍📊など）
### 3. タイポグラフィ
  - タイトル：32px、グラデーション効果、太字
  - サブタイトル：16px、#475569
  - セクション見出し：18px、#1e40af、アイコン付き
  - 本文：14px、#334155、行間1.4
  - フォント指定：
    @import url('https://fonts.googleapis.com/css2?family=Kaisei+Decol&family=Yomogi&family=Zen+Kurenaido&display=swap');
### 4. レイアウト
  - ヘッダー：左揃えタイトル＋右揃え日付/出典
  - 3カラム構成：左側33%、中央33%、右側33%
  - カード型コンポーネント：白背景、角丸12px、微細シャドウ
  - セクション間の適切な余白と階層構造
  - 適切にグラスモーフィズムを活用
  - 横幅は100%にして
## グラフィックレコーディング表現技法
- テキストと視覚要素のバランスを重視
- キーワードを囲み線や色で強調
- 簡易的なアイコンや図形で概念を視覚化
- 数値データは簡潔なグラフや図表で表現
- 接続線や矢印で情報間の関係性を明示
- 余白を効果的に活用して視認性を確保
## 全体的な指針
- 読み手が自然に視線を移動できる配置
- 情報の階層と関連性を視覚的に明確化
- 手書き風の要素で親しみやすさを演出
- 視覚的な記憶に残るデザイン
- フッターに出典情報を明記`,
    preset: GRAPHIC_RECORDING_ANIMATION_PRESET
  },
  
  // 従来のスタイル
  textbook: {
    key: 'textbook',
    displayName: '教科書風',
    description: '教科書のような整理された情報表示',
    prompt: `以下の内容を、日本語の教科書風に変換してください。
- 論理的かつ体系的に情報を整理し、読みやすい形式にまとめます。
- 見出し・段落・リストを適切に使用し、重要なポイントは太字や色で強調します。
- フォーマルな文体を採用し、学習者が理解しやすいように具体例や図表を適宜挿入してください。
- 情報の流れを意識し、基本的な概念から応用・発展へと段階的に説明してください。
- また、各章末には「まとめ」と「練習問題」を設け、理解を深める構成にしてください。

##デザイン仕様
#レイアウト
- 章タイトル（大見出し）：フォーマルなフォントを使用し、大きめのサイズ
- セクション見出し（中見出し）：統一されたデザインで視認性を確保
- 本文：14px、読みやすいフォントを使用し、適切な行間を設定
- 重要語句：太字や色（青や赤）で強調
- 図表やイラストを活用し、視覚的な理解をサポート
#構成
- 章単位の構成
-「章の導入」と「本文」、「文末」の3つの部分で構成する
#表現スタイル
- 明確で簡潔な文章を使用
- 難解な用語には適宜注釈を付ける
- 例や図を活用し、具体的なイメージを持たせる
- フッターに出典情報を明記
    `    
    
    
    ,
    preset: TEXTBOOK_PRESET
  },
  magazine: {
    key: 'magazine',
    displayName: '雑誌風',
    description: '雑誌のようなグラフィカルなレイアウト',
    prompt: '雑誌風のデザイン。興味を引くレイアウトと視覚的な要素を組み合わせて、魅力的な表現にしてください。',
    preset: MAGAZINE_PRESET
  },
  handwritten: {
    key: 'handwritten',
    displayName: '手書き風',
    description: '手書き風の温かみのあるデザイン',
    prompt: 'このテキスト内容を手書き風に表現してください。自然な筆致とカジュアルな雰囲気を持つデザインにしてください。',
    preset: HANDWRITTEN_PRESET
  },
  minimalist: {
    key: 'minimalist',
    displayName: 'ミニマリスト',
    description: 'シンプルで余計な装飾のないデザイン',
    prompt: 'ミニマルなデザインで内容を表現してください。余分な装飾を省き、本質的な情報に焦点を当ててください。',
    preset: MINIMALIST_PRESET
  },
  childrenBook: {
    key: 'childrenBook',
    displayName: '子供向け絵本風',
    description: '子供向けの親しみやすい絵本風デザイン',
    prompt: '子供向け絵本風のデザインにしてください。親しみやすいイラストと明るい色使いで内容を表現してください。',
    preset: CHILDREN_BOOK_PRESET
  },
  infographic: {
    key: 'infographic',
    displayName: 'インフォグラフィック風',
    description: 'データを視覚的に表現するインフォグラフィック',
    prompt: 'インフォグラフィック形式でデータを視覚化してください。グラフ、チャート、アイコンを活用して情報を整理してください。',
    preset: INFOGRAPHIC_PRESET
  },
  tech: {
    key: 'tech',
    displayName: 'ハイテク風',
    description: '先進的なテクノロジー風のデザイン',
    prompt: 'ハイテク風のデザインにしてください。近未来的な要素と洗練されたグラフィックで内容を表現してください。',
    preset: TECH_PRESET
  },
  popArt: {
    key: 'popArt',
    displayName: 'ポップアート風',
    description: '大胆で鮮やかなポップアート風デザイン',
    prompt: 'ポップアート風のデザインで表現してください。大胆な色使いと特徴的なグラフィック要素を取り入れてください。',
    preset: POP_ART_PRESET
  }
};

// スタイルキーの配列を取得するヘルパー関数
export const getStyleKeys = (): string[] => {
  return Object.keys(STYLE_DEFINITIONS);
};

// 指定されたスタイルの定義を取得するヘルパー関数
export const getStyleDefinition = (styleKey: string): StyleDefinition => {
  return STYLE_DEFINITIONS[styleKey] || STYLE_DEFINITIONS.standard;
};
