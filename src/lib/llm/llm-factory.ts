import { LLMProvider } from './types';
import { OpenAIProvider } from './providers/openai-provider';
import { AnthropicProvider } from './providers/anthropic-provider';
import { GoogleProvider } from './providers/google-provider';
import { OllamaProvider } from './providers/ollama-provider';
import { OpenRouterProvider } from './providers/openrouter-provider';
import { getCustomModels } from '../storage';
import { AIModelInfo } from '../types';
import { AI_MODELS } from '../constants/models';

/**
 * 必要なLLMプロバイダーを生成するファクトリークラス
 */
export class LLMFactory {
  /**
   * モデルKeyに基づいて適切なプロバイダーを生成
   * @param modelKey AI_MODELSまたはカスタムモデルのキー
   */
  static createProvider(modelKey: string): LLMProvider {
    // ビルトインとカスタムモデルを結合
    const allModels: Record<string, AIModelInfo> = {
      ...AI_MODELS,
      ...getCustomModels()
    };

    const modelInfo = allModels[modelKey];
    if (!modelInfo) {
      throw new Error(`未定義のLLMモデル: ${modelKey}`);
    }

    // モデル情報からプロバイダータイプに応じたインスタンスを生成
    switch (modelInfo.provider) {
      case 'openai':
        return new OpenAIProvider(modelKey);
      case 'anthropic':
        return new AnthropicProvider(modelKey);
      case 'google':
        return new GoogleProvider(modelKey);
      case 'ollama':
        return new OllamaProvider(modelKey);
      case 'openrouter':
        return new OpenRouterProvider(modelKey);
      default:
        throw new Error(`未対応のLLMプロバイダー: ${modelInfo.provider}`);
    }
  }
}
