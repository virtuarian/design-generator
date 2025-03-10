import { AIModelInfo, AIProvider } from "../types";

// サンプルテキスト
export const SAMPLE_TEXT = ``;

// サンプルHTML
export const SAMPLE_HTML = ``;

// AIモデルの情報
export const AI_MODELS: Record<string, AIModelInfo> = {
  // OpenAI モデル
  // 'gpt-4-turbo': {
  //   id: 'gpt-4-turbo-preview',
  //   name: 'GPT-4 Turbo',
  //   provider: 'openai',
  //   description: '最新のGPT-4モデル。高い理解力と生成能力を持つ',
  // },
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
  // 'gpt-3.5-turbo': {
  //   id: 'gpt-3.5-turbo',
  //   name: 'GPT-3.5 Turbo',
  //   provider: 'openai',
  //   description: 'コスト効率の良いGPT-3.5モデル',
  // },
  'gpt-3o-mini': {
    id: 'gpt-3o-mini',
    name: 'GPT-3o Mini',
    provider: 'openai',
    description: '軽量で高速なGPT-3モデル',
  },
  
  // Anthropic モデル
  // 'claude-3-opus': {
  //   id: 'claude-3-opus-20240229',
  //   name: 'Claude 3 Opus',
  //   provider: 'anthropic',
  //   isAdvanced: true,
  //   description: 'AnthropicのフラッグシップモデルClaude 3 Opus',
  // },
  // 'claude-3-sonnet': {
  //   id: 'claude-3-sonnet-20240229',
  //   name: 'Claude 3 Sonnet',
  //   provider: 'anthropic',
  //   description: 'バランスの取れたClaude 3 Sonnet',
  // },
  // 'claude-3-haiku': {
  //   id: 'claude-3-haiku-20240307',
  //   name: 'Claude 3 Haiku',
  //   provider: 'anthropic',
  //   description: '高速で効率的なClaude 3 Haiku',
  // },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet-latest',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: 'バランスの取れたClaude 3.5 Sonnet',
  },
  'claude-3-7-sonnet': {
    id: 'claude-3-7-sonnet-latest',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    description: '最も知的なモデルClaude 3.7 Sonnet',
  },
  
  // Google モデル
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    isAdvanced: true,
    description: 'バランスの取れたGeminiモデル',
  },
  'gemini-2.0-flash-lite': {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    provider: 'google',
    description: '最適化されたGeminiモデル',
  },
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    description: '最新のGeminiモデル',
  },
  'gemini-2.0-pro-exp': {
    id: 'gemini-2.0-pro-exp-02-05',
    name: 'Gemini 2.0 Pro (実験版)',
    provider: 'google',
    isAdvanced: true,
    description: 'Gemini 2.0実験版',
  },
  'gemini-2.0-flash-exp': {
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
export const DEFAULT_MODEL = 'gemini-2.0-flash-exp';

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
