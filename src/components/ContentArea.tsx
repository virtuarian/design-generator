import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCode, Eye, Code, Save, Download, Check, Sparkles, Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useView } from '@/contexts/ViewContext';
import Preview from '@/components/Preview'; // Preview コンポーネントのインポートを追加

// Content Areaのpropsを簡素化
interface ContentAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  outputHtml: string;
  isLoading: boolean;
  onConvert: (settings: any) => Promise<string | null>;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  inputText, 
  setInputText, 
  outputHtml, 
  isLoading, 
  onConvert
}) => {
  // Contextから必要な状態と関数を取得
  const { settings } = useSettings();
  const { 
    currentView, 
    setCurrentView, 
    isConverted, 
    setIsConverted, 
    settingsChanged, 
    setSettingsChanged 
  } = useView();
  
  // コピー状態の管理
  const [isCopied, setIsCopied] = useState(false);

  // 入力されたテキストを更新
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };
  
  // HTMLをクリップボードにコピー
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(outputHtml);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました', err);
    }
  };

  // HTMLを生成する関数
  const handleConvert = async () => {
    const result = await onConvert(settings);
    if (result) {
      setIsConverted(true);
      setSettingsChanged(false);
    }
  };

  // 文字数をカウント
  const getCharCount = () => {
    return inputText.length;
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* タブナビゲーション */}
      <div className="bg-white border-b border-stone-200 px-6 py-2 flex justify-between items-center">
        <div className="flex gap-1">
          <Button 
            variant={currentView === 'edit' ? "default" : "ghost"} 
            className={`text-sm gap-2 ${currentView === 'edit' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
            onClick={() => setCurrentView('edit')}
          >
            <FileCode className="h-4 w-4" />
            編集
          </Button>
          
          <Button 
            variant={currentView === 'preview' ? "default" : "ghost"} 
            className={`text-sm gap-2 ${currentView === 'preview' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
            onClick={() => setCurrentView('preview')}
            disabled={!isConverted && !isLoading}
          >
            <Eye className="h-4 w-4" />
            プレビュー
          </Button>
          
          <Button 
            variant={currentView === 'code' ? "default" : "ghost"} 
            className={`text-sm gap-2 ${currentView === 'code' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
            onClick={() => setCurrentView('code')}
            disabled={!isConverted && !isLoading}
          >
            <Code className="h-4 w-4" />
            HTML
          </Button>
        </div>
        
        <div className="flex gap-2">
          {/* 再生成ボタン */}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-stone-600 border-stone-300 gap-2"
            onClick={() => handleConvert()}
            disabled={isLoading || (!isConverted && inputText.trim().length === 0)}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            HTML変換
          </Button>
          
          <Button variant="outline" size="sm" className="text-stone-600 border-stone-300 gap-2">
            <Save className="h-4 w-4" />
            保存
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-stone-600 border-stone-300 gap-2" 
            disabled={!isConverted}
          >
            <Download className="h-4 w-4" />
            エクスポート
          </Button>
        </div>
      </div>
      
      {/* 設定変更通知 */}
      {settingsChanged && isConverted && (currentView === 'preview' || currentView === 'code') && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <p className="text-xs text-amber-800">設定が変更されました。最新の設定を反映するには「HTMLに変換」をクリックしてください。</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto text-xs border-amber-300 text-amber-700 bg-amber-50 h-7"
            onClick={() => setCurrentView('edit')}
          >
            編集に戻る
          </Button>
        </div>
      )}
      
      {/* コンテンツエリア */}
      <div className={`flex-1 overflow-hidden ${settingsChanged && isConverted ? 'opacity-80' : ''}`}>
        {/* 編集ビュー */}
        {currentView === 'edit' && (
          <div className="h-full flex flex-col">
            <div className="bg-stone-50 p-4 flex-none">
              <Card className="shadow-sm border-stone-200">
                <CardHeader className="p-4 bg-gradient-to-r from-amber-50 to-stone-50 border-b border-stone-200">
                  <CardTitle className="text-amber-800 text-lg flex justify-between items-center">
                    <span>変換したい文章を入力</span>
                    <span className="text-sm text-stone-500 font-normal">文字数: {getCharCount()}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Textarea 
                    className="border-0 rounded-none min-h-64 p-4 text-stone-800 bg-white resize-none focus-visible:ring-0"
                    placeholder="ここに変換したい文章を入力してください..."
                    value={inputText}
                    onChange={handleTextChange}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1 p-4 bg-stone-100 flex items-center justify-center overflow-y-auto">
              <Button 
                className="gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg shadow-md"
                onClick={() => handleConvert()}
                disabled={isLoading || inputText.trim().length === 0}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    変換中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    HTMLに変換
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        {/* プレビュービュー - Preview コンポーネントに置き換え */}
        {currentView === 'preview' && (
          <Preview html={outputHtml} isLoading={isLoading} />
        )}
        
        {/* コードビュー */}
        {currentView === 'code' && (
          <div className="h-full flex flex-col">
            <div className="bg-stone-800 text-stone-300 p-2 flex justify-between items-center border-b border-stone-700">
              <div className="text-sm">生成されたHTML</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-stone-300 hover:bg-stone-700 gap-2"
                onClick={handleCopyCode}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 text-green-400" />
                    コピー済み
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    コピー
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex-1 bg-stone-900 p-4 overflow-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mb-4" />
                  <p className="text-stone-500">HTMLを生成中...</p>
                </div>
              ) : (
                <pre className="text-stone-300 text-sm font-mono whitespace-pre-wrap">
                  {outputHtml}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentArea;
