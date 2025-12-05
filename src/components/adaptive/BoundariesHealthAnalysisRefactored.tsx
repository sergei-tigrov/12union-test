import React from 'react';
import { Shield, Heart, Users, ArrowRight } from 'lucide-react';
import {
  BoundariesHealthProps
} from '../../types/analysis-types';
import AnalysisCard from '../shared/AnalysisCard';
import Tooltip from '../ui/Tooltip';
import { analyzeBoundariesHealth } from '../../utils/analysis-psychology';

/**
 * Компонент анализа здоровья границ (рефакторинговая версия)
 * @param indicators - индикаторы для анализа
 * @param personalMaturity - уровень личностной зрелости
 * @param relationshipMaturity - уровень зрелости отношений (используется для контекста)
 * @param boundariesAnswers - ответы на вопросы о границах
 */
const BoundariesHealthAnalysisRefactored: React.FC<BoundariesHealthProps> = ({
  indicators = [],
  personalMaturity
}) => {
  const boundaries = analyzeBoundariesHealth(indicators, personalMaturity);

  // Получаем иконку в зависимости от типа границ
  const getBoundaryIcon = () => {
    switch (boundaries.type) {
      case 'weak': return <Heart className="text-yellow-600" size={20} />;
      case 'rigid': return <Shield className="text-blue-600" size={20} />;
      case 'fluctuating': return <ArrowRight className="text-orange-600" size={20} />;
      case 'healthy': return <Users className="text-green-600" size={20} />;
      case 'developing': return <Shield className="text-purple-600" size={20} />;
      default: return <Shield className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="text-indigo-600" size={20} />
          Анализ здоровья границ
        </h3>
        <Tooltip
          content="Исследует вашу способность устанавливать и поддерживать здоровые личные границы в отношениях. Показывает, как вы балансируете между своими потребностями и потребностями других людей."
          title="Здоровье границ"
          trigger="click"
          position="left"
          maxWidth="max-w-sm"
        />
      </div>

      <AnalysisCard
        title={boundaries.title}
        description={boundaries.description}
        severity={boundaries.severity}
        icon={getBoundaryIcon()}
        characteristics={boundaries.characteristics}
        additionalSections={[
          {
            title: "Практические упражнения",
            items: boundaries.practicalExercises,
            icon: <Shield className="text-indigo-600" size={16} />
          },
          {
            title: "Утверждения для укрепления границ",
            items: boundaries.boundaryStatements,
            icon: <Users className="text-green-600" size={16} />
          }
        ]}
        className="border-l-4 rounded-lg"
      />
    </div>
  );
};

export default BoundariesHealthAnalysisRefactored;
