// グラレコメーカー用の型定義

// AIプロバイダータイプ
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'ollama' | 'openrouter';

// 利用可能なAIモデル
export type AIModelName = string;

// モデルの詳細情報
export interface AIModelInfo {
  id: string;           // モデルの識別子（API用）
  name: string;         // 表示名
  provider: AIProvider; // プロバイダー名
  isAdvanced?: boolean; // 上級モデルかどうか
  maxTokens?: number;   // 最大トークン数
  description?: string; // モデルの説明
}

// レガシータイプ互換性のため残す
export type AIModel = string;

// カラーテーマオプション
export type ColorTheme = 'coffee' | 'blue' | 'green' | 'popArt' | 'custom';

// フォントスタイルオプション
export type FontStyle = 'serif' | 'sans' | 'mixed' | 'display' | 'rounded' | 'script' | 'custom';

// レイアウトオプション
export type LayoutType = 'centered' | 'full' | 'sidebar' | 'asymmetric' | 'zigzag';

// 長さの単位
export type LengthUnit = 'rem' | 'px' | 'em' | '%' | 'unit' | 'percent';

// テクスチャオプション
export type TextureType = 'none' | 'paper' | 'noise' | 'grid' | 'dots';

// グラデーションタイプ
export type GradientType = 'none' | 'linear' | 'radial' | 'conic';

// グラデーション方向
export type GradientDirection = 'to-right' | 'to-left' | 'to-top' | 'to-bottom' | 
                               'to-tr' | 'to-tl' | 'to-br' | 'to-bl';

// デザインスタイル
export type DesignStyle = 
  | 'standard' 
  | 'graphicRecordingNormal'
  | 'graphicRecordingBusiness'
  | 'graphicRecordingAnimation'
  | 'textbook'
  | 'magazine'
  | 'handwritten'
  | 'minimalist'
  | 'childrenBook'
  | 'infographic'
  | 'tech'
  | 'popArt';

// APIプロバイダー
export type ApiProvider = 'openai' | 'anthropic' | 'google' | 'ollama' | 'openrouter';

// APIキー設定
export interface ApiKeySettings {
  provider: ApiProvider;
  key: string;
}

// スタイル設定の基本項目
export interface BasicSettings {
  colorTheme: ColorTheme;
  fontStyle: FontStyle;
  layoutType: LayoutType;
  hasShadow: boolean;
  hasBorder: boolean;
  hasAnimation: boolean;
  textureType?: TextureType;
  gradientType?: GradientType;
  designStyle: DesignStyle; // 追加: デザインスタイル
  summarizeText: boolean; // 要約機能フラグを追加
}

// カラー詳細設定
export interface ColorSettings {
  mainColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  contrastColor?: string;
  highlightColor?: string;
  additionalColors?: AdditionalColor[];
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientDirection?: GradientDirection;
}

// 追加カラー設定
export interface AdditionalColor {
  id: string;
  name: string;
  color: string;
  purpose?: string; // 用途（アクセント、背景など）
}

// タイポグラフィ詳細設定
export interface TypographySettings {
  headingFont: FontStyle;
  h1Size: number;
  h1SizeUnit: LengthUnit;
  h2Size: number;
  h2SizeUnit: LengthUnit;
  bodyFont: FontStyle;
  bodySize: number;
  bodySizeUnit: LengthUnit;
  lineHeight: number;
  lineHeightUnit: LengthUnit;
  letterSpacing?: number;
  letterSpacingUnit?: LengthUnit;
  fontWeight?: number;
  textDecoration?: TextDecorationSettings;
}

// テキスト装飾設定
export interface TextDecorationSettings {
  underlineColor?: string;
  highlightColor?: string;
  textOutline?: boolean;
  textShadow?: boolean;
}

// レイアウト詳細設定
export interface LayoutSettings {
  maxWidth: number;
  maxWidthUnit: LengthUnit;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  sectionSpacing: number;
  sectionSpacingUnit: LengthUnit;
  borderRadius: number;
  borderRadiusUnit: LengthUnit;
  columns?: number; // 1列～3列レイアウト
  framing?: boolean; // 装飾フレームの有無
}

// 視覚効果設定
export interface VisualEffectSettings {
  iconStyle?: 'simple' | 'detailed' | 'rounded';
  decorativeElements?: ('dots' | 'zigzag' | 'triangle' | 'doodle')[];
  speechBubbles?: boolean;
  emphasizeTechniques?: ('speedLines' | 'emotionLines' | 'radialLines')[];
  layerEffects?: boolean;
  tiltEffects?: boolean;
}

// 全体の設定
export interface AppSettings {
  basic: BasicSettings;
  colors: ColorSettings;
  typography: TypographySettings;
  layout: LayoutSettings;
  visualEffects?: VisualEffectSettings;
  additionalInstructions: string;
}

// プリセットオプション
export type PresetType = 'corporate' | 'casual' | 'minimal' | 'creative' | 'popArt' | 'custom';

// アプリケーションの表示モード
export type ViewMode = 'edit' | 'preview' | 'code';

// 設定パネルのタブ
export type SettingTab = 'style' | 'prompt';
