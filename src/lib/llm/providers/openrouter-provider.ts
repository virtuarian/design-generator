import { BaseLLMProvider } from './base-provider';
import { LLMRequestParams, LLMResponse, LLMError, LLMErrorType, CustomPromptLLMRequestParams } from '../types';
import { AI_MODELS } from '../../constants/models';

/**
 * OpenRouter APIを使用するLLMプロバイダー
 */
export class OpenRouterProvider extends BaseLLMProvider {
  constructor(modelKey: string) {
    // modelKeyを使ってAI_MODELSから適切なモデル情報を取得
    const modelInfo = AI_MODELS[modelKey];
    if (!modelInfo || modelInfo.provider !== 'openrouter') {
      throw new Error(`無効なOpenRouterモデル: ${modelKey}`);
    }

    const apiModelId = modelInfo.id; 
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

    super(
      'openrouter',
      modelKey, 
      endpoint,
      apiModelId
    );
  }

  /**
   * OpenRouter APIを使用してHTMLを生成
   */
  async generateHTML(params: LLMRequestParams): Promise<LLMResponse> {
    this.refreshApiKey();
    
    if (!this.apiKey) {
      throw new LLMError(
        'OpenRouter APIキーが設定されていません',
        LLMErrorType.AUTH_ERROR,
        'openrouter'
      );
    }

    const { message, settings, temperature = 0.7, maxTokens } = params;
    const prompt = this.generatePrompt(message, settings);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.href, // OpenRouter推奨ヘッダー
          'X-Title': 'HTML Converter' // アプリ名をヘッダーに含める
        },
        body: JSON.stringify({
          model: this.apiModelId,
          messages: [{ role: 'user', content: prompt }],
          temperature,
          max_tokens: maxTokens || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorType = this.getErrorType(response.status, error);
        throw new LLMError(
          error.error?.message || 'OpenRouter APIエラー',
          errorType,
          'openrouter'
        );
      }

      const data = await response.json();
      const content = this.extractHTMLContent(data.choices[0].message.content);

      return {
        content,
        model: data.model || this.apiModelId,
        finishReason: data.choices[0].finish_reason,
        tokenUsage: data.usage ? {
          input: data.usage.prompt_tokens,
          output: data.usage.completion_tokens,
          total: data.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      
      throw new LLMError(
        error instanceof Error ? error.message : '不明なエラーが発生しました',
        LLMErrorType.UNKNOWN,
        'openrouter'
      );
    }
  }

  /**
   * カスタムプロンプトを使用してHTMLを生成
   */
  async generateHTMLWithCustomPrompt(params: CustomPromptLLMRequestParams): Promise<LLMResponse> {
    this.refreshApiKey();
    
    if (!this.apiKey) {
      throw new LLMError(
        'OpenRouter APIキーが設定されていません',
        LLMErrorType.AUTH_ERROR,
        'openrouter'
      );
    }

    const { message, customPrompt, temperature = 0.7, maxTokens } = params;
    
    // カスタムプロンプトとテキストを組み合わせた最終プロンプトを生成
    const finalPrompt = this.generateCustomFinalPrompt(message, customPrompt);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.href, // OpenRouter推奨ヘッダー
          'X-Title': 'HTML Converter' // アプリ名をヘッダーに含める
        },
        body: JSON.stringify({
          model: this.apiModelId,
          messages: [
            {
              role: 'system',
              content: 'あなたはHTMLとCSSの専門家です。与えられたテキストをHTMLに変換し、指定されたスタイルを適用してください。'
            },
            { role: 'user', content: finalPrompt }
          ],
          temperature,
          max_tokens: maxTokens || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorType = this.getErrorType(response.status, error);
        throw new LLMError(
          error.error?.message || 'OpenRouter APIエラー',
          errorType,
          'openrouter'
        );
      }

      const data = await response.json();
      const content = this.extractHTMLContent(data.choices[0].message.content);

      return {
        content,
        model: data.model || this.apiModelId,
        finishReason: data.choices[0].finish_reason,
        tokenUsage: data.usage ? {
          input: data.usage.prompt_tokens,
          output: data.usage.completion_tokens,
          total: data.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      
      throw new LLMError(
        error instanceof Error ? error.message : '不明なエラーが発生しました',
        LLMErrorType.UNKNOWN,
        'openrouter'
      );
    }
  }

  /**
   * エラーのタイプを判別
   */
  private getErrorType(status: number, error: { error?: { message?: string } }): LLMErrorType {
    switch (status) {
      case 401:
        return LLMErrorType.AUTH_ERROR;
      case 402:
        return LLMErrorType.QUOTA_EXCEEDED;
      case 429:
        return LLMErrorType.RATE_LIMIT;
      case 400:
        return LLMErrorType.INVALID_REQUEST;
      case 500:
      case 502:
      case 503:
        return LLMErrorType.SERVER_ERROR;
      default:
        console.log('OpenRouter APIエラー:', error);
        return LLMErrorType.UNKNOWN;
    }
  }
}