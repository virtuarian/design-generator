import { AppSettings } from '../types';

/**
 * LLMのリクエストパラメータ
 */
export interface LLMRequestParams {
  message: string;
  model: string;
  settings: AppSettings;
  temperature?: number;
  maxTokens?: number;
}

/**
 * LLMのレスポンス
 */
export interface LLMResponse {
  content: string;
  fullResponse?: string;
  model?: string;
  finishReason?: string;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
}

export interface CustomPromptLLMRequestParams {
  message: string;
  model: string;
  customPrompt: string;
  temperature?: number;
  maxTokens?: number;
}


/**
 * すべてのLLMプロバイダーが実装すべきインターフェース
 */
export interface LLMProvider {
  /**
   * HTMLを生成する
   */
  generateHTML(params: LLMRequestParams): Promise<LLMResponse>;

  /**
   * プロバイダーが利用可能かを確認する
   */
  isAvailable(): Promise<boolean>;

  /**
   * モデル名を取得する
   */
  getModelName(): string;

  /**
   * デバッグ用プロンプトを生成する
   */
  generateDebugPrompt(text: string, settings: AppSettings): string;

  /**
   * プロンプトを利用してHTMLを生成する
   */
  generateHTML(params: LLMRequestParams): Promise<LLMResponse>;

  /**
   * カスタムプロンプトを利用してHTMLを生成する
   */
  generateHTMLWithCustomPrompt(params: CustomPromptLLMRequestParams): Promise<LLMResponse>;

}

/**
 * LLMエラータイプ
 */
export enum LLMErrorType {
  AUTH_ERROR = 'auth_error',
  RATE_LIMIT = 'rate_limit',
  QUOTA_EXCEEDED = 'quota_exceeded',
  INVALID_REQUEST = 'invalid_request',
  SERVER_ERROR = 'server_error',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

/**
 * LLMエラークラス
 */
export class LLMError extends Error {
  type: LLMErrorType;
  provider: string;

  constructor(message: string, type: LLMErrorType = LLMErrorType.UNKNOWN, provider: string = 'unknown') {
    super(message);
    this.name = 'LLMError';
    this.type = type;
    this.provider = provider;
  }
}
