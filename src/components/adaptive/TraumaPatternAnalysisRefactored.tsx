import React from 'react';
import { AlertTriangle, Brain, Shield, Lightbulb } from 'lucide-react';
import { 
  TraumaPatternProps
} from '../../types/analysis-types';
import AnalysisCard from '../shared/AnalysisCard';
import Tooltip from '../ui/Tooltip';
import { analyzeTraumaPattern } from '../../utils/trauma-analysis';

/**
 * Компонент анализа паттернов травмы (рефакторинговая версия)
 * @param indicators - индикаторы для анализа
 * @param personalMaturity - уровень личностной зрелости 
 * @param relationshipMaturity - уровень зрелости отношений (используется для контекста)
 * @param traumaAnswers - ответы на вопросы о травматическом опыте
 */
const TraumaPatternAnalysisRefactored: React.FC<TraumaPatternProps> = ({
  indicators = [],
  personalMaturity,
  // @ts-ignore - сохраняем для единообразия API, хотя пока не используется
  relationshipMaturity,
  // @ts-ignore - сохраняем для единообразия API, хотя пока не используется
  traumaAnswers = []
}) => {
  const trauma = analyzeTraumaPattern(indicators, personalMaturity);
  
  // Получаем иконку в зависимости от типа паттерна травмы
  const getTraumaIcon = () => {
    switch (trauma.type) {
      case 'compensated_high_functioning': return <Lightbulb className="text-blue-600" size={20} />;
      case 'karmic_loop': return <AlertTriangle className="text-red-600" size={20} />;
      case 'survival_fear': return <AlertTriangle className="text-yellow-600" size={20} />;
      case 'unresolved_childhood': return <Brain className="text-orange-600" size={20} />;
      case 'adaptive_management': return <Shield className="text-green-600" size={20} />;
      case 'moderate_trauma': return <Brain className="text-purple-600" size={20} />;
      default: return <Brain className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Brain className="text-indigo-600" size={20} />
          Анализ паттернов травмы
        </h3>
        <Tooltip
          content="Выявляет влияние прошлого травматического опыта на ваши отношения. Показывает, как неосознанные травматические реакции могут активироваться в близких отношениях."
          title="Травматические паттерны"
          trigger="click"
          position="left"
          maxWidth="max-w-sm"
        />
      </div>
      
      <AnalysisCard
        title={trauma.title}
        description={trauma.description}
        severity={trauma.severity}
        icon={getTraumaIcon()}
        characteristics={trauma.characteristics}
        additionalSections={[
          {
            title: "Путь исцеления",
            items: trauma.healingPath,
            icon: <Shield className="text-indigo-600" size={16} />
          },
          {
            title: "Рекомендации по терапии",
            items: trauma.therapyRecommendations,
            icon: <Brain className="text-amber-600" size={16} />
          },
          {
            title: "Сигналы предупреждения",
            items: trauma.warningSignals,
            icon: <AlertTriangle className="text-red-600" size={16} />
          }
        ]}
        className="border-l-4 rounded-lg"
      />
    </div>
  );
};

export default TraumaPatternAnalysisRefactored;
