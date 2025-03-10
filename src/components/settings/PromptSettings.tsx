import React from 'react';
import { MessageSquare, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/contexts/SettingsContext';
import { useView } from '@/contexts/ViewContext';

const PromptSettings: React.FC = () => {
  const { 
    customPrompt,
    updateCustomPrompt,
    generatedPrompt,
    setGeneratedPrompt,
    showPromptPreview,
    setShowPromptPreview
  } = useSettings();
  
  const { setSettingsChanged } = useView();

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

  return (
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
  );
};

export default PromptSettings;
