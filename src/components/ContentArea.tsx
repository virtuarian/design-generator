import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wand2, AlertTriangle, FileCode } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useView } from '@/contexts/ViewContext';

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
  
  // HTMLプレビューが表示されるフレームのrefを取得
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // HTMLの変換を実行
  const handleConvert = async () => {
    const result = await onConvert(settings);
    if (result) {
      setIsConverted(true);
      setSettingsChanged(false);
      setCurrentView('preview');
      
      // HTMLが生成されたらiframeを更新
      setTimeout(() => {
        updateIframeContent();
      }, 100);
    }
  };

  // iframeのコンテンツを更新
  const updateIframeContent = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(outputHtml);
      doc.close();
    }
  };

  // 入力されたテキストを更新
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  // HTML表示ボタン用の関数を追加
  const handleViewHtml = () => {
    // テキストエリアに埋め込みHTMLを表示
    const htmlViewer = window.open('', '_blank');
    if (htmlViewer) {
      htmlViewer.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>HTML Source</title>
          <style>
            body { margin: 0; padding: 20px; font-family: monospace; background: #f5f5f5; }
            pre { background: white; padding: 15px; border: 1px solid #ddd; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <pre>${outputHtml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </body>
        </html>
      `);
      htmlViewer.document.close();
    }
  };

  // HTML表示モードが選択されたら、iframeのコンテンツを更新
  React.useEffect(() => {
    if (currentView === 'preview' && outputHtml) {
      updateIframeContent();
    }
  }, [currentView, outputHtml]);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* ヘッダー部分 */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <div className="flex-1">
          <Tabs value={currentView} onValueChange={setCurrentView} className="w-[400px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="edit">編集</TabsTrigger>
              <TabsTrigger value="preview" disabled={!outputHtml}>プレビュー</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          {/* HTMLコード表示ボタンを追加 */}
          {outputHtml && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewHtml}
              className="gap-1"
            >
              <FileCode className="h-4 w-4" />
              <span>HTMLを表示</span>
            </Button>
          )}

          <Button 
            onClick={handleConvert} 
            disabled={isLoading || !inputText} 
            className="gap-2"
          >
            <Wand2 className="h-4 w-4" />
            {isLoading ? '生成中...' : 'HTMLを生成'}
          </Button>
        </div>
      </div>

      {/* コンテンツ部分 */}
      <div className="flex-1 overflow-hidden">
        {/* contentViewの値に応じて表示を切り替える */}
        {currentView === 'edit' ? (
          <div className="h-full p-4">
            <Textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder="ここにテキストを入力..."
              className="w-full h-full min-h-[300px] resize-none font-mono text-sm p-4"
            />
          </div>
        ) : (
          <div className="h-full">
            {settingsChanged && isConverted && (
              <Alert className="m-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  設定が変更されました。新しい設定でHTMLを再生成するには「HTMLを生成」ボタンをクリックしてください。
                </AlertDescription>
              </Alert>
            )}
            <iframe
              ref={iframeRef}
              title="HTML Preview"
              className="w-full h-full border-none"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentArea;
