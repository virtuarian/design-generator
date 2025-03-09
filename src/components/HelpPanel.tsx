import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface HelpPanelProps {
  onClose: () => void;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ onClose }) => {
  return (
    <div className="absolute right-5 top-16 w-80 bg-white shadow-lg rounded-lg border border-stone-200 z-10">
      <div className="flex justify-between items-center p-3 border-b border-stone-200 bg-amber-50">
        <h3 className="font-medium text-amber-800">使い方ガイド</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4 text-stone-500" />
        </Button>
      </div>
      
      <div className="p-4">
        <ul className="space-y-3 text-sm text-stone-700">
          <li className="flex gap-2">
            <div className="text-amber-600 flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>左側の入力エリアにテキストを入力し、「変換」ボタンをクリックするとHTMLが生成されます</span>
          </li>
          <li className="flex gap-2">
            <div className="text-amber-600 flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>左側の設定パネルでフォント、デザインスタイル、色などをカスタマイズできます</span>
          </li>
          <li className="flex gap-2">
            <div className="text-amber-600 flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>右上の⚙️アイコンからLLM設定ダイアログを開き、APIキーを設定できます</span>
          </li>
          <li className="flex gap-2">
            <div className="text-amber-600 flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>生成されたHTMLはコピーして他のアプリケーションで利用できます</span>
          </li>
        </ul>
        
        <Button variant="outline" size="sm" className="mt-4 w-full text-amber-700 border-amber-200 bg-amber-50">
          もっと見る
        </Button>
      </div>
    </div>
  );
};

export default HelpPanel;
