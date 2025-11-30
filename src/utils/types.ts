import React from 'react';

export interface Answer {
  questionId: string;
  value?: number;      // Для блока C (шкалирование)
  levelId?: number;    // Для блоков A и B (множественный выбор)
}

export interface Tab {
  id: string;
  label: string;
  icon: React.ReactElement;
  content?: React.ReactNode;
}

// УДАЛЕН устаревший интерфейс TestResult - он был заменен на современную версию в calculateResult.ts
// Это предотвращает конфликты типов и обеспечивает использование актуального интерфейса
