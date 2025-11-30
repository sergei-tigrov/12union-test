import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Info,
  Brain
} from 'lucide-react';
import Tooltip from '../ui/Tooltip';

interface ContradictionAnalysisProps {
  contradictions: {
    detected: boolean;
    severity: 'low' | 'medium' | 'high';
    details: string[];
  };
  consistency: number;
  validationScore: number;
  questionsAsked: number;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getValidationLevel = (score: number) => {
  if (score >= 85) return { level: 'Высокая', color: 'text-green-600', icon: <CheckCircle className="w-5 h-5" /> };
  if (score >= 70) return { level: 'Хорошая', color: 'text-blue-600', icon: <Shield className="w-5 h-5" /> };
  if (score >= 50) return { level: 'Умеренная', color: 'text-yellow-600', icon: <AlertTriangle className="w-5 h-5" /> };
  return { level: 'Низкая', color: 'text-red-600', icon: <XCircle className="w-5 h-5" /> };
};

const getConsistencyLevel = (consistency: number) => {
  if (consistency >= 0.85) return { level: 'Очень высокая', color: 'text-green-600', description: 'Ваши ответы демонстрируют исключительную согласованность' };
  if (consistency >= 0.75) return { level: 'Высокая', color: 'text-blue-600', description: 'Ответы хорошо согласованы между собой' };
  if (consistency >= 0.65) return { level: 'Умеренная', color: 'text-yellow-600', description: 'Есть некоторые расхождения в ответах' };
  if (consistency >= 0.50) return { level: 'Низкая', color: 'text-orange-600', description: 'Заметные противоречия в ответах' };
  return { level: 'Очень низкая', color: 'text-red-600', description: 'Значительные противоречия, результаты могут быть неточными' };
};

const getSocialDesirabilityInsight = (contradictions: { detected: boolean; severity: string }, consistency: number, validationScore: number) => {
  const hasHighValidation = validationScore >= 80;
  const hasHighConsistency = consistency >= 0.8;
  const hasContradictions = contradictions.detected && contradictions.severity !== 'low';
  
  if (hasHighValidation && hasHighConsistency && !hasContradictions) {
    return {
      type: 'authentic',
      title: '✨ Высокая аутентичность ответов',
      description: 'Ваши ответы демонстрируют искренность и последовательность',
      insight: 'Вы отвечали честно, не пытаясь представить себя в более выгодном свете. Это редкое качество, которое говорит о высоком уровне самоосознания и принятия себя.',
      color: 'from-green-50 to-emerald-50 border-green-200',
      textColor: 'text-green-800'
    };
  }
  
  if (!hasHighValidation || hasContradictions) {
    return {
      type: 'social_desirability',
      title: '🎭 Влияние социальной желательности',
      description: 'Обнаружены признаки "приукрашивания" ответов',
      insight: 'Возможно, вы неосознанно давали ответы, которые кажутся более социально приемлемыми или "правильными". Это естественная тенденция, но может влиять на точность результатов.',
      color: 'from-yellow-50 to-orange-50 border-yellow-200',
      textColor: 'text-yellow-800'
    };
  }
  
  if (!hasHighConsistency) {
    return {
      type: 'inconsistent',
      title: '🔄 Внутренние противоречия',
      description: 'Выявлены противоречия в ответах на схожие вопросы',
      insight: 'Это может указывать на внутренние конфликты, переходный период в жизни или сложность ситуации. Также возможно, что вы торопились с ответами или не до конца понимали вопросы.',
      color: 'from-blue-50 to-purple-50 border-blue-200',
      textColor: 'text-blue-800'
    };
  }
  
  return {
    type: 'moderate',
    title: '⚖️ Умеренная надежность',
    description: 'Результаты в целом надежны, но есть некоторые нюансы',
    insight: 'Ваши ответы показывают смешанную картину с элементами как искренности, так и некоторого "приукрашивания". Это нормально для большинства людей.',
    color: 'from-gray-50 to-blue-50 border-gray-200',
    textColor: 'text-gray-800'
  };
};

const getRecommendationsForImprovement = (analysis: { type: string }, contradictions: { detected: boolean; severity: string }) => {
  const recommendations = [];
  
  if (analysis.type === 'social_desirability') {
    recommendations.push(
      'Попробуйте пройти тест повторно, отвечая максимально честно, даже если ответ кажется "неправильным"',
      'Помните: нет "плохих" или "хороших" уровней - каждый этап развития ценен',
      'Рассмотрите работу с психологом для повышения самопринятия'
    );
  }
  
  if (analysis.type === 'inconsistent') {
    recommendations.push(
      'Найдите спокойное время и место для повторного прохождения теста',
      'Обратите внимание на вопросы, которые вызывают внутреннее сопротивление',
      'Возможно, стоит исследовать обнаруженные внутренние противоречия с помощью самоанализа или терапии'
    );
  }
  
  if (contradictions.detected && contradictions.severity === 'high') {
    recommendations.push(
      'Обратитесь к специалисту для более глубокого анализа выявленных противоречий',
      'Рассмотрите ведение дневника для лучшего понимания своих паттернов',
      'Практикуйте медитацию или майндфулнесс для повышения самоосознания'
    );
  }
  
  if (analysis.type === 'authentic') {
    recommendations.push(
      'Используйте результаты как основу для дальнейшего развития',
      'Поделитесь инсайтами с партнером для углубления понимания друг друга',
      'Рассмотрите возможность повторного прохождения теста через 3-6 месяцев для отслеживания прогресса'
    );
  }
  
  return recommendations;
};

export const ContradictionAnalysis: React.FC<ContradictionAnalysisProps> = ({
  contradictions,
  consistency,
  validationScore,
  questionsAsked
}) => {
  const validation = getValidationLevel(validationScore);
  const consistencyLevel = getConsistencyLevel(consistency);
  const socialDesirabilityAnalysis = getSocialDesirabilityInsight(contradictions, consistency, validationScore);
  const recommendations = getRecommendationsForImprovement(socialDesirabilityAnalysis, contradictions);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-500" />
              Анализ качества ответов
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Оценка надежности и аутентичности результатов тестирования
            </p>
          </div>
          <Tooltip
            content="Оценивает достоверность ваших ответов, выявляет противоречия и влияние социальной желательности. Помогает понять, насколько можно доверять полученным результатам."
            title="Качество ответов"
            trigger="click"
            position="left"
            maxWidth="max-w-sm"
          />
        </div>
      </div>
      
      {/* Ключевые метрики */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Валидность */}
          <div className="text-center">
            <div className={`flex items-center justify-center mb-2 ${validation.color}`}>
              {validation.icon}
            </div>
            <div className="text-lg font-bold text-gray-900">{validationScore}%</div>
            <div className="text-xs text-gray-600">Валидность</div>
            <div className={`text-xs font-medium ${validation.color}`}>
              {validation.level}
            </div>
          </div>
          
          {/* Согласованность */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {Math.round(consistency * 100)}%
            </div>
            <div className="text-xs text-gray-600">Согласованность</div>
            <div className={`text-xs font-medium ${consistencyLevel.color}`}>
              {consistencyLevel.level}
            </div>
          </div>
          
          {/* Противоречия */}
          <div className="text-center">
            <div className="text-2xl mb-2">
              {contradictions.detected ? (
                contradictions.severity === 'high' ? '🚨' : 
                contradictions.severity === 'medium' ? '⚠️' : '⚡'
              ) : '✅'}
            </div>
            <div className="text-xs text-gray-600">Противоречия</div>
            <div className={`text-xs font-medium ${contradictions.detected ? getSeverityColor(contradictions.severity) : 'text-green-600'}`}>
              {contradictions.detected ? 
                (contradictions.severity === 'high' ? 'Высокие' : 
                 contradictions.severity === 'medium' ? 'Средние' : 'Низкие') : 
                'Отсутствуют'
              }
            </div>
          </div>
          
          {/* Эффективность */}
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {questionsAsked}
            </div>
            <div className="text-xs text-gray-600">Вопросов</div>
            <div className="text-xs font-medium text-purple-600">
              Эффективно
            </div>
          </div>
        </div>
      </div>
      
      {/* Анализ социальной желательности */}
      <div className="p-6">
        <div className={`bg-gradient-to-r ${socialDesirabilityAnalysis.color} rounded-lg p-4 mb-6`}>
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Info className="w-5 h-5" />
            {socialDesirabilityAnalysis.title}
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            {socialDesirabilityAnalysis.description}
          </p>
          <div className="bg-white/70 rounded-lg p-3">
            <p className={`text-sm ${socialDesirabilityAnalysis.textColor} leading-relaxed`}>
              {socialDesirabilityAnalysis.insight}
            </p>
          </div>
        </div>
        

        
        {/* Интерпретация согласованности */}
        <div className="mb-6">
          <h5 className="font-semibold text-gray-900 mb-3">
            📊 Анализ согласованности ответов
          </h5>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Уровень согласованности</span>
              <span className={`font-bold ${consistencyLevel.color}`}>{Math.round(consistency * 100)}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${consistency * 100}%` }}
              />
            </div>
            <p className="text-sm text-blue-800">
              {consistencyLevel.description}
            </p>
          </div>
        </div>
        
        {/* Рекомендации */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <h5 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Рекомендации для улучшения результатов
          </h5>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                <span className="text-purple-500 mt-1">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Дополнительная информация */}
        <div className="mt-6 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p className="flex items-center gap-1 mb-1">
            <Info className="w-3 h-3" />
            <strong>О метриках:</strong>
          </p>
          <p>• <strong>Валидность</strong> — соответствие ответов экспертным ожиданиям</p>
          <p>• <strong>Согласованность</strong> — отсутствие противоречий между ответами</p>
          <p>• <strong>Социальная желательность</strong> — тенденция давать "правильные" ответы</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ContradictionAnalysis; 