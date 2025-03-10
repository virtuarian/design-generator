import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { AppSettings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/constants/constants';
import { saveSettings, getSettings } from '@/lib/storage';

// コンテキストに含める値の型定義
interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
  customPrompt: string;
  updateCustomPrompt: (newPrompt: string) => void;
  generatedPrompt: string;
  setGeneratedPrompt: (prompt: string) => void;
  showPromptPreview: boolean;
  setShowPromptPreview: (show: boolean) => void;
  customStyles: StyleDefinition[];
  setCustomStyles: (styles: StyleDefinition[]) => void;
}

// StyleDefinition型を追加
export interface StyleDefinition {
  id: string;
  displayName: string;
  description: string;
  prompt: string;
}

// コンテキストの作成とデフォルト値の設定
const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  customPrompt: '',
  updateCustomPrompt: () => {},
  generatedPrompt: '',
  setGeneratedPrompt: () => {},
  showPromptPreview: false,
  setShowPromptPreview: () => {},
  customStyles: [],
  setCustomStyles: () => {},
});

// コンテキストを簡単に使えるようにするカスタムフック
export const useSettings = () => useContext(SettingsContext);

// プロバイダーのProps型定義
interface SettingsProviderProps {
  initialSettings?: AppSettings;
  children: ReactNode;
}

// プロバイダーコンポーネント
export const SettingsProvider = ({ children, initialSettings }: SettingsProviderProps) => {
  // 初期設定を読み込む（引数で渡された値を優先）
  const [settings, setSettings] = useState<AppSettings>(() => {
    return initialSettings || DEFAULT_SETTINGS;
  });
  
  const [customPrompt, setCustomPrompt] = useState<string>(
    initialSettings?.additionalInstructions || ''
  );
  
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [showPromptPreview, setShowPromptPreview] = useState<boolean>(false);
  const [customStyles, setCustomStylesState] = useState<Array<StyleDefinition>>([]);

  // コンポーネントの初期化時にカスタムスタイルをロード
  useEffect(() => {
    try {
      const savedCustomStyles = getSettings<Array<StyleDefinition>>('custom_styles', []);
      if (savedCustomStyles && Array.isArray(savedCustomStyles) && savedCustomStyles.length > 0) {
        setCustomStylesState(savedCustomStyles);
      }
    } catch (e) {
      console.error('カスタムスタイルの読み込みエラー:', e);
    }
  }, []);

  // カスタムスタイルが変更されたときにローカルストレージに保存
  useEffect(() => {
    try {
      if (customStyles.length > 0 || customStyles.length === 0) {
        // いずれの場合も保存（空配列の場合も保存する）
        saveSettings('custom_styles', customStyles);
      }
    } catch (e) {
      console.error('カスタムスタイルの保存に失敗しました:', e);
    }
  }, [customStyles]);

  // メモ化した設定更新関数
  const updateSettings = useCallback((newSettings: AppSettings) => {
    // console.log('設定を更新: スタイル=', newSettings.basic.designStyle);
    
    // 参照の問題を避けるため、完全に新しいオブジェクトを作成
    // structuredCloneはJavaScriptの組み込み関数で、オブジェクトのディープコピーを作成
    try {
      const clonedSettings = structuredClone(newSettings);
      
      // 設定を更新
      setSettings(clonedSettings);
      
      // ローカルストレージに保存
      saveSettings('settings', clonedSettings);
      
    //   console.log('設定更新完了:', clonedSettings.basic.designStyle);
    } catch (error:unknown) {
      console.error('設定更新エラー:', error);
      
      // フォールバック：JSONを使った方法
      const jsonCopy = JSON.parse(JSON.stringify(newSettings));
      setSettings(jsonCopy);
      saveSettings('settings', jsonCopy);
    }
  }, []);

  // メモ化したカスタムプロンプト更新関数
  const updateCustomPrompt = useCallback((newPrompt: string) => {
    setCustomPrompt(newPrompt);
    
    // customPromptが更新されたら、settingsも更新
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        additionalInstructions: newPrompt
      };
      
      // ローカルストレージに保存
      saveSettings('settings', updatedSettings);
      
      return updatedSettings;
    });
  }, []);

  // カスタムスタイルの状態更新関数をラップ（必要に応じて追加ロジックを実装）
  const setCustomStyles = (styles: StyleDefinition[]) => {
    setCustomStylesState(styles);
  };

  // コンテキスト値
  const value = {
    settings,
    updateSettings,
    customPrompt,
    updateCustomPrompt,
    generatedPrompt, 
    setGeneratedPrompt,
    showPromptPreview,
    setShowPromptPreview,
    customStyles,
    setCustomStyles,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
