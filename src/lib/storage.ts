// ローカルストレージ操作のためのユーティリティ関数

import { AIModelInfo } from './types';

// APIキーの保存 - 一貫性のある方法に修正
export const saveApiKey = (provider: string, key: string): void => {
  try {
    // ローカルストレージに個別のキーで保存
    localStorage.setItem(`html_converter_api_key_${provider}`, key);
    console.log(`APIキーを保存しました: ${provider}`);
  } catch (error) {
    console.error(`APIキーの保存に失敗しました: ${provider}`, error);
  }
};

// すべてのAPIキーを取得 - 互換性のため残しつつ修正
export const getApiKeys = (): Record<string, string> => {
  try {
    const providers = ['openai', 'anthropic', 'google', 'ollama', 'openrouter'];
    const keys: Record<string, string> = {};
    
    // 各プロバイダーのキーを取得
    providers.forEach(provider => {
      const key = localStorage.getItem(`html_converter_api_key_${provider}`);
      if (key) {
        keys[provider] = key;
      }
    });
    
    return keys;
  } catch (error) {
    console.error('APIキーの取得に失敗しました', error);
    return {};
  }
};

// 特定のプロバイダーのAPIキーを取得
export const getApiKey = (provider: string): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  try {
    const key = localStorage.getItem(`html_converter_api_key_${provider}`);
    // console.log(`APIキー取得試行: ${provider}, 結果: ${key ? '成功' : '未設定'}`);
    return key || '';
  } catch (error) {
    console.error(`APIキーの取得に失敗しました: ${provider}`, error);
    return '';
  }
};

// プロバイダーのAPIキーを削除
export const removeApiKey = (provider: string): void => {
  try {
    localStorage.removeItem(`html_converter_api_key_${provider}`);
  } catch (error) {
    console.error(`APIキーの削除に失敗しました: ${provider}`, error);
  }
};

// すべての設定をローカルストレージに保存
export const saveSettings = <T>(key: string, value: T): void => {
  // サーバーサイドレンダリング時は、localStorageへのアクセスをスキップ
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(`html_converter_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`設定の保存に失敗しました: ${key}`, error);
  }
};

// ローカルストレージから設定を取得
export const getSettings = <T>(key: string, defaultValue: T): T => {
  // サーバーサイドレンダリング時は、localStorageへのアクセスをスキップ
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const data = localStorage.getItem(`html_converter_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`設定の取得に失敗しました: ${key}`, error);
    return defaultValue;
  }
};

// カスタムモデルを保存
export const saveCustomModels = (models: Record<string, AIModelInfo>): void => {
  try {
    localStorage.setItem('html_converter_custom_models', JSON.stringify(models));
  } catch (error) {
    console.error('カスタムモデルの保存に失敗しました', error);
  }
};

// カスタムモデルを取得
export const getCustomModels = (): Record<string, AIModelInfo> => {
  try {
    const models = localStorage.getItem('html_converter_custom_models');
    return models ? JSON.parse(models) : {};
  } catch (error) {
    console.error('カスタムモデルの取得に失敗しました', error);
    return {};
  }
};

// 特定のカスタムモデルを保存
export const saveCustomModel = (key: string, model: AIModelInfo): void => {
  try {
    const models = getCustomModels();
    models[key] = model;
    saveCustomModels(models);
  } catch (error) {
    console.error('カスタムモデルの保存に失敗しました', error);
  }
};

// カスタムモデルを削除
export const removeCustomModel = (key: string): void => {
  try {
    const models = getCustomModels();
    if (models[key]) {
      delete models[key];
      saveCustomModels(models);
    }
  } catch (error) {
    console.error('カスタムモデルの削除に失敗しました', error);
  }
};
