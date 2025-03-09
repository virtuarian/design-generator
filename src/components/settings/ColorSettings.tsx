import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { AppSettings, AdditionalColor, GradientDirection } from '@/lib/types';

interface ColorSettingsProps {
  localSettings: AppSettings;
  setLocalSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const ColorSettings: React.FC<ColorSettingsProps> = ({
  localSettings,
  setLocalSettings
}) => {
  const [newColorName, setNewColorName] = useState<string>("");
  const [newColorValue, setNewColorValue] = useState<string>("#CCCCCC");
  const [newColorPurpose, setNewColorPurpose] = useState<string>("");
  const [showAddColor, setShowAddColor] = useState<boolean>(false);

  const updateColorSetting = (key: keyof typeof localSettings.colors, value: string) => {
    setLocalSettings({
      ...localSettings,
      colors: {
        ...localSettings.colors,
        [key]: value
      },
      // カスタムカラーに設定を変更
      basic: {
        ...localSettings.basic,
        colorTheme: 'custom'
      }
    });
  };

  const updateGradientSettings = (key: 'gradientStartColor' | 'gradientEndColor' | 'gradientDirection', value: any) => {
    setLocalSettings({
      ...localSettings,
      colors: {
        ...localSettings.colors,
        [key]: value
      }
    });
  };

  // 追加カラーの追加
  const addColor = () => {
    if (!newColorName || !newColorValue) return;

    const newColor: AdditionalColor = {
      id: Date.now().toString(),
      name: newColorName,
      color: newColorValue,
      purpose: newColorPurpose || undefined
    };

    const updatedColors = localSettings.colors.additionalColors ? 
      [...localSettings.colors.additionalColors, newColor] : [newColor];

    setLocalSettings({
      ...localSettings,
      colors: {
        ...localSettings.colors,
        additionalColors: updatedColors
      },
      basic: {
        ...localSettings.basic,
        colorTheme: 'custom'
      }
    });

    // フォームをリセット
    setNewColorName("");
    setNewColorValue("#CCCCCC");
    setNewColorPurpose("");
    setShowAddColor(false);
  };

  // 追加カラーの削除
  const removeColor = (id: string) => {
    const updatedColors = localSettings.colors.additionalColors?.filter(c => c.id !== id) || [];
    
    setLocalSettings({
      ...localSettings,
      colors: {
        ...localSettings.colors,
        additionalColors: updatedColors
      }
    });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-stone-500">カラー詳細設定</h3>
        <button 
          className="text-xs text-amber-600 flex items-center gap-1"
          onClick={() => setShowAddColor(!showAddColor)}
        >
          <Plus className="h-3 w-3" />
          追加
        </button>
      </div>
      
      {/* 新しい色の追加フォーム */}
      {showAddColor && (
        <div className="mb-4 p-3 bg-white rounded-md shadow-sm border border-stone-200">
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-stone-500 mb-1">カラー名</label>
              <Input 
                type="text" 
                value={newColorName} 
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="例: アクセントカラー2" 
                className="text-xs" 
              />
            </div>
            
            <div>
              <label className="block text-xs text-stone-500 mb-1">カラー値</label>
              <div className="flex gap-2 items-center">
                <div 
                  className="w-6 h-6 rounded border border-stone-300"
                  style={{ backgroundColor: newColorValue }}
                ></div>
                <Input 
                  type="text" 
                  value={newColorValue} 
                  onChange={(e) => setNewColorValue(e.target.value)}
                  placeholder="#RRGGBB" 
                  className="text-xs flex-1" 
                />
                <input 
                  type="color"
                  value={newColorValue}
                  onChange={(e) => setNewColorValue(e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-stone-500 mb-1">用途（オプション）</label>
              <Input 
                type="text" 
                value={newColorPurpose} 
                onChange={(e) => setNewColorPurpose(e.target.value)}
                placeholder="例: 見出し背景" 
                className="text-xs" 
              />
            </div>
            
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                className="text-xs w-full bg-amber-600 hover:bg-amber-700 text-white"
                onClick={addColor}
                disabled={!newColorName || !newColorValue}
              >
                追加する
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => setShowAddColor(false)}
              >
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">メインカラー</label>
          <div className="flex gap-2">
            <div 
              className="w-8 h-8 rounded border border-stone-300"
              style={{ backgroundColor: localSettings.colors.mainColor }}
            ></div>
            <Input 
              type="text" 
              value={localSettings.colors.mainColor} 
              onChange={(e) => updateColorSetting('mainColor', e.target.value)}
              className="text-xs flex-1" 
            />
            <input 
              type="color"
              value={localSettings.colors.mainColor}
              onChange={(e) => updateColorSetting('mainColor', e.target.value)}
              className="w-8 h-8 p-0 border-0"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-stone-500 mb-1">セカンダリカラー</label>
          <div className="flex gap-2">
            <div 
              className="w-8 h-8 rounded border border-stone-300"
              style={{ backgroundColor: localSettings.colors.secondaryColor }}
            ></div>
            <Input 
              type="text" 
              value={localSettings.colors.secondaryColor} 
              onChange={(e) => updateColorSetting('secondaryColor', e.target.value)}
              className="text-xs flex-1" 
            />
            <input 
              type="color"
              value={localSettings.colors.secondaryColor}
              onChange={(e) => updateColorSetting('secondaryColor', e.target.value)}
              className="w-8 h-8 p-0 border-0"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-stone-500 mb-1">アクセントカラー</label>
          <div className="flex gap-2">
            <div 
              className="w-8 h-8 rounded border border-stone-300"
              style={{ backgroundColor: localSettings.colors.accentColor }}
            ></div>
            <Input 
              type="text" 
              value={localSettings.colors.accentColor} 
              onChange={(e) => updateColorSetting('accentColor', e.target.value)}
              className="text-xs flex-1" 
            />
            <input 
              type="color"
              value={localSettings.colors.accentColor}
              onChange={(e) => updateColorSetting('accentColor', e.target.value)}
              className="w-8 h-8 p-0 border-0"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-stone-500 mb-1">背景色</label>
          <div className="flex gap-2">
            <div 
              className="w-8 h-8 rounded border border-stone-300"
              style={{ backgroundColor: localSettings.colors.backgroundColor }}
            ></div>
            <Input 
              type="text" 
              value={localSettings.colors.backgroundColor} 
              onChange={(e) => updateColorSetting('backgroundColor', e.target.value)}
              className="text-xs flex-1" 
            />
            <input 
              type="color"
              value={localSettings.colors.backgroundColor}
              onChange={(e) => updateColorSetting('backgroundColor', e.target.value)}
              className="w-8 h-8 p-0 border-0"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-stone-500 mb-1">コントラストカラー</label>
          <div className="flex gap-2">
            <div 
              className="w-8 h-8 rounded border border-stone-300"
              style={{ backgroundColor: localSettings.colors.contrastColor || '#333333' }}
            ></div>
            <Input 
              type="text" 
              value={localSettings.colors.contrastColor || '#333333'} 
              onChange={(e) => updateColorSetting('contrastColor', e.target.value)}
              className="text-xs flex-1" 
            />
            <input 
              type="color"
              value={localSettings.colors.contrastColor || '#333333'}
              onChange={(e) => updateColorSetting('contrastColor', e.target.value)}
              className="w-8 h-8 p-0 border-0"
            />
          </div>
        </div>
        
        {localSettings.basic.gradientType !== 'none' && (
          <>
            <div>
              <label className="block text-xs text-stone-500 mb-1">グラデーション開始色</label>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border border-stone-300"
                  style={{ backgroundColor: localSettings.colors.gradientStartColor || localSettings.colors.mainColor }}
                ></div>
                <Input 
                  type="text" 
                  value={localSettings.colors.gradientStartColor || localSettings.colors.mainColor} 
                  onChange={(e) => updateGradientSettings('gradientStartColor', e.target.value)}
                  className="text-xs flex-1" 
                />
                <input 
                  type="color"
                  value={localSettings.colors.gradientStartColor || localSettings.colors.mainColor}
                  onChange={(e) => updateGradientSettings('gradientStartColor', e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-stone-500 mb-1">グラデーション終了色</label>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border border-stone-300"
                  style={{ backgroundColor: localSettings.colors.gradientEndColor || localSettings.colors.secondaryColor }}
                ></div>
                <Input 
                  type="text" 
                  value={localSettings.colors.gradientEndColor || localSettings.colors.secondaryColor} 
                  onChange={(e) => updateGradientSettings('gradientEndColor', e.target.value)}
                  className="text-xs flex-1" 
                />
                <input 
                  type="color"
                  value={localSettings.colors.gradientEndColor || localSettings.colors.secondaryColor}
                  onChange={(e) => updateGradientSettings('gradientEndColor', e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-stone-500 mb-1">グラデーション方向</label>
              <Select 
                value={localSettings.colors.gradientDirection || 'to-right'}
                onValueChange={(value) => updateGradientSettings('gradientDirection', value as GradientDirection)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="方向" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to-right">右方向</SelectItem>
                  <SelectItem value="to-left">左方向</SelectItem>
                  <SelectItem value="to-top">上方向</SelectItem>
                  <SelectItem value="to-bottom">下方向</SelectItem>
                  <SelectItem value="to-tr">右上方向</SelectItem>
                  <SelectItem value="to-tl">左上方向</SelectItem>
                  <SelectItem value="to-br">右下方向</SelectItem>
                  <SelectItem value="to-bl">左下方向</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        {/* 追加カラーリスト */}
        {localSettings.colors.additionalColors && localSettings.colors.additionalColors.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs text-stone-500 mb-2">追加カラー</h4>
            <div className="space-y-2">
              {localSettings.colors.additionalColors.map(color => (
                <div key={color.id} className="flex items-center gap-2 bg-white p-2 rounded border border-stone-200">
                  <div 
                    className="w-6 h-6 rounded border border-stone-300 flex-shrink-0"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-700 truncate">{color.name}</p>
                    <p className="text-xs text-stone-500 truncate">{color.color} {color.purpose ? `(${color.purpose})` : ''}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-stone-400 hover:text-red-500"
                    onClick={() => removeColor(color.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
