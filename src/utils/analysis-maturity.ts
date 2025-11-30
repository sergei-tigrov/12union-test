/**
 * Утилиты для работы с уровнями зрелости в компонентах анализа
 */

/**
 * Определяет категории зрелости на основе числового значения
 * @param maturity - числовое значение зрелости (обычно 1-12)
 * @returns объект с булевыми флагами для разных уровней зрелости
 */
export const getMaturityLevels = (maturity: number) => {
  return {
    veryLow: maturity < 4,
    low: maturity >= 4 && maturity < 6,
    medium: maturity >= 6 && maturity < 8,
    high: maturity >= 8 && maturity < 10,
    veryHigh: maturity >= 10
  };
};

/**
 * Определяет различия в зрелости и их значимость
 * @param personal - личная зрелость
 * @param relationship - зрелость отношений
 * @returns объект с разницей и её характеристиками
 */
export const analyzeMaturityGap = (personal: number, relationship: number) => {
  const gap = Math.abs(personal - relationship);
  const direction: 'personal_higher' | 'relationship_higher' | 'balanced' = personal > relationship 
    ? 'personal_higher' 
    : personal < relationship 
      ? 'relationship_higher' 
      : 'balanced';
      
  return {
    gap,
    direction,
    gapSize: getGapSize(gap),
    significant: gap >= 2
  };
};

/**
 * Определяет размер разрыва зрелости
 */
const getGapSize = (gap: number): 'none' | 'small' | 'moderate' | 'large' | 'extreme' => {
  if (gap < 0.5) return 'none';
  if (gap < 1.5) return 'small';
  if (gap < 3) return 'moderate';
  if (gap < 5) return 'large';
  return 'extreme';
};

/**
 * Определяет соответствующие рекомендации по развитию в зависимости от зоны
 * @param dominantZone - доминантная зона (transcendent, mature, survival и т.д.)
 * @returns соответствующие рекомендации для этой зоны
 */
export const getZoneBasedRecommendations = (dominantZone: string = 'mature') => {
  switch (dominantZone) {
    case 'transcendent':
      return {
        focusAreas: [
          'Интеграция духовных практик и повседневной жизни',
          'Служение и позитивное влияние на сообщество',
          'Передача мудрости и опыта другим'
        ],
        timeframe: 'Непрерывное развитие',
        approach: 'трансцендентный'
      };
    case 'mature':
      return {
        focusAreas: [
          'Углубление эмоциональной осознанности',
          'Развитие навыков совместного решения конфликтов',
          'Постоянное расширение зоны комфорта'
        ],
        timeframe: '3-6 месяцев при регулярной практике',
        approach: 'зрелый'
      };
    case 'survival':
      return {
        focusAreas: [
          'Базовая эмоциональная регуляция',
          'Создание чувства безопасности',
          'Установление базовых границ'
        ],
        timeframe: '6-12 месяцев при регулярной работе',
        approach: 'поддерживающий'
      };
    default:
      return {
        focusAreas: [
          'Развитие эмоционального интеллекта',
          'Улучшение коммуникации',
          'Практика осознанности'
        ],
        timeframe: '3-12 месяцев при регулярной работе',
        approach: 'сбалансированный'
      };
  }
};
