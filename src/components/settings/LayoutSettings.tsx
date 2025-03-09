import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AppSettings, LengthUnit } from '@/lib/types';

interface LayoutSettingsProps {
  localSettings: AppSettings;
  setLocalSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const LayoutSettings: React.FC<LayoutSettingsProps> = ({
  localSettings,
  setLocalSettings
}) => {
  const updateLayoutPadding = (side: keyof typeof localSettings.layout.padding, value: number) => {
    setLocalSettings({
      ...localSettings,
      layout: {
        ...localSettings.layout,
        padding: {
          ...localSettings.layout.padding,
          [side]: value
        }
      }
    });
  };

  const updateLayoutSetting = (key: keyof Omit<typeof localSettings.layout, 'padding'>, value: any) => {
    setLocalSettings({
      ...localSettings,
      layout: {
        ...localSettings.layout,
        [key]: value
      }
    });
  };

  const updateVisualEffect = (key: keyof typeof localSettings.visualEffects, value: any) => {
    setLocalSettings({
      ...localSettings,
      visualEffects: {
        ...localSettings.visualEffects,
        [key]: value
      }
    });
  };

  const toggleDecorativeElement = (element: string) => {
    const currentElements = localSettings.visualEffects?.decorativeElements || [];
    const isSelected = currentElements.includes(element as any);
    
    const newElements = isSelected
      ? currentElements.filter(e => e !== element)
      : [...currentElements, element] as any;

    updateVisualEffect('decorativeElements', newElements);
  };

  const toggleEmphasizeTechnique = (technique: string) => {
    const currentTechniques = localSettings.visualEffects?.emphasizeTechniques || [];
    const isSelected = currentTechniques.includes(technique as any);
    
    const newTechniques = isSelected
      ? currentTechniques.filter(t => t !== technique)
      : [...currentTechniques, technique] as any;

    updateVisualEffect('emphasizeTechniques', newTechniques);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-stone-500 mb-3">レイアウト詳細</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">最大横幅</label>
          <div className="flex">
            <Input 
              type="number" 
              value={localSettings.layout.maxWidth} 
              onChange={(e) => updateLayoutSetting('maxWidth', parseFloat(e.target.value) || 0)}
              className="text-xs rounded-r-none" 
            />
            <Select 
              value={localSettings.layout.maxWidthUnit}
              onValueChange={(value) => updateLayoutSetting('maxWidthUnit', value as LengthUnit)}  
            >
              <SelectTrigger className="text-xs rounded-l-none w-16">
                <SelectValue placeholder="単位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">px</SelectItem>
                <SelectItem value="rem">rem</SelectItem>
                <SelectItem value="%">%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-stone-500 mb-1">コンテンツ余白</label>
          <div className="grid grid-cols-4 gap-1">
            <div>
              <span className="block text-xs text-stone-400 text-center">上</span>
              <Input 
                type="number" 
                value={localSettings.layout.padding.top} 
                onChange={(e) => updateLayoutPadding('top', parseFloat(e.target.value) || 0)}
                className="text-xs h-8" 
              />
            </div>
            <div>
              <span className="block text-xs text-stone-400 text-center">右</span>
              <Input 
                type="number" 
                value={localSettings.layout.padding.right} 
                onChange={(e) => updateLayoutPadding('right', parseFloat(e.target.value) || 0)}
                className="text-xs h-8" 
              />
            </div>
            <div>
              <span className="block text-xs text-stone-400 text-center">下</span>
              <Input 
                type="number" 
                value={localSettings.layout.padding.bottom} 
                onChange={(e) => updateLayoutPadding('bottom', parseFloat(e.target.value) || 0)}
                className="text-xs h-8" 
              />
            </div>
            <div>
              <span className="block text-xs text-stone-400 text-center">左</span>
              <Input 
                type="number" 
                value={localSettings.layout.padding.left} 
                onChange={(e) => updateLayoutPadding('left', parseFloat(e.target.value) || 0)}
                className="text-xs h-8" 
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-stone-500 mb-1">セクション間隔</label>
            <div className="flex">
              <Input 
                type="number" 
                value={localSettings.layout.sectionSpacing} 
                onChange={(e) => updateLayoutSetting('sectionSpacing', parseFloat(e.target.value) || 0)}
                className="text-xs rounded-r-none" 
              />
              <Select 
                value={localSettings.layout.sectionSpacingUnit}
                onValueChange={(value) => updateLayoutSetting('sectionSpacingUnit', value as LengthUnit)}
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
            <label className="block text-xs text-stone-500 mb-1">角丸</label>
            <div className="flex">
              <Input 
                type="number" 
                value={localSettings.layout.borderRadius} 
                onChange={(e) => updateLayoutSetting('borderRadius', parseFloat(e.target.value) || 0)}
                className="text-xs rounded-r-none" 
              />
              <Select 
                value={localSettings.layout.borderRadiusUnit}
                onValueChange={(value) => updateLayoutSetting('borderRadiusUnit', value as LengthUnit)}
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
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-stone-500 mb-1">カラム数</label>
            <Select 
              value={String(localSettings.layout.columns || 1)}
              onValueChange={(value) => updateLayoutSetting('columns', parseInt(value))}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="カラム数" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1カラム</SelectItem>
                <SelectItem value="2">2カラム</SelectItem>
                <SelectItem value="3">3カラム</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col justify-end mb-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="framing"
                checked={localSettings.layout.framing || false}
                onCheckedChange={(checked) => 
                  updateLayoutSetting('framing', checked === true ? true : false)
                }
              />
              <Label 
                htmlFor="framing" 
                className="text-xs text-stone-700 cursor-pointer"
              >
                装飾フレームを使用
              </Label>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-stone-500 my-3">視覚要素</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">アイコンスタイル</label>
          <Select 
            value={localSettings.visualEffects?.iconStyle || 'simple'}
            onValueChange={(value) => updateVisualEffect('iconStyle', value)}
          >
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="スタイル" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">シンプル</SelectItem>
              <SelectItem value="detailed">詳細</SelectItem>
              <SelectItem value="rounded">ラウンド</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-xs text-stone-500 mb-2">装飾要素</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dots" 
                checked={localSettings.visualEffects?.decorativeElements?.includes('dots') || false}
                onCheckedChange={() => toggleDecorativeElement('dots')}
              />
              <Label 
                htmlFor="dots" 
                className="text-xs text-stone-700 cursor-pointer"
              >
                水玉模様
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="zigzag" 
                checked={localSettings.visualEffects?.decorativeElements?.includes('zigzag') || false}
                onCheckedChange={() => toggleDecorativeElement('zigzag')}
              />
              <Label 
                htmlFor="zigzag" 
                className="text-xs text-stone-700 cursor-pointer"
              >
                ジグザグ線
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="triangle" 
                checked={localSettings.visualEffects?.decorativeElements?.includes('triangle') || false}
                onCheckedChange={() => toggleDecorativeElement('triangle')}
              />
              <Label 
                htmlFor="triangle" 
                className="text-xs text-stone-700 cursor-pointer"
              >
                三角形
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="doodle" 
                checked={localSettings.visualEffects?.decorativeElements?.includes('doodle') || false}
                onCheckedChange={() => toggleDecorativeElement('doodle')}
              />
              <Label 
                htmlFor="doodle" 
                className="text-xs text-stone-700 cursor-pointer"
              >
                落書き風線画
              </Label>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="speechBubbles" 
            checked={localSettings.visualEffects?.speechBubbles || false}
            onCheckedChange={(checked) => 
              updateVisualEffect('speechBubbles', checked === true ? true : false)
            }
          />
          <Label 
            htmlFor="speechBubbles" 
            className="text-xs text-stone-700 cursor-pointer"
          >
            吹き出しスタイルを使用
          </Label>
        </div>
        
        <div>
          <label className="block text-xs text-stone-500 mb-2">強調テクニック</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="speedLines" 
                checked={localSettings.visualEffects?.emphasizeTechniques?.includes('speedLines') || false}
                onCheckedChange={() => toggleEmphasizeTechnique('speedLines')}
              />
              <Label 
                htmlFor="speedLines" 
                className="text-xs text-stone-700 cursor-pointer"
              >
                速度線
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emotionLines" 
                checked={localSettings.visualEffects?.emphasizeTechniques?.includes('emotionLines') || false}
                onCheckedChange={() => toggleEmphasizeTechnique('emotionLines')}
              />
              <Label 
                htmlFor="emotionLines" 
                className="text-xs text-stone-700 cursor-pointer"
              >
                感情線
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="radialLines" 
                checked={localSettings.visualEffects?.emphasizeTechniques?.includes('radialLines') || false}
                onCheckedChange={() => toggleEmphasizeTechnique('radialLines')}
              />
              <Label 
                htmlFor="radialLines" 
                className="text-xs text-stone-700 cursor-pointer"
              >
                放射線
              </Label>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="layerEffects" 
              checked={localSettings.visualEffects?.layerEffects || false}
              onCheckedChange={(checked) => 
                updateVisualEffect('layerEffects', checked === true ? true : false)
              }
            />
            <Label 
              htmlFor="layerEffects" 
              className="text-xs text-stone-700 cursor-pointer"
            >
              レイヤー効果を使用
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="tiltEffects" 
              checked={localSettings.visualEffects?.tiltEffects || false}
              onCheckedChange={(checked) => 
                updateVisualEffect('tiltEffects', checked === true ? true : false)
              }
            />
            <Label 
              htmlFor="tiltEffects" 
              className="text-xs text-stone-700 cursor-pointer"
            >
              傾き効果を使用
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};
