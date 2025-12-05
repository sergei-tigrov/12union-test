import React from 'react';
import { AlertCircle, Heart, MessageCircle } from 'lucide-react';
import { JealousyDynamicsProps } from '../../types/analysis-types';
import AnalysisCard from '../shared/AnalysisCard';
import Tooltip from '../ui/Tooltip';
import { analyzeJealousyDynamics } from '../../utils/analysis-psychology';

/**
 * Рефакторинговый компонент анализа динамики ревности
 */
const JealousyDynamicsAnalysisRefactored: React.FC<JealousyDynamicsProps> = ({
  indicators = [],
  personalMaturity
}) => {
  // Используем утилиту для анализа динамики ревности
  const dynamics = analyzeJealousyDynamics(indicators, personalMaturity);

  // Получаем иконку в зависимости от типа динамики ревности
  const getDynamicsIcon = () => {
    switch (dynamics.type) {
      case 'insecurity_based': return <Heart className="text-amber-600" size={20} />;
      case 'control_based': return <AlertCircle className="text-red-600" size={20} />;
      case 'trauma_based': return <AlertCircle className="text-red-600" size={20} />;
      case 'minimal': return <Heart className="text-green-600" size={20} />;
      case 'healthy_concern': return <Heart className="text-green-600" size={20} />;
      default: return <Heart className="text-gray-600" size={20} />;
    }
  };

  // Формируем дополнительные секции
  const additionalSections = [
    {
      title: "Триггеры ревности",
      items: dynamics.triggers,
      icon: <AlertCircle className="text-amber-600" size={16} />
    },
    {
      title: "Здоровые практики",
      items: dynamics.healthyPractices,
      icon: <Heart className="text-indigo-600" size={16} />
    },
    {
      title: "Стратегии коммуникации",
      items: dynamics.communicationStrategies,
      icon: <MessageCircle className="text-blue-600" size={16} />
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Heart className="text-indigo-600" size={20} />
          Анализ динамики ревности
        </h3>
        <Tooltip
          content="Анализирует паттерны ревности в отношениях, их источники и предлагает стратегии для развития здорового доверия."
          title="Динамика ревности"
          trigger="click"
          position="left"
          maxWidth="max-w-sm"
        />
      </div>

      <AnalysisCard
        title={dynamics.title}
        description={dynamics.description}
        severity={dynamics.severity}
        icon={getDynamicsIcon()}
        characteristics={dynamics.characteristics}
        additionalSections={additionalSections}
        className="border-l-4 rounded-lg"
      />
    </div>
  );
};

export default JealousyDynamicsAnalysisRefactored;
