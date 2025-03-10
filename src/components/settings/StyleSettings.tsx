import React, { useState, useEffect, useRef } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getStyleDefinition } from '@/lib/constants/styleDefinitions';
import { useSettings, StyleDefinition } from '@/contexts/SettingsContext';
import { useView } from '@/contexts/ViewContext';
import { DesignStyle as AppDesignStyle } from '@/lib/types';
import { toast } from 'sonner';

// すべてのスタイルオプションを定義
const DESIGN_STYLE_OPTIONS = [
  { id: 'standard', displayName: '標準' },
  { id: 'graphicRecordingNormal', displayName: 'グラレコ-ノーマル' },
  { id: 'graphicRecordingBusiness', displayName: 'グラレコ-ビジネス' }, 
  { id: 'graphicRecordingAnimation', displayName: 'グラレコ-アニメーション' },
  { id: 'textbook', displayName: '教科書風' },
  { id: 'magazine', displayName: '雑誌風' }
];

const StyleSettings: React.FC = () => {
  // コンテキストから状態と関数を取得
  const { 
    settings,
    updateSettings,
    updateCustomPrompt,
    setGeneratedPrompt,
    setShowPromptPreview,
    customStyles,
    setCustomStyles
  } = useSettings();
  
  const { setSettingsChanged } = useView();

  // ローカルステートを使用して選択状態を管理
  const [selectedStyle, setSelectedStyle] = useState<string>(settings.basic.designStyle);

  // スタイル管理のための状態
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
  
  // カスタムスタイルの参照を保持するためのref
  const customStylesRef = useRef<Array<StyleDefinition>>([]);
  
  // カスタムスタイルの状態が更新されたらrefも更新
  useEffect(() => {
    customStylesRef.current = customStyles;
  }, [customStyles]);

  // 設定が変更されたときにローカルステートを同期
  useEffect(() => {
    setSelectedStyle(settings.basic.designStyle);
  }, [settings.basic.designStyle]);

  // デザインスタイルが変更されたときの処理
  const handleStyleChange = (styleId: string) => {
    try {
      // まずローカル状態を更新
      setSelectedStyle(styleId);
      
      // スタイル定義を取得
      const styleDefinition = getExtendedStyleDefinitionWithRef(styleId);
      
      if (!styleDefinition || !styleDefinition.displayName) {
        throw new Error('スタイル定義の取得に失敗しました');
      }
      
      // プロンプトを生成
      const stylePrompt = styleDefinition.prompt || '';
      
      const fullPrompt = `
# ${styleDefinition.displayName}スタイル
${styleDefinition.description || ''}

## スタイル指示
${stylePrompt || '特別なスタイル指示はありません。'}`;
      
      // 新しい設定オブジェクトを作成
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
    } catch (error) {
      console.error('スタイル変更中にエラーが発生しました:', error);
      toast.error('スタイル適用中にエラーが発生しました。');
    }
  };

  // refを使用して最新のカスタムスタイルにアクセスする拡張関数
  const getExtendedStyleDefinitionWithRef = (styleId: string): StyleDefinition => {
    // コンテキストから直接カスタムスタイルを取得
    const currentCustomStyles = customStylesRef.current;
    
    // カスタムスタイルを最初に探す（優先度を高くする）
    const customStyle = currentCustomStyles.find(style => style.id === styleId);
    if (customStyle) {
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
    
    // デフォルトスタイル
    const defaultStyle = getStyleDefinition('standard');
    return {
      id: 'standard',
      displayName: defaultStyle.displayName,
      description: defaultStyle.description || '',
      prompt: defaultStyle.prompt || ''
    };
  };

  // スタイルオプションとカスタムスタイルを結合
  const allStyleOptions = React.useMemo(() => {
    // 標準スタイルのIDリストを作成
    const standardIds = DESIGN_STYLE_OPTIONS.map(style => style.id);
    
    // 標準スタイルとカスタムスタイルを結合（重複は除外）
    const mergedOptions = [
      ...DESIGN_STYLE_OPTIONS,
      ...customStyles
        .filter(style => !standardIds.includes(style.id))
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

  // カスタムスタイルを含めた拡張されたgetStyleDefinition関数
  const getExtendedStyleDefinition = (styleId: string): StyleDefinition => {
    // カスタムスタイルを最初に探す
    const customStyle = customStyles.find(style => style.id === styleId);
    if (customStyle) {
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
    
    // デフォルトスタイル
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

  // スタイル追加の送信
  const handleAddStyle = () => {
    // IDが空の場合は処理しない
    if (!styleForm.id) {
      toast.error('スタイルIDを入力してください。');
      return;
    }
    
    // 重複IDチェック
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
    
    try {
      // カスタムスタイルの配列を更新（コンテキストを使用）
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
        handleStyleChange(newStyle.id);
      }, 300);
    } catch (e) {
      toast.error('スタイルの追加に失敗しました:' + e);
    }
  };

  // スタイル編集の送信
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
    
    try {
      // カスタムスタイル配列を更新（コンテキストを使用）
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
      
      // カスタムスタイル配列を更新（コンテキストを使用）
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

  // セレクターコンポーネント：個々のラジオボタン + ラベルをカスタム実装
  const StyleSelector = ({ style, isSelected, isCustom }: { 
    style: { id: string, displayName: string }, 
    isSelected: boolean, 
    isCustom: boolean 
  }) => {
    const styleDefinition = getExtendedStyleDefinition(style.id);
    
    return (
      <div 
        className={`flex items-start p-2 rounded-md hover:bg-stone-200 cursor-pointer ${isSelected ? 'bg-stone-200' : ''}`}
        onClick={() => handleStyleChange(style.id)} // 親Divで直接ハンドラーを実装
      >
        {/* カスタムラジオボタン - チェックマークを自前で実装 */}
        <div className="flex-shrink-0 h-5 w-5 mr-2">
          <div 
            className={`h-4 w-4 rounded-full border ${isSelected 
              ? 'border-amber-600 bg-amber-600' 
              : 'border-stone-400 bg-white'
            } flex items-center justify-center`}
          >
            {isSelected && (
              <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="font-medium text-stone-800 block">
            {styleDefinition.displayName}
            {isCustom && <span className="ml-2 text-xs text-amber-600">(カスタム)</span>}
          </div>
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
  };
  
  // コンポーネントがマウントされた時のデバッグログ
  // useEffect(() => {
  //   console.log('StyleSettings マウント時のカスタムスタイル数:', customStyles.length);
  // }, []);

  return (
    <>
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
      
      <div className="space-y-2 h-full">
        {allStyleOptions.map((style, index) => {
          const isSelected = selectedStyle === style.id;
          const isCustom = customStyles.some(custom => custom.id === style.id);
          
          return (
            <StyleSelector
              key={`${style.id}-${index}`}
              style={style}
              isSelected={isSelected}
              isCustom={isCustom}
            />
          );
        })}
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
    </>
  );
};

export default StyleSettings;
