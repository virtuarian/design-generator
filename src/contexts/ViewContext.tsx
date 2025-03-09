import { createContext, useContext, useState, ReactNode } from 'react';
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
  activeSetting: 'basic',
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
  const [activeSetting, setActiveSetting] = useState<SettingTab>('basic');
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [isConverted, setIsConverted] = useState<boolean>(false);
  const [settingsChanged, setSettingsChanged] = useState<boolean>(false);
  const [showHtmlCode, setShowHtmlCode] = useState<boolean>(false);

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
