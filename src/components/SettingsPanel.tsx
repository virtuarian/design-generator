import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, RefreshCw,  MessageSquare } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStyleDefinition } from '@/lib/constants/styleDefinitions';
import { useSettings } from '@/contexts/SettingsContext';
import { useView } from '@/contexts/ViewContext';
import { DesignStyle as AppDesignStyle, SettingTab } from '@/lib/types';

// 利用可能なフォントファミリーのリスト
// const FONT_FAMILIES = [
//   { value: 'sans', label: 'サンセリフ' },
//   { value: 'serif', label: 'セリフ' }, 
//   { value: 'rounded', label: '丸ゴシック' },
//   { value: 'script', label: '手書き風' },
//   { value: 'mono', label: '等幅' }
// ];

// すべてのスタイルオプションを定義
const DESIGN_STYLE_OPTIONS = [
  { id: 'standard', label: '標準' },
  { id: 'graphicRecordingNormal', label: 'グラレコ-ノーマル' },
  { id: 'graphicRecordingBusiness', label: 'グラレコ-ビジネス' }, 
  { id: 'graphicRecordingAnimation', label: 'グラレコ-アニメーション' },
  { id: 'textbook', label: '教科書風' },
  { id: 'magazine', label: '雑誌風' }
];

const SettingsPanel = () => {
  // コンテキストから状態と関数を取得
  const { 
    settings,
    updateSettings,
    customPrompt,
    updateCustomPrompt,
    generatedPrompt,
    setGeneratedPrompt,
    showPromptPreview,
    setShowPromptPreview
  } = useSettings();
  
  const { activeSetting, setActiveSetting, setSettingsChanged } = useView();

  // ローカルステートを使用して選択状態を管理（問題の回避策）
  const [selectedStyle, setSelectedStyle] = useState<string>(settings.basic.designStyle);

  // 設定が変更されたときにローカルステートを同期
  useEffect(() => {
    setSelectedStyle(settings.basic.designStyle);
    // console.log('設定変更を検知: 現在のスタイル =', settings.basic.designStyle);
  }, [settings.basic.designStyle]);

  // コンポーネントがマウントされた時に必ずスタイルタブをアクティブにする
  // 空の依存配列を使って初回レンダリング時のみ実行されるように修正
  useEffect(() => {
    setActiveSetting('style');
    // console.log('初期タブを設定: style');
  }, [setActiveSetting]); // 依存配列を空に設定

  // プロンプトプレビューを生成する関数
  const generatePromptPreview = () => {
    try {
      if (!customPrompt.includes('## コンテンツ')) {
        const previewPrompt = `${customPrompt}

## コンテンツ
プレビュー用テキストがここに入ります。

## 出力形式
- 完全なHTMLを生成します
- インラインCSSを使って設定を適用します
- モバイルレスポンシブなデザインにします
`;
        setGeneratedPrompt(previewPrompt);
      } else {
        setGeneratedPrompt(customPrompt);
      }
    } catch (error) {
      // console.warn('プロンプト生成に失敗しました:', error);
      setGeneratedPrompt('プロンプトの表示に失敗しました。:' + error);
    }
  };

  // プロンプトプレビューの表示/非表示を切り替える
  const togglePromptPreview = () => {
    const newState = !showPromptPreview;
    setShowPromptPreview(newState);
    
    if (newState) {
      generatePromptPreview();
    }
  };

  // デザインスタイルが変更されたときの処理を完全に書き直し
  const handleStyleChange = (styleId: string) => {
    // console.log(`スタイル変更リクエスト: ${styleId} (現在: ${settings.basic.designStyle})`);
    
    // すでに選択されているスタイルなら何もしない
    if (styleId === settings.basic.designStyle) {
      // console.log('既に選択されているスタイルです。変更をスキップします。');
      return;
    }

    // まずローカル状態を更新
    setSelectedStyle(styleId);
    
    // スタイル定義を取得
    const styleDefinition = getStyleDefinition(styleId);
    // console.log('スタイル定義:', styleDefinition.displayName);
    
    // プロンプトを生成
    const fullPrompt = `
# ${styleDefinition.displayName}スタイル
${styleDefinition.description}

## スタイル指示
${styleDefinition.prompt || '特別なスタイル指示はありません。'}`

// ## デザイン設定
// - カラーテーマ: ${settings.basic.colorTheme}
// - メインカラー: ${settings.colors.mainColor}
// - セカンダリカラー: ${settings.colors.secondaryColor}
// - アクセントカラー: ${settings.colors.accentColor}
// - 背景色: ${settings.colors.backgroundColor}
// - 見出しフォント: ${settings.typography.headingFont}
// - 本文フォント: ${settings.typography.bodyFont}
// - レイアウト: ${settings.basic.layoutType}
// `;
    
    // 新しい設定オブジェクトを作成（完全に新しいインスタンス）
    const newSettings = structuredClone(settings);
    
    // 設定を更新
    newSettings.basic.designStyle = styleId as AppDesignStyle;
    newSettings.additionalInstructions = fullPrompt;
    
    // 設定コンテキストを更新
    updateSettings(newSettings);
    
    // プロンプト関連の状態も更新
    updateCustomPrompt(fullPrompt);
    setGeneratedPrompt(fullPrompt);
    setShowPromptPreview(true);
    setSettingsChanged(true);
    
    // console.log('スタイル変更完了:', styleId);
  };

  // カラー設定が変更されたときの処理
  // const handleColorChange = (colorKey: string, value: string) => {
  //   const newSettings = {
  //     ...settings,
  //     colors: {
  //       ...settings.colors,
  //       [colorKey]: value
  //     }
  //   };
  //   updateSettings(newSettings);
  //   setSettingsChanged(true);
  // };

  // フォント設定が変更されたときの処理
  // const handleFontChange = (fontType: 'headingFont' | 'bodyFont', value: string) => {
  //   const newSettings = {
  //     ...settings,
  //     typography: {
  //       ...settings.typography,
  //       [fontType]: value
  //     }
  //   };
  //   updateSettings(newSettings);
  //   setSettingsChanged(true);
  // };

  // プロンプトが変更されたときの処理
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    updateCustomPrompt(newPrompt);
    
    // プレビュー表示中なら更新
    if (showPromptPreview) {
      if (!newPrompt.includes('## コンテンツ')) {
        const previewPrompt = `${newPrompt}

## コンテンツ
プレビュー用テキストがここに入ります。

## 出力形式
- 完全なHTMLを生成します
- インラインCSSを使って設定を適用します
- モバイルレスポンシブなデザインにします`;
        
        setGeneratedPrompt(previewPrompt);
      } else {
        setGeneratedPrompt(newPrompt);
      }
    }
    
    // 設定変更フラグを設定
    setSettingsChanged(true);
  };
  
  // console.log('レンダリング時の選択スタイル:', selectedStyle, '設定値:', settings.basic.designStyle);

  return (
    <aside className="w-80 bg-stone-100 border-r border-stone-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
      <div className="flex flex-col h-full">
        {/* ヘッダー */}
        <div className="p-4 border-b border-stone-200 bg-white">
          <h2 className="text-lg font-medium text-stone-800">デザインスタイル設定</h2>
          <p className="text-xs text-stone-500 mt-1">
            スタイルを選択すると自動的に設定が適用されます
          </p>
        </div>
        
        {/* タブと内容を一つの Tabs コンポーネントで囲む */}
        <Tabs value={activeSetting} onValueChange={(value) => setActiveSetting(value as SettingTab)} className="flex-1 flex flex-col">
          <div className="p-4 border-b border-stone-200 bg-white">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="style" >スタイル</TabsTrigger>
              {/* <TabsTrigger value="customize">カスタマイズ</TabsTrigger> */}
              <TabsTrigger value="prompt">プロンプト</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="style" className="p-4 h-[300px] overflow-y-auto">
              <Label className="text-sm font-medium text-stone-700 mb-3 block">デザインスタイルを選択</Label>
              
              {/* シンプルなラジオグループに書き換え */}
              <div className="space-y-2 h-full" role="radiogroup" aria-label="デザインスタイル">
                {DESIGN_STYLE_OPTIONS.map(style => {
                  const styleDefinition = getStyleDefinition(style.id);
                  // ローカル状態を使用して選択状態を決定
                  const isSelected = selectedStyle === style.id;
                  
                  return (
                    <div 
                      key={style.id} 
                      className={`flex items-start p-2 rounded-md hover:bg-stone-200 cursor-pointer ${isSelected ? 'bg-stone-200' : ''}`}
                      onClick={() => handleStyleChange(style.id)}
                    >
                      <div className="flex items-center h-5 mr-2">
                        <input 
                          type="radio" 
                          id={`style-${style.id}`}
                          name="designStyle"
                          className="h-4 w-4 cursor-pointer"
                          checked={isSelected}
                          onChange={() => handleStyleChange(style.id)}
                          value={style.id}
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor={`style-${style.id}`} className="font-medium text-stone-800 cursor-pointer block">
                          {styleDefinition.displayName}
                        </label>
                        <p className="text-xs text-stone-500 mt-1">
                          {styleDefinition.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            {/* カスタマイズタブ */}
            {/* ※一旦非表示 */}
            {/* <TabsContent value="customize" className="p-4 space-y-4 h-full">
              <Accordion type="single" collapsible defaultValue="colors" className="w-full">
                <AccordionItem value="colors">
                  <AccordionTrigger className="flex items-center gap-2 text-sm">
                    <PaintBucket className="h-4 w-4" />
                    <span>カラー設定</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="mainColor" className="text-xs">メインカラー</Label>
                        <div 
                          className="w-5 h-5 rounded-full border border-slate-300" 
                          style={{backgroundColor: settings.colors.mainColor}} 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id="mainColor"
                          type="color"
                          className="w-10 h-8 p-0 border-none"
                          value={settings.colors.mainColor}
                          onChange={(e) => handleColorChange('mainColor', e.target.value)}
                        />
                        <Input
                          type="text"
                          className="h-8"
                          value={settings.colors.mainColor}
                          onChange={(e) => handleColorChange('mainColor', e.target.value)}
                          maxLength={7}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="secondaryColor" className="text-xs">セカンダリカラー</Label>
                        <div 
                          className="w-5 h-5 rounded-full border border-slate-300" 
                          style={{backgroundColor: settings.colors.secondaryColor}} 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          className="w-10 h-8 p-0 border-none"
                          value={settings.colors.secondaryColor}
                          onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        />
                        <Input
                          type="text"
                          className="h-8"
                          value={settings.colors.secondaryColor}
                          onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                          maxLength={7}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="accentColor" className="text-xs">アクセントカラー</Label>
                        <div 
                          className="w-5 h-5 rounded-full border border-slate-300" 
                          style={{backgroundColor: settings.colors.accentColor}} 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id="accentColor"
                          type="color"
                          className="w-10 h-8 p-0 border-none"
                          value={settings.colors.accentColor}
                          onChange={(e) => handleColorChange('accentColor', e.target.value)}
                        />
                        <Input
                          type="text"
                          className="h-8"
                          value={settings.colors.accentColor}
                          onChange={(e) => handleColorChange('accentColor', e.target.value)}
                          maxLength={7}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="backgroundColor" className="text-xs">背景色</Label>
                        <div 
                          className="w-5 h-5 rounded-full border border-slate-300" 
                          style={{backgroundColor: settings.colors.backgroundColor}} 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          className="w-10 h-8 p-0 border-none"
                          value={settings.colors.backgroundColor}
                          onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        />
                        <Input
                          type="text"
                          className="h-8"
                          value={settings.colors.backgroundColor}
                          onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="typography">
                  <AccordionTrigger className="flex items-center gap-2 text-sm">
                    <Type className="h-4 w-4" />
                    <span>フォント設定</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="headingFont" className="text-xs">見出しフォント</Label>
                      <Select
                        value={settings.typography.headingFont}
                        onValueChange={(value) => handleFontChange('headingFont', value)}
                      >
                        <SelectTrigger className="w-full h-8">
                          <SelectValue placeholder="フォントを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_FAMILIES.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="bodyFont" className="text-xs">本文フォント</Label>
                      <Select
                        value={settings.typography.bodyFont}
                        onValueChange={(value) => handleFontChange('bodyFont', value)}
                      >
                        <SelectTrigger className="w-full h-8">
                          <SelectValue placeholder="フォントを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_FAMILIES.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
             */}
            {/* プロンプトタブ */}
            <TabsContent value="prompt" className="p-4  h-[300px] overflow-y-auto ">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-700" />
                  <Label className="text-sm font-medium text-stone-700">AIプロンプトをカスタマイズ</Label>
                </div>
                
                <Textarea 
                  value={customPrompt}
                  onChange={handlePromptChange}
                  placeholder="AIに対する追加指示を入力..."
                  className="max-h-[150px] min-h-[150px] text-sm"
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1 text-xs"
                  onClick={togglePromptPreview}
                >
                  {showPromptPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{showPromptPreview ? "プロンプトプレビューを閉じる" : "プロンプトプレビューを表示"}</span>
                </Button>
                
                {showPromptPreview && (
                  <div className="border border-amber-200 bg-amber-50 p-2 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-amber-800">プロンプトプレビュー</span>
                      <Button 
                        variant="ghost"
                        size="sm" 
                        className="h-5 w-5 p-0"
                        onClick={generatePromptPreview}
                      >
                        <RefreshCw className="h-3 w-3 text-amber-700" />
                      </Button>
                    </div>
                    <pre className="text-xs bg-white border border-amber-100 p-2 rounded-md overflow-auto max-h-48 text-stone-700 whitespace-pre-wrap">
                      {generatedPrompt || 'プロンプトを生成しています...'}
                    </pre>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        {/* <Separator />
        
        <div className="p-4 flex items-center justify-center">
          <div className="text-xs text-stone-500">
            変更は自動的に適用されます
          </div>
        </div> */}
      </div>
    </aside>
  );
};

export default SettingsPanel;