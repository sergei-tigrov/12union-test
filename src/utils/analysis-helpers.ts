/**
 * Утилиты для компонентов психологического анализа
 */

/**
 * Подсчитывает количество индикаторов определенного типа
 */
export const countIndicatorsOfType = (
  indicators: string[], 
  keywords: string[]
): number => {
  return indicators.filter(indicator => 
    keywords.some(keyword => indicator.includes(keyword))
  ).length;
};

/**
 * Определяет уровень тяжести на основе количества индикаторов
 */
export const determineSeverity = (
  count: number
): 'minimal' | 'moderate' | 'significant' | 'critical' => {
  if (count >= 5) return 'critical';
  if (count >= 3) return 'significant';
  if (count >= 2) return 'moderate';
  return 'minimal';
};

/**
 * Определяет, содержит ли набор индикаторов все ключевые слова
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
 * Определяет, содержит ли набор индикаторов хотя бы одно ключевое слово
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
 * Фильтр для индикаторов травмы
 */
export const traumaKeywords = [
  'trauma', 'terror', 'abandonment', 'karmic', 'survival', 'chaos'
];

/**
 * Фильтр для индикаторов тревожной привязанности
 */
export const anxiousAttachmentKeywords = [
  'anxiety', 'abandonment', 'jealousy', 'clingy', 'constant_reassurance'
];

/**
 * Фильтр для индикаторов избегающей привязанности
 */
export const avoidantAttachmentKeywords = [
  'avoidance', 'independence', 'self_reliance', 'emotional_distance', 'fear_engulfment'
];

/**
 * Фильтр для индикаторов надежной привязанности
 */
export const secureAttachmentKeywords = [
  'secure', 'stability', 'trust', 'self_worth', 'healthy_boundaries'
];

/**
 * Создает общие элементы UI для всех анализов
 */
export const getAnalysisCardVariants = () => {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
};
