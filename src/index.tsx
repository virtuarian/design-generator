import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import './styles/preview.css'; // 新しいスタイルシートを追加
import App from 'next/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
