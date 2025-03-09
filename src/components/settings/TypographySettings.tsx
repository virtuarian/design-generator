import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppSettings, FontStyle, LengthUnit } from '@/lib/types';

interface TypographySettingsProps {
  localSettings: AppSettings;
  setLocalSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const TypographySettings: React.FC<TypographySettingsProps> = ({
  localSettings,
  setLocalSettings
}) => {
  const updateTypographySetting = (key: keyof typeof localSettings.typography, value: any) => {
    setLocalSettings({
      ...localSettings,
      typography: {
        ...localSettings.typography,
        [key]: value
      }
    });
  };

  const updateTextDecoration = (key: keyof typeof localSettings.typography.textDecoration, value: any) => {
    setLocalSettings({
      ...localSettings,
      typography: {
        ...localSettings.typography,
        textDecoration: {
          ...localSettings.typography.textDecoration,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-stone-500 mb-3">タイポグラフィ詳細</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">見出しフォント</label>
          <Select 
            value={localSettings.typography.headingFont}
            onValueChange={(value) => updateTypographySetting('headingFont', value as FontStyle)}
          >
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="フォント" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serif">明朝体 / Serif</SelectItem>
              <SelectItem value="sans">ゴシック体 / Sans-serif</SelectItem>
              <SelectItem value="display">ディスプレイ</SelectItem>
              <SelectItem value="rounded">丸ゴシック</SelectItem>
              <SelectItem value="script">手書き風</SelectItem>
              <SelectItem value="custom">カスタム</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-stone-500 mb-1">H1サイズ</label>
            <div className="flex">
              <Input 
                type="number" 
                value={localSettings.typography.h1Size} 
                onChange={(e) => updateTypographySetting('h1Size', parseFloat(e.target.value) || 0)}
                className="text-xs rounded-r-none" 
              />
              <Select 
                value={localSettings.typography.h1SizeUnit}
                onValueChange={(value) => updateTypographySetting('h1SizeUnit', value as LengthUnit)}
              >
                <SelectTrigger className="text-xs rounded-l-none w-16">
                  <SelectValue placeholder="単位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rem">rem</SelectItem>
                  <SelectItem value="px">px</SelectItem>
                  <SelectItem value="em">em</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-stone-500 mb-1">H2サイズ</label>
            <div className="flex">
              <Input 
                type="number" 
                value={localSettings.typography.h2Size} 
                onChange={(e) => updateTypographySetting('h2Size', parseFloat(e.target.value) || 0)}
                className="text-xs rounded-r-none" 
              />
              <Select 
                value={localSettings.typography.h2SizeUnit}
                onValueChange={(value) => updateTypographySetting('h2SizeUnit', value as LengthUnit)}
              >
                <SelectTrigger className="text-xs rounded-l-none w-16">
                  <SelectValue placeholder="単位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rem">rem</SelectItem>
                  <SelectItem value="px">px</SelectItem>
                  <SelectItem value="em">em</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-stone-500 mb-1">本文フォント</label>
          <Select 
            value={localSettings.typography.bodyFont}
            onValueChange={(value) => updateTypographySetting('bodyFont', value as FontStyle)}
          >
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="フォント" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serif">明朝体 / Serif</SelectItem>
              <SelectItem value="sans">ゴシック体 / Sans-serif</SelectItem>
              <SelectItem value="rounded">丸ゴシック</SelectItem>
              <SelectItem value="custom">カスタム</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-stone-500 mb-1">本文サイズ</label>
            <div className="flex">
              <Input 
                type="number" 
                value={localSettings.typography.bodySize} 
                onChange={(e) => updateTypographySetting('bodySize', parseFloat(e.target.value) || 0)}
                className="text-xs rounded-r-none" 
              />
              <Select 
                value={localSettings.typography.bodySizeUnit}
                onValueChange={(value) => updateTypographySetting('bodySizeUnit', value as LengthUnit)}
              >
                <SelectTrigger className="text-xs rounded-l-none w-16">
                  <SelectValue placeholder="単位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rem">rem</SelectItem>
                  <SelectItem value="px">px</SelectItem>
                  <SelectItem value="em">em</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-stone-500 mb-1">行間</label>
            <div className="flex">
              <Input 
                type="number" 
                value={localSettings.typography.lineHeight} 
                onChange={(e) => updateTypographySetting('lineHeight', parseFloat(e.target.value) || 0)}
                className="text-xs rounded-r-none" 
              />
              <Select 
                value={localSettings.typography.lineHeightUnit}
                onValueChange={(value) => updateTypographySetting('lineHeightUnit', value as LengthUnit)}
              >
                <SelectTrigger className="text-xs rounded-l-none w-16">
                  <SelectValue placeholder="単位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit">倍</SelectItem>
                  <SelectItem value="px">px</SelectItem>
                  <SelectItem value="percent">%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-stone-500 mb-1">字間</label>
            <div className="flex">
              <Input 
                type="number" 
                value={localSettings.typography.letterSpacing || 0} 
                onChange={(e) => updateTypographySetting('letterSpacing', parseFloat(e.target.value) || 0)}
                className="text-xs rounded-r-none" 
              />
              <Select 
                value={localSettings.typography.letterSpacingUnit || 'em'}
                onValueChange={(value) => updateTypographySetting('letterSpacingUnit', value as LengthUnit)}
              >
                <SelectTrigger className="text-xs rounded-l-none w-16">
                  <SelectValue placeholder="単位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em">em</SelectItem>
                  <SelectItem value="px">px</SelectItem>
                  <SelectItem value="rem">rem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-stone-500 mb-1">フォントの太さ</label>
            <Select 
              value={String(localSettings.typography.fontWeight || 400)}
              onValueChange={(value) => updateTypographySetting('fontWeight', parseInt(value))}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="太さ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light (300)</SelectItem>
                <SelectItem value="400">Regular (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">SemiBold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="pt-2">
          <h4 className="text-xs text-stone-500 mb-2">テキスト装飾</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-stone-500 mb-1">下線色</label>
              <div className="flex gap-2">
                <div 
                  className="w-6 h-6 rounded border border-stone-300"
                  style={{ backgroundColor: localSettings.typography.textDecoration?.underlineColor || '' }}
                ></div>
                <Input 
                  type="text" 
                  value={localSettings.typography.textDecoration?.underlineColor || ''} 
                  onChange={(e) => updateTextDecoration('underlineColor', e.target.value)}
                  className="text-xs flex-1" 
                  placeholder="例: #0000FF"
                />
                <input 
                  type="color"
                  value={localSettings.typography.textDecoration?.underlineColor || '#000000'}
                  onChange={(e) => updateTextDecoration('underlineColor', e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-stone-500 mb-1">ハイライト色</label>
              <div className="flex gap-2">
                <div 
                  className="w-6 h-6 rounded border border-stone-300"
                  style={{ backgroundColor: localSettings.typography.textDecoration?.highlightColor || '' }}
                ></div>
                <Input 
                  type="text" 
                  value={localSettings.typography.textDecoration?.highlightColor || ''} 
                  onChange={(e) => updateTextDecoration('highlightColor', e.target.value)}
                  className="text-xs flex-1" 
                  placeholder="例: #FFFF00"
                />
                <input 
                  type="color"
                  value={localSettings.typography.textDecoration?.highlightColor || '#FFFF00'}
                  onChange={(e) => updateTextDecoration('highlightColor', e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localSettings.typography.textDecoration?.textOutline || false}
                onChange={(e) => updateTextDecoration('textOutline', e.target.checked)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <label className="text-xs text-stone-700">アウトライン</label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localSettings.typography.textDecoration?.textShadow || false}
                onChange={(e) => updateTextDecoration('textShadow', e.target.checked)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <label className="text-xs text-stone-700">テキストシャドウ</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
