/**
 * Утилиты для создания унифицированного UI для компонентов анализа
 */
import { createElement } from 'react';
import { 
  Heart, Shield, AlertCircle, AlertTriangle, 
  Target, Lightbulb, Users, Zap 
} from 'lucide-react';

/**
 * Доступные иконки для компонентов анализа
 */
export type AnalysisIcon = 
  | 'heart' 
  | 'shield'
  | 'alertCircle'
  | 'alertTriangle'
  | 'target'
  | 'lightbulb'
  | 'users'
  | 'zap';

/**
 * Получает компонент иконки по её названию с заданными свойствами
 * @param icon - название иконки
 * @param size - размер иконки (по умолчанию 20)
 * @param className - дополнительные CSS-классы
 * @returns React-компонент иконки
 */
export const getAnalysisIcon = (icon: AnalysisIcon, size: number = 20, className?: string) => {
  const iconComponents = {
    heart: Heart,
    shield: Shield,
    alertCircle: AlertCircle,
    alertTriangle: AlertTriangle,
    target: Target,
    lightbulb: Lightbulb,
    users: Users,
    zap: Zap
  };

  const iconComponent = iconComponents[icon];
  return createElement(iconComponent, { size, className });
};

/**
 * Получает CSS-класс цвета в зависимости от уровня тяжести
 * @param severity - уровень тяжести/важности
 * @returns CSS-класс для цвета
 */
export const getSeverityColorClass = (severity: 'minimal' | 'moderate' | 'significant' | 'critical') => {
  switch (severity) {
    case 'minimal':
      return 'text-green-600';
    case 'moderate':
      return 'text-amber-500';
    case 'significant': 
      return 'text-orange-600';
    case 'critical':
      return 'text-red-600';
    default:
      return 'text-blue-500';
  }
};

/**
 * Создает варианты анимации для карточек анализа
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

/**
 * Получает эмодзи для заголовка в зависимости от уровня тяжести
 * @param severity - уровень тяжести/важности
 * @returns соответствующий эмодзи
 */
export const getSeverityEmoji = (severity: 'minimal' | 'moderate' | 'significant' | 'critical') => {
  switch (severity) {
    case 'minimal':
      return '💚';
    case 'moderate':
      return '💛';
    case 'significant': 
      return '🧡';
    case 'critical':
      return '❤️';
    default:
      return '💙';
  }
};
