// HTML変換とプレビュー表示を処理するスクリプト

document.addEventListener('DOMContentLoaded', function() {
  const previewContainer = document.getElementById('preview-container');
  const htmlInput = document.getElementById('html-input');
  const previewButton = document.getElementById('preview-button');
  const loadingContainer = document.getElementById('loading-container');
  const previewContent = document.getElementById('preview-content');
  
  // iframeの作成
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.border = 'none';
  iframe.style.minHeight = '300px';
  iframe.style.backgroundColor = 'white';
  iframe.setAttribute('title', 'HTML Preview');
  iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
  
  // iframeの読み込み完了イベント
  iframe.onload = function() {
    try {
      // iframeの高さを内容に合わせて調整
      const height = iframe.contentWindow.document.body.scrollHeight;
      iframe.style.height = `${height + 40}px`; // 余白のために40px追加
    } catch (error) {
      console.error('iframeの高さ調整エラー:', error);
    }
  };
  
  // プレビューコンテナにiframeを追加
  if (previewContainer) {
    previewContainer.appendChild(iframe);
  }
  
  // iframe内からのメッセージを処理
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'resize' && iframe) {
      iframe.style.height = `${event.data.height + 40}px`;
    }
  });
  
  // プレビューボタンがクリックされたときの処理
  if (previewButton) {
    previewButton.addEventListener('click', function() {
      showLoading();
      // 実際の処理を遅延させてローディング表示を確認できるようにする
      setTimeout(function() {
        updatePreview();
        hideLoading();
      }, 1200); // 1.2秒後に表示（ローディング効果を楽しむため）
    });
  }
  
  // 入力のキー操作に応じてプレビューを更新（オプション）
  if (htmlInput) {
    htmlInput.addEventListener('input', function() {
      // リアルタイムプレビューが必要な場合はコメントを外す
      // updatePreview();
    });
  }
  
  // ローディング表示を表示
  function showLoading() {
    if (loadingContainer && previewContent) {
      previewContent.style.display = 'none';
      loadingContainer.style.display = 'flex';
    }
  }
  
  // ローディング表示を非表示
  function hideLoading() {
    if (loadingContainer && previewContent) {
      loadingContainer.style.display = 'none';
      previewContent.style.display = 'block';
      
      // アーティスティック効果のためにコンテナにクラスを追加
      if (previewContainer) {
        previewContainer.classList.add('fade-in');
      }
    }
  }
  
  // プレビュー表示を更新する関数
  function updatePreview() {
    if (!iframe || !htmlInput) return;
    
    try {
      const htmlContent = htmlInput.value;
      
      // iframeに表示するHTMLを作成
      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* iframeのコンテンツに適用するベーススタイル */
              html, body {
                margin: 0;
                padding: 0;
                font-family: 'Georgia', serif;
                line-height: 1.7;
                color: #5d4037;
                background-color: white;
              }
              
              body {
                padding: 20px;
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
                font-size: 1.7em;
              }
              
              h3 {
                font-size: 1.4em;
              }
              
              /* 段落スタイル */
              p {
                margin: 1em 0;
                line-height: 1.7;
                color: #5a4a42;
                font-size: 1.05em;
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
              
              /* 引用ブロックスタイル */
              blockquote {
                border-left: 4px solid #d4c5b9;
                margin-left: 0;
                padding: 0.8em 1em 0.8em 2em;
                background-color: rgba(212, 197, 185, 0.1);
                border-radius: 0 4px 4px 0;
                font-style: italic;
                color: #6d5d53;
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
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              // 親ウィンドウに高さを通知するためのスクリプト
              function notifyHeight() {
                const height = document.body.scrollHeight;
                window.parent.postMessage({ type: 'resize', height: height }, '*');
              }
              
              // ロード時とリサイズ時に高さを通知
              window.onload = notifyHeight;
              window.onresize = notifyHeight;
              
              // すべての画像のロード完了後にも通知
              window.addEventListener('load', function() {
                const images = document.querySelectorAll('img');
                if(images.length > 0) {
                  let loadedImages = 0;
                  images.forEach(function(img) {
                    if(img.complete) {
                      loadedImages++;
                    } else {
                      img.addEventListener('load', function() {
                        loadedImages++;
                        if(loadedImages === images.length) {
                          notifyHeight();
                        }
                      });
                    }
                  });
                  if(loadedImages === images.length) {
                    notifyHeight();
                  }
                }
              });
              
              // リンクのクリックを処理
              document.addEventListener('click', function(e) {
                if(e.target.tagName === 'A' && e.target.href) {
                  e.preventDefault();
                  window.open(e.target.href, '_blank', 'noopener,noreferrer');
                }
              });
            </script>
          </body>
        </html>
      `;
      
      // iframeのドキュメントにHTMLを書き込む
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(htmlTemplate);
      iframeDoc.close();
      
      // ヘッダー要素の作成
      const headerDiv = document.createElement('div');
      headerDiv.className = 'preview-header';
      headerDiv.innerHTML = `
        <h3 class="preview-title">Artistic View</h3>
        <div class="preview-dots">
          <span class="preview-dot red"></span>
          <span class="preview-dot gold"></span>
          <span class="preview-dot green"></span>
        </div>
      `;
      
      // previewContainerの親要素を取得
      const parentContainer = previewContainer.parentNode;
      
      // 以前のヘッダーがあれば削除
      const oldHeader = parentContainer.querySelector('.preview-header');
      if (oldHeader) {
        parentContainer.removeChild(oldHeader);
      }
      
      // 新しいヘッダーを追加（previewContainerの前に）
      parentContainer.insertBefore(headerDiv, previewContainer);
      
    } catch (error) {
      console.error('プレビュー更新エラー:', error);
      // エラー時のフォールバック
      if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(`
            <html>
              <body style="font-family: sans-serif; padding: 20px; color: #5d4037;">
                <p>プレビューの表示中にエラーが発生しました。</p>
                <p>HTMLコードを確認してください。</p>
              </body>
            </html>
          `);
          iframeDoc.close();
        }
      }
    }
  }
});
