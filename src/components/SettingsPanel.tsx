import React, { useState, useEffect, useRef } from 'react';
import {X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, RefreshCw, MessageSquare, Plus, Edit, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStyleDefinition } from '@/lib/constants/styleDefinitions';
import { useSettings } from '@/contexts/SettingsContext';
import { useView } from '@/contexts/ViewContext';
import { DesignStyle as AppDesignStyle, SettingTab } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { saveSettings, getSettings } from '@/lib/storage';
import { toast } from 'sonner';
// スタイル定義の型を定義
interface StyleDefinition {
  id: string;
  displayName: string;
  description: string;
  prompt: string;
}

// すべてのスタイルオプションを定義
const DESIGN_STYLE_OPTIONS = [
  { id: 'standard', displayName: '標準' },
  { id: 'graphicRecordingNormal', displayName: 'グラレコ-ノーマル' },
  { id: 'graphicRecordingBusiness', displayName: 'グラレコ-ビジネス' }, 
  { id: 'graphicRecordingAnimation', displayName: 'グラレコ-アニメーション' },
  { id: 'textbook', displayName: '教科書風' },
  { id: 'magazine', displayName: '雑誌風' }
];

interface SettingsPanelProps {
  onClose?: () => void; // 閉じるボタン用のコールバック
  embedded?: boolean; // ContentAreaに埋め込まれるかどうか
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, embedded = false }) => {
  // コンテキストから状態と関数を取得
  const { 
    settings,
    updateSettings,
    customPrompt,
    updateCustomPrompt,
    generatedPrompt,
    setGeneratedPrompt,
    showPromptPreview,
    setShowPromptPreview
  } = useSettings();
  
  const { activeSetting, setActiveSetting, setSettingsChanged } = useView();

  // ローカルステートを使用して選択状態を管理（問題の回避策）
  const [selectedStyle, setSelectedStyle] = useState<string>(settings.basic.designStyle);

  // スタイル管理のための状態 - 先に宣言する
  const [isAddingStyle, setIsAddingStyle] = useState(false);
  const [isEditingStyle, setIsEditingStyle] = useState(false);
  const [isDeletingStyle, setIsDeletingStyle] = useState(false);
  const [editedStyleId, setEditedStyleId] = useState('');
  const [styleForm, setStyleForm] = useState<StyleDefinition>({
    id: '',
    displayName: '',
    description: '',
    prompt: ''
  });
  
  // ↓ この変数宣言を useEffect より前に移動
  const [customStyles, setCustomStyles] = useState<Array<StyleDefinition>>([]);
  
  // カスタムスタイルの参照を保持するためのref
  const customStylesRef = useRef<Array<StyleDefinition>>([]);
  
  // カスタムスタイルの状態が更新されたらrefも更新
  useEffect(() => {
    customStylesRef.current = customStyles;
  }, [customStyles]);

  // 設定が変更されたときにローカルステートを同期
  useEffect(() => {
    setSelectedStyle(settings.basic.designStyle);
    // console.log('設定変更を検知: 現在のスタイル =', settings.basic.designStyle);
  }, [settings.basic.designStyle]);

  // コンポーネントがマウントされた時に必ずスタイルタブをアクティブにする
  // 空の依存配列を使って初回レンダリング時のみ実行されるように修正
  useEffect(() => {
    setActiveSetting('style');
    // console.log('初期タブを設定: style');
  }, [setActiveSetting]); // 依存配列を空に設定

  // プロンプトプレビューを生成する関数
  const generatePromptPreview = () => {
    try {
      if (!customPrompt.includes('## コンテンツ')) {
        const previewPrompt = `${customPrompt}

## コンテンツ
プレビュー用テキストがここに入ります。

## 出力形式
- 完全なHTMLを生成します
- インラインCSSを使って設定を適用します
- モバイルレスポンシブなデザインにします
`;
        setGeneratedPrompt(previewPrompt);
      } else {
        setGeneratedPrompt(customPrompt);
      }
    } catch (error) {
      // console.warn('プロンプト生成に失敗しました:', error);
      setGeneratedPrompt('プロンプトの表示に失敗しました。:' + error);
    }
  };

  // プロンプトプレビューの表示/非表示を切り替える
  const togglePromptPreview = () => {
    const newState = !showPromptPreview;
    setShowPromptPreview(newState);
    
    if (newState) {
      generatePromptPreview();
    }
  };

  // デザインスタイルが変更されたときの処理を完全に書き直し
  const handleStyleChange = (styleId: string) => {
    console.log(`スタイル変更リクエスト: ${styleId} (現在: ${settings.basic.designStyle})`);
    
    try {
      // まずローカル状態を更新
      setSelectedStyle(styleId);
      
      // スタイル定義を取得（現在のcustomStylesRefを使用）
      const styleDefinition = getExtendedStyleDefinitionWithRef(styleId);
      console.log('選択したスタイル定義:', styleDefinition);
      
      if (!styleDefinition || !styleDefinition.displayName) {
        console.error('スタイル定義が不完全です:', styleDefinition);
        throw new Error('スタイル定義の取得に失敗しました');
      }
      
      // プロンプト生成のためのデータをデバッグ出力
      console.log('スタイルID:', styleId);
      console.log('使用するプロンプト:', styleDefinition.prompt);
      console.log('使用する説明:', styleDefinition.description);
      
      // プロンプトを生成
      const stylePrompt = styleDefinition.prompt || '';
      
      const fullPrompt = `
# ${styleDefinition.displayName}スタイル
${styleDefinition.description || ''}

## スタイル指示
${stylePrompt || '特別なスタイル指示はありません。'}`;
      
      console.log('生成されたプロンプト:', fullPrompt);
      
      // 新しい設定オブジェクトを作成（完全に新しいインスタンス）
      const newSettings = structuredClone(settings);
      
      // 設定を更新
      newSettings.basic.designStyle = styleId as AppDesignStyle;
      newSettings.additionalInstructions = fullPrompt;
      
      // 設定コンテキストを更新
      updateSettings(newSettings);
      
      // プロンプト関連の状態も更新
      updateCustomPrompt(fullPrompt);
      setGeneratedPrompt(fullPrompt);
      setShowPromptPreview(true);
      setSettingsChanged(true);
      
      // console.log('スタイル変更完了:', styleId);
      
      // 設定が適用されたことをユーザーに通知
      // toast.success(`${styleDefinition.displayName}スタイルを適用しました`);
    } catch (error) {
      console.error('スタイル変更中にエラーが発生しました:', error);
      toast.error('スタイル適用中にエラーが発生しました。');
    }
  };
  
  // refを使用して最新のカスタムスタイルにアクセスする拡張関数
  const getExtendedStyleDefinitionWithRef = (styleId: string): StyleDefinition => {
    // 最新のカスタムスタイルを使用
    const currentCustomStyles = customStylesRef.current;
    
    // カスタムスタイルを最初に探す（優先度を高くする）
    const customStyle = currentCustomStyles.find(style => style.id === styleId);
    if (customStyle) {
      // console.log('カスタムスタイルを使用(ref):', customStyle);
      return customStyle;
    }
    
    // 標準のスタイル定義を試す
    try {
      const standardStyle = getStyleDefinition(styleId);
      if (standardStyle && standardStyle.displayName) {
        return {
          id: styleId,
          displayName: standardStyle.displayName,
          description: standardStyle.description || '',
          prompt: standardStyle.prompt || ''
        };
      }
    } catch (e) {
      console.warn(`標準スタイル取得エラー: ${styleId}`, e);
    }
    
    // console.log(`スタイルID ${styleId} が見つからず、デフォルトを使用`);
    const defaultStyle = getStyleDefinition('standard');
    return {
      id: 'standard',
      displayName: defaultStyle.displayName,
      description: defaultStyle.description || '',
      prompt: defaultStyle.prompt || ''
    };
  };

  // プロンプトが変更されたときの処理
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    updateCustomPrompt(newPrompt);
    
    // プレビュー表示中なら更新
    if (showPromptPreview) {
      if (!newPrompt.includes('## コンテンツ')) {
        const previewPrompt = `${newPrompt}

## コンテンツ
プレビュー用テキストがここに入ります。

## 出力形式
- 完全なHTMLを生成します
- インラインCSSを使って設定を適用します
- モバイルレスポンシブなデザインにします`;
        
        setGeneratedPrompt(previewPrompt);
      } else {
        setGeneratedPrompt(newPrompt);
      }
    }
    
    // 設定変更フラグを設定
    setSettingsChanged(true);
  };
  
  // コンポーネントの初期化時にカスタムスタイルをロード
  useEffect(() => {
    try {
      const savedCustomStyles = getSettings<Array<StyleDefinition>>('custom_styles', []);
      // console.log('保存されたカスタムスタイルを読み込み:', savedCustomStyles);
      if (savedCustomStyles && Array.isArray(savedCustomStyles) && savedCustomStyles.length > 0) {
        setCustomStyles(savedCustomStyles);
      }
    } catch (e) {
      console.error('カスタムスタイルの読み込みエラー:', e);
    }
  }, []);

  // カスタムスタイルが変更されたときにローカルストレージに保存
  useEffect(() => {
    try {
      if (customStyles.length > 0) {
        saveSettings('custom_styles', customStyles);
        // console.log('カスタムスタイルを保存:', customStyles);
      } else if (customStyles.length === 0) {
        // すべてのカスタムスタイルが削除された場合も保存する
        saveSettings('custom_styles', []);
      }
    } catch (e) {
      // console.error('カスタムスタイルの保存に失敗:', e);
      toast.error('カスタムスタイルの保存に失敗しました:' + e);
    }
  }, [customStyles]);
  
  // スタイルオプションとカスタムスタイルを結合 - 重複チェックを追加
  const allStyleOptions = React.useMemo(() => {
    // 標準スタイルのIDリストを作成
    const standardIds = DESIGN_STYLE_OPTIONS.map(style => style.id);
    
    // 標準スタイルとカスタムスタイルを結合（重複は除外）
    const mergedOptions = [
      ...DESIGN_STYLE_OPTIONS,
      ...customStyles
        .filter(style => !standardIds.includes(style.id)) // 標準スタイルと重複するものは除外
        .map(style => ({ 
          id: style.id, 
          displayName: style.displayName 
        }))
    ];
    
    // IDの一意性チェック
    const ids = new Set();
    const uniqueOptions = mergedOptions.filter(style => {
      if (ids.has(style.id)) {
        console.warn(`重複したスタイルID "${style.id}" を検出しました。一つだけ表示します。`);
        return false;
      }
      ids.add(style.id);
      return true;
    });
    
    return uniqueOptions;
  }, [customStyles]);

  // カスタムスタイルを含めた拡張されたgetStyleDefinition関数 - 改善版
  const getExtendedStyleDefinition = (styleId: string): StyleDefinition => {
    // カスタムスタイルを最初に探す（優先度を高くする）
    const customStyle = customStyles.find(style => style.id === styleId);
    if (customStyle) {
      // console.log('カスタムスタイルを使用:', customStyle);
      return customStyle;
    }
    
    // 標準のスタイル定義を試す
    try {
      const standardStyle = getStyleDefinition(styleId);
      if (standardStyle && standardStyle.displayName) {
        // インポートされたStyleDefinitionから自分のStyleDefinitionへ正しく変換
        return {
          id: styleId,
          displayName: standardStyle.displayName,
          description: standardStyle.description || '',
          prompt: standardStyle.prompt || ''
        };
      }
    } catch (e) {
      console.warn(`標準スタイル取得エラー: ${styleId}`, e);
    }
    
    // どちらも見つからない場合はデフォルトスタイルを返す
    // console.log(`スタイルID ${styleId} が見つからず、デフォルトを使用`);
    const defaultStyle = getStyleDefinition('standard');
    return {
      id: 'standard',
      displayName: defaultStyle.displayName,
      description: defaultStyle.description || '',
      prompt: defaultStyle.prompt || ''
    };
  };

  // スタイル追加モーダルを開く
  const openAddStyleModal = () => {
    setStyleForm({
      id: '',
      displayName: '',
      description: '',
      prompt: ''
    });
    setIsAddingStyle(true);
  };

  // スタイル編集モーダルを開く
  const openEditStyleModal = (styleId: string) => {
    const style = getExtendedStyleDefinition(styleId);
    setStyleForm({
      id: styleId,
      displayName: style.displayName || '',
      description: style.description || '',
      prompt: style.prompt || ''
    });
    setEditedStyleId(styleId);
    setIsEditingStyle(true);
  };

  // スタイル削除確認ダイアログを開く
  const openDeleteDialog = (styleId: string) => {
    setEditedStyleId(styleId);
    setIsDeletingStyle(true);
  };

  // スタイルフォームの入力変更ハンドラ
  const handleStyleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStyleForm({
      ...styleForm,
      [name]: value
    });
  };

  // スタイル追加の送信 - バリデーション強化 & 重複チェック
  const handleAddStyle = () => {
    // IDが空の場合は処理しない
    if (!styleForm.id) {
      toast.error('スタイルIDを入力してください。');
      return;
    }
    
    // 重複IDチェック（標準スタイルとカスタムスタイル両方）
    const formattedId = styleForm.id.toLowerCase().replace(/\s+/g, '-');
    const isStandardId = DESIGN_STYLE_OPTIONS.some(style => style.id === formattedId);
    const isCustomId = customStyles.some(style => style.id === formattedId);
    
    if (isStandardId) {
      toast.error('このIDは標準スタイルで使用されています。別のIDを選択してください。');
      return;
    }
    
    if (isCustomId) {
      toast.error('このIDは既に使用されています。別のIDを選択してください。');
      return;
    }
    
    // 表示名が空の場合はエラー
    if (!styleForm.displayName) {
      toast.error('スタイル名を入力してください。');
      return;
    }
    
    const newStyle: StyleDefinition = {
      id: formattedId,
      displayName: styleForm.displayName,
      description: styleForm.description || '',
      prompt: styleForm.prompt || ''
    };
    
    // console.log('新しいスタイルを追加:', newStyle);
    
    try {
      // カスタムスタイルの配列を更新
      const updatedCustomStyles = [...customStyles, newStyle];
      setCustomStyles(updatedCustomStyles);
      
      // refにも直接セット
      customStylesRef.current = updatedCustomStyles;
      
      // モーダルを閉じる
      setIsAddingStyle(false);
      
      // 成功メッセージ
      toast.success(`${newStyle.displayName}スタイルを追加しました`);
      
      // 遅延を長めに設定してから適用
      setTimeout(() => {
        // console.log('追加スタイル適用開始:', newStyle.id);
        // console.log('現在のcustomStyles:', customStylesRef.current);
        handleStyleChange(newStyle.id);
      }, 300);
    } catch (e) {
      // console.error('スタイル追加エラー:', e);
      toast.error('スタイルの追加に失敗しました:' + e);
    }
  };

  // スタイル編集の送信 - IDチェック強化
  const handleEditStyle = () => {
    // 元のIDと新しいIDが異なる場合の重複チェック
    const formattedId = styleForm.id.toLowerCase().replace(/\s+/g, '-');
    if (formattedId !== editedStyleId) {
      // 標準スタイルIDとの重複チェック
      if (DESIGN_STYLE_OPTIONS.some(style => style.id === formattedId)) {
        toast.error('このIDは標準スタイルで使用されています。別のIDを選択してください。');
        return;
      }
      
      // カスタムスタイルIDとの重複チェック
      if (customStyles.some(style => style.id === formattedId)) {
        toast.error('このIDは既に使用されています。別のIDを選択してください。');
        return;
      }
    }
    
    // 表示名が空の場合はエラー
    if (!styleForm.displayName) {
      toast.error('スタイル名を入力してください。');
      return;
    }
    
    const updatedStyle: StyleDefinition = {
      id: formattedId,
      displayName: styleForm.displayName,
      description: styleForm.description || '',
      prompt: styleForm.prompt || ''
    };
    
    console.log('スタイルを更新:', updatedStyle);
    
    try {
      // カスタムスタイル配列を更新
      const updatedCustomStyles = customStyles.map(style => 
        style.id === editedStyleId ? updatedStyle : style
      );
      
      setCustomStyles(updatedCustomStyles);
      
      // refも更新
      customStylesRef.current = updatedCustomStyles;
      
      setIsEditingStyle(false);
      
      // 成功メッセージ
      toast.success(`${updatedStyle.displayName}スタイルを更新しました`);
      
      // 編集したスタイルが現在選択されている場合、更新を適用
      if (selectedStyle === editedStyleId) {
        // 少し遅延させて状態更新の完了を待つ
        setTimeout(() => {
          console.log('編集スタイル適用開始:', updatedStyle.id);
          console.log('現在のcustomStyles:', customStylesRef.current);
          handleStyleChange(updatedStyle.id);
        }, 300);
      }
    } catch (e) {
      console.error('スタイル更新エラー:', e);
      toast.error('スタイルの更新に失敗しました');
    }
  };

  // スタイル削除の実行
  const handleDeleteStyle = () => {
    try {
      // 削除前にスタイル名を取得
      const styleToDelete = customStyles.find(style => style.id === editedStyleId);
      const styleName = styleToDelete?.displayName || 'カスタム';
      
      // カスタムスタイル配列を更新
      const filteredStyles = customStyles.filter(style => style.id !== editedStyleId);
      setCustomStyles(filteredStyles);
      
      setIsDeletingStyle(false);
      
      // 成功メッセージ
      toast.success(`${styleName}スタイルを削除しました`);
      
      // 削除したスタイルが選択されていた場合、デフォルトスタイルに戻す
      if (selectedStyle === editedStyleId) {
        handleStyleChange('standard');
      }
    } catch (e) {
      console.error('スタイル削除エラー:', e);
      toast.error('スタイルの削除に失敗しました');
    }
  };

  // console.log('レンダリング時の選択スタイル:', selectedStyle, '設定値:', settings.basic.designStyle);

  return (
    <div className={`flex flex-col h-full w-full ${embedded ? '' : 'border-r'} border-stone-200 bg-stone-50 overflow-y-auto`}>
      {!embedded && (
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-100 sticky top-0 z-10">
          <h2 className="text-lg font-medium text-stone-800">設定</h2>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="p-1 hover:bg-stone-200 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
      <div className="flex flex-col h-full">
        {/* ヘッダー */}
        <div className="p-4 border-b border-stone-200 bg-white">
          <h2 className="text-lg font-medium text-stone-800">デザインスタイル設定</h2>
          <p className="text-xs text-stone-500 mt-1">
            スタイルを選択すると自動的に設定が適用されます
          </p>
        </div>
        
        {/* タブと内容を一つの Tabs コンポーネントで囲む */}
        <Tabs value={activeSetting} onValueChange={(value) => setActiveSetting(value as SettingTab)} className="flex-1 flex flex-col">
          <div className="p-4 border-b border-stone-200 bg-white">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="style" >スタイル</TabsTrigger>
              <TabsTrigger value="prompt">プロンプト</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="style" className="p-4 h-auto">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-sm font-medium text-stone-700">デザインスタイルを選択</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={openAddStyleModal}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>新規スタイル</span>
                </Button>
              </div>
              
              <div className="space-y-2 h-full" role="radiogroup" aria-label="デザインスタイル">
                {allStyleOptions.map((style, index) => {
                  const styleDefinition = getExtendedStyleDefinition(style.id);
                  const isSelected = selectedStyle === style.id;
                  // 修正: カスタムスタイルかどうかの判定を確実に
                  const isCustom = customStyles.some(custom => custom.id === style.id);
                  
                  return (
                    <div 
                      key={`${style.id}-${index}`} // インデックスを追加して確実に一意にする
                      className={`flex items-start p-2 rounded-md hover:bg-stone-200 cursor-pointer ${isSelected ? 'bg-stone-200' : ''}`}
                    >
                      <div className="flex items-center h-5 mr-2">
                        <input 
                          type="radio" 
                          id={`style-${style.id}`}
                          name="designStyle"
                          className="h-4 w-4 cursor-pointer"
                          checked={isSelected}
                          onChange={() => handleStyleChange(style.id)}
                          value={style.id}
                        />
                      </div>
                      <div className="flex-1" onClick={() => handleStyleChange(style.id)}>
                        <label htmlFor={`style-${style.id}`} className="font-medium text-stone-800 cursor-pointer block">
                          {styleDefinition.displayName}
                          {isCustom && <span className="ml-2 text-xs text-amber-600">(カスタム)</span>}
                        </label>
                        <p className="text-xs text-stone-500 mt-1">
                          {styleDefinition.description}
                        </p>
                      </div>
                      
                      {isCustom && (
                        <div className="flex space-x-1 ml-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditStyleModal(style.id);
                            }}
                          >
                            <Edit className="h-3.5 w-3.5 text-stone-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(style.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-stone-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* プロンプトタブ */}
            <TabsContent value="prompt" className="p-4 h-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-700" />
                  <Label className="text-sm font-medium text-stone-700">AIプロンプトをカスタマイズ</Label>
                </div>
                
                <Textarea 
                  value={customPrompt}
                  onChange={handlePromptChange}
                  placeholder="AIに対する追加指示を入力..."
                  className="max-h-[150px] min-h-[150px] text-sm"
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1 text-xs"
                  onClick={togglePromptPreview}
                >
                  {showPromptPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{showPromptPreview ? "プロンプトプレビューを閉じる" : "プロンプトプレビューを表示"}</span>
                </Button>
                
                {showPromptPreview && (
                  <div className="border border-amber-200 bg-amber-50 p-2 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-amber-800">プロンプトプレビュー</span>
                      <Button 
                        variant="ghost"
                        size="sm" 
                        className="h-5 w-5 p-0"
                        onClick={generatePromptPreview}
                      >
                        <RefreshCw className="h-3 w-3 text-amber-700" />
                      </Button>
                    </div>
                    <pre className="text-xs bg-white border border-amber-100 p-2 rounded-md overflow-auto max-h-48 text-stone-700 whitespace-pre-wrap">
                      {generatedPrompt || 'プロンプトを生成しています...'}
                    </pre>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        {/* <Separator />
        
        <div className="p-4 flex items-center justify-center">
          <div className="text-xs text-stone-500">
            変更は自動的に適用されます
          </div>
        </div> */}
      </div>
      
      {/* スタイル追加モーダル */}
      <Dialog open={isAddingStyle} onOpenChange={setIsAddingStyle}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新しいデザインスタイルを追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="styleId">スタイルID</Label>
              <Input
                id="styleId"
                name="id"
                value={styleForm.id}
                onChange={handleStyleFormChange}
                placeholder="my-custom-style"
                className="text-sm"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="styleDisplayName">表示名</Label>
              <Input
                id="styleDisplayName"
                name="displayName"
                value={styleForm.displayName}
                onChange={handleStyleFormChange}
                placeholder="カスタムスタイル"
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="styleDescription">説明</Label>
              <Textarea
                id="styleDescription"
                name="description"
                value={styleForm.description}
                onChange={handleStyleFormChange}
                placeholder="このスタイルの簡単な説明"
                className="text-sm max-h-[80px] min-h-[80px]"
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="stylePrompt">プロンプト</Label>
              <Textarea
                id="stylePrompt"
                name="prompt"
                value={styleForm.prompt}
                onChange={handleStyleFormChange}
                placeholder="AIに対する指示"
                className="max-h-[150px] min-h-[150px] text-sm"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingStyle(false)}>キャンセル</Button>
            <Button onClick={handleAddStyle}>追加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* スタイル編集モーダル */}
      <Dialog open={isEditingStyle} onOpenChange={setIsEditingStyle}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>デザインスタイルを編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="editStyleId">スタイルID</Label>
              <Input
                id="editStyleId"
                name="id"
                value={styleForm.id}
                onChange={handleStyleFormChange}
                placeholder="my-custom-style"
                className="text-sm"
              />
            </div>
           
            <div className="space-y-1">
              <Label htmlFor="editStyleDisplayName">表示名</Label>
              <Input
                id="editStyleDisplayName"
                name="displayName"
                value={styleForm.displayName}
                onChange={handleStyleFormChange}
                placeholder="カスタムスタイル"
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="editStyleDescription">説明</Label>
              <Textarea
                id="editStyleDescription"
                name="description"
                value={styleForm.description}
                onChange={handleStyleFormChange}
                placeholder="このスタイルの簡単な説明"
                className="text-sm"
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="editStylePrompt">プロンプト</Label>
              <Textarea
                id="editStylePrompt"
                name="prompt"
                value={styleForm.prompt}
                onChange={handleStyleFormChange}
                placeholder="AIに対する指示"
                className="text-sm"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingStyle(false)}>キャンセル</Button>
            <Button onClick={handleEditStyle}>更新</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* スタイル削除確認ダイアログ */}
      <AlertDialog open={isDeletingStyle} onOpenChange={setIsDeletingStyle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>スタイルを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は元に戻せません。このスタイルは完全に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStyle} className="bg-red-600 hover:bg-red-700">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPanel;