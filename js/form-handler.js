// フォーム処理と送信を担当するスクリプト

document.addEventListener('DOMContentLoaded', function() {
  const htmlForm = document.getElementById('html-form');
  const htmlInput = document.getElementById('html-input');
  const previewButton = document.getElementById('preview-button');
  
  // フォーム送信とプレビュー表示の処理
  if (htmlForm) {
    htmlForm.addEventListener('submit', function(event) {
      // デフォルトの送信動作をキャンセル
      event.preventDefault();
      
      // プレビューボタンをクリック
      if (previewButton) {
        previewButton.click();
      }
    });
  }
  
  // テキストエリアのタブキー処理
  if (htmlInput) {
    htmlInput.addEventListener('keydown', function(event) {
      // タブキーが押された場合
      if (event.key === 'Tab') {
        event.preventDefault();
        
        // テキストエリアにタブを挿入
        const start = this.selectionStart;
        const end = this.selectionEnd;
        
        // タブ文字を挿入（2スペースまたは4スペース）
        const tabChar = '  '; // 2スペース
        this.value = this.value.substring(0, start) + tabChar + this.value.substring(end);
        
        // カーソル位置を調整
        this.selectionStart = this.selectionEnd = start + tabChar.length;
      }
      
      // Ctrl+Enter でプレビュー表示のショートカット
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        
        if (previewButton) {
          previewButton.click();
        }
      }
    });
  }
});
