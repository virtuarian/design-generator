import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCode, Eye, Code, Download, Check, Sparkles, Copy, RefreshCw, AlertTriangle, Settings } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useView } from '@/contexts/ViewContext';
import Preview from '@/components/Preview';
import { AppSettings } from '@/lib/types';
import SettingsPanel from './SettingsPanel';

// Content Areaのpropsを簡素化
interface ContentAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  outputHtml: string;
  isLoading: boolean;
  onConvert: (settings: AppSettings) => Promise<string | null>;
  onShowSettings?: () => void; // 設定パネル表示切り替えのためのコールバック
  isMobileView: boolean; // モバイルビューかどうかを判定するプロパティ
}

const ContentArea: React.FC<ContentAreaProps> = ({
  inputText, 
  setInputText, 
  outputHtml, 
  isLoading, 
  onConvert,
  isMobileView
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
  const [isDownloaded, setIsDownloaded] = useState(false);

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

  // HTMLをファイルとしてダウンロード
  const handleDownloadHtml = () => {
    if (!outputHtml) return;
    
    try {
      // Blobオブジェクトを作成
      const blob = new Blob([outputHtml], { type: 'text/html' });
      
      // ダウンロードリンクを作成
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      // ファイル名を設定（日時を追加して一意にする）
      const now = new Date();
      const timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
      a.download = `graphic_${timestamp}.html`;
      
      a.href = url;
      document.body.appendChild(a);
      a.click();
      
      // クリーンアップ
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // ダウンロード完了表示
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
    } catch (err) {
      console.error('HTMLのダウンロードに失敗しました', err);
    }
  };

  // HTMLを生成する関数
  const handleConvert = async () => {
    const result = await onConvert(settings);
    if (result) {
      setIsConverted(true);
      setSettingsChanged(false);
      
      // 変換が完了したら自動的にプレビュー画面に切り替え
      setCurrentView('preview');
    }
  };

  // 文字数をカウント
  const getCharCount = () => {
    return inputText.length;
  };

  return (
    <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
      <div className={`flex-1 flex flex-col overflow-hidden ${currentView === 'edit' && !isMobileView ? 'hidden md:flex' : ''}`}>
        <div className="flex justify-between items-center md:p-2 border-b border-stone-200">
          <div className="flex items-center space-x-4">
            <div className="flex bg-stone-100 rounded-lg p-1 overflow-x-auto">
              {/* 設定タブ */}
              <Button 
                variant={currentView === 'settings' ? "default" : "ghost"} 
                className={`text-xs md:text-sm gap-1 md:gap-1 ${currentView === 'settings' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                onClick={() => setCurrentView('settings')}
              >
                <Settings className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden md:inline">設定</span>
                <span className="md:hidden">設定</span>
              </Button>

              <Button 
                variant={currentView === 'edit' ? "default" : "ghost"} 
                className={`text-xs md:text-sm gap-1 md:gap-2 ${currentView === 'edit' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                onClick={() => setCurrentView('edit')}
              >
                <FileCode className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden md:inline">文章</span>
                <span className="md:hidden">文章</span>
              </Button>
              
              <Button 
                variant={currentView === 'preview' ? "default" : "ghost"} 
                className={`text-xs md:text-sm gap-1 md:gap-2 ${currentView === 'preview' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                onClick={() => setCurrentView('preview')}
                disabled={!isConverted && !isLoading}
              >
                <Eye className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden md:inline">プレビュー</span>
                <span className="md:hidden">表示</span>
              </Button>
              
              <Button 
                variant={currentView === 'code' ? "default" : "ghost"} 
                className={`text-xs md:text-sm gap-1 md:gap-2 ${currentView === 'code' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                onClick={() => setCurrentView('code')}
                disabled={!isConverted && !isLoading}
              >
                <Code className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden md:inline">HTML</span>
                <span className="md:hidden">HTML</span>
              </Button>
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
            
            {/* 保存ボタンをダウンロードボタンに変更 */}
            <Button 
              variant="outline" 
              size="sm" 
              className="text-stone-600 border-stone-300 gap-2"
              onClick={handleDownloadHtml}
              disabled={!isConverted || isLoading}
            >
              {isDownloaded ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  保存済み
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  保存
                </>
              )}
            </Button>
          </div>
        </div>
        <div className={`flex-1 overflow-hidden ${settingsChanged && isConverted ? 'opacity-80' : ''}`}>
          {/* 設定タブ (モバイル表示) */}
          {currentView === 'settings' && (
            <div className="h-full overflow-y-auto">
              <SettingsPanel embedded={true} />
            </div>
          )}
        
          {/* プレビュービュー */}
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

          {/* 編集ビュー（モバイル表示時のみ） */}
          {currentView === 'edit' && (
            <div className="h-full flex flex-col overflow-y-auto">
              <div className="bg-stone-50 pt-3 px-4 pb-2 flex-none"> {/* ここでpaddingを調整 */}
                <Card className="shadow-sm border-stone-200">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-stone-50 border-b border-stone-200 py-3"> {/* paddingを縮小 */}
                    <CardTitle className="text-amber-800 text-lg flex justify-between items-center">
                      <span>変換したい文章を入力</span>
                      <span className="text-sm text-stone-500 font-normal">文字数: {getCharCount()}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Textarea 
                      className="border-0 rounded-none min-h-40 p-4 text-stone-800 bg-white resize-none focus-visible:ring-0"
                      placeholder="ここに変換したい文章を入力してください..."
                      value={inputText}
                      onChange={handleTextChange}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex-1 p-4 bg-stone-100 flex items-center justify-center">
                <Button 
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-4 text-base shadow-md"
                  onClick={() => handleConvert()}
                  disabled={isLoading || inputText.trim().length === 0}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      変換中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      HTMLに変換
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ContentArea;
