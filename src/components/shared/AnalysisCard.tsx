import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

interface AnalysisCardProps {
  title: string;
  description: string;
  severity: 'minimal' | 'moderate' | 'significant' | 'critical';
  icon?: ReactNode;
  characteristics?: string[];
  recommendations?: string[];
  additionalSections?: {
    title: string;
    items: string[];
    icon?: ReactNode;
  }[];
  className?: string;
}

/**
 * Универсальная карточка для отображения результатов анализа
 */
const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  description,
  severity,
  icon,
  characteristics,
  recommendations,
  additionalSections = [],
  className = '',
}) => {
  // Анимация появления
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Цвета в зависимости от важности
  const getSeverityColor = () => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20';
      case 'significant': return 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20';
      case 'moderate': return 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20';
      case 'minimal': return 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20';
      default: return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/20';
    }
  };

  return (
    <motion.div
      className={`rounded-xl border-l-4 p-5 mb-6 shadow-md ${getSeverityColor()} ${className}`}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      {/* Заголовок */}
      <div className="flex items-center gap-3 mb-3">
        {icon || <Lightbulb className="text-indigo-600 dark:text-indigo-400" size={20} />}
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">{title}</h3>
        
        {severity === 'critical' && (
          <Tooltip content="Требует особого внимания">
            <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-200">
              Критично
            </span>
          </Tooltip>
        )}
      </div>
      
      {/* Описание */}
      <p className="mb-4 text-gray-600 dark:text-gray-300">{description}</p>
      
      {/* Характеристики */}
      {characteristics && characteristics.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Характеристики:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {characteristics.map((item, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300">{item}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Рекомендации */}
      {recommendations && recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Рекомендации:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {recommendations.map((item, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300">{item}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Дополнительные секции */}
      {additionalSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {section.icon}
            <h4 className="font-medium text-gray-700 dark:text-gray-200">{section.title}:</h4>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {section.items.map((item, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300">{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </motion.div>
  );
};

export default AnalysisCard;
