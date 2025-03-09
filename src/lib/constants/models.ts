import { AIModelInfo, AIProvider } from "../types";

// サンプルテキスト
export const SAMPLE_TEXT = `ようこそ、私たちのサービスへ。

このサービスは、あなたのニーズに合わせたカスタマイズされたソリューションを提供します。長年の経験と専門知識を活かし、最高品質の結果をお約束します。

## 主な特徴

- 直感的で使いやすいインターフェース
- 柔軟なカスタマイズオプション
- 迅速なサポート対応

ぜひお気軽にお問い合わせください。あなたのプロジェクトの成功をサポートいたします。`;

// サンプルHTML
export const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>変換されたHTML</title>
  <style>
    :root {
      --color-primary: #B35C00;
      --color-secondary: #8A6552;
      --color-accent: #E9B171;
      --color-background: #FAF7F0;
      --color-text: #3D2C1E;
      --font-serif: 'Georgia', serif;
      --font-sans: 'Helvetica Neue', sans-serif;
    }
    
    body {
      font-family: var(--font-sans);
      background-color: var(--color-background);
      color: var(--color-text);
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1, h2, h3 {
      font-family: var(--font-serif);
      color: var(--color-primary);
    }
    
    h1 {
      font-size: 2.5rem;
      border-bottom: 2px solid var(--color-accent);
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    h2 {
      font-size: 1.8rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 1.5rem 0;
    }
    
    .feature-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .feature-icon {
      background-color: var(--color-primary);
      color: white;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
      flex-shrink: 0;
    }
    
    .highlight-box {
      background-color: #FFF8E8;
      border-left: 4px solid var(--color-accent);
      padding: 1rem;
      margin: 1.5rem 0;
      border-radius: 0.25rem;
    }
    
    .cta-button {
      background-color: var(--color-primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.25rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    
    .cta-button:hover {
      background-color: #8A4400;
    }
    
    .text-center {
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      h1 {
        font-size: 2rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>ようこそ、私たちのサービスへ</h1>
    
    <p>このサービスは、あなたのニーズに合わせたカスタマイズされたソリューションを提供します。長年の経験と専門知識を活かし、最高品質の結果をお約束します。</p>
    
    <h2>主な特徴</h2>
    
    <ul class="feature-list">
      <li class="feature-item">
        <div class="feature-icon">✓</div>
        <span>直感的で使いやすいインターフェース</span>
      </li>
      <li class="feature-item">
        <div class="feature-icon">✓</div>
        <span>柔軟なカスタマイズオプション</span>
      </li>
      <li class="feature-item">
        <div class="feature-icon">✓</div>
        <span>迅速なサポート対応</span>
      </li>
    </ul>
    
    <div class="highlight-box">
      <p>ぜひお気軽にお問い合わせください。あなたのプロジェクトの成功をサポートいたします。</p>
    </div>
    
    <div class="text-center">
      <button class="cta-button">お問い合わせ</button>
    </div>
  </div>
</body>
</html>`;

// AIモデルの情報
export const AI_MODELS: Record<string, AIModelInfo> = {
  // OpenAI モデル
  'gpt-4-turbo': {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: '最新のGPT-4モデル。高い理解力と生成能力を持つ',
  },
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'OpenAIの最新マルチモーダルモデル',
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: 'GPT-4oの軽量版。高速処理向き',
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'コスト効率の良いGPT-3.5モデル',
  },
  'gpt-3o-mini': {
    id: 'gpt-3o-mini',
    name: 'GPT-3o Mini',
    provider: 'openai',
    description: '軽量で高速なGPT-3モデル',
  },
  
  // Anthropic モデル
  'claude-3-opus': {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    isAdvanced: true,
    description: 'AnthropicのフラッグシップモデルClaude 3 Opus',
  },
  'claude-3-sonnet': {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    description: 'バランスの取れたClaude 3 Sonnet',
  },
  'claude-3-haiku': {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: '高速で効率的なClaude 3 Haiku',
  },
  
  // Google モデル
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    isAdvanced: true,
    description: 'Googleの高性能長文コンテキストモデル',
  },
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    description: '高速処理に最適化されたGeminiモデル',
  },
  'gemini-pro': {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    description: '標準的なGeminiモデル',
  },
  'gemini-2.0-pro': {
    id: 'gemini-2.0-pro-exp-02-05',
    name: 'Gemini 2.0 Pro (実験版)',
    provider: 'google',
    isAdvanced: true,
    description: 'Gemini 2.0実験版',
  },
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash-exp', 
    name: 'Gemini 2.0 Flash (実験版)',
    provider: 'google',
    description: 'Gemini 2.0 Flash実験版',
  },
  
  // Ollama モデル
  'llama3': {
    id: 'llama3',
    name: 'Llama 3',
    provider: 'ollama',
    description: 'Meta製のLlama 3モデル（ローカル実行）',
  },
  'mixtral': {
    id: 'mixtral',
    name: 'Mixtral 8x7B',
    provider: 'ollama',
    description: 'Mixtral 8x7B Instruct（ローカル実行）',
  },
  'codellama': {
    id: 'codellama',
    name: 'CodeLlama',
    provider: 'ollama',
    description: 'コード生成に特化したLlamaモデル（ローカル実行）',
    isAdvanced: true,
  },
  
  // OpenRouter モデル
  'openrouter-llama3': {
    id: 'meta/llama-3-70b-instruct',
    name: 'Llama 3 70B (OR)',
    provider: 'openrouter',
    description: 'OpenRouter経由のLlama 3 70B',
    isAdvanced: true,
  },
  'openrouter-claude-3': {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus (OR)',
    provider: 'openrouter',
    description: 'OpenRouter経由のClaude 3 Opus',
    isAdvanced: true,
  },
  'openrouter-mixtral': {
    id: 'mistralai/mixtral-8x7b-instruct',
    name: 'Mixtral 8x7B (OR)',
    provider: 'openrouter',
    description: 'OpenRouter経由のMixtral',
  },
};

// デフォルトのモデル選択
export const DEFAULT_MODEL = 'gpt-4-turbo';

// プロバイダー別にモデルをグループ化（キーも保持する）
export const GROUPED_AI_MODELS: Record<AIProvider, Array<{ key: string, model: AIModelInfo }>> = (() => {
  const result: Record<AIProvider, Array<{ key: string, model: AIModelInfo }>> = {
    'openai': [],
    'anthropic': [],
    'google': [],
    'ollama': [],
    'openrouter': []
  };
  
  Object.entries(AI_MODELS).forEach(([key, model]) => {
    if (model.provider in result) {
      result[model.provider].push({ key, model });
    }
  });
  
  return result;
})();
