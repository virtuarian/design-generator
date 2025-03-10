import React, { useState } from 'react';
import { Check, ChevronDown, Info } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AIModelInfo, AIProvider } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AI_MODELS, GROUPED_AI_MODELS } from '@/lib/constants/models';

interface ModelSelectorProps {
  selectedModelKey: string;
  onSelectModel: (modelKey: string) => void;
  showOnlyAdvanced?: boolean;
  compact?: boolean; // コンパクト表示用のプロパティ追加
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelKey,
  onSelectModel,
  showOnlyAdvanced = false,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 選択されたモデルの情報を取得
  const selectedModel = AI_MODELS[selectedModelKey];
  
  // 表示するモデルをフィルタリング
  const filterModels = (models: Array<{ key: string, model: AIModelInfo }>) => {
    if (showOnlyAdvanced) {
      return models.filter(item => item.model.isAdvanced);
    }
    return models;
  };

  const renderProviderModels = (provider: AIProvider, label: string) => {
    const models = filterModels(GROUPED_AI_MODELS[provider]);
    
    if (models.length === 0) return null;
    
    return (
      <>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {models.map(({ key, model }) => (
          <DropdownMenuItem
            key={key}
            className={`flex items-center justify-between ${selectedModelKey === key ? 'bg-amber-50' : ''}`}
            onClick={() => {
              onSelectModel(key);
              setIsOpen(false);
            }}
          >
            <span>{model.name}</span>
            {selectedModelKey === key && <Check size={16} className="text-amber-600" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
      </>
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          className={`${compact ? 'w-[110px] text-xs px-2' : 'w-48 text-sm'} justify-between bg-stone-700 border-stone-600 text-stone-100 hover:bg-stone-600`}
        >
          <span className="truncate">{selectedModel?.name || 'モデルを選択'}</span>
          <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
        <DropdownMenuGroup>
          {renderProviderModels('openai', 'OpenAI')}
          {renderProviderModels('anthropic', 'Anthropic')}
          {renderProviderModels('google', 'Google')}
          {renderProviderModels('ollama', 'Ollama')}
          {renderProviderModels('openrouter', 'OpenRouter')}          
        </DropdownMenuGroup>
        
        {selectedModel?.description && (
          <div className="p-2 text-xs text-stone-500 border-t border-stone-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help">
                    <Info className="h-3 w-3" />
                    <span className="truncate">{selectedModel.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{selectedModel.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelSelector;
