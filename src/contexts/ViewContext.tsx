import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ViewMode, SettingTab } from '@/lib/types';

// コンテキストに含める値の型定義
interface ViewContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  activeSetting: SettingTab;
  setActiveSetting: (tab: SettingTab) => void;
  isAdvancedMode: boolean;
  setIsAdvancedMode: (advanced: boolean) => void;
  isConverted: boolean;
  setIsConverted: (converted: boolean) => void;
  settingsChanged: boolean;
  setSettingsChanged: (changed: boolean) => void;
  showHtmlCode: boolean;
  setShowHtmlCode: (show: boolean) => void;
}

// コンテキストの作成とデフォルト値の設定
const ViewContext = createContext<ViewContextType>({
  currentView: 'edit',
  setCurrentView: () => {},
  activeSetting: 'style', // デフォルトを'style'に設定
  setActiveSetting: () => {},
  isAdvancedMode: false,
  setIsAdvancedMode: () => {},
  isConverted: false,
  setIsConverted: () => {},
  settingsChanged: false,
  setSettingsChanged: () => {},
  showHtmlCode: false,
  setShowHtmlCode: () => {},
});

// コンテキストを使うためのカスタムフック
export const useView = () => useContext(ViewContext);

// プロバイダーのProps型定義
interface ViewProviderProps {
  children: ReactNode;
}

// プロバイダーコンポーネント
export const ViewProvider = ({ children }: ViewProviderProps) => {
  const [currentView, setCurrentView] = useState<ViewMode>('edit');
  // 明示的にデフォルト値を'style'に設定
  const [activeSetting, setActiveSetting] = useState<SettingTab>('style'); 
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [isConverted, setIsConverted] = useState<boolean>(false);
  const [settingsChanged, setSettingsChanged] = useState<boolean>(false);
  const [showHtmlCode, setShowHtmlCode] = useState<boolean>(false);

  // コンポーネントのマウント時に実行される効果
  useEffect(() => {
    // 確実にスタイルタブが選択されるようにする
    setActiveSetting('style');
  }, []);

  const value = {
    currentView,
    setCurrentView,
    activeSetting,
    setActiveSetting,
    isAdvancedMode,
    setIsAdvancedMode,
    isConverted,
    setIsConverted,
    settingsChanged,
    setSettingsChanged,
    showHtmlCode,
    setShowHtmlCode,
  };

  return (
    <ViewContext.Provider value={value}>
      {children}
    </ViewContext.Provider>
  );
};
