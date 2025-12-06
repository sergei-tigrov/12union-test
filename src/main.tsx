import React from 'react';
import ReactDOM from 'react-dom/client';
import WebApp from '@twa-dev/sdk';
import App from './App.tsx';
import './main.css';
// import './index.css'; 

// Инициализация Telegram Mini App
if (typeof window !== 'undefined') {
  try {
    WebApp.ready();
    WebApp.expand(); // Разворачиваем на весь экран
  } catch {
    console.log('Telegram WebApp is not available (running in browser)');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
