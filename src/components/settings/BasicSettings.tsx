import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppSettings, ColorTheme, TextureType, GradientType, DesignStyle } from '@/lib/types';
import { 
  COLOR_THEME_MAP, 
  DESIGN_STYLE_DESCRIPTIONS, 
  TEXTBOOK_PRESET, 
  GRAPHIC_RECORDING_PRESET,
  MAGAZINE_PRESET,
  HANDWRITTEN_PRESET,
  MINIMALIST_PRESET,
  CHILDREN_BOOK_PRESET,
  INFOGRAPHIC_PRESET,
  TECH_PRESET
} from '@/lib/constants/constants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, BookText, PenTool, Newspaper, Pencil, Minimize2, Building2, Clock, Baby, PieChart, Cpu, Lightbulb } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface BasicSettingsProps {
  localSettings: AppSettings;
  setLocalSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  applyPreset: (preset: 'corporate' | 'casual' | 'minimal' | 'creative' | 'popArt') => void;
}

export const BasicSettings: React.FC<BasicSettingsProps> = ({
  localSettings,
  setLocalSettings,
  applyPreset
}) => {
  // カラーテーマを変更した際に、対応する色も更新
  const handleColorThemeChange = (theme: ColorTheme) => {
    if (theme === 'custom') return;
    
    const themeColors = COLOR_THEME_MAP[theme];
    
    setLocalSettings({
      ...localSettings,
      basic: {
        ...localSettings.basic,
        colorTheme: theme
      },
      colors: {
        ...localSettings.colors,
        ...themeColors,
      }
    });
  };

  const updateBasicSetting = (key: keyof typeof localSettings.basic, value: any) => {
    if (key === 'colorTheme') {
      handleColorThemeChange(value as ColorTheme);
    } else {
      setLocalSettings({
        ...localSettings,
        basic: {
          ...localSettings.basic,
          [key]: value
        }
      });
    }
  };

  // デザインスタイルを変更する際に適切なプリセットを適用
  const handleDesignStyleChange = (style: DesignStyle) => {
    let newSettings = { ...localSettings };
    newSettings.basic.designStyle = style;
    
    // スタイルに応じたプリセット適用
    switch (style) {
      case 'textbook':
        newSettings = applyPresetSettings(newSettings, TEXTBOOK_PRESET);
        break;
      case 'graphicRecording':
        newSettings = applyPresetSettings(newSettings, GRAPHIC_RECORDING_PRESET);
        break;
      case 'magazine':
        newSettings = applyPresetSettings(newSettings, MAGAZINE_PRESET);
        break;
      case 'handwritten':
        newSettings = applyPresetSettings(newSettings, HANDWRITTEN_PRESET);
        break;
      case 'minimalist':
        newSettings = applyPresetSettings(newSettings, MINIMALIST_PRESET);
        break;
      case 'childrenBook':
        newSettings = applyPresetSettings(newSettings, CHILDREN_BOOK_PRESET);
        break;
      case 'infographic':
        newSettings = applyPresetSettings(newSettings, INFOGRAPHIC_PRESET);
        break;
      case 'tech':
        newSettings = applyPresetSettings(newSettings, TECH_PRESET);
        break;
    }
    
    setLocalSettings(newSettings);
  };

  // 部分的なプリセット設定を適用するためのヘルパー関数
  const applyPresetSettings = (current: AppSettings, preset: Partial<AppSettings>): AppSettings => {
    const merged = { ...current };
    
    // 部分的にプリセット設定をマージ
    if (preset.basic) merged.basic = { ...merged.basic, ...preset.basic };
    if (preset.colors) merged.colors = { ...merged.colors, ...preset.colors };
    if (preset.typography) merged.typography = { ...merged.typography, ...preset.typography };
    if (preset.layout) merged.layout = { ...merged.layout, ...preset.layout };
    if (preset.visualEffects) merged.visualEffects = { ...merged.visualEffects, ...preset.visualEffects };
    if (preset.additionalInstructions) merged.additionalInstructions = preset.additionalInstructions;
    
    return merged;
  };

  // デザインスタイルに対応するアイコンを返す
  const getDesignStyleIcon = (style: DesignStyle) => {
    switch (style) {
      case 'textbook': return <BookText className="h-4 w-4" />;
      case 'graphicRecording': return <PenTool className="h-4 w-4" />;
      case 'magazine': return <Newspaper className="h-4 w-4" />;
      case 'handwritten': return <Pencil className="h-4 w-4" />;
      case 'minimalist': return <Minimize2 className="h-4 w-4" />;
      case 'corporate': return <Building2 className="h-4 w-4" />;
      case 'retro': return <Clock className="h-4 w-4" />;
      case 'childrenBook': return <Baby className="h-4 w-4" />;
      case 'infographic': return <PieChart className="h-4 w-4" />;
      case 'tech': return <Cpu className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-stone-500 mb-3">プリセット</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start text-sm text-stone-700 border-stone-300"
            onClick={() => applyPreset('corporate')}
          >
            コーポレート
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start text-sm text-stone-700 border-stone-300"
            onClick={() => applyPreset('casual')}
          >
            カジュアル
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start text-sm text-stone-700 border-stone-300"
            onClick={() => applyPreset('minimal')}
          >
            ミニマル
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start text-sm text-stone-700 border-stone-300"
            onClick={() => applyPreset('creative')}
          >
            クリエイティブ
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="col-span-2 justify-start text-sm text-pink-700 border-pink-300 bg-pink-50"
            onClick={() => applyPreset('popArt')}
          >
            ポップアート
          </Button>
        </div>
      </div>
      
      {/* デザインスタイル選択セクション */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-stone-500">デザインスタイル</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-stone-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  デザインスタイルを選択すると、フォント、色、レイアウトなどが自動的に調整されます
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* スタイル選択ボタン */}
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 ${localSettings.basic.designStyle === 'textbook' ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}
            onClick={() => handleDesignStyleChange('textbook')}
          >
            <BookText className="h-4 w-4" />
            <span>教科書風</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 ${localSettings.basic.designStyle === 'graphicRecording' ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}
            onClick={() => handleDesignStyleChange('graphicRecording')}
          >
            <PenTool className="h-4 w-4" />
            <span>グラレコ風</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 ${localSettings.basic.designStyle === 'magazine' ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}
            onClick={() => handleDesignStyleChange('magazine')}
          >
            <Newspaper className="h-4 w-4" />
            <span>雑誌風</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 ${localSettings.basic.designStyle === 'handwritten' ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}
            onClick={() => handleDesignStyleChange('handwritten')}
          >
            <Pencil className="h-4 w-4" />
            <span>手書き風</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 ${localSettings.basic.designStyle === 'minimalist' ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}
            onClick={() => handleDesignStyleChange('minimalist')}
          >
            <Minimize2 className="h-4 w-4" />
            <span>ミニマリスト</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 ${localSettings.basic.designStyle === 'childrenBook' ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}
            onClick={() => handleDesignStyleChange('childrenBook')}
          >
            <Baby className="h-4 w-4" />
            <span>絵本風</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 ${localSettings.basic.designStyle === 'infographic' ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}
            onClick={() => handleDesignStyleChange('infographic')}
          >
            <PieChart className="h-4 w-4" />
            <span>インフォグラフィック</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 ${localSettings.basic.designStyle === 'tech' ? 'border-amber-400 bg-amber-50' : 'border-stone-200'}`}
            onClick={() => handleDesignStyleChange('tech')}
          >
            <Cpu className="h-4 w-4" />
            <span>ハイテク風</span>
          </Button>
        </div>
        
        {/* 選択されたデザインスタイルの説明 */}
        {DESIGN_STYLE_DESCRIPTIONS[localSettings.basic.designStyle] && (
          <p className="text-xs text-stone-500 bg-stone-100 p-2 rounded-sm">
            {DESIGN_STYLE_DESCRIPTIONS[localSettings.basic.designStyle]}
          </p>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-stone-500 mb-3">カラースタイル</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-stone-700 mb-1">メインカラー</label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-md border border-stone-300"
                style={{ backgroundColor: localSettings.colors.mainColor }}
              ></div>
              <Select 
                value={localSettings.basic.colorTheme}
                onValueChange={(value) => updateBasicSetting('colorTheme', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="カラーテーマ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coffee">モカブラウン</SelectItem>
                  <SelectItem value="blue">ブルー</SelectItem>
                  <SelectItem value="green">グリーン</SelectItem>
                  <SelectItem value="popArt">ポップアート</SelectItem>
                  <SelectItem value="custom">カスタム</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-stone-700 mb-1">フォントスタイル</label>
            <Select 
              value={localSettings.basic.fontStyle}
              onValueChange={(value) => updateBasicSetting('fontStyle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="フォントスタイル" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="serif">明朝体</SelectItem>
                <SelectItem value="sans">ゴシック体</SelectItem>
                <SelectItem value="mixed">ミックス</SelectItem>
                <SelectItem value="rounded">丸ゴシック</SelectItem>
                <SelectItem value="script">手書き風</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm text-stone-700 mb-1">レイアウト</label>
            <Select 
              value={localSettings.basic.layoutType}
              onValueChange={(value) => updateBasicSetting('layoutType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="レイアウト" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="centered">中央揃え</SelectItem>
                <SelectItem value="full">全幅</SelectItem>
                <SelectItem value="sidebar">サイドバー付き</SelectItem>
                <SelectItem value="asymmetric">非対称</SelectItem>
                <SelectItem value="zigzag">ジグザグ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="mb-6 border-t border-stone-200 pt-4 mt-4">
        <h3 className="text-sm font-medium text-stone-700 mb-2">文章処理</h3>
        <div className="space-y-4">
          {/* 文章を要約 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs text-stone-600" htmlFor="summarize-text">文章を要約</label>
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <Switch 
              id="summarize-text"
              checked={localSettings.basic.summarizeText}
              onCheckedChange={(checked) => updateBasicSetting('summarizeText', checked)}
            />
          </div>
          {localSettings.basic.summarizeText && (
            <div className="text-xs text-stone-500 italic pl-4">
              長い文章を簡潔に要約して表示します
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-stone-500 mb-3">装飾効果</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-stone-700">シャドウ効果</label>
            <div className="relative inline-block w-10 h-5">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0 absolute" 
                checked={localSettings.basic.hasShadow}
                onChange={(e) => updateBasicSetting('hasShadow', e.target.checked)} 
              />
              <span 
                onClick={() => updateBasicSetting('hasShadow', !localSettings.basic.hasShadow)}
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${localSettings.basic.hasShadow ? 'bg-amber-600' : 'bg-stone-300'} rounded-full before:absolute before:h-4 before:w-4 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all ${localSettings.basic.hasShadow ? 'before:translate-x-5' : ''}`}
              ></span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm text-stone-700">境界線</label>
            <div className="relative inline-block w-10 h-5">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0 absolute" 
                checked={localSettings.basic.hasBorder}
                onChange={(e) => updateBasicSetting('hasBorder', e.target.checked)} 
              />
              <span 
                onClick={() => updateBasicSetting('hasBorder', !localSettings.basic.hasBorder)}
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${localSettings.basic.hasBorder ? 'bg-amber-600' : 'bg-stone-300'} rounded-full before:absolute before:h-4 before:w-4 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all ${localSettings.basic.hasBorder ? 'before:translate-x-5' : ''}`}
              ></span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm text-stone-700">アニメーション</label>
            <div className="relative inline-block w-10 h-5">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0 absolute" 
                checked={localSettings.basic.hasAnimation}
                onChange={(e) => updateBasicSetting('hasAnimation', e.target.checked)}
              />
              <span 
                onClick={() => updateBasicSetting('hasAnimation', !localSettings.basic.hasAnimation)}
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${localSettings.basic.hasAnimation ? 'bg-amber-600' : 'bg-stone-300'} rounded-full before:absolute before:h-4 before:w-4 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all ${localSettings.basic.hasAnimation ? 'before:translate-x-5' : ''}`}
              ></span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-stone-700">テクスチャ</label>
            <Select 
              value={localSettings.basic.textureType || 'none'}
              onValueChange={(value) => updateBasicSetting('textureType', value as TextureType)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="テクスチャ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">なし</SelectItem>
                <SelectItem value="paper">紙目調</SelectItem>
                <SelectItem value="noise">ノイズ</SelectItem>
                <SelectItem value="grid">グリッド</SelectItem>
                <SelectItem value="dots">ドット</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm text-stone-700">グラデーション</label>
            <Select 
              value={localSettings.basic.gradientType || 'none'}
              onValueChange={(value) => updateBasicSetting('gradientType', value as GradientType)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="グラデーション" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">なし</SelectItem>
                <SelectItem value="linear">線形</SelectItem>
                <SelectItem value="radial">放射状</SelectItem>
                <SelectItem value="conic">円錐状</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
