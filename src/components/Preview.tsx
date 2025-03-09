import React, { useEffect, useState, useRef } from 'react';

interface PreviewProps {
  html: string;
  isLoading: boolean;
}

const Preview: React.FC<PreviewProps> = ({ html, isLoading }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  // コンテンツが更新されるたびにフェードインアニメーションを設定
  useEffect(() => {
    if (!isLoading && html) {
      setError(null); // エラー状態をリセット
      updateIframeContent();
      
    }
  }, [html, isLoading]);

  // iframeにHTMLコンテンツを更新
  const updateIframeContent = () => {
    if (!iframeRef.current || !html) return;

    try {
      // HTMLテンプレートを構築
      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* ベーススタイル */
              html, body {
                margin: 0;
                padding: 0;
                font-family: 'Georgia', serif;
                line-height: 1.7;
                color: #5d4037;
                background-color: white;
              }
               /* コンテンツのコンテナにも幅を設定 */
              .container, main, article, section {
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
              }

              body {
                // padding: 20px;
              }
              
              /* 見出しスタイル */
              h1, h2, h3, h4, h5, h6 {
                font-family: 'Garamond', 'Georgia', serif;
                font-weight: normal;
                line-height: 1.3;
                color: #5d4037;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
              }
              
              h1 {
                font-size: 2.2em;
                padding-bottom: 0.3em;
                border-bottom: 1px solid rgba(180, 160, 120, 0.2);
              }
              
              h2 {
                font-size: 1.8em;
              }
              
              h3 {
                font-size: 1.4em;
              }
              
              /* 段落スタイル */
              p {
                margin: 1em 0;
                line-height: 1.7;
                color: #5a4a42;
              }
              
              /* リンクスタイル */
              a {
                color: #8b7355;
                text-decoration: none;
              }
              
              a:hover {
                text-decoration: underline;
              }
              
              /* リストスタイル */
              ul, ol {
                margin: 1em 0;
                padding-left: 2em;
                color: #5a4a42;
              }
              
              li {
                margin: 0.5em 0;
                line-height: 1.5;
              }
              
              /* コードスタイル */
              code {
                background: rgba(200, 185, 170, 0.15);
                padding: 0.2em 0.4em;
                border-radius: 3px;
                font-family: "Courier New", monospace;
                font-size: 0.9em;
                color: #6b584c;
              }
              
              pre {
                background: rgba(200, 185, 170, 0.15);
                padding: 1em;
                border-radius: 6px;
                overflow-x: auto;
              }
              
              pre code {
                background: transparent;
                padding: 0;
              }
              
              /* 画像スタイル */
              img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              
              /* テーブルスタイル */
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
              }
              
              th, td {
                border: 1px solid #e8ded0;
                padding: 0.5em;
                text-align: left;
              }
              
              th {
                background-color: rgba(240, 230, 214, 0.3);
              }
              
              /* その他の要素 */
              hr {
                border: 0;
                border-top: 1px solid #e8ded0;
                margin: 2em 0;
              }
            </style>
          </head>
          <body>
            ${html}
            <script>
              // リンクのクリックを処理
              document.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' && e.target.href) {
                  e.preventDefault();
                  window.open(e.target.href, '_blank', 'noopener,noreferrer');
                }
              });
            </script>
          </body>
        </html>
      `;
      
      // iframeのcontentDocumentにHTMLを書き込む
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlTemplate);
        iframeDoc.close();
      }
    } catch (error) {
      console.error('iframeコンテンツ更新エラー:', error);
      setError('プレビューの表示中にエラーが発生しました。HTMLコードを確認してください。');
    }
  };

  return (
    <div className="h-full w-full bg-stone-100 p-4 overflow-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
          <p className="text-stone-500">HTMLを生成中...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : (
        <div className={`transition-opacity duration-500`}>
          <div className="">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* <div className="h-10 flex items-center px-4 bg-stone-100 border-b border-stone-200">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto text-sm text-stone-500">プレビュー</div>
              </div> */}
              
              <div className="p-0">
                <div className="w-full overflow-auto">
                  <iframe 
                    ref={iframeRef}
                    title="HTML Preview"
                    className="w-full"
                    style={{ 
                      border: 'none', 
                      height: '600px',
                      backgroundColor: 'white',
                      display: 'block'
                    }}
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
