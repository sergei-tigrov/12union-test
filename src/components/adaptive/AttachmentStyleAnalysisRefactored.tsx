import React from 'react';
import { Heart, Shield, Users, Zap, Lightbulb } from 'lucide-react';
import {
  AttachmentStyleProps
} from '../../types/analysis-types';
import AnalysisCard from '../shared/AnalysisCard';
import Tooltip from '../ui/Tooltip';
import { analyzeAttachmentStyle } from '../../utils/analysis-psychology';

/**
 * Рефакторинговый компонент анализа стиля привязанности
 */
/**
 * Компонент анализа стиля привязанности (рефакторинговая версия)
 * @param indicators - индикаторы для анализа
 * @param personalMaturity - уровень личностной зрелости
 * @param relationshipMaturity - уровень зрелости отношений (используется для контекста)
 */
const AttachmentStyleAnalysisRefactored: React.FC<AttachmentStyleProps> = ({
  indicators = [],
  personalMaturity,
}) => {
  const style = analyzeAttachmentStyle(indicators, personalMaturity);

  // Получаем иконку в зависимости от типа привязанности
  const getStyleIcon = () => {
    switch (style.type) {
      case 'disorganized': return <Zap className="text-red-600" size={20} />;
      case 'anxious': return <Heart className="text-yellow-600" size={20} />;
      case 'avoidant': return <Shield className="text-blue-600" size={20} />;
      case 'secure': return <Users className="text-green-600" size={20} />;
      case 'anxious_high_functioning': return <Heart className="text-yellow-600" size={20} />;
      case 'avoidant_intellectual': return <Shield className="text-blue-600" size={20} />;
      case 'mixed': return <Lightbulb className="text-gray-600" size={20} />;
      default: return <Lightbulb className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Heart className="text-indigo-600" size={20} />
          Анализ стиля привязанности
        </h3>
        <Tooltip
          content="Определяет ваш базовый стиль привязанности и его влияние на отношения. Показывает паттерны поведения в близости и предлагает пути развития более здоровой привязанности."
          title="Стиль привязанности"
          trigger="click"
          position="left"
          maxWidth="max-w-sm"
        />
      </div>

      <AnalysisCard
        title={style.title}
        description={style.description}
        severity={style.severity}
        icon={getStyleIcon()}
        characteristics={style.characteristics}
        additionalSections={[
          {
            title: "Работа с привязанностью",
            items: style.workingWith,
            icon: <Shield className="text-indigo-600" size={16} />
          },
          {
            title: "Здоровое развитие",
            items: style.healthyDevelopment,
            icon: <Zap className="text-amber-600" size={16} />
          },
          {
            title: "Советы для отношений",
            items: style.relationshipAdvice,
            icon: <Users className="text-green-600" size={16} />
          }
        ]}
        className="border-l-4 rounded-lg"
      />
    </div>
  );
};

export default AttachmentStyleAnalysisRefactored;
