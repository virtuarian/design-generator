import { BaseLLMProvider } from './base-provider';
import { LLMRequestParams, LLMResponse, LLMError, LLMErrorType, CustomPromptLLMRequestParams } from '../types';
import { AI_MODELS } from '../../constants/models';

/**
 * Anthropic APIを使用するLLMプロバイダー
 */
export class AnthropicProvider extends BaseLLMProvider {
  constructor(modelKey: string) {
    // modelKeyを使ってAI_MODELSから適切なモデル情報を取得
    const modelInfo = AI_MODELS[modelKey];
    if (!modelInfo || modelInfo.provider !== 'anthropic') {
      throw new Error(`無効なAnthropicモデル: ${modelKey}`);
    }

    super(
      'anthropic',
      modelKey,
      'https://api.anthropic.com/v1/messages',
      modelInfo.id  // 実際のAPI用モデルID
    );
  }

  /**
   * Anthropic APIを使用してHTMLを生成
   */
  async generateHTML(params: LLMRequestParams): Promise<LLMResponse> {
    this.refreshApiKey();
    
    if (!this.apiKey) {
      throw new LLMError(
        'Anthropic APIキーが設定されていません',
        LLMErrorType.AUTH_ERROR,
        'anthropic'
      );
    }

    const { message, settings, temperature = 0.7, maxTokens } = params;
    const prompt = this.generatePrompt(message, settings);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.apiModelId,  // apiModelIdを使用
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens || 4000,
          temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorType = this.getErrorType(response.status, error);
        throw new LLMError(
          error.error?.message || 'Anthropic APIエラー',
          errorType,
          'anthropic'
        );
      }

      const data = await response.json();
      const content = this.extractHTMLContent(data.content[0].text);

      return {
        content,
        model: data.model,
        finishReason: data.stop_reason,
        tokenUsage: {
          input: data.usage?.input_tokens || 0,
          output: data.usage?.output_tokens || 0,
          total: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        },
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      
      throw new LLMError(
        error instanceof Error ? error.message : '不明なエラーが発生しました',
        LLMErrorType.UNKNOWN,
        'anthropic'
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
        'Anthropic APIキーが設定されていません',
        LLMErrorType.AUTH_ERROR,
        'anthropic'
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
          'X-API-Key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.apiModelId,
          messages: [
            { role: 'user', content: finalPrompt }
          ],
          system: "あなたはHTMLとCSSの専門家です。与えられたテキストをHTMLに変換し、指定されたスタイルを適用してください。",
          max_tokens: maxTokens || 4000,
          temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorType = this.getErrorType(response.status, error);
        throw new LLMError(
          error.error?.message || 'Anthropic APIエラー',
          errorType,
          'anthropic'
        );
      }

      const data = await response.json();
      const content = this.extractHTMLContent(data.content[0].text);

      return {
        content,
        model: data.model,
        finishReason: data.stop_reason,
        tokenUsage: {
          input: data.usage?.input_tokens || 0,
          output: data.usage?.output_tokens || 0,
          total: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        },
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      
      throw new LLMError(
        error instanceof Error ? error.message : '不明なエラーが発生しました',
        LLMErrorType.UNKNOWN,
        'anthropic'
      );
    }
  }

  /**
   * エラーのタイプを判別
   */
  private getErrorType(status: number, error: any): LLMErrorType {
    switch (status) {
      case 401:
        return LLMErrorType.AUTH_ERROR;
      case 429:
        return error.error?.type === 'rate_limit_exceeded'
          ? LLMErrorType.RATE_LIMIT
          : LLMErrorType.QUOTA_EXCEEDED;
      case 400:
        return LLMErrorType.INVALID_REQUEST;
      case 500:
      case 502:
      case 503:
        return LLMErrorType.SERVER_ERROR;
      default:
        return LLMErrorType.UNKNOWN;
    }
  }
}