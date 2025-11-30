/**
 * Утилиты для фильтрации и работы с индикаторами
 * Выделены в отдельный модуль для повторного использования и кеширования
 */

import { createSelector } from 'reselect';

/**
 * Набор ключевых слов для фильтрации различных типов индикаторов
 */
export const indicatorKeywords = {
  // Личные индикаторы
  personal: ['personal', 'self', 'individual', 'identity'],
  
  // Отношенческие индикаторы
  relationship: ['relationship', 'partner', 'intimacy', 'connection'],
  
  // Индикаторы травмы
  trauma: ['trauma', 'wound', 'abuse', 'neglect', 'abandonment'],
  
  // Индикаторы стилей привязанности
  attachment: ['attachment', 'bond', 'secure', 'insecure', 'anxious', 'avoidant'],
  
  // Индикаторы границ
  boundaries: ['boundary', 'limit', 'invasion', 'control', 'autonomy'],
  
  // Индикаторы мотивации в отношениях
  motivation: ['motivation', 'goal', 'purpose', 'intention', 'desire']
};

/**
 * Базовая функция фильтрации индикаторов по ключевым словам
 */
export const filterIndicatorsByKeywords = (
  indicators: string[],
  keywords: string[]
): string[] => {
  return indicators.filter(indicator => 
    keywords.some(keyword => indicator.includes(keyword))
  );
};

/**
 * Создание мемоизированных селекторов для каждого типа индикаторов
 * с использованием reselect для кеширования результатов
 */
export const createIndicatorsSelector = (type: keyof typeof indicatorKeywords) => {
  return createSelector(
    [(indicators: string[]) => indicators],
    (indicators: string[]) => filterIndicatorsByKeywords(indicators, indicatorKeywords[type])
  );
};

// Мемоизированные селекторы для различных типов индикаторов
export const selectPersonalIndicators = createIndicatorsSelector('personal');
export const selectRelationshipIndicators = createIndicatorsSelector('relationship');
export const selectTraumaIndicators = createIndicatorsSelector('trauma');
export const selectAttachmentIndicators = createIndicatorsSelector('attachment');
export const selectBoundariesIndicators = createIndicatorsSelector('boundaries');
export const selectMotivationIndicators = createIndicatorsSelector('motivation');

/**
 * Подсчет индикаторов определенного типа
 */
export const countIndicatorsOfType = (
  indicators: string[],
  type: keyof typeof indicatorKeywords
): number => {
  const filteredIndicators = filterIndicatorsByKeywords(indicators, indicatorKeywords[type]);
  return filteredIndicators.length;
};

/**
 * Определяет, содержит ли набор индикаторов все ключевые слова из списка
 */
export const hasAllIndicators = (
  indicators: string[],
  keywords: string[]
): boolean => {
  return keywords.every(keyword => 
    indicators.some(indicator => indicator.includes(keyword))
  );
};

/**
 * Определяет, содержит ли набор индикаторов хотя бы одно ключевое слово из списка
 */
export const hasAnyIndicator = (
  indicators: string[],
  keywords: string[]
): boolean => {
  return keywords.some(keyword => 
    indicators.some(indicator => indicator.includes(keyword))
  );
};

/**
 * Определяет уровень тяжести на основе количества индикаторов
 */
export const determineSeverityByCount = (
  count: number
): 'minimal' | 'moderate' | 'significant' | 'critical' => {
  if (count >= 5) return 'critical';
  if (count >= 3) return 'significant';
  if (count >= 2) return 'moderate';
  return 'minimal';
};
