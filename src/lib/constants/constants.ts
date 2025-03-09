import { AppSettings, ColorTheme } from '../types';

// カラーテーマ設定のマッピング
export const COLOR_THEME_MAP: Record<ColorTheme, {
  mainColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  contrastColor?: string;
  highlightColor?: string;
}> = {
  coffee: {
    mainColor: '#B35C00',
    secondaryColor: '#FDE68A',
    accentColor: '#44403C',
    backgroundColor: '#FAFAF9',
    contrastColor: '#3D2C1E',
  },
  blue: {
    mainColor: '#1E40AF',
    secondaryColor: '#DBEAFE',
    accentColor: '#1E3A8A',
    backgroundColor: '#F8FAFC',
    contrastColor: '#0F172A',
  },
  green: {
    mainColor: '#15803D',
    secondaryColor: '#DCFCE7',
    accentColor: '#14532D',
    backgroundColor: '#F0FDF4',
    contrastColor: '#052e16',
  },
  popArt: {
    mainColor: '#FF40A0',
    secondaryColor: '#00D8E0',
    accentColor: '#FFE800',
    backgroundColor: '#FFFFFF',
    contrastColor: '#202A44',
    highlightColor: '#80FF00',
  },
  custom: {
    mainColor: '#000000',
    secondaryColor: '#CCCCCC',
    accentColor: '#666666',
    backgroundColor: '#FFFFFF',
    contrastColor: '#333333',
  },
};

// デフォルトのアプリケーション設定
export const DEFAULT_SETTINGS: AppSettings = {
  basic: {
    colorTheme: 'blue', // またはグラレコに適したカラーテーマ
    fontStyle: 'rounded', // グラレコに適したフォント
    layoutType: 'full',
    hasShadow: true,
    hasBorder: true,
    hasAnimation: true,
    textureType: 'paper', // グラレコは紙テクスチャが合う
    gradientType: 'none',
    designStyle: 'graphicRecordingNormal', // ここをgraphicRecordingNormalに変更
    summarizeText: false
  },
  colors: {
    mainColor: COLOR_THEME_MAP.coffee.mainColor,
    secondaryColor: COLOR_THEME_MAP.coffee.secondaryColor,
    accentColor: COLOR_THEME_MAP.coffee.accentColor,
    backgroundColor: COLOR_THEME_MAP.coffee.backgroundColor,
    contrastColor: COLOR_THEME_MAP.coffee.contrastColor,
    additionalColors: []
  },
  typography: {
    headingFont: 'serif',
    h1Size: 2.5,
    h1SizeUnit: 'rem',
    h2Size: 1.8,
    h2SizeUnit: 'rem',
    bodyFont: 'sans',
    bodySize: 1,
    bodySizeUnit: 'rem',
    lineHeight: 1.6,
    lineHeightUnit: 'unit',
    letterSpacing: 0,
    letterSpacingUnit: 'em',
    fontWeight: 400,
    textDecoration: {
      underlineColor: '',
      highlightColor: '',
      textOutline: false,
      textShadow: false
    }
  },
  layout: {
    maxWidth: 1200,
    maxWidthUnit: 'px',
    padding: {
      top: 2,
      right: 2,
      bottom: 2,
      left: 2
    },
    sectionSpacing: 2,
    sectionSpacingUnit: 'rem',
    borderRadius: 0.5,
    borderRadiusUnit: 'rem',
    columns: 1,
    framing: false
  },
  visualEffects: {
    iconStyle: 'simple',
    decorativeElements: [],
    speechBubbles: false,
    emphasizeTechniques: [],
    layerEffects: false,
    tiltEffects: false
  },
  additionalInstructions: `
# グラフィックレコーディング風スタイル
標準的なグラフィックレコーディングスタイル

## スタイル指示
# グラフィックレコーディング風インフォグラフィック変換プロンプト V2
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

## 全体的な指針
- 読み手が自然に視線を移動できる配置（Font Awesomeアイコンで視線誘導）
- 情報の階層と関連性を視覚的に明確化（階層ごとにアイコンのサイズや色を変える）
- 手書き風の要素とFont Awesomeアイコンを組み合わせて親しみやすさとプロフェッショナル感を両立
  `
};

// デザインスタイルの説明
export const DESIGN_STYLE_DESCRIPTIONS: Record<string, string> = {
  'standard': '標準的なWebデザイン。シンプルで読みやすいレイアウト',
  'textbook': '教科書風デザイン。見出しの番号付けや囲み枠、注釈などの学習資料的要素',
  'graphicRecording': 'グラフィックレコーディング風。手書きイラスト、図形、矢印、吹き出しを使った視覚的な情報整理',
  'magazine': '雑誌風レイアウト。大きな見出し、プルクオートなど雑誌的な要素',
  'handwritten': '手書き風デザイン。手描き感のあるフォントやイラスト',
  'minimalist': 'ミニマルデザイン。必要最小限の装飾と余白の活用',
  'corporate': 'ビジネス向けの整ったデザイン。プロフェッショナルな印象',
  'retro': 'レトロ/ビンテージ風。古風な要素や色使い',
  'childrenBook': '子供向け絵本風。明るい色使い、丸みを帯びた形、かわいらしい要素',
  'infographic': 'インフォグラフィック風。データ視覚化、チャート、アイコンを活用',
  'tech': 'ハイテク/デジタル風。シャープな線、暗めの背景、テクノロジー的な要素',
  'custom': 'カスタムデザイン。個別の指示に基づくスタイル'
};

// PopArt テーマのプリセット設定
export const POP_ART_PRESET: AppSettings = {
  basic: {
    colorTheme: 'popArt',
    fontStyle: 'rounded',
    layoutType: 'asymmetric',
    hasShadow: true,
    hasBorder: true,
    hasAnimation: true,
    textureType: 'dots',
    gradientType: 'linear',
    designStyle: 'standard', // デザインスタイル追加
    summarizeText: false // プリセットにも追加
  },
  colors: {
    mainColor: '#FF40A0',
    secondaryColor: '#00D8E0',
    accentColor: '#FFE800',
    backgroundColor: '#FFFFFF',
    contrastColor: '#202A44',
    highlightColor: '#80FF00',
    gradientStartColor: '#FF40A0',
    gradientEndColor: '#00D8E0',
    gradientDirection: 'to-br',
    additionalColors: [
      { id: '1', name: 'ライムグリーン', color: '#80FF00', purpose: 'アクセント' },
      { id: '2', name: 'クリームホワイト', color: '#FFFAF0', purpose: '背景' },
    ]
  },
  typography: {
    headingFont: 'rounded',
    h1Size: 3,
    h1SizeUnit: 'rem',
    h2Size: 2.2,
    h2SizeUnit: 'rem',
    bodyFont: 'sans',
    bodySize: 1.1,
    bodySizeUnit: 'rem',
    lineHeight: 1.8,
    lineHeightUnit: 'unit',
    letterSpacing: 0.02,
    letterSpacingUnit: 'em',
    fontWeight: 600,
    textDecoration: {
      underlineColor: '#00D8E0',
      highlightColor: '#FFE800',
      textOutline: true,
      textShadow: true
    }
  },
  layout: {
    maxWidth: 1920,
    maxWidthUnit: 'px',
    padding: {
      top: 3,
      right: 3,
      bottom: 3,
      left: 3
    },
    sectionSpacing: 3,
    sectionSpacingUnit: 'rem',
    borderRadius: 1,
    borderRadiusUnit: 'rem',
    columns: 3,
    framing: true
  },
  visualEffects: {
    iconStyle: 'rounded',
    decorativeElements: ['dots', 'zigzag', 'triangle', 'doodle'],
    speechBubbles: true,
    emphasizeTechniques: ['speedLines', 'emotionLines', 'radialLines'],
    layerEffects: true,
    tiltEffects: true
  },
  additionalInstructions: '明るく活気あるポップアートスタイルのデザインで、視覚的なインパクトを重視してください。装飾要素を効果的に使い、遊び心のある表現を心がけてください。文字サイズは大きめに設定し、カラフルな色使いで視認性を高めてください。'
};

// 教科書風プリセット
export const TEXTBOOK_PRESET: Partial<AppSettings> = {
  basic: {
    colorTheme: 'blue',
    fontStyle: 'serif',
    layoutType: 'centered',
    hasShadow: false,
    hasBorder: true,
    hasAnimation: false,
    textureType: 'paper',
    gradientType: 'none',
    designStyle: 'textbook',
    summarizeText: false
  },
  colors: {
    mainColor: '#1A365D',
    secondaryColor: '#EBF8FF',
    accentColor: '#2B6CB0',
    backgroundColor: '#FFFFFF',
    contrastColor: '#1A202C',
  },
  typography: {
    headingFont: 'serif',
    bodyFont: 'serif',
    h1Size: 2.5,
    h1SizeUnit: 'rem',
    h2Size: 1.8,
    h2SizeUnit: 'rem',
    bodySize: 1,
    bodySizeUnit: 'rem',
    lineHeight: 1.8,
    lineHeightUnit: 'unit',
    letterSpacing: 0.01,
    fontWeight: 400
  },
  layout: {
    maxWidth: 800,
    maxWidthUnit: 'px',
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    sectionSpacing: 0,
    sectionSpacingUnit: 'rem',
    borderRadius: 0,
    borderRadiusUnit: 'rem',
    columns: 1,
    framing: true
  },
  visualEffects: {
    iconStyle: 'simple',
    decorativeElements: [],
    speechBubbles: false,
    emphasizeTechniques: [],
    layerEffects: false,
    tiltEffects: false
  },
  additionalInstructions: '教科書風のレイアウトで、見出しには番号を付け、重要な部分は囲み枠を使用してください。脚注や参考情報はページの下部に配置し、章や節の構造を明確にしてください。図表には番号と説明を付けてください。'
};

// グラフィックレコーディング風プリセット
export const GRAPHIC_RECORDING_PRESET: Partial<AppSettings> = {
  basic: {
    colorTheme: 'custom',
    fontStyle: 'script',
    layoutType: 'full',
    hasShadow: true,
    hasBorder: false,
    hasAnimation: true,
    textureType: 'paper',
    gradientType: 'none',
    designStyle: 'graphicRecordingNormal',
    summarizeText: true
  },
  colors: {
    mainColor: '#2D3748',
    secondaryColor: '#FEEBC8',
    accentColor: '#DD6B20',
    backgroundColor: '#FFFAF0',
    contrastColor: '#1A202C',
    additionalColors: [
      { id: '1', name: 'アクセント1', color: '#3182CE', purpose: '図形・矢印' },
      { id: '2', name: 'アクセント2', color: '#38A169', purpose: 'キーワード強調' },
      { id: '3', name: 'アクセント3', color: '#E53E3E', purpose: '重要ポイント' },
    ]
  },
  typography: {
    headingFont: 'script',
    bodyFont: 'script',
    h1Size: 2.5,
    h1SizeUnit: 'rem',
    h2Size: 2,
    h2SizeUnit: 'rem',
    bodySize: 1,
    bodySizeUnit: 'rem',
    lineHeight: 1.5,
    lineHeightUnit: 'unit',
    letterSpacing: 0.02,
    fontWeight: 500,
    textDecoration: {
      underlineColor: '#DD6B20',
      textOutline: true,
      textShadow: false
    }
  },
  layout: {
    columns: 3,
    maxWidth: 1900,
    maxWidthUnit: 'px',
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    sectionSpacing: 0,
    sectionSpacingUnit: 'rem',
    borderRadius: 0,
    borderRadiusUnit: 'rem',
  },
  visualEffects: {
    iconStyle: 'detailed',
    decorativeElements: ['dots', 'zigzag', 'doodle'],
    speechBubbles: true,
    emphasizeTechniques: ['emotionLines'],
    layerEffects: true,
    tiltEffects: true
  },
  additionalInstructions: `グラフィックレコーディング風:
  超一流デザイナーが作成したような、日本語で完璧なグラフィックレコーディング風のHTMLインフォグラフィックに変換してください。情報設計とビジュアルデザインの両面で最高水準を目指します 手書き風の図形やアイコンを活用して内容を視覚的に表現します。
- 左上から右へ、上から下へと情報を順次配置
- カード型コンポーネント：白背景、角丸12px、微細シャドウ
- セクション間の適切な余白と階層構造
- 適切にグラスモーフィズムを活用
- 手描き風の囲み線、矢印、バナー、吹き出し
- テキストと視覚要素（アイコン、シンプルな図形）の組み合わせ
- キーワードの強調（色付き下線、マーカー効果）
- 関連する概念を線や矢印で接続
- 絵文字やアイコン、Font Awesomeを効果的に配置（✏️📌📝🔍📊など）
- テキストと視覚要素のバランスを重視
- キーワードを囲み線や色で強調
- 簡易的なアイコンや図形で概念を視覚化
- 数値データは簡潔なグラフや図表で表現
- 接続線や矢印で情報間の関係性を明示
- 余白を効果的に活用して視認性を確保
- 読み手が自然に視線を移動できる配置
- 情報の階層と関連性を視覚的に明確化
- 手書き風の要素で親しみやすさを演出
- 視覚的な記憶に残るデザイン`
};

// 雑誌風プリセット
export const MAGAZINE_PRESET: Partial<AppSettings> = {
  basic: {
    colorTheme: 'custom',
    fontStyle: 'mixed',
    layoutType: 'asymmetric',
    hasShadow: true,
    hasBorder: true,
    hasAnimation: false,
    textureType: 'none',
    gradientType: 'none',
    designStyle: 'magazine',
    summarizeText: false
  },
  colors: {
    mainColor: '#1A1A1A',
    secondaryColor: '#F5F5F5',
    accentColor: '#E53E3E',
    backgroundColor: '#FFFFFF',
    contrastColor: '#1A1A1A',
  },
  typography: {
    headingFont: 'serif',
    h1Size: 3.5,
    h1SizeUnit: 'rem',
    h2Size: 2.5,
    h2SizeUnit: 'rem',
    bodyFont: 'serif',
    bodySize: 1.2,
    bodySizeUnit: 'rem',
    lineHeight: 1.6,
    letterSpacing: 0.02,
    fontWeight: 400,
    textDecoration: {
      underlineColor: '#E53E3E'
    },
    lineHeightUnit: 'rem'
  },
  layout: {
    columns: 2,
    maxWidth: 1200,
    maxWidthUnit: 'px',
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    sectionSpacing: 0,
    sectionSpacingUnit: 'rem',
    borderRadius: 0,
    borderRadiusUnit: 'rem',
  },
  additionalInstructions: '雑誌風のレイアウトで、大きな見出しと引用を目立たせてください。段組みを効果的に使い、視線の流れを意識したデザインにしてください。見出しと本文でフォントを使い分け、適宜プルクオート（大きな引用）を挿入してください。余白を効果的に使って情報を整理してください。'
};

// 手書き風プリセット
export const HANDWRITTEN_PRESET: Partial<AppSettings> = {
  basic: {
    colorTheme: 'custom',
    fontStyle: 'script',
    layoutType: 'full',
    hasShadow: false,
    hasBorder: true,
    hasAnimation: false,
    textureType: 'paper',
    gradientType: 'none',
    designStyle: 'handwritten',
    summarizeText: true
  },
  colors: {
    mainColor: '#2D3748',
    secondaryColor: '#FFF9C4',
    accentColor: '#4A5568',
    backgroundColor: '#FFFEF2',
    contrastColor: '#1A202C',
  },
  typography: {
    headingFont: 'script',
    bodyFont: 'script',
    lineHeight: 1.6,
    letterSpacing: 0.05,
    fontWeight: 400,
    h1Size: 0,
    h1SizeUnit: 'rem',
    h2Size: 0,
    h2SizeUnit: 'rem',
    bodySize: 0,
    bodySizeUnit: 'rem',
    lineHeightUnit: 'rem'
  },
  visualEffects: {
    decorativeElements: ['doodle'],
    speechBubbles: true,
    layerEffects: false
  },
  additionalInstructions: '手書き風のデザインで、不規則な配置と自然なずれを表現してください。メモ用紙やノートのような背景テクスチャを使い、手描き感のある線や矢印を活用してください。付箋やテープのような装飾要素を加えて、自然な色ムラや不完全さを感じさせるデザインにしてください。'
};

// ミニマルデザインプリセット
export const MINIMALIST_PRESET: Partial<AppSettings> = {
  basic: {
    colorTheme: 'custom',
    fontStyle: 'sans',
    layoutType: 'centered',
    hasShadow: false,
    hasBorder: false,
    hasAnimation: false,
    textureType: 'none',
    gradientType: 'none',
    designStyle: 'minimalist',
    summarizeText: true
  },
  colors: {
    mainColor: '#171717',
    secondaryColor: '#F5F5F5',
    accentColor: '#404040',
    backgroundColor: '#FFFFFF',
    contrastColor: '#0A0A0A',
  },
  typography: {
    headingFont: 'sans',
    bodyFont: 'sans',
    h1Size: 2,
    h2Size: 1.5,
    lineHeight: 1.5,
    letterSpacing: 0.01,
    fontWeight: 300,
    h1SizeUnit: 'rem',
    h2SizeUnit: 'rem',
    bodySize: 0,
    bodySizeUnit: 'rem',
    lineHeightUnit: 'rem'
  },
  layout: {
    maxWidth: 768,
    padding: {
      top: 4,
      right: 4,
      bottom: 4,
      left: 4
    },
    borderRadius: 0,
    maxWidthUnit: 'rem',
    sectionSpacing: 0,
    sectionSpacingUnit: 'rem',
    borderRadiusUnit: 'rem'
  },
  additionalInstructions: 'ミニマルなデザインで、余白を多く取り、必要最小限の要素だけを使ってください。装飾は控えめにし、シンプルな線と形だけを使います。フォントは軽めの太さで統一し、色使いもモノクロを基調としてください。コンテンツが引き立つようなクリーンなデザインを心がけてください。'
};

// 子供向け絵本風プリセット
export const CHILDREN_BOOK_PRESET: Partial<AppSettings> = {
  basic: {
    colorTheme: 'custom',
    fontStyle: 'rounded',
    layoutType: 'asymmetric',
    hasShadow: true,
    hasBorder: true,
    hasAnimation: true,
    textureType: 'dots',
    gradientType: 'none',
    designStyle: 'childrenBook',
    summarizeText: true
  },
  colors: {
    mainColor: '#1E88E5',
    secondaryColor: '#FFF176',
    accentColor: '#FF8A65',
    backgroundColor: '#E3F2FD',
    contrastColor: '#0D47A1',
    additionalColors: [
      { id: '1', name: 'ピンク', color: '#F06292', purpose: 'アクセント' },
      { id: '2', name: 'グリーン', color: '#81C784', purpose: 'アクセント' },
    ]
  },
  typography: {
    headingFont: 'rounded',
    bodyFont: 'rounded',
    h1Size: 2.8,
    h2Size: 2,
    bodySize: 1.2,
    lineHeight: 1.6,
    fontWeight: 500,
    h1SizeUnit: 'rem',
    h2SizeUnit: 'rem',
    bodySizeUnit: 'rem',
    lineHeightUnit: 'rem'
  },
  visualEffects: {
    iconStyle: 'rounded',
    decorativeElements: ['dots', 'doodle'],
    speechBubbles: true
  },
  additionalInstructions: '子供向け絵本風のかわいらしいデザインで、丸みを帯びたフォントと形状を使ってください。明るく鮮やかな色使いで、カラフルで楽しい雰囲気を演出し、大きなテキストサイズで読みやすくしてください。かわいらしいイラストや吹き出しを効果的に使って、親しみやすさを感じさせるデザインにしてください。'
};

// インフォグラフィック風プリセット
export const INFOGRAPHIC_PRESET: Partial<AppSettings> = {
  basic: {
    colorTheme: 'custom',
    fontStyle: 'sans',
    layoutType: 'full',
    hasShadow: true,
    hasBorder: true,
    hasAnimation: true,
    textureType: 'none',
    gradientType: 'linear',
    designStyle: 'infographic',
    summarizeText: false
  },
  colors: {
    mainColor: '#0077B6',
    secondaryColor: '#90E0EF',
    accentColor: '#FF9F1C',
    backgroundColor: '#F8F9FA',
    contrastColor: '#03045E',
    gradientStartColor: '#0077B6',
    gradientEndColor: '#00B4D8',
    gradientDirection: 'to-br'
  },
  typography: {
    headingFont: 'sans',
    bodyFont: 'sans',
    bodySize: 0.9,
    h1Size: 2.2,
    h2Size: 1.8,
    fontWeight: 600,
    h1SizeUnit: 'rem',
    h2SizeUnit: 'rem',
    bodySizeUnit: 'rem',
    lineHeight: 0,
    lineHeightUnit: 'rem'
  },
  layout: {
    columns: 3,
    borderRadius: 0.8,
    maxWidth: 0,
    maxWidthUnit: 'rem',
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    sectionSpacing: 0,
    sectionSpacingUnit: 'rem',
    borderRadiusUnit: 'rem'
  },
  visualEffects: {
    iconStyle: 'detailed',
    decorativeElements: ['dots'],
    emphasizeTechniques: ['radialLines'],
    layerEffects: true
  },
  additionalInstructions: 'インフォグラフィック風のデザインで、データを視覚的に表現してください。アイコン、グラフ、チャートを効果的に使い、情報の階層を明確にしてください。数字や統計を大きく表示し、矢印や線でつながりを示してください。情報を小さなセクションに分け、視覚的に整理された形で伝えられるようにしてください。'
};

// ハイテク/デジタル風プリセット
export const TECH_PRESET: Partial<AppSettings> = {
  basic: {
    colorTheme: 'custom',
    fontStyle: 'sans',
    layoutType: 'asymmetric',
    hasShadow: true,
    hasBorder: true,
    hasAnimation: true,
    textureType: 'grid',
    gradientType: 'radial',
    designStyle: 'tech',
    summarizeText: false
  },
  colors: {
    mainColor: '#0EE6B7',
    secondaryColor: '#111827',
    accentColor: '#3B82F6',
    backgroundColor: '#030712',
    contrastColor: '#F9FAFB',
    gradientStartColor: '#111827',
    gradientEndColor: '#1F2937'
  },
  typography: {
    headingFont: 'sans',
    bodyFont: 'sans',
    lineHeight: 1.5,
    fontWeight: 500,
    letterSpacing: 0.05,
    textDecoration: {
      textShadow: true
    },
    h1Size: 0,
    h1SizeUnit: 'rem',
    h2Size: 0,
    h2SizeUnit: 'rem',
    bodySize: 0,
    bodySizeUnit: 'rem',
    lineHeightUnit: 'rem'
  },
  layout: {
    borderRadius: 0.25,
    maxWidth: 0,
    maxWidthUnit: 'rem',
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    sectionSpacing: 0,
    sectionSpacingUnit: 'rem',
    borderRadiusUnit: 'rem'
  },
  visualEffects: {
    emphasizeTechniques: ['radialLines'],
    layerEffects: true
  },
  additionalInstructions: 'ハイテク/デジタル風のデザインで、暗めの背景と明るく光るようなアクセントカラーを使用してください。シャープな線、未来的なグラフィック要素、グリッドパターンを取り入れ、テクノロジー的な雰囲気を作り出してください。情報はブロック状に整理し、LEDスクリーンやコンピューターインターフェースを想起させるようなデザイン要素を使ってください。'
};
