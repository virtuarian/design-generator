import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { KeyRound, EyeIcon, EyeOffIcon, Copy, Check, Save, PlusCircle, Trash2, Edit, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';
import { ApiProvider, AIModelInfo } from '@/lib/types';
import { 
  saveApiKey, 
  getApiKey, 
  getCustomModels, 
  saveCustomModel, 
  removeCustomModel 
} from '@/lib/storage';
import { AI_MODELS } from '@/lib/constants/models';

interface LLMSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LLMSettingsDialog: React.FC<LLMSettingsDialogProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<string>('api-keys');
  const [activeProvider, setActiveProvider] = useState<ApiProvider>('openai');
  const [apiKeys, setApiKeys] = useState<Record<ApiProvider, string>>({
    openai: '',
    anthropic: '',
    google: '',
    ollama: '',
    openrouter: ''
  });
  const [showKey, setShowKey] = useState<Record<ApiProvider, boolean>>({
    openai: false,
    anthropic: false,
    google: false,
    ollama: false,
    openrouter: false
  });
  const [copied, setCopied] = useState<Record<ApiProvider, boolean>>({
    openai: false,
    anthropic: false,
    google: false,
    ollama: false,
    openrouter: false
  });
  const [saving, setSaving] = useState<boolean>(false);
  
  // モデル管理用の状態
  const [builtInModels, setBuiltInModels] = useState<Record<string, AIModelInfo>>({});
  const [customModels, setCustomModels] = useState<Record<string, AIModelInfo>>({});
  const [editingModel, setEditingModel] = useState<boolean>(false);
  const [currentModelKey, setCurrentModelKey] = useState<string>('');
  const [modelForm, setModelForm] = useState<{
    key: string;
    name: string;
    provider: ApiProvider;
    id: string;
    description: string;
    isAdvanced: boolean;
  }>({
    key: '',
    name: '',
    provider: 'openai',
    id: '',
    description: '',
    isAdvanced: false,
  });

  // APIキーとモデルのロード
  useEffect(() => {
    // APIキーをロード
    const openaiKey = getApiKey('openai');
    const anthropicKey = getApiKey('anthropic');
    const googleKey = getApiKey('google');
    const ollamaKey = getApiKey('ollama');
    const openrouterKey = getApiKey('openrouter');
    
    setApiKeys({
      openai: openaiKey,
      anthropic: anthropicKey,
      google: googleKey,
      ollama: ollamaKey,
      openrouter: openrouterKey
    });
    
    // モデルをロード
    setBuiltInModels({...AI_MODELS});
    setCustomModels(getCustomModels());
  }, [open]);

  // 表示・非表示の切り替え
  const toggleKeyVisibility = (provider: ApiProvider) => {
    setShowKey(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  // APIキーをコピー
  const copyToClipboard = async (provider: ApiProvider) => {
    try {
      await navigator.clipboard.writeText(apiKeys[provider]);
      setCopied(prev => ({ ...prev, [provider]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [provider]: false }));
      }, 2000);
    } catch (error) {
      toast.error('クリップボードへのコピーに失敗しました');
    }
  };

  // APIキーの保存
  const handleSaveApiKeys = () => {
    setSaving(true);
    
    try {
      Object.keys(apiKeys).forEach(provider => {
        if (apiKeys[provider as ApiProvider]) {
          saveApiKey(provider as ApiProvider, apiKeys[provider as ApiProvider]);
        }
      });
      
      toast.success('APIキーを保存しました');
      onOpenChange(false);
    } catch (error) {
      toast.error('APIキーの保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };
  
  // 新規モデル作成モードを開始
  const startCreateModel = () => {
    setModelForm({
      key: '',
      name: '',
      provider: 'openai',
      id: '',
      description: '',
      isAdvanced: false
    });
    setCurrentModelKey('');
    setEditingModel(true);
  };
  
  // モデル編集モードを開始
  const startEditModel = (modelKey: string) => {
    const model = customModels[modelKey] || builtInModels[modelKey];
    if (!model) return;
    
    setModelForm({
      key: modelKey,
      name: model.name,
      provider: model.provider,
      id: model.id,
      description: model.description || '',
      isAdvanced: model.isAdvanced || false
    });
    setCurrentModelKey(modelKey);
    setEditingModel(true);
  };
  
  // モデルを保存
  const saveModel = () => {
    // 入力検証
    if (!modelForm.name || !modelForm.id || !modelForm.key) {
      toast.error('必須項目を入力してください');
      return;
    }
    
    // モデルキーが既に存在するか確認（編集モードの場合は自分自身を除外）
    const isDuplicate = 
      (currentModelKey !== modelForm.key) && 
      (builtInModels[modelForm.key] || customModels[modelForm.key]);
      
    if (isDuplicate) {
      toast.error('同じキーのモデルが既に存在します');
      return;
    }
    
    // 新しいモデルオブジェクトを作成
    const newModel: AIModelInfo = {
      id: modelForm.id,
      name: modelForm.name,
      provider: modelForm.provider,
      description: modelForm.description,
      isAdvanced: modelForm.isAdvanced
    };
    
    // 前のモデルキーと異なる場合は削除
    if (currentModelKey && currentModelKey !== modelForm.key) {
      removeCustomModel(currentModelKey);
    }
    
    // 新しいモデルを保存
    saveCustomModel(modelForm.key, newModel);
    
    // カスタムモデルリストを更新
    setCustomModels(prevModels => ({
      ...prevModels,
      [modelForm.key]: newModel
    }));
    
    toast.success(currentModelKey ? 'モデルを更新しました' : 'モデルを追加しました');
    setEditingModel(false);
  };
  
  // モデルを削除
  const deleteModel = (modelKey: string) => {
    removeCustomModel(modelKey);
    setCustomModels(prevModels => {
      const newModels = {...prevModels};
      delete newModels[modelKey];
      return newModels;
    });
    toast.success('モデルを削除しました');
  };
  
  // モデル編集をキャンセル
  const cancelModelEdit = () => {
    setEditingModel(false);
  };
  
  // モデルプロバイダーの表示名
  const getProviderDisplayName = (provider: ApiProvider): string => {
    switch (provider) {
      case 'openai': return 'OpenAI';
      case 'anthropic': return 'Anthropic';
      case 'google': return 'Google';
      case 'ollama': return 'Ollama';
      case 'openrouter': return 'OpenRouter';
      default: return provider;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-amber-600" />
            LLM設定
          </DialogTitle>
          <DialogDescription>
            APIキーの設定と、LLMモデルの管理を行います
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="api-keys" className="mt-2" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="api-keys">APIキー</TabsTrigger>
            <TabsTrigger value="models">モデル管理</TabsTrigger>
          </TabsList>
          
          {/* APIキー設定タブ */}
          <TabsContent value="api-keys" className="space-y-4">
            <Tabs defaultValue="openai" onValueChange={(value) => setActiveProvider(value as ApiProvider)}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="openai">OpenAI</TabsTrigger>
                <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="ollama">Ollama</TabsTrigger>
                <TabsTrigger value="openrouter">OpenRouter</TabsTrigger>
              </TabsList>
              
              <TabsContent value="openai" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key" className="text-sm font-medium">
                    OpenAI API キー
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="openai-key"
                        type={showKey.openai ? "text" : "password"}
                        value={apiKeys.openai}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                        placeholder="sk-..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility('openai')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
                      >
                        {showKey.openai ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard('openai')}
                      disabled={!apiKeys.openai}
                    >
                      {copied.openai ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-stone-500">
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline"
                    >
                      OpenAIウェブサイト
                    </a>
                    からAPIキーを取得できます。
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="anthropic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key" className="text-sm font-medium">
                    Anthropic API キー
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="anthropic-key"
                        type={showKey.anthropic ? "text" : "password"}
                        value={apiKeys.anthropic}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
                        placeholder="sk-ant-..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility('anthropic')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
                      >
                        {showKey.anthropic ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard('anthropic')}
                      disabled={!apiKeys.anthropic}
                    >
                      {copied.anthropic ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-stone-500">
                    <a
                      href="https://console.anthropic.com/account/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline"
                    >
                      Anthropicウェブサイト
                    </a>
                    からAPIキーを取得できます。
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="google" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-key" className="text-sm font-medium">
                    Google API キー
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="google-key"
                        type={showKey.google ? "text" : "password"}
                        value={apiKeys.google}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, google: e.target.value }))}
                        placeholder="AIza..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility('google')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
                      >
                        {showKey.google ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard('google')}
                      disabled={!apiKeys.google}
                    >
                      {copied.google ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-stone-500">
                    <a
                      href="https://ai.google.dev/tutorials/setup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline"
                    >
                      Googleウェブサイト
                    </a>
                    からAPIキーを取得できます。
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="ollama" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ollama-key" className="text-sm font-medium">
                    Ollama API キー
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="ollama-key"
                        type={showKey.ollama ? "text" : "password"}
                        value={apiKeys.ollama}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, ollama: e.target.value }))}
                        placeholder="ローカル環境では空欄可"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility('ollama')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
                      >
                        {showKey.ollama ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard('ollama')}
                      disabled={!apiKeys.ollama}
                    >
                      {copied.ollama ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    ローカル環境でOllamaを使用する場合、通常はAPIキーは必要ありません。リモートOllamaサーバーを使用する場合は、そのサーバーの設定に従ってAPIキーを入力してください。
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="openrouter" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openrouter-key" className="text-sm font-medium">
                    OpenRouter API キー
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="openrouter-key"
                        type={showKey.openrouter ? "text" : "password"}
                        value={apiKeys.openrouter}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, openrouter: e.target.value }))}
                        placeholder="sk-or-..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility('openrouter')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
                      >
                        {showKey.openrouter ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard('openrouter')}
                      disabled={!apiKeys.openrouter}
                    >
                      {copied.openrouter ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline"
                    >
                      OpenRouterウェブサイト
                    </a>
                    からAPIキーを取得できます。複数のAIサービスに一括アクセス可能です。
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-4">
              <Button
                type="button"
                onClick={handleSaveApiKeys}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                disabled={saving}
              >
                {saving ? (
                  <><Save className="mr-2 h-4 w-4 animate-spin" /> 保存中...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> 保存</>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          {/* モデル管理タブ */}
          <TabsContent value="models">
            {editingModel ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-stone-700">
                  {currentModelKey ? 'モデルの編集' : '新規モデルの追加'}
                </h3>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="model-key" className="text-xs">モデルキー (一意の識別子)</Label>
                    <Input
                      id="model-key"
                      value={modelForm.key}
                      onChange={(e) => setModelForm(prev => ({ ...prev, key: e.target.value }))}
                      placeholder="例: gpt-4-custom"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="model-name" className="text-xs">表示名</Label>
                    <Input
                      id="model-name"
                      value={modelForm.name}
                      onChange={(e) => setModelForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="例: GPT-4 カスタム"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="model-provider" className="text-xs">プロバイダー</Label>
                    <Select
                      value={modelForm.provider}
                      onValueChange={(value: ApiProvider) => setModelForm(prev => ({ ...prev, provider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="プロバイダーを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="ollama">Ollama</SelectItem>
                        <SelectItem value="openrouter">OpenRouter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="model-id" className="text-xs">モデルID (API用)</Label>
                    <Input
                      id="model-id"
                      value={modelForm.id}
                      onChange={(e) => setModelForm(prev => ({ ...prev, id: e.target.value }))}
                      placeholder="例: gpt-4-turbo-preview"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="model-description" className="text-xs">説明 (オプション)</Label>
                    <Textarea
                      id="model-description"
                      value={modelForm.description}
                      onChange={(e) => setModelForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="モデルの説明"
                      className="text-sm resize-none h-20"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="model-advanced"
                      checked={modelForm.isAdvanced}
                      onChange={(e) => setModelForm(prev => ({ ...prev, isAdvanced: e.target.checked }))}
                      className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="model-advanced" className="text-xs cursor-pointer">
                      上級モデル (高性能・高価格)
                    </Label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={cancelModelEdit}>
                    キャンセル
                  </Button>
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={saveModel}
                  >
                    {currentModelKey ? '更新' : '追加'}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-stone-700">
                    カスタムモデル
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                    onClick={startCreateModel}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    追加
                  </Button>
                </div>
                
                <div className="space-y-2 mb-6">
                  {Object.keys(customModels).length === 0 ? (
                    <div className="text-center p-4 text-sm text-stone-500 bg-stone-100 rounded-md">
                      追加ボタンから新しいモデルを作成してください。
                    </div>
                  ) : (
                    Object.entries(customModels).map(([key, model]) => (
                      <div
                        key={key} 
                        className="flex items-center justify-between p-2 border rounded-md border-stone-200 hover:bg-stone-50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className="font-medium text-sm truncate">{model.name}</span>
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-stone-200 text-stone-700 rounded">
                              {getProviderDisplayName(model.provider)}
                            </span>
                            {model.isAdvanced && (
                              <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-800 rounded">
                                上級
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-500 truncate">{model.id}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={() => startEditModel(key)}
                          >
                            <Edit className="h-3.5 w-3.5 text-stone-500" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 w-7 p-0"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>モデルの削除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  「{model.name}」を削除してもよろしいですか？この操作は元に戻せません。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => deleteModel(key)}
                                >
                                  削除する
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* ビルトインモデル表示部分 */}
                <div className="space-y-2  max-h-[200px] overflow-y-auto" >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-stone-700">
                      標準モデル
                    </h3>
                    <div className="text-xs text-stone-500">(参照のみ)</div>
                  </div>
                  
                  {Object.entries(builtInModels).map(([key, model]) => (
                    <div
                      key={key} 
                      className="flex items-center p-2 border rounded-md border-stone-200 bg-stone-50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="font-medium text-sm truncate">{model.name}</span>
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-stone-200 text-stone-700 rounded">
                            {getProviderDisplayName(model.provider)}
                          </span>
                          {model.isAdvanced && (
                            <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-800 rounded">
                              上級
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500 truncate">{model.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 mt-6 p-3 bg-amber-50 text-amber-800 rounded-md text-xs">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p>ビルトインモデルは参照のみで、編集や削除はできません。カスタムモデルを追加して独自のモデル設定を行ってください。</p>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LLMSettingsDialog;
