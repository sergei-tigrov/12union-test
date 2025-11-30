import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Users, 
  Brain, 
  Heart, 
  Shield, 
  Target,
  TrendingUp,
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

interface EnhancedIndicatorsProps {
  indicators: string[];
  personalMaturity: number;
  relationshipMaturity: number;
  detectedZone: string;
}

interface IndicatorGroup {
  category: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  indicators: string[];
  description: string;
  psychologicalMeaning: string;
}

const categorizeIndicators = (indicators: string[]): IndicatorGroup[] => {
  const categories: { [key: string]: IndicatorGroup } = {
    emotional: {
      category: 'Эмоциональная сфера',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-pink-700',
      bgColor: 'bg-pink-50 border-pink-200',
      indicators: [],
      description: 'Как вы переживаете и выражаете эмоции',
      psychologicalMeaning: 'Эмоциональная зрелость определяет способность к глубокой близости и эмоциональному интеллекту.'
    },
    cognitive: {
      category: 'Когнитивная сфера',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      indicators: [],
      description: 'Мышление, анализ и осознанность',
      psychologicalMeaning: 'Когнитивная зрелость отражает способность к самоанализу и осознанному принятию решений.'
    },
    relational: {
      category: 'Отношенческая сфера',
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-700',
      bgColor: 'bg-green-50 border-green-200',
      indicators: [],
      description: 'Взаимодействие и близость с партнером',
      psychologicalMeaning: 'Отношенческая зрелость показывает умение создавать и поддерживать здоровые связи.'
    },
    personal: {
      category: 'Личностная сфера',
      icon: <User className="w-5 h-5" />,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50 border-purple-200',
      indicators: [],
      description: 'Самопознание и личностный рост',
      psychologicalMeaning: 'Личностная зрелость характеризует уровень самосознания и аутентичности.'
    },
    behavioral: {
      category: 'Поведенческая сфера',
      icon: <Target className="w-5 h-5" />,
      color: 'text-orange-700',
      bgColor: 'bg-orange-50 border-orange-200',
      indicators: [],
      description: 'Действия и реакции в отношениях',
      psychologicalMeaning: 'Поведенческие паттерны отражают уровень осознанности в действиях.'
    },
    shadow: {
      category: 'Теневые аспекты',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-gray-700',
      bgColor: 'bg-gray-50 border-gray-200',
      indicators: [],
      description: 'Скрытые и неосознанные паттерны',
      psychologicalMeaning: 'Теневые аспекты показывают области для проработки и интеграции.'
    }
  };

  // Ключевые слова для категоризации
  const emotionalKeywords = ['эмоция', 'чувств', 'любов', 'страст', 'ревност', 'гнев', 'страх', 'радост', 'грусть', 'тревог', 'эмпат'];
  const cognitiveKeywords = ['осознан', 'анализ', 'мышлен', 'понимани', 'знани', 'учени', 'интеллект', 'рефлекс', 'инсайт'];
  const relationalKeywords = ['отношени', 'партнер', 'близост', 'интимност', 'совместн', 'взаимо', 'коммуникац', 'связь', 'союз'];
  const personalKeywords = ['личност', 'само', 'индивидуальн', 'аутентичн', 'идентичност', 'границ', 'ценност', 'убеждени'];
  const behavioralKeywords = ['поведени', 'действи', 'реакци', 'привычк', 'паттерн', 'навык', 'практик', 'привяз'];
  const shadowKeywords = ['тень', 'теневой', 'скрыт', 'подавлен', 'отрицани', 'проекци', 'деструктив', 'созависим'];

  indicators.forEach(indicator => {
    const lowerIndicator = indicator.toLowerCase();
    let categorized = false;

    // Проверяем каждую категорию
    if (shadowKeywords.some(keyword => lowerIndicator.includes(keyword))) {
      categories.shadow.indicators.push(indicator);
      categorized = true;
    } else if (emotionalKeywords.some(keyword => lowerIndicator.includes(keyword))) {
      categories.emotional.indicators.push(indicator);
      categorized = true;
    } else if (cognitiveKeywords.some(keyword => lowerIndicator.includes(keyword))) {
      categories.cognitive.indicators.push(indicator);
      categorized = true;
    } else if (relationalKeywords.some(keyword => lowerIndicator.includes(keyword))) {
      categories.relational.indicators.push(indicator);
      categorized = true;
    } else if (personalKeywords.some(keyword => lowerIndicator.includes(keyword))) {
      categories.personal.indicators.push(indicator);
      categorized = true;
    } else if (behavioralKeywords.some(keyword => lowerIndicator.includes(keyword))) {
      categories.behavioral.indicators.push(indicator);
      categorized = true;
    }

    // Если не удалось категоризировать, добавляем в общую группу
    if (!categorized) {
      categories.personal.indicators.push(indicator);
    }
  });

  // Возвращаем только категории с индикаторами
  return Object.values(categories).filter(cat => cat.indicators.length > 0);
};

const getZoneAnalysis = (detectedZone: string) => {
  
  const analyses = {
    destructive: {
      title: '🚨 Деструктивная зона (1-3 уровни)',
      description: 'Основное внимание на выживании и базовой безопасности',
      characteristics: [
        'Травматические реакции и защитные механизмы',
        'Фокус на физической и эмоциональной безопасности',
        'Паттерны избегания или агрессии в конфликтах'
      ],
      opportunities: [
        'Работа с травмой и исцеление прошлого',
        'Развитие базового доверия и безопасности',
        'Создание стабильного фундамента для роста'
      ],
      color: 'from-red-50 to-orange-50 border-red-200'
    },
    emotional: {
      title: '💝 Эмоциональная зона (4-6 уровни)',
      description: 'Развитие эмоционального интеллекта и социальных навыков',
      characteristics: [
        'Практические и социальные аспекты отношений',
        'Стремление к стабильности и комфорту',
        'Ориентация на внешние ожидания и нормы'
      ],
      opportunities: [
        'Углубление эмоциональной связи с партнером',
        'Развитие навыков коммуникации',
        'Переход от внешней к внутренней мотивации'
      ],
      color: 'from-yellow-50 to-pink-50 border-yellow-200'
    },
    mature: {
      title: '🌟 Зрелая зона (7-9 уровни)',
      description: 'Развитие аутентичности и глубокой близости',
      characteristics: [
        'Эмоциональная честность и уязвимость',
        'Баланс между близостью и автономией',
        'Способность к взаимному росту и поддержке'
      ],
      opportunities: [
        'Развитие духовной близости',
        'Создание совместных проектов и целей',
        'Интеграция теневых аспектов личности'
      ],
      color: 'from-green-50 to-blue-50 border-green-200'
    },
    transcendent: {
      title: '✨ Трансцендентная зона (10-12 уровни)',
      description: 'Выход за пределы личности к служению и творчеству',
      characteristics: [
        'Синергия и взаимное усиление',
        'Творческое сотрудничество и сотворчество',
        'Служение чему-то большему, чем пара'
      ],
      opportunities: [
        'Создание значимого вклада в мир',
        'Трансформация через любовь и служение',
        'Становление примером для других пар'
      ],
      color: 'from-purple-50 to-indigo-50 border-purple-200'
    }
  };

  return analyses[detectedZone as keyof typeof analyses] || analyses.emotional;
};

export const EnhancedIndicators: React.FC<EnhancedIndicatorsProps> = ({
  indicators,
  personalMaturity,
  relationshipMaturity,
  detectedZone
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showZoneAnalysis, setShowZoneAnalysis] = useState(true);
  
  const categorizedIndicators = categorizeIndicators(indicators);
  const zoneAnalysis = getZoneAnalysis(detectedZone);
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      {/* Анализ зоны */}
      {showZoneAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${zoneAnalysis.color} rounded-xl p-6 border`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {zoneAnalysis.title}
              </h3>
              <p className="text-sm text-gray-700">
                {zoneAnalysis.description}
              </p>
            </div>
            <button 
              onClick={() => setShowZoneAnalysis(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Характерные черты
              </h4>
              <ul className="space-y-1">
                {zoneAnalysis.characteristics.map((char, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {char}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Возможности роста
              </h4>
              <ul className="space-y-1">
                {zoneAnalysis.opportunities.map((opp, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {opp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Заголовок индикаторов */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Психологические индикаторы
        </h3>
        <div className="text-sm text-gray-500">
          {categorizedIndicators.length} категорий • {indicators.length} индикаторов
        </div>
      </div>

      {/* Категории индикаторов */}
      <div className="space-y-4">
        {categorizedIndicators.map((group, index) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-xl overflow-hidden ${group.bgColor}`}
          >
            {/* Заголовок категории */}
            <button
              onClick={() => toggleCategory(group.category)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={group.color}>
                  {group.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">
                    {group.category}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {group.description} • {group.indicators.length} индикаторов
                  </p>
                </div>
              </div>
              <div className="text-gray-400">
                {expandedCategories.includes(group.category) ? 
                  <ChevronDown className="w-5 h-5" /> : 
                  <ChevronRight className="w-5 h-5" />
                }
              </div>
            </button>

            {/* Содержимое категории */}
            <AnimatePresence>
              {expandedCategories.includes(group.category) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200"
                >
                  <div className="px-6 py-4 bg-white/70">
                    {/* Психологическое значение */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Психологическое значение
                      </h5>
                      <p className="text-sm text-gray-700 italic">
                        {group.psychologicalMeaning}
                      </p>
                    </div>

                    {/* Список индикаторов */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.indicators.map((indicator, idx) => {
                        const cleanIndicator = indicator.replace(/^(Личность:|Отношения:)\s*/, '');
                        const isPersonal = indicator.includes('Личность:');
                        const isRelational = indicator.includes('Отношения:');
                        
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-1">
                                {isPersonal && <User className="w-3 h-3 text-blue-500" />}
                                {isRelational && <Users className="w-3 h-3 text-green-500" />}
                                {!isPersonal && !isRelational && <CheckCircle className="w-3 h-3 text-gray-400" />}
                              </div>
                              <span className="text-sm font-medium text-gray-700 leading-relaxed">
                                {cleanIndicator}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Сводка по индикаторам */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 rounded-xl p-6 border border-gray-200"
      >
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-gray-600" />
          Интегративный анализ
        </h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {categorizedIndicators.filter(g => g.indicators.some(i => i.includes('Личность:'))).length}
            </div>
            <div className="text-sm text-gray-600">Личностных сфер</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {categorizedIndicators.filter(g => g.indicators.some(i => i.includes('Отношения:'))).length}
            </div>
            <div className="text-sm text-gray-600">Отношенческих сфер</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.round((personalMaturity + relationshipMaturity) / 2 * 10) / 10}
            </div>
            <div className="text-sm text-gray-600">Средняя зрелость</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Ключевой инсайт:</strong> Ваши индикаторы показывают {' '}
            {categorizedIndicators.length >= 4 ? 'многогранное развитие' : 'фокусированное развитие'} {' '}
            с преобладанием {categorizedIndicators[0]?.category.toLowerCase() || 'смешанных'} характеристик.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedIndicators; 