import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { KeyRound, EyeIcon, EyeOffIcon, Copy, Check, Save } from 'lucide-react';
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
import { ApiProvider } from '@/lib/types';
import { saveApiKey, getApiKey } from '@/lib/storage';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ open, onOpenChange }) => {
  const [activeProvider, setActiveProvider] = useState<ApiProvider>('openai');
  const [apiKeys, setApiKeys] = useState<Record<ApiProvider, string>>({
    openai: '',
    anthropic: '',
    google: ''
  });
  const [showKey, setShowKey] = useState<Record<ApiProvider, boolean>>({
    openai: false,
    anthropic: false,
    google: false
  });
  const [copied, setCopied] = useState<Record<ApiProvider, boolean>>({
    openai: false,
    anthropic: false,
    google: false
  });
  const [saving, setSaving] = useState<boolean>(false);

  // APIキーをローカルストレージから読み込み
  useEffect(() => {
    const openaiKey = getApiKey('openai');
    const anthropicKey = getApiKey('anthropic');
    const googleKey = getApiKey('google');
    
    setApiKeys({
      openai: openaiKey,
      anthropic: anthropicKey,
      google: googleKey
    });
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
  const handleSave = () => {
    setSaving(true);
    
    try {
      Object.keys(apiKeys).forEach(provider => {
        if (apiKeys[provider as ApiProvider]) {
          saveApiKey(provider, apiKeys[provider as ApiProvider]);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-amber-600" />
            APIキー設定
          </DialogTitle>
          <DialogDescription>
            各AIプロバイダーのAPIキーを設定してください。キーはローカルに保存され、サーバーには送信されません。
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="openai" className="mt-2" onValueChange={(value) => setActiveProvider(value as ApiProvider)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
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
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button
            type="button"
            onClick={handleSave}
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
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
