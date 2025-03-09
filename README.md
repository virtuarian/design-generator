# Design Generator

Design Generatorは、テキストから様々なスタイルのHTMLデザインを自動生成するツールです。複数のAIプロバイダーと連携し、異なるデザインスタイルを適用することができます。

## 主な機能

- **複数のAIプロバイダー対応**
  - OpenAI
  - Anthropic
  - Google (Gemini)
  - OpenRouter
  - Ollama（ローカル実行サポート）

- **多彩なデザインスタイル**
  - グラフィックレコーディング（ノーマル、ビジネス、アニメーション）
  - 教科書風
  - 雑誌風

- **高度なカスタマイズ**
  - カスタムプロンプト対応
  - デザイン設定のカスタマイズ
  - APIキー管理

## インストール

### 必要条件

- Node.js 18.0.0以上
- pnpm

### インストール手順

```bash
# リポジトリのクローン
git clone https://github.com/virtuarian/design-generator.git
cd design-generator

# 依存パッケージのインストール
pnpm install
```

## 使い方

### アプリケーションの起動

```bash
# 開発モードで実行
pnpm dev

# プロダクションビルド
pnpm build

# ビルド後の起動
pnpm start
```

### APIキーの設定

1. アプリケーション右上の⚙️（設定）アイコンをクリック
2. 「APIキー」タブで使用したいAIプロバイダーのAPIキーを入力
3. 「保存」をクリック

各プロバイダーのAPIキー取得先:
- OpenAI: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Anthropic: [https://console.anthropic.com/account/keys](https://console.anthropic.com/account/keys)
- Google: [https://ai.google.dev/tutorials/setup](https://ai.google.dev/tutorials/setup)
- OpenRouter: [https://openrouter.ai/keys](https://openrouter.ai/keys)

### デザイン生成

1. 左側の設定パネルでデザインスタイルを選択
2. 中央のテキストエリアに変換したいテキストを入力
3. 「変換」ボタンをクリックしてHTMLを生成
4. 右側のプレビューエリアで結果を確認

### カスタムモデルの追加

1. 設定アイコンからLLM設定ダイアログを開く
2. 「モデル管理」タブを選択
3. 「追加」ボタンをクリックして新規モデル情報を入力
4. モデルキー、名前、プロバイダー、モデルIDを設定して保存

## 技術スタック

- **フロントエンド**
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - Radix UI コンポーネント
  - Lucide Reactアイコン

- **AI統合**
  - OpenAI API
  - Anthropic API (Claude)
  - Google Gemini API
  - OpenRouter API
  - Ollama (ローカルモデル対応)

## 開発

### ディレクトリ構造

```
design-generator/
├── src/
│   ├── components/       # UIコンポーネント
│   ├── lib/              # ユーティリティ・ロジック
│   │   ├── constants/    # 定数・設定値
│   │   ├── llm/          # LLM関連ロジック
│   │   │   └── providers/ # 各AIプロバイダー実装
│   ├── contexts/         # Reactコンテキスト
│   └── app/              # Next.jsページ
├── public/               # 静的ファイル
└── package.json          # 依存関係
```

### 新しいLLMプロバイダーの追加

1. `src/lib/llm/providers/` に新しいプロバイダークラスを作成
2. `BaseLLMProvider` を拡張した新しいクラスを実装
3. `src/lib/constants/models.ts` にサポートするモデル情報を追加

### 新しいスタイルの追加

1. `src/lib/constants/styleDefinitions.ts` に新しいスタイルを追加

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。 

