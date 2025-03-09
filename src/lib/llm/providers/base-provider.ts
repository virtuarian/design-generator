import { LLMProvider, LLMRequestParams, LLMResponse, CustomPromptLLMRequestParams } from '../types';
import { getApiKey } from '../../storage';
import { AppSettings } from '../../types';
import { getStyleDefinition } from '../../constants/styleDefinitions';

/**
 * LLMプロバイダーの基本クラス
 * 共通機能を提供し、派生クラスで特定のLLMの実装を行う
 */
export abstract class BaseLLMProvider implements LLMProvider {
  protected apiKey: string;
  protected provider: string;
  protected modelName: string;
  protected endpoint: string;
  protected apiModelId: string;  // 実際のAPI呼び出しで使用するモデルID

  constructor(provider: string, modelName: string, endpoint: string, apiModelId: string) {
    this.provider = provider;
    this.modelName = modelName;
    this.endpoint = endpoint;
    this.apiModelId = apiModelId;
    this.apiKey = getApiKey(provider);
  }

  /**
   * APIキーをローカルストレージから再取得
   */
  protected refreshApiKey(): void {
    this.apiKey = getApiKey(this.provider);
  }

  /**
   * HTML生成リクエストを送信
   * 各プロバイダーで実装が必要
   */
  abstract generateHTML(params: LLMRequestParams): Promise<LLMResponse>;

  /**
   * プロバイダーがAPIキーを持ち、使用可能か確認
   */
  async isAvailable(): Promise<boolean> {
    this.refreshApiKey();
    return Boolean(this.apiKey);
  }

  /**
   * モデル名を取得
   */
  getModelName(): string {
    return this.modelName;
  }

  /**
 * カスタムプロンプトを使用してHTML生成リクエストを送信
 * このメソッドは各プロバイダーで実装する必要あり
 */
  abstract generateHTMLWithCustomPrompt(params: CustomPromptLLMRequestParams): Promise<LLMResponse>;

  // カスタムプロンプトとテキストを組み合わせた最終的なプロンプトを生成
  protected generateCustomFinalPrompt(text: string, customPrompt: string): string {
    // カスタムプロンプトと入力テキストを組み合わせる
    // カスタムプロンプトにコンテンツセクションがあるか確認
    if (customPrompt.includes('## コンテンツ')) {
      // すでにコンテンツセクションがある場合は、ダミーテキストを実際のコンテンツに置き換える
      const contentPlaceholder = 'プレビュー用テキストがここに入ります。';
      return customPrompt.replace(contentPlaceholder, text);
    } else {
      // コンテンツセクションがない場合は、単純に追加する
      return `
${customPrompt}

## コンテンツ
${text}

## 出力形式
- 完全なHTMLを生成してください (DOCTYPE, html, head, body要素を含む)
- インラインCSSを使って、上記の設定を適用してください
- CSSカスタムプロパティ (変数) を使用して、色やフォントなどを一元管理してください
- モバイルレスポンシブなデザインにしてください
- 実際にブラウザで動作する有効なHTMLとCSSを生成してください
- マークアップはセマンティックで、アクセシビリティを考慮してください

HTMLのみを出力してください。説明は不要です。
`;
    }
  }

  // デバッグ用のカスタムプロンプト表示メソッド
  public generateDebugPrompt(text: string, settings: AppSettings): string {
    // スタイル定義を取得して設定に反映されているか確認できるようにする
    const styleDefinition = getStyleDefinition(settings.basic.designStyle);
    return `スタイル: ${styleDefinition.displayName}\n\n${settings.additionalInstructions || 'カスタムプロンプトが設定されていません'}`;
  }

  /**
   * レスポンスからHTMLコンテンツを抽出するヘルパーメソッド
   * プロバイダーごとにオーバーライド可能
   */
  protected extractHTMLContent(text: string): string {
    // HTMLタグを含むコンテンツを抽出する基本ロジック
    // ```html と ``` の間のコンテンツを探す
    const htmlRegex = /```html\n?([\s\S]*?)```/;
    const match = text.match(htmlRegex);

    if (match && match[1]) {
      return match[1].trim();
    }

    // HTMLタグで囲まれたコンテンツを探す
    if (text.includes('<html') && text.includes('</html>')) {
      const startIndex = text.indexOf('<html');
      const endIndex = text.lastIndexOf('</html>') + 7;
      return text.substring(startIndex, endIndex).trim();
    }

    // <!DOCTYPE から始まるコンテンツを探す
    if (text.includes('<!DOCTYPE')) {
      const startIndex = text.indexOf('<!DOCTYPE');
      return text.substring(startIndex).trim();
    }

    // どれも見つからなければ、元のテキストを返す
    return text.trim();
  }

  /**
   * プロンプトテンプレートを生成するヘルパーメソッド
   * 注: 現在は使用されていませんが、将来の拡張のために残しています
   */
  protected generatePrompt(text: string, settings: AppSettings): string {
    // スタイル定義を取得
    const styleDefinition = getStyleDefinition(settings.basic.designStyle);
    
    // 簡易版のプロンプトを生成
    return `
あなたはグラレコメーカーです。以下のテキストをHTMLに変換してください。
スタイル: ${styleDefinition.displayName}

${styleDefinition.prompt}

## コンテンツ
${text}

## 出力形式
完全なHTMLを生成してください。
`;
  }

}
