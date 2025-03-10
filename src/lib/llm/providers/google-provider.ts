import { BaseLLMProvider } from './base-provider';
import { LLMRequestParams, LLMResponse, LLMError, LLMErrorType, CustomPromptLLMRequestParams } from '../types';
import { AI_MODELS } from '../../constants/models';

/**
 * Google Gemini APIを使用するLLMプロバイダー
 */
export class GoogleProvider extends BaseLLMProvider {
  constructor(modelKey: string) {
    // modelKeyを使ってAI_MODELSから適切なモデル情報を取得
    const modelInfo = AI_MODELS[modelKey];
    if (!modelInfo || modelInfo.provider !== 'google') {
      throw new Error(`無効なGoogleモデル: ${modelKey}`);
    }

    const apiModelId = modelInfo.id;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${apiModelId}:generateContent`;

    super(
      'google',
      modelKey, 
      endpoint,
      apiModelId
    );
  }

  /**
   * Google Gemini APIを使用してHTMLを生成
   */
  async generateHTML(params: LLMRequestParams): Promise<LLMResponse> {
    this.refreshApiKey();
    
    if (!this.apiKey) {
      throw new LLMError(
        'Google APIキーが設定されていません',
        LLMErrorType.AUTH_ERROR,
        'google'
      );
    }

    const { message, settings, temperature = 0.7 } = params;
    const prompt = this.generatePrompt(message, settings);
    const apiUrl = `${this.endpoint}?key=${this.apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorType = this.getErrorType(response.status, error);
        throw new LLMError(
          error.error?.message || 'Google APIエラー',
          errorType,
          'google'
        );
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new LLMError(
          'レスポンスにデータがありません',
          LLMErrorType.UNKNOWN,
          'google'
        );
      }

      const content = this.extractHTMLContent(data.candidates[0].content.parts[0].text);

      return {
        content,
        model: 'gemini-pro',
        finishReason: data.candidates[0].finishReason || undefined,
        tokenUsage: data.usage ? {
          input: data.usage.promptTokenCount,
          output: data.usage.candidatesTokenCount,
          total: data.usage.totalTokenCount,
        } : undefined,
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      
      throw new LLMError(
        error instanceof Error ? error.message : '不明なエラーが発生しました',
        LLMErrorType.UNKNOWN,
        'google'
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
        'Google APIキーが設定されていません',
        LLMErrorType.AUTH_ERROR,
        'google'
      );
    }

    const { message, customPrompt, temperature = 0.7 } = params;
    
    // カスタムプロンプトとテキストを組み合わせた最終プロンプトを生成
    const finalPrompt = this.generateCustomFinalPrompt(message, customPrompt);
    const apiUrl = `${this.endpoint}?key=${this.apiKey}`;
// console.log('finalPrompt', finalPrompt);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: finalPrompt }]
            }
          ],
          systemInstruction: {
            parts: [{ text: "あなたはHTMLとCSSの専門家です。与えられたテキストをHTMLに変換し、指定されたスタイルを適用してください。" }]
          },
          generationConfig: {
            temperature,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorType = this.getErrorType(response.status, error);
        throw new LLMError(
          error.error?.message || 'Google APIエラー',
          errorType,
          'google'
        );
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new LLMError(
          'レスポンスにデータがありません',
          LLMErrorType.UNKNOWN,
          'google'
        );
      }

      const content = this.extractHTMLContent(data.candidates[0].content.parts[0].text);

      return {
        content,
        model: 'gemini-pro',
        finishReason: data.candidates[0].finishReason || undefined,
        tokenUsage: data.usage ? {
          input: data.usage.promptTokenCount,
          output: data.usage.candidatesTokenCount,
          total: data.usage.totalTokenCount,
        } : undefined,
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      
      throw new LLMError(
        error instanceof Error ? error.message : '不明なエラーが発生しました',
        LLMErrorType.UNKNOWN,
        'google'
      );
    }
  }

  /**
   * エラーのタイプを判別
   */
  private getErrorType(status: number, error: { error?: { message?: string } }): LLMErrorType {
    switch (status) {
      case 400:
        return LLMErrorType.INVALID_REQUEST;
      case 401:
      case 403:
        return LLMErrorType.AUTH_ERROR;
      case 429:
        return LLMErrorType.RATE_LIMIT;
      case 500:
      case 502:
      case 503:
        return LLMErrorType.SERVER_ERROR;
      default:
        console.log('Google APIエラー:', error);
        return LLMErrorType.UNKNOWN;
    }
  }
}