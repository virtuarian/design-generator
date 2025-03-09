import React from 'react';
import { AppSettings } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { ColorSettings } from './ColorSettings';
import { TypographySettings } from './TypographySettings';
import { LayoutSettings } from './LayoutSettings';

interface AdvancedSettingsProps {
  localSettings: AppSettings;
  setLocalSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  isAdvancedMode: boolean;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  localSettings,
  setLocalSettings,
  isAdvancedMode
}) => {
  const updateAdditionalInstructions = (value: string) => {
    setLocalSettings({
      ...localSettings,
      additionalInstructions: value
    });
  };

  return (
    <div className="p-4">
      <ColorSettings 
        localSettings={localSettings} 
        setLocalSettings={setLocalSettings} 
      />
      
      <TypographySettings 
        localSettings={localSettings} 
        setLocalSettings={setLocalSettings}
      />
      
      <LayoutSettings 
        localSettings={localSettings} 
        setLocalSettings={setLocalSettings}
      />
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-stone-500 mb-3">追加指示</h3>
        <Textarea 
          placeholder="AIに対する自由形式の追加指示をここに入力..."
          className="min-h-24 text-sm"
          value={localSettings.additionalInstructions}
          onChange={(e) => updateAdditionalInstructions(e.target.value)}
        />
      </div>
    </div>
  );
};
