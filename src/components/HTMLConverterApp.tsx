"use client";

import React, { useState, useEffect } from 'react';
import { Wand2, Settings, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AppSettings } from '@/lib/types'; // AppSettingsを明示的にインポート
import { getApiKey, getSettings, saveSettings, getCustomModels } from '@/lib/storage';
import { LLMFactory, LLMError, LLMErrorType } from '@/lib/llm';
import SettingsPanel from './SettingsPanel';
import ContentArea from './ContentArea';
import HelpPanel from './HelpPanel';
import LLMSettingsDialog from './LLMSettingsDialog';
import ModelSelector from './ModelSelector';
import { DEFAULT_SETTINGS } from '@/lib/constants/constants';
import { DEFAULT_MODEL, SAMPLE_TEXT, SAMPLE_HTML, AI_MODELS } from '@/lib/constants/models';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ViewProvider } from '@/contexts/ViewContext';

const HTMLConverterApp = () => {
  // モデル関連の状態
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXT);
  const [outputHtml, setOutputHtml] = useState<string>(SAMPLE_HTML);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);
  
  // LLM設定ダイアログ
  const [llmSettingsDialogOpen, setLlmSettingsDialogOpen] = useState<boolean>(false);

  // 設定をローカルストレージから読み込む
  // クライアントサイドレンダリング用のデフォルト値を設定
  const [initialSettings, setInitialSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // クライアントサイドで実行される初期化処理
  useEffect(() => {
    // ローカルストレージから設定を読み込む
    const settings = getSettings<AppSettings>('settings', DEFAULT_SETTINGS);
    setInitialSettings(settings);
    
    // 保存されたモデル設定を読み込む
    const savedModel = getSettings<string>('selected_model', DEFAULT_MODEL);
    
    // カスタムモデルを取得
    const customModels: Record<string, { provider: string, name: string }> = getCustomModels();
      
    // 選択されたモデルが存在するか確認（ビルトインまたはカスタム）
    const modelExists = AI_MODELS[savedModel] || customModels[savedModel];
    
    // モデルが存在する場合のみ設定
    if (modelExists) {
      setSelectedModel(savedModel);
      checkApiKeyForModel(savedModel, customModels);
    } else {
      // モデルが存在しない場合はデフォルトモデルを使用
      setSelectedModel(DEFAULT_MODEL);
      checkApiKeyForModel(DEFAULT_MODEL);
    }
  }, []);
  
  // 指定されたモデルのAPIキーをチェック
  const checkApiKeyForModel = (modelKey: string, customModels: Record<string, { provider: string, name: string }> = {}) => {
    const model = AI_MODELS[modelKey] || customModels[modelKey];
    if (!model) return;
    
    const apiKeyProvider = model.provider;
    const apiKey = getApiKey(apiKeyProvider);
    
    if (!apiKey) {
      toast.warning(`${getProviderDisplayName(apiKeyProvider)}のAPIキーが設定されていません`, {
        description: '設定アイコンからAPIキーを設定してください',
        action: {
          label: '設定する',
          onClick: () => setLlmSettingsDialogOpen(true)
        }
      });
    }
  };
  
  // プロバイダー名を表示用に変換
  const getProviderDisplayName = (provider: string): string => {
    switch (provider) {
      case 'openai': return 'OpenAI';
      case 'anthropic': return 'Anthropic';
      case 'google': return 'Google';
      case 'ollama': return 'Ollama';
      case 'openrouter': return 'OpenRouter';
      default: return provider;
    }
  };

  // モデル選択が変更された時の処理
  const handleModelChange = (modelKey: string) => {
    setSelectedModel(modelKey);
    saveSettings('selected_model', modelKey);
    
    // モデルに対応するAPIキーが設定されているかチェック
    checkApiKeyForModel(modelKey);
  };

  // HTMLへの変換処理
  const handleConvert = async (currentSettings: AppSettings) => {
    // すべてのモデル（ビルトインとカスタム）を結合
    const allModels = {...AI_MODELS, ...getCustomModels()};
    const modelInfo = allModels[selectedModel];
    
    if (!modelInfo) {
      toast.error('無効なモデルが選択されています');
      return null;
    }
    
    // APIキーのチェック
    const apiKeyProvider = modelInfo.provider;
    const apiKey = getApiKey(apiKeyProvider);
    
    if (!apiKey) {
      toast.error(`${getProviderDisplayName(apiKeyProvider)}のAPIキーが設定されていません`, {
        description: '変換を行うにはAPIキーの設定が必要です',
        action: {
          label: '設定する',
          onClick: () => setLlmSettingsDialogOpen(true)
        }
      });
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // LLMファクトリーを使用して適切なプロバイダーを取得
      const provider = LLMFactory.createProvider(selectedModel);
      
      // トースト通知用のIDを生成
      const toastId = `html-generation-${Date.now()}`;
      
      // デバッグ用ログを追加
      console.log('変換実行時のスタイル設定:', currentSettings.basic.designStyle);
      console.log('変換実行時のカスタムプロンプト (先頭部分):', 
        currentSettings.additionalInstructions ? currentSettings.additionalInstructions.substring(0, 150) + '...' : 'なし');
      
      // ローディング通知を表示
      toast.loading(`${modelInfo.name} でHTMLを生成中...`, { id: toastId });
      
      try {
        // カスタムプロンプトを直接使用してLLM呼び出しを実行
        const customPrompt = currentSettings.additionalInstructions || '';
        
        // LLM呼び出しを直接実行
        const response = await provider.generateHTMLWithCustomPrompt({
          message: inputText,
          model: selectedModel,
          customPrompt,
          temperature: 0.7
        });
      
        // 成功通知に更新
        toast.success('HTMLの生成が完了しました', { id: toastId });
      
        setOutputHtml(response.content);
        
        // トークン使用量がある場合は表示
        if (response.tokenUsage) {
          console.log('トークン使用量:', response.tokenUsage);
        }
        
        return response.content;
      } catch (err) {
        // エラー通知に更新
        toast.error(`エラーが発生しました: ${err instanceof Error ? err.message : '未知のエラー'}`, {
          id: toastId
        });
        return null;
      }
    } catch (error) {
      // エラー処理
      console.error('LLM呼び出しエラー:', error);
      
      if (error instanceof LLMError) {
        switch (error.type) {
          case LLMErrorType.AUTH_ERROR:
            toast.error('認証エラー: APIキーが無効です', {
              action: {
                label: '設定する',
                onClick: () => setLlmSettingsDialogOpen(true)
              }
            });
            break;
          case LLMErrorType.RATE_LIMIT:
            toast.error('レート制限エラー: APIの呼び出し頻度が高すぎます。少し時間をおいて再試行してください');
            break;
          case LLMErrorType.QUOTA_EXCEEDED:
            toast.error('クォータ超過エラー: APIの使用上限に達しました');
            break;
          case LLMErrorType.INVALID_REQUEST:
            toast.error('無効なリクエスト: 入力内容を確認してください');
            break;
          case LLMErrorType.SERVER_ERROR:
            toast.error('サーバーエラー: AI提供元のサーバーでエラーが発生しました');
            break;
          case LLMErrorType.TIMEOUT:
            toast.error('タイムアウト: リクエストがタイムアウトしました');
            break;
          default:
            toast.error(`エラーが発生しました: ${error.message}`);
            break;
        }
      } else {
        toast.error('不明なエラーが発生しました');
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsProvider initialSettings={initialSettings}>
      <ViewProvider>
        <div className="flex flex-col h-screen bg-stone-50">
          {/* ヘッダー */}
          <header className="bg-stone-800 text-stone-100 px-6 py-3 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <Wand2 className="text-amber-400" />
              <h1 className="text-xl font-medium">Design Generator</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* モデル選択ドロップダウン */}
              <ModelSelector 
                selectedModelKey={selectedModel}
                onSelectModel={handleModelChange}
                showOnlyAdvanced={false}
              />
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-stone-100 hover:bg-stone-700" 
                onClick={() => setShowTips(!showTips)}
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-stone-100 hover:bg-stone-700"
                onClick={() => setLlmSettingsDialogOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* メインエリア */}
          <main className="flex flex-1 overflow-hidden">
            {/* 左サイドパネル：設定 */}
            <SettingsPanel />

            {/* メインコンテンツエリア */}
            <ContentArea 
              inputText={inputText}
              setInputText={setInputText}
              outputHtml={outputHtml}
              isLoading={isLoading}
              onConvert={handleConvert}
            />
          </main>
          
          {/* ヘルプパネル */}
          {showTips && <HelpPanel onClose={() => setShowTips(false)} />}

          {/* LLM設定ダイアログ */}
          <LLMSettingsDialog 
            open={llmSettingsDialogOpen}
            onOpenChange={setLlmSettingsDialogOpen}
          />
        </div>
      </ViewProvider>
    </SettingsProvider>
  );
};

export default HTMLConverterApp;
