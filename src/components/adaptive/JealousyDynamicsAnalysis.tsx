import React from 'react';
import { motion } from 'framer-motion';
import { Heart, AlertTriangle, Shield, Eye, Lightbulb, ArrowRight } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

interface JealousyDynamicsAnalysisProps {
  jealousyAnswers: string[];
  indicators: string[];
  personalMaturity: number;
  relationshipMaturity: number;
}

interface JealousyDynamics {
  type: 'toxic_possessive' | 'insecure_reactive' | 'healthy_protective' | 'wise_nonattached';
  intensity: 'destructive' | 'concerning' | 'moderate' | 'healthy';
  title: string;
  description: string;
  patterns: string[];
  underlyingBeliefs: string[];
  impacts: string[];
  transformationSteps: string[];
  partnerSupport: string[];
}

const analyzeJealousyDynamics = (_answers: string[], indicators: string[], personalMaturity: number): JealousyDynamics => {
  const hasJealousyAsLove = indicators.includes('jealousy_as_love') || indicators.includes('possessive_control');
  const hasOwnershipFear = indicators.includes('ownership_thinking') || indicators.includes('property_mentality');
  const hasHealthyJealousy = indicators.includes('protective_instinct') || indicators.includes('healthy_boundaries');

  const hasTraumaActivation = indicators.includes('childhood_trauma_activation') || indicators.includes('abandonment_fear');

  // Токсичная собственническая ревность
  if (hasJealousyAsLove && hasOwnershipFear && personalMaturity <= 4) {
    return {
      type: 'toxic_possessive',
      intensity: 'destructive',
      title: '🚨 Токсичная собственническая ревность',
      description: 'Ревность воспринимается как проявление любви. Партнер рассматривается как собственность, которую нужно охранять.',
      patterns: [
        'Контроль общения и связей партнера',
        'Запреты на дружбы и социальные контакты',
        'Постоянная слежка и проверки',
        'Интерпретация любого внимания к другим как угрозы'
      ],
      underlyingBeliefs: [
        'Если ревнуешь, значит любишь',
        'Партнер принадлежит мне и только мне',
        'Внимание к другим = предательство',
        'Контроль = забота и защита'
      ],
      impacts: [
        'Разрушение доверия и автономии партнера',
        'Создание атмосферы страха и напряжения',
        'Изоляция партнера от социальной поддержки',
        'Риск эскалации до эмоционального абьюза'
      ],
      transformationSteps: [
        'КРИТИЧНО: Признание проблемы и обращение за помощью',
        'Терапия по работе с контролирующим поведением',
        'Изучение здоровых форм любви и привязанности',
        'Работа с глубинными страхами покинутости'
      ],
      partnerSupport: [
        'НЕ нормализовать контролирующее поведение',
        'Устанавливать четкие границы на контроль',
        'Искать поддержку у друзей/семьи/терапевта',
        'Готовность к ultimatum при эскалации'
      ]
    };
  }

  // Небезопасная реактивная ревность
  if (hasTraumaActivation && (hasJealousyAsLove || hasOwnershipFear) && personalMaturity <= 6) {
    return {
      type: 'insecure_reactive',
      intensity: 'concerning',
      title: '⚠️ Небезопасная реактивная ревность',
      description: 'Ревность как реакция на глубинную неуверенность в себе и страх покинутости. Импульсивные вспышки без контроля.',
      patterns: [
        'Эмоциональные вспышки при малейших триггерах',
        'Поиск "доказательств" неверности или потери интереса',
        'Сравнение себя с другими людьми',
        'Требование постоянных подтверждений любви'
      ],
      underlyingBeliefs: [
        'Я недостаточно хорош/хороша для партнера',
        'Партнер рано или поздно найдет кого-то лучше',
        'Любовь нужно заслуживать и удерживать',
        'Если не контролировать, то потеряю'
      ],
      impacts: [
        'Эмоциональное истощение обеих сторон',
        'Циклы ссор и примирений',
        'Снижение спонтанности и радости в отношениях',
        'Развитие избегающего поведения у партнера'
      ],
      transformationSteps: [
        'Работа с самооценкой и внутренней безопасностью',
        'Изучение триггеров и паттернов реагирования',
        'Развитие навыков эмоциональной регуляции',
        'Исцеление травм покинутости'
      ],
      partnerSupport: [
        'Терпеливые, последовательные подтверждения',
        'Помощь в распознавании триггеров',
        'Избегание поведения, которое может провоцировать',
        'Поощрение работы над собой'
      ]
    };
  }

  // Здоровая защитная ревность
  if (hasHealthyJealousy && !hasOwnershipFear && personalMaturity >= 5) {
    return {
      type: 'healthy_protective',
      intensity: 'moderate',
      title: '💚 Здоровая защитная ревность',
      description: 'Ревность как естественный инстинкт защиты отношений. Контролируемая реакция с фокусом на коммуникацию.',
      patterns: [
        'Открытое обсуждение дискомфорта без обвинений',
        'Фокус на укреплении отношений, а не контроле',
        'Признание права партнера на автономию',
        'Использование ревности как сигнала для работы над парой'
      ],
      underlyingBeliefs: [
        'Ревность - естественное чувство, требующее понимания',
        'Отношения ценны и заслуживают защиты',
        'Доверие и общение решают большинство проблем',
        'Каждый имеет право на друзей и интересы'
      ],
      impacts: [
        'Углубление понимания друг друга',
        'Укрепление границ пары',
        'Развитие навыков коммуникации',
        'Баланс между близостью и свободой'
      ],
      transformationSteps: [
        'Продолжать развивать эмоциональную зрелость',
        'Изучать различие между интуицией и проекцией',
        'Работать над полным принятием партнера',
        'Развивать духовное понимание любви'
      ],
      partnerSupport: [
        'Ценить открытость в выражении чувств',
        'Участвовать в диалоге о границах и комфорте',
        'Быть внимательным к воздействию своих действий',
        'Совместно укреплять доверие и близость'
      ]
    };
  }

  // Мудрая неприкрепленность
  return {
    type: 'wise_nonattached',
    intensity: 'healthy',
    title: '🌟 Мудрая неприкрепленность',
    description: 'Глубокое понимание природы любви как свободы. Ревность трансформирована в сострадание и мудрость.',
    patterns: [
      'Радость за счастье и рост партнера',
      'Принятие неопределенности как части жизни',
      'Фокус на качестве связи, а не на обладании',
      'Использование вызовов как возможности для роста'
    ],
    underlyingBeliefs: [
      'Истинная любовь освобождает, а не порабощает',
      'Если отношения суждены, они выстоят любые испытания',
      'Каждый человек - свободная душа на своем пути',
      'Привязанность создает страдание, любовь - радость'
    ],
    impacts: [
      'Глубокое доверие и взаимное уважение',
      'Свобода для аутентичного самовыражения',
      'Трансформация отношений в духовную практику',
      'Служение росту друг друга и миру'
    ],
    transformationSteps: [
      'Углубление духовных практик и медитации',
      'Изучение философии безусловной любви',
      'Практика отпускания и принятия',
      'Служение другим как выражение любви'
    ],
    partnerSupport: [
      'Взаимное вдохновение в духовном росте',
      'Создание пространства для индивидуального развития',
      'Празднование свободы и аутентичности друг друга',
      'Совместное служение высшим ценностям'
    ]
  };
};

const JealousyDynamicsAnalysis: React.FC<JealousyDynamicsAnalysisProps> = ({
  jealousyAnswers,
  indicators,
  personalMaturity,
  relationshipMaturity
}) => {
  const dynamics = analyzeJealousyDynamics(jealousyAnswers, indicators, personalMaturity);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'destructive': return 'bg-red-50 border-red-200 text-red-800';
      case 'concerning': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'moderate': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'healthy': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'destructive': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'concerning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'moderate': return <Eye className="w-5 h-5 text-yellow-600" />;
      case 'healthy': return <Heart className="w-5 h-5 text-green-600" />;
      default: return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-baseline gap-3">
          {getIntensityIcon(dynamics.intensity)}
          <h3 className="text-lg font-semibold text-gray-900">
            Анализ динамики ревности
          </h3>
        </div>
        <Tooltip
          content="Исследует ваши паттерны ревности и их влияние на отношения. Помогает понять, является ли ваша ревность защитной или деструктивной, и найти пути к здоровой привязанности."
          title="Динамика ревности"
          trigger="click"
          position="left"
          maxWidth="max-w-sm"
        />
      </div>

      {/* Основной тип */}
      <div className={`rounded-lg border p-4 mb-6 ${getIntensityColor(dynamics.intensity)}`}>
        <h4 className="font-medium text-sm mb-2">{dynamics.title}</h4>
        <p className="text-sm leading-relaxed">{dynamics.description}</p>
      </div>

      {/* Критическое предупреждение */}
      {dynamics.intensity === 'destructive' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-baseline gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h4 className="font-medium text-red-800">Критическая ситуация</h4>
          </div>
          <p className="text-sm text-red-700 mb-3">
            Токсичная ревность может эскалировать в психологическое или физическое насилие. 
            Это серьезная проблема, требующая немедленного внимания.
          </p>
          <div className="p-3 bg-red-100 rounded border border-red-300">
            <p className="text-sm text-red-800 font-medium">
              Рекомендуется срочная работа с психологом, специализирующимся на семейных кризисах.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Поведенческие паттерны */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-baseline gap-2">
            <Eye className="w-4 h-4" />
            Паттерны поведения
          </h4>
          <ul className="space-y-2">
            {dynamics.patterns.map((pattern, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                {pattern}
              </li>
            ))}
          </ul>
        </div>

        {/* Подавления убеждения */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-baseline gap-2">
            <Heart className="w-4 h-4" />
            Глубинные убеждения
          </h4>
          <ul className="space-y-2">
            {dynamics.underlyingBeliefs.map((belief, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-blue-500 mt-1">→</span>
                {belief}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Влияние на отношения */}
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <h4 className="font-medium text-indigo-800 mb-3 flex items-baseline gap-2">
          <ArrowRight className="w-4 h-4" />
          Влияние на отношения
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {dynamics.impacts.map((impact, index) => (
            <div key={index} className="text-sm text-indigo-700 flex items-start gap-2">
              <span className={`mt-1 ${
                dynamics.intensity === 'healthy' ? 'text-green-500' : 'text-orange-500'
              }`}>
                {dynamics.intensity === 'healthy' ? '✓' : '⚠'}
              </span>
              {impact}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Шаги трансформации */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-baseline gap-2">
            <Lightbulb className="w-4 h-4" />
            Шаги трансформации
          </h4>
          <ul className="space-y-2">
            {dynamics.transformationSteps.map((step, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-500 mt-1 font-bold">{index + 1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Поддержка партнера */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-baseline gap-2">
            <Shield className="w-4 h-4" />
            Поддержка партнера
          </h4>
          <ul className="space-y-2">
            {dynamics.partnerSupport.map((support, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-purple-500 mt-1">💝</span>
                {support}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Эволюционная перспектива */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="font-medium text-purple-800 mb-2">
          🔄 Эволюционная перспектива
        </h4>
        <p className="text-sm text-purple-700">
          {dynamics.type === 'toxic_possessive' && 
            'Ревность может трансформироваться в здоровую защиту через работу с травмами и развитие самооценки.'}
          {dynamics.type === 'insecure_reactive' && 
            'Работа с неуверенностью может привести к здоровому выражению потребностей в безопасности.'}
          {dynamics.type === 'healthy_protective' && 
            'Здоровая ревность может эволюционировать в мудрую неприкрепленность через духовную практику.'}
          {dynamics.type === 'wise_nonattached' && 
            'Это высший уровень развития - любовь без обладания, свобода без отчуждения.'}
        </p>
      </div>

      {/* Специальная поддержка в зависимости от зрелости */}
      {relationshipMaturity > personalMaturity + 2 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-medium text-amber-800 mb-2">
            💡 Ресурс отношений
          </h4>
          <p className="text-sm text-amber-700">
            Высокая зрелость ваших отношений может стать мощным исцеляющим фактором. 
            Безопасность и принятие в отношениях могут помочь трансформировать ревность 
            в более здоровые формы любви и привязанности.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default JealousyDynamicsAnalysis; 