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
        <h3 className="font-medium text-amber-800">変換のヒント</h3>
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
            <span>マークダウン形式で文章を入力するとより構造化されたHTMLに変換されます</span>
          </li>
          <li className="flex gap-2">
            <div className="text-amber-600 flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>見出しは「#」や「##」を使用して指定できます</span>
          </li>
          <li className="flex gap-2">
            <div className="text-amber-600 flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>箇条書きは「-」や「*」を使うとリストとして変換されます</span>
          </li>
          <li className="flex gap-2">
            <div className="text-amber-600 flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>強調したいテキストは「**太字**」や「*斜体*」で囲みます</span>
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
