import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Wand2, 
  Settings, 
  Code, 
  Eye, 
  FileCode, 
  Save, 
  Download, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  X, 
  Check, 
  RefreshCw,
  Sliders,
  Plus,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const HTMLConverterApp = () => {
  const [currentView, setCurrentView] = useState('edit');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [activeSetting, setActiveSetting] = useState('basic');
  
  return (
    <div className="flex flex-col h-screen bg-stone-50">
      {/* ヘッダー：シンプルで必要最小限の機能のみ表示 */}
      <header className="bg-stone-800 text-stone-100 px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <Wand2 className="text-amber-400" />
          <h1 className="text-xl font-medium">HTML コンバーター</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48 bg-stone-700 border-stone-600 text-stone-100">
              <SelectValue placeholder="AIモデルを選択" />
            </SelectTrigger>
            <SelectContent className="bg-stone-700 border-stone-600 text-stone-100">
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="claude-3">Claude 3 Opus</SelectItem>
              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            size="sm" 
            variant={isAdvancedMode ? "default" : "ghost"} 
            className={isAdvancedMode ? "bg-amber-600 text-white hover:bg-amber-700" : "text-stone-100 hover:bg-stone-700"} 
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
          >
            <Sliders className="h-5 w-5" />
          </Button>
          
          <Button size="sm" variant="ghost" className="text-stone-100 hover:bg-stone-700" onClick={() => setShowTips(!showTips)}>
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          <Button size="sm" variant="ghost" className="text-stone-100 hover:bg-stone-700">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* メインエリア：2カラムレイアウト */}
      <main className="flex flex-1 overflow-hidden">
        {/* 左サイドパネル：設定 */}
        <aside className="w-80 bg-stone-100 border-r border-stone-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
          <div className="flex flex-col h-full">
            {/* 設定タブ切り替え */}
            <div className="p-2 border-b border-stone-200 bg-white">
              <div className="flex">
                <Button 
                  variant={activeSetting === 'basic' ? "default" : "ghost"} 
                  className={`rounded-r-none flex-1 text-sm ${activeSetting === 'basic' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                  onClick={() => setActiveSetting('basic')}
                >
                  基本設定
                </Button>
                <Button 
                  variant={activeSetting === 'advanced' ? "default" : "ghost"} 
                  className={`rounded-l-none flex-1 text-sm ${activeSetting === 'advanced' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                  onClick={() => setActiveSetting('advanced')}
                >
                  上級設定
                </Button>
              </div>

              {/* モード表示 */}
              <div className="flex items-center justify-between mt-3 px-2">
                <span className="text-xs text-stone-500">設定モード</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 gap-2 text-xs"
                  onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                >
                  {isAdvancedMode ? (
                    <>
                      <ToggleRight className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-800">上級</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4 text-stone-400" />
                      <span className="text-stone-600">標準</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* スクロール可能な設定エリア */}
            <div className="flex-1 overflow-y-auto">
              {activeSetting === 'basic' ? (
                // 基本設定パネル
                <div className="p-4">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-stone-500 mb-3">プリセット</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="justify-start text-sm text-stone-700 border-stone-300">
                        コーポレート
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start text-sm text-stone-700 border-stone-300">
                        カジュアル
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start text-sm text-stone-700 border-stone-300">
                        ミニマル
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start text-sm text-stone-700 border-stone-300">
                        クリエイティブ
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-stone-500 mb-3">カラースタイル</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-stone-700 mb-1">メインカラー</label>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md bg-amber-700"></div>
                          <Select defaultValue="coffee">
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="カラーテーマ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="coffee">モカブラウン</SelectItem>
                              <SelectItem value="blue">ブルー</SelectItem>
                              <SelectItem value="green">グリーン</SelectItem>
                              <SelectItem value="custom">カスタム</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-stone-700 mb-1">フォントスタイル</label>
                        <Select defaultValue="serif">
                          <SelectTrigger>
                            <SelectValue placeholder="フォントスタイル" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="serif">明朝体</SelectItem>
                            <SelectItem value="sans">ゴシック体</SelectItem>
                            <SelectItem value="mixed">ミックス</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-stone-700 mb-1">レイアウト</label>
                        <Select defaultValue="centered">
                          <SelectTrigger>
                            <SelectValue placeholder="レイアウト" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="centered">中央揃え</SelectItem>
                            <SelectItem value="full">全幅</SelectItem>
                            <SelectItem value="sidebar">サイドバー付き</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-stone-500 mb-3">装飾効果</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-stone-700">シャドウ効果</label>
                        <div className="relative inline-block w-10 h-5">
                          <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-amber-600 rounded-full before:absolute before:h-4 before:w-4 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all before:translate-x-5"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-stone-700">境界線</label>
                        <div className="relative inline-block w-10 h-5">
                          <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-amber-600 rounded-full before:absolute before:h-4 before:w-4 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all before:translate-x-5"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-stone-700">アニメーション</label>
                        <div className="relative inline-block w-10 h-5">
                          <input type="checkbox" className="opacity-0 w-0 h-0" />
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-stone-300 rounded-full before:absolute before:h-4 before:w-4 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // 上級設定パネル - より詳細な項目がある
                <div className="p-4">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-stone-500">カラー詳細設定</h3>
                      <button className="text-xs text-amber-600 flex items-center gap-1">
                        <Plus className="h-3 w-3" />
                        追加
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">メインカラー</label>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded bg-amber-700 border border-stone-300"></div>
                          <Input type="text" value="#B35C00" className="text-xs flex-1" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">セカンダリカラー</label>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded bg-amber-200 border border-stone-300"></div>
                          <Input type="text" value="#FDE68A" className="text-xs flex-1" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">アクセントカラー</label>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded bg-stone-800 border border-stone-300"></div>
                          <Input type="text" value="#44403C" className="text-xs flex-1" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">背景色</label>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded bg-stone-50 border border-stone-300"></div>
                          <Input type="text" value="#FAFAF9" className="text-xs flex-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-stone-500 mb-3">タイポグラフィ詳細</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">見出しフォント</label>
                        <Select defaultValue="serif">
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="フォント" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="serif">明朝体 / Serif</SelectItem>
                            <SelectItem value="sans">ゴシック体 / Sans-serif</SelectItem>
                            <SelectItem value="display">ディスプレイ</SelectItem>
                            <SelectItem value="custom">カスタム</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-stone-500 mb-1">H1サイズ</label>
                          <div className="flex">
                            <Input type="number" value="2.5" className="text-xs rounded-r-none" />
                            <Select defaultValue="rem">
                              <SelectTrigger className="text-xs rounded-l-none w-16">
                                <SelectValue placeholder="単位" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rem">rem</SelectItem>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="em">em</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-stone-500 mb-1">H2サイズ</label>
                          <div className="flex">
                            <Input type="number" value="1.8" className="text-xs rounded-r-none" />
                            <Select defaultValue="rem">
                              <SelectTrigger className="text-xs rounded-l-none w-16">
                                <SelectValue placeholder="単位" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rem">rem</SelectItem>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="em">em</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">本文フォント</label>
                        <Select defaultValue="sans">
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="フォント" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="serif">明朝体 / Serif</SelectItem>
                            <SelectItem value="sans">ゴシック体 / Sans-serif</SelectItem>
                            <SelectItem value="custom">カスタム</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-stone-500 mb-1">本文サイズ</label>
                          <div className="flex">
                            <Input type="number" value="1" className="text-xs rounded-r-none" />
                            <Select defaultValue="rem">
                              <SelectTrigger className="text-xs rounded-l-none w-16">
                                <SelectValue placeholder="単位" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rem">rem</SelectItem>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="em">em</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-stone-500 mb-1">行間</label>
                          <div className="flex">
                            <Input type="number" value="1.6" className="text-xs rounded-r-none" />
                            <Select defaultValue="unit">
                              <SelectTrigger className="text-xs rounded-l-none w-16">
                                <SelectValue placeholder="単位" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unit">倍</SelectItem>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="percent">%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-stone-500 mb-3">レイアウト詳細</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">最大横幅</label>
                        <div className="flex">
                          <Input type="number" value="1200" className="text-xs rounded-r-none" />
                          <Select defaultValue="px">
                            <SelectTrigger className="text-xs rounded-l-none w-16">
                              <SelectValue placeholder="単位" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="px">px</SelectItem>
                              <SelectItem value="rem">rem</SelectItem>
                              <SelectItem value="percent">%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">コンテンツ余白</label>
                        <div className="grid grid-cols-4 gap-1">
                          <div>
                            <span className="block text-xs text-stone-400 text-center">上</span>
                            <Input type="number" value="2" className="text-xs h-8" />
                          </div>
                          <div>
                            <span className="block text-xs text-stone-400 text-center">右</span>
                            <Input type="number" value="2" className="text-xs h-8" />
                          </div>
                          <div>
                            <span className="block text-xs text-stone-400 text-center">下</span>
                            <Input type="number" value="2" className="text-xs h-8" />
                          </div>
                          <div>
                            <span className="block text-xs text-stone-400 text-center">左</span>
                            <Input type="number" value="2" className="text-xs h-8" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-stone-500 mb-1">セクション間隔</label>
                          <div className="flex">
                            <Input type="number" value="2" className="text-xs rounded-r-none" />
                            <Select defaultValue="rem">
                              <SelectTrigger className="text-xs rounded-l-none w-16">
                                <SelectValue placeholder="単位" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rem">rem</SelectItem>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="em">em</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-stone-500 mb-1">角丸</label>
                          <div className="flex">
                            <Input type="number" value="0.5" className="text-xs rounded-r-none" />
                            <Select defaultValue="rem">
                              <SelectTrigger className="text-xs rounded-l-none w-16">
                                <SelectValue placeholder="単位" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rem">rem</SelectItem>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="em">em</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-stone-500 mb-3">追加指示</h3>
                    <Textarea 
                      placeholder="AIに対する自由形式の追加指示をここに入力..."
                      className="min-h-24 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* アクションボタン */}
            <div className="p-4 border-t border-stone-200">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                設定を適用
              </Button>
            </div>
          </div>
        </aside>

        {/* メインコンテンツエリア */}
        <div className="flex-1 flex flex-col">
          {/* タブナビゲーション */}
          <div className="bg-white border-b border-stone-200 px-6 py-2 flex justify-between items-center">
            <div className="flex gap-1">
              <Button 
                variant={currentView === 'edit' ? "default" : "ghost"} 
                className={`text-sm gap-2 ${currentView === 'edit' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                onClick={() => setCurrentView('edit')}
              >
                <FileCode className="h-4 w-4" />
                編集
              </Button>
              
              <Button 
                variant={currentView === 'preview' ? "default" : "ghost"} 
                className={`text-sm gap-2 ${currentView === 'preview' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                onClick={() => setCurrentView('preview')}
              >
                <Eye className="h-4 w-4" />
                プレビュー
              </Button>
              
              <Button 
                variant={currentView === 'code' ? "default" : "ghost"} 
                className={`text-sm gap-2 ${currentView === 'code' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                onClick={() => setCurrentView('code')}
              >
                <Code className="h-4 w-4" />
                HTML
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-stone-600 border-stone-300 gap-2">
                <Save className="h-4 w-4" />
                保存
              </Button>
              
              <Button variant="outline" size="sm" className="text-stone-600 border-stone-300 gap-2">
                <Download className="h-4 w-4" />
                エクスポート
              </Button>
            </div>
          </div>
          
          {/* コンテンツエリア */}
          <div className="flex-1 overflow-hidden">
            {currentView === 'edit' && (
              <div className="h-full flex flex-col">
                <div className="bg-stone-50 p-4 flex-none">
                  <Card className="shadow-sm border-stone-200">
                    <CardHeader className="p-4 bg-gradient-to-r from-amber-50 to-stone-50 border-b border-stone-200">
                      <CardTitle className="text-amber-800 text-lg flex justify-between items-center">
                        <span>変換したい文章を入力</span>
                        <span className="text-sm text-stone-500 font-normal">文字数: 0</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="p-2 bg-stone-50 border-b border-stone-200 flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs text-stone-600 h-7">
                          <span>見出し</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-stone-600 h-7">
                          <span>段落</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-stone-600 h-7">
                          <span>リスト</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-stone-600 h-7">
                          <span>引用</span>
                        </Button>
                      </div>
                      <Textarea 
                        className="border-0 rounded-none min-h-64 p-4 text-stone-800 bg-white resize-none focus-visible:ring-0"
                        placeholder="ここに変換したい文章を入力してください..."
                        defaultValue="ようこそ、私たちのサービスへ。

このサービスは、あなたのニーズに合わせたカスタマイズされたソリューションを提供します。長年の経験と専門知識を活かし、最高品質の結果をお約束します。

## 主な特徴

- 直感的で使いやすいインターフェース
- 柔軟なカスタマイズオプション
- 迅速なサポート対応

ぜひお気軽にお問い合わせください。あなたのプロジェクトの成功をサポートいたします。"
                      />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex-1 p-4 bg-stone-100 flex items-center justify-center overflow-y-auto">
                  <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg shadow-md">
                    <Sparkles className="h-5 w-5" />
                    HTMLに変換
                  </Button>
                </div>
              </div>
            )}
            
            {currentView === 'preview' && (
              <div className="h-full bg-stone-100 p-4 overflow-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="h-10 flex items-center px-4 bg-stone-100 border-b border-stone-200">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="mx-auto text-sm text-stone-500">プレビュー</div>
                    </div>
                    
                    <div className="p-8">
                      {/* モカカラーのデザインでのプレビュー表示 */}
                      <div className="max-w-3xl mx-auto bg-stone-50 p-8 rounded-lg shadow-sm border border-stone-200">
                        <h1 className="text-3xl font-serif text-amber-900 mb-6 border-b border-amber-200 pb-3">ようこそ、私たちのサービスへ</h1>
                        
                        <p className="text-stone-700 mb-6 leading-relaxed">このサービスは、あなたのニーズに合わせたカスタマイズされたソリューションを提供します。長年の経験と専門知識を活かし、最高品質の結果をお約束します。</p>
                        
                        <h2 className="text-2xl font-serif text-amber-800 mb-4">主な特徴</h2>
                        
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="h-4 w-4" />
                            </div>
                            <span className="text-stone-700">直感的で使いやすいインターフェース</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="h-4 w-4" />
                            </div>
                            <span className="text-stone-700">柔軟なカスタマイズオプション</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="h-4 w-4" />
                            </div>
                            <span className="text-stone-700">迅速なサポート対応</span>
                          </li>
                        </ul>
                        
                        <p className="text-stone-700 bg-amber-50 p-4 rounded-md border-l-4 border-amber-400">ぜひお気軽にお問い合わせください。あなたのプロジェクトの成功をサポートいたします。</p>
                        
                        <div className="mt-8 text-center">
                          <button className="bg-amber-700 text-white px-6 py-3 rounded-md shadow hover:bg-amber-800 transition-colors">
                            お問い合わせ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentView === 'code' && (
              <div className="h-full flex flex-col">
                <div className="bg-stone-800 text-stone-300 p-2 flex justify-between items-center border-b border-stone-700">
                  <div className="text-sm">生成されたHTML</div>
                  <Button variant="ghost" size="sm" className="text-stone-300 hover:bg-stone-700 gap-2">
                    <Copy className="h-4 w-4" />
                    コピー
                  </Button>
                </div>
                
                <div className="flex-1 bg-stone-900 p-4 overflow-auto">
                  <pre className="text-stone-300 text-sm font-mono">
{`<!DOCTYPE html>
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
</html>`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* チップスとヘルプパネル */}
      {showTips && (
        <div className="absolute right-5 top-16 w-80 bg-white shadow-lg rounded-lg border border-stone-200 z-10">
          <div className="flex justify-between items-center p-3 border-b border-stone-200 bg-amber-50">
            <h3 className="font-medium text-amber-800">変換のヒント</h3>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowTips(false)}>
              <X className="h-4 w-4 text-stone-500" />
            </Button>
          </div>
          
          <div className="p-4">
            <ul className="space-y-3 text-sm text-stone-700">
              <li className="flex gap-2">
                <div className="text-amber-600 flex-shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <span>マークダウン形式で文章を入力するとより構造化されたHTMLに変換されます</span>
              </li>
              <li className="flex gap-2">
                <div className="text-amber-600 flex-shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <span>見出しは「#」や「##」を使用して指定できます</span>
              </li>
              <li className="flex gap-2">
                <div className="text-amber-600 flex-shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <span>箇条書きは「-」や「*」を使うとリストとして変換されます</span>
              </li>
              <li className="flex gap-2">
                <div className="text-amber-600 flex-shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <span>強調したいテキストは「**太字**」や「*斜体*」で囲みます</span>
              </li>
            </ul>
            
            <Button variant="outline" size="sm" className="mt-4 w-full text-amber-700 border-amber-200 bg-amber-50">
              もっと見る
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HTMLConverterApp;