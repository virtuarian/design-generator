import React from 'react';
import {X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useView } from '@/contexts/ViewContext';
import { SettingTab } from '@/lib/types';
import StyleSettings from './settings/StyleSettings';
import PromptSettings from './settings/PromptSettings';

interface SettingsPanelProps {
  onClose?: () => void; // 閉じるボタン用のコールバック
  embedded?: boolean; // ContentAreaに埋め込まれるかどうか
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, embedded = false }) => {
  // コンテキストから状態と関数を取得
  const { activeSetting, setActiveSetting } = useView();

  return (
    <div className={`flex flex-col h-full w-full ${embedded ? '' : 'border-r'} border-stone-200 bg-stone-50 overflow-y-auto`}>
      {!embedded && (
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-100 sticky top-0 z-10">
          <h2 className="text-lg font-medium text-stone-800">設定</h2>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="p-1 hover:bg-stone-200 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
      
      <div className="flex flex-col h-full">
        {/* ヘッダー */}
        <div className="p-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-medium text-stone-800">デザインスタイル設定</h2>
          <p className="text-xs text-stone-500 mt-1">
            スタイルを選択すると自動的に設定が適用されます
          </p>
        </div>
        
        {/* タブ コンポーネント */}
        <Tabs value={activeSetting} onValueChange={(value) => setActiveSetting(value as SettingTab)} className="flex-1 flex flex-col">
          {/* タブリスト */}
          <div className="p-4 border-b border-stone-200 bg-white sticky top-[77px] z-10">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="style">スタイル</TabsTrigger>
              <TabsTrigger value="prompt">プロンプト</TabsTrigger>
            </TabsList>
          </div>
          
          {/* タブコンテンツ - スクロール可能なエリア */}
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="style" className="p-4 h-auto">
              <StyleSettings />
            </TabsContent>

            <TabsContent value="prompt" className="p-4 h-auto">
              <PromptSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPanel;