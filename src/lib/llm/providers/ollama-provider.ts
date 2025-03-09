import { BaseLLMProvider } from './base-provider';
import { LLMRequestParams, LLMResponse, LLMError, LLMErrorType, CustomPromptLLMRequestParams } from '../types';
import { AI_MODELS } from '../../constants/models';

/**
 * Ollama APIを使用するLLMプロバイダー
 */
export class OllamaProvider extends BaseLLMProvider {
  constructor(modelKey: string) {
    // modelKeyを使ってAI_MODELSから適切なモデル情報を取得
    const modelInfo = AI_MODELS[modelKey];
    if (!modelInfo || modelInfo.provider !== 'ollama') {
      throw new Error(`無効なOllamaモデル: ${modelKey}`);
    }

    const apiModelId = modelInfo.id;
    // ローカルのOllamaサーバーを想定
    const endpoint = 'http://localhost:11434/api/generate';

    super(
      'ollama',
      modelKey, 
      endpoint,
      apiModelId
    );
  }

  /**
   * Ollama APIを使用してHTMLを生成
   */
  async generateHTML(params: LLMRequestParams): Promise<LLMResponse> {
    this.refreshApiKey();
    
    // Ollamaはローカル実行の場合APIキーが不要な場合があるが、
    // リモートサーバーなど認証が必要な場合に備えて実装
    if (this.apiKey && this.apiKey.trim() === '') {
      console.warn('Ollama APIキーが設定されていません。ローカル環境では不要かもしれません。');
    }

    const { message, settings, temperature = 0.7 } = params;
    const prompt = this.generatePrompt(message, settings);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      // APIキーがある場合は認証ヘッダーを追加
      if (this.apiKey && this.apiKey.trim() !== '') {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: this.apiModelId,
          prompt,
          stream: false,
          temperature
        }),
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          error = { error: `HTTP error! status: ${response.status}` };
        }
        const errorType = this.getErrorType(response.status, error);
        throw new LLMError(
          error.error?.message || `Ollama APIエラー: ${response.statusText}`,
          errorType,
          'ollama'
        );
      }

      const data = await response.json();
      const content = this.extractHTMLContent(data.response);

      return {
        content,
        model: this.apiModelId,
        tokenUsage: data.eval_count ? {
          input: 0, // Ollamaは入力トークン数を提供していない場合がある
          output: data.eval_count || 0,
          total: data.eval_count || 0,
        } : undefined,
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      
      throw new LLMError(
        error instanceof Error ? error.message : '不明なエラーが発生しました',
        LLMErrorType.UNKNOWN,
        'ollama'
      );
    }
  }

  /**
   * カスタムプロンプトを使用してHTMLを生成
   */
  async generateHTMLWithCustomPrompt(params: CustomPromptLLMRequestParams): Promise<LLMResponse> {
    this.refreshApiKey();
    
    // Ollamaはローカル実行の場合APIキーが不要な場合があるが、
    // リモートサーバーなど認証が必要な場合に備えて実装
    if (this.apiKey && this.apiKey.trim() === '') {
      console.warn('Ollama APIキーが設定されていません。ローカル環境では不要かもしれません。');
    }

    const { message, customPrompt, temperature = 0.7 } = params;
    
    // カスタムプロンプトとテキストを組み合わせた最終プロンプトを生成
    const finalPrompt = this.generateCustomFinalPrompt(message, customPrompt);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      // APIキーがある場合は認証ヘッダーを追加
      if (this.apiKey && this.apiKey.trim() !== '') {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      // システム指示をプリペンドするためのフレーマー
      const systemInstruction = "あなたはHTMLとCSSの専門家です。与えられたテキストをHTMLに変換し、指定されたスタイルを適用してください。";
      
      // Ollamaでは多くのモデルがシステムプロンプト形式を認識するため、標準的な形式でシステムプロンプトを先頭に追加
      const promptWithSystem = `<|system|>\n${systemInstruction}\n<|user|>\n${finalPrompt}`;

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: this.apiModelId,
          prompt: promptWithSystem,
          stream: false,
          temperature
        }),
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          error = { error: `HTTP error! status: ${response.status}` };
        }
        const errorType = this.getErrorType(response.status, error);
        throw new LLMError(
          error.error?.message || `Ollama APIエラー: ${response.statusText}`,
          errorType,
          'ollama'
        );
      }

      const data = await response.json();
      const content = this.extractHTMLContent(data.response);

      return {
        content,
        model: this.apiModelId,
        tokenUsage: data.eval_count ? {
          input: 0, // Ollamaは入力トークン数を提供していない場合がある
          output: data.eval_count || 0,
          total: data.eval_count || 0,
        } : undefined,
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      
      throw new LLMError(
        error instanceof Error ? error.message : '不明なエラーが発生しました',
        LLMErrorType.UNKNOWN,
        'ollama'
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
      case 404:
        return LLMErrorType.INVALID_REQUEST; // モデルが見つからない場合など
      case 429:
        return LLMErrorType.RATE_LIMIT;
      case 500:
      case 502:
      case 503:
        return LLMErrorType.SERVER_ERROR;
      default:
        console.log('Ollama APIエラー:', error);
        return LLMErrorType.UNKNOWN;
    }
  }
}