import React from 'react';
import { Heart, Target, ChevronRight, AlertCircle } from 'lucide-react';
import { 
  RelationshipMotivationProps
} from '../../types/analysis-types';
import AnalysisCard from '../shared/AnalysisCard';
import Tooltip from '../ui/Tooltip';
import { analyzeRelationshipMotivation } from '../../utils/relationship-motivation-analysis';

/**
 * Рефакторинговый компонент анализа мотивации отношений
 */
const RelationshipMotivationAnalysisRefactored: React.FC<RelationshipMotivationProps> = ({
  motivationAnswers: _motivationAnswers,
  indicators = [],
  personalMaturity,
  relationshipMaturity
}) => {
  const motivation = analyzeRelationshipMotivation(
    indicators, 
    personalMaturity,
    relationshipMaturity
  );
  
  // Получаем иконку в зависимости от типа мотивации
  const getMotivationIcon = () => {
    switch (motivation.type) {
      case 'purpose_based': return <Target className="text-blue-600" size={20} />;
      case 'growth_based': return <ChevronRight className="text-green-600" size={20} />;
      case 'mixed': return <Heart className="text-purple-600" size={20} />;
      case 'fear_based': return <AlertCircle className="text-red-600" size={20} />;
      case 'need_based': return <Heart className="text-orange-600" size={20} />;
      default: return <Heart className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Heart className="text-pink-600" size={20} />
          Анализ мотивации отношений
        </h3>
        <Tooltip
          content="Анализ глубинной психологической мотивации ваших отношений. Показывает, какие силы движут вашими отношениями – от базовых нужд и страхов до роста и высшего предназначения."
          title="Мотивация отношений"
          trigger="click"
          position="left"
          maxWidth="max-w-sm"
        />
      </div>
      
      <AnalysisCard
        title={motivation.title}
        description={motivation.description}
        severity={motivation.severity}
        icon={getMotivationIcon()}
        characteristics={motivation.characteristics}
        additionalSections={[
          {
            title: "Более здоровые альтернативы",
            items: motivation.healthierAlternatives,
            icon: <Target className="text-teal-600" size={16} />
          },
          {
            title: "Вопросы для самоанализа",
            items: motivation.selfReflectionQuestions,
            icon: <ChevronRight className="text-blue-600" size={16} />
          }
        ]}
        className="border-l-4 border-pink-200 rounded-lg"
      />
    </div>
  );
};

export default RelationshipMotivationAnalysisRefactored;
