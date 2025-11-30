import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Heart,
  Brain
} from 'lucide-react';
import Tooltip from '../ui/Tooltip';

interface MaturityGapAnalysisProps {
  personalMaturity: number;
  relationshipMaturity: number;
  gapAnalysis: {
    type: 'personal_higher' | 'relationship_higher' | 'balanced';
    severity: 'minimal' | 'moderate' | 'significant' | 'critical';
    psychologicalPattern: string;
    recommendations: string[];
  };
}

const getGapIcon = (type: string, severity: string) => {
  if (severity === 'critical') return <AlertTriangle className="w-8 h-8 text-red-500" />;
  if (type === 'personal_higher') return <Brain className="w-8 h-8 text-blue-500" />;
  if (type === 'relationship_higher') return <Heart className="w-8 h-8 text-pink-500" />;
  return <CheckCircle className="w-8 h-8 text-green-500" />;
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'minimal': return 'text-green-600 bg-green-50 border-green-200';
    case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'significant': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getPsychologicalInsight = (type: string, severity: string) => {
  
  if (type === 'balanced') {
    return {
      title: "🌟 Гармоничное развитие",
      description: "Ваша личная и отношенческая зрелость развиваются сбалансированно. Это редкое и ценное качество.",
      insight: "Вы умеете сохранять себя в отношениях, не теряя способности к глубокой близости. Такой баланс создает основу для здоровых, долгосрочных отношений, где оба партнера могут расти и развиваться.",
      risks: [],
      opportunities: [
        "Служить примером здоровых отношений для других",
        "Помогать партнерам в их личностном росте",
        "Создавать глубокие, взаимообогащающие связи"
      ]
    };
  }
  
  if (type === 'personal_higher') {
    const insights = {
      moderate: {
        title: "🧠 Личностный рост опережает отношения",
        description: "Вы активно работаете над собой, но навыки близости развиваются медленнее.",
        insight: "Высокая личная зрелость - это дар, но она может создавать барьеры в отношениях. Вы можете чувствовать фрустрацию от того, что партнер 'не дорос' до вашего уровня, или ощущать одиночество даже в паре.",
        risks: [
          "Интеллектуализация эмоций вместо их проживания",
          "Критичность к партнеру и его 'незрелости'",
          "Избегание уязвимости и эмоциональной открытости"
        ],
        opportunities: [
          "Использовать личную зрелость для создания безопасного пространства в отношениях",
          "Развивать эмоциональный интеллект и эмпатию",
          "Учиться принимать несовершенства партнера с пониманием"
        ]
      },
      significant: {
        title: "🔬 Значительный дисбаланс в пользу личности",
        description: "Выраженный разрыв может создавать серьезные трудности в близости.",
        insight: "Вы достигли высокого уровня самосознания и личностной зрелости, но это может парадоксально мешать отношениям. Возможна тенденция к контролю, сверханализу или эмоциональной отстраненности.",
        risks: [
          "Превращение отношений в 'проект по развитию партнера'",
          "Подавление спонтанности и игривости",
          "Создание динамики 'учитель-ученик' вместо равноправного партнерства"
        ],
        opportunities: [
          "Научиться 'спускаться' с высот разума к сердцу",
          "Практиковать безусловное принятие и любовь",
          "Развивать способность к здоровой зависимости"
        ]
      },
      critical: {
        title: "⚠️ Критический разрыв: риск изоляции",
        description: "Такой значительный дисбаланс требует немедленного внимания.",
        insight: "Ваша личная зрелость настолько превышает отношенческую, что это может приводить к глубокому одиночеству и неспособности создавать настоящую близость. Возможны нарциссические тенденции или избегание привязанности.",
        risks: [
          "Полная эмоциональная изоляция даже в отношениях",
          "Неспособность к взаимозависимости и компромиссам",
          "Превращение партнера в 'проект' или объект контроля"
        ],
        opportunities: [
          "Работа с терапевтом по привязанности",
          "Изучение уязвимости как силы, а не слабости",
          "Практика эмоциональной доступности в безопасной среде"
        ]
      }
    };
    
    if (severity === 'critical') return insights.critical;
    if (severity === 'significant') return insights.significant;
    return insights.moderate;
  }
  
  if (type === 'relationship_higher') {
    const insights = {
      moderate: {
        title: "💕 Отношенческая зрелость опережает личную",
        description: "Вы умеете строить связи, но можете терять себя в них.",
        insight: "У вас есть прекрасный дар создавать близость и поддерживать других, но вы можете жертвовать собственными потребностями ради отношений. Это может приводить к выгоранию и потере идентичности.",
        risks: [
          "Созависимость и потеря личных границ",
          "Подавление собственных потребностей ради мира",
          "Привычка 'спасать' и 'исправлять' партнера"
        ],
        opportunities: [
          "Развивать здоровую автономию внутри отношений",
          "Учиться выражать свои потребности и желания",
          "Находить баланс между заботой о других и о себе"
        ]
      },
      significant: {
        title: "🔄 Значительный дисбаланс в пользу отношений",
        description: "Сильный уклон в отношения при недостатке личностного развития.",
        insight: "Вы можете полностью растворяться в отношениях, теряя ощущение собственной идентичности. Отношения становятся не дополнением к жизни, а единственным источником самооценки и смысла.",
        risks: [
          "Глубокая созависимость и эмоциональная нестабильность",
          "Паника при угрозе разрыва отношений",
          "Неспособность быть в одиночестве и наслаждаться им"
        ],
        opportunities: [
          "Развивать индивидуальные интересы и хобби",
          "Укреплять самооценку независимо от отношений",
          "Учиться здоровой привязанности без слияния"
        ]
      },
      critical: {
        title: "🚨 Критическая созависимость",
        description: "Экстремальный дисбаланс требует профессиональной помощи.",
        insight: "Ваша идентичность полностью поглощена отношениями. Без партнера вы можете ощущать экзистенциальную пустоту. Это может проявляться в деструктивных паттернах и нездоровой привязанности.",
        risks: [
          "Полная потеря собственной идентичности",
          "Разрушительные циклы расставаний и воссоединений",
          "Возможность попадания в абьюзивные отношения"
        ],
        opportunities: [
          "Срочная работа с психологом по теме созависимости",
          "Программы поддержки для созависимых",
          "Постепенное восстановление связи с собой"
        ]
      }
    };
    
    if (severity === 'critical') return insights.critical;
    if (severity === 'significant') return insights.significant;
    return insights.moderate;
  }
  
  return {
    title: "Анализ недоступен",
    description: "",
    insight: "",
    risks: [],
    opportunities: []
  };
};

export const MaturityGapAnalysis: React.FC<MaturityGapAnalysisProps> = ({
  personalMaturity,
  relationshipMaturity,
  gapAnalysis
}) => {
  const gap = Math.abs(personalMaturity - relationshipMaturity);
  const insight = getPsychologicalInsight(gapAnalysis.type, gapAnalysis.severity);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            {getGapIcon(gapAnalysis.type, gapAnalysis.severity)}
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Анализ разрыва зрелости
              </h3>
              <p className="text-sm text-gray-600">
                Разрыв: {gap.toFixed(1)} ступени
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip
              content="Психологический анализ соотношения личной и отношенческой зрелости. Помогает понять дисбалансы в развитии и получить персональные рекомендации для гармоничного роста."
              title="О модуле"
              trigger="click"
              position="left"
              maxWidth="max-w-sm"
            />
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(gapAnalysis.severity)}`}>
              {gapAnalysis.severity === 'minimal' && 'Минимальный'}
              {gapAnalysis.severity === 'moderate' && 'Умеренный'}
              {gapAnalysis.severity === 'significant' && 'Значительный'}
              {gapAnalysis.severity === 'critical' && 'Критический'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Визуализация разрыва */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600">Личная зрелость</span>
          <span className="text-sm font-medium text-green-600">Зрелость отношений</span>
        </div>
        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(personalMaturity / 12) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {personalMaturity.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="text-lg font-bold text-gray-400">VS</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(relationshipMaturity / 12) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {relationshipMaturity.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Психологическая интерпретация */}
      <div className="px-6 py-6">
        <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-baseline gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              {insight.title}
            </h4>
          <p className="text-gray-700 mb-4">
            {insight.description}
          </p>
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
            <p className="text-blue-800 text-sm leading-relaxed">
              {insight.insight}
            </p>
          </div>
        </div>
        
        {/* Риски и возможности */}
        <div className="grid md:grid-cols-2 gap-6">
          {insight.risks.length > 0 && (
            <div>
              <h5 className="font-semibold text-red-600 mb-3 flex items-baseline gap-2">
                <AlertTriangle className="w-4 h-4" />
                Потенциальные риски
              </h5>
              <ul className="space-y-2">
                {insight.risks.map((risk, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-500 mt-1 text-xs">●</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {insight.opportunities.length > 0 && (
            <div>
              <h5 className="font-semibold text-green-600 mb-3 flex items-baseline gap-2">
                <Target className="w-4 h-4" />
                Возможности роста
              </h5>
              <ul className="space-y-2">
                {insight.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 mt-1 text-xs">●</span>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Рекомендации */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <h5 className="font-semibold text-purple-800 mb-3">🎯 Персональные рекомендации</h5>
          <ul className="space-y-2">
            {gapAnalysis.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                <span className="text-purple-500 mt-1">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default MaturityGapAnalysis; 