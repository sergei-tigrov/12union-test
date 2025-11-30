import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Star, Zap, ArrowUp, Lightbulb, Target } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

interface RelationshipMotivationAnalysisProps {
  motivationAnswers: string[];
  indicators: string[];
  personalMaturity: number;
  relationshipMaturity: number;
}

interface MotivationAnalysis {
  primaryType: 'fear_based' | 'comfort_based' | 'love_based' | 'transcendent_service';
  evolutionLevel: number; // 1-12
  title: string;
  description: string;
  drivingForces: string[];
  relationshipPurpose: string;
  growthOpportunities: string[];
  shadowAspects: string[];
  nextEvolutionStep: string;
  partnerInvitation: string;
}

const analyzeRelationshipMotivation = (_answers: string[], indicators: string[], personalMaturity: number): MotivationAnalysis => {
  const hasFearBasedUnion = indicators.includes('fear_based_union') || indicators.includes('survival_motivation');
  const hasComfortSeeking = indicators.includes('comfort_seeking') || indicators.includes('practical_motivation');
  const hasLoveMotivation = indicators.includes('love_motivation') || indicators.includes('growth_together');

  const hasTraumaActivation = indicators.includes('childhood_trauma_activation');
  const hasTraumaIndicators = indicators.some(ind => ind.includes('trauma') || ind.includes('survival') || ind.includes('terror'));
  const hasComfortIndicators = indicators.some(ind => ind.includes('practical') || ind.includes('comfort') || ind.includes('social'));
  const hasLoveIndicators = indicators.some(ind => ind.includes('authentic') || ind.includes('conscious') || ind.includes('growth'));
  const hasTranscendentIndicators = indicators.some(ind => ind.includes('transcendent') || ind.includes('service') || ind.includes('unity'));

  // Трансцендентное служение (10-12 уровни) - проверяем СНАЧАЛА
  // ИСПРАВЛЕНО: Требуется И высокая зрелость, И трансцендентные индикаторы
  if (personalMaturity >= 9 && hasTranscendentIndicators) {
    return {
      primaryType: 'transcendent_service',
      evolutionLevel: Math.min(12, Math.max(10, personalMaturity)),
      title: '✨ Союз трансцендентного служения',
      description: 'Отношения как священное пространство для служения высшей цели. Пара становится каналом для любви, мудрости и исцеления мира.',
      drivingForces: [
        'Служение эволюции сознания человечества',
        'Воплощение божественной любви через отношения',
        'Совместное творчество для блага мира',
        'Трансформация отношений в духовную практику'
      ],
      relationshipPurpose: 'Служение как канал божественной любви и мудрости для исцеления мира',
      growthOpportunities: [
        'Углубление медитативных и духовных практик',
        'Развитие ясновидения и интуитивной мудрости',
        'Создание форм служения как пары',
        'Воплощение архетипов священного брака'
      ],
      shadowAspects: [
        'Духовная гордыня и чувство превосходства',
        'Отрыв от земных нужд и практичности',
        'Игнорирование человеческих потребностей ради "высших" целей',
        'Потеря заземленности и простой человеческой радости'
      ],
      nextEvolutionStep: 'Интеграция трансцендентного и человеческого в повседневной жизни',
      partnerInvitation: 'Воплощать божественную любовь в каждом моменте совместной жизни'
    };
  }

  // Мотивация любви и роста (7-9 уровни) 
  // ИСПРАВЛЕНО: Более строгие критерии для определения love_based
  if ((personalMaturity >= 7 && personalMaturity <= 9) || (personalMaturity >= 6 && (hasLoveMotivation || hasLoveIndicators))) {
    return {
      primaryType: 'love_based',
      evolutionLevel: Math.min(9, Math.max(7, personalMaturity)),
      title: '💝 Союз любви и взаимного роста',
      description: 'Отношения как пространство для глубокой близости, аутентичности и взаимного развития. Партнер ценится за его уникальную сущность и потенциал.',
      drivingForces: [
        'Глубокая любовь и принятие партнера таким, какой он есть',
        'Желание расти и развиваться вместе',
        'Стремление к аутентичности и эмоциональной близости',
        'Радость от служения росту и счастью партнера'
      ],
      relationshipPurpose: 'Взаимное исцеление, рост и раскрытие потенциала через любовь',
      growthOpportunities: [
        'Развитие безусловной любви и принятия',
        'Исследование духовных измерений отношений',
        'Трансформация эго через служение другому',
        'Создание пространства для творческого самовыражения'
      ],
      shadowAspects: [
        'Идеализация партнера и отношений',
        'Попытки "исправить" или изменить партнера',
        'Потеря границ в попытках слиться',
        'Эмоциональная зависимость от взаимности чувств'
      ],
      nextEvolutionStep: 'Развитие любви без привязанности и ожиданий',
      partnerInvitation: 'Стать зеркалом для душевного роста друг друга'
    };
  }

  // Мотивация комфорта и удобства (4-6 уровни)
  // ИСПРАВЛЕНО: Более строгие критерии для определения comfort_based
  if ((personalMaturity >= 4 && personalMaturity <= 6) || (personalMaturity >= 3 && (hasComfortSeeking || hasComfortIndicators))) {
    return {
      primaryType: 'comfort_based',
      evolutionLevel: Math.min(6, Math.max(4, personalMaturity)),
      title: '🏠 Союз комфорта и практичности',
      description: 'Отношения как источник стабильности, социального статуса и жизненного удобства. Фокус на внешних аспектах: финансы, статус, общественное признание.',
      drivingForces: [
        'Потребность в финансовой и социальной безопасности',
        'Желание соответствовать общественным ожиданиям',
        'Стремление к предсказуемости и контролю',
        'Практические выгоды совместной жизни'
      ],
      relationshipPurpose: 'Создание стабильной, предсказуемой и социально одобряемой жизни',
      growthOpportunities: [
        'Углубление эмоциональной близости за пределы комфорта',
        'Исследование собственных истинных желаний и страстей',
        'Развитие способности к уязвимости и аутентичности',
        'Принятие неопределенности как части роста'
      ],
      shadowAspects: [
        'Эмоциональное отчуждение и поверхностность',
        'Сопротивление изменениям и росту',
        'Использование партнера как средство для достижения целей',
        'Страх потерять контроль или стабильность'
      ],
      nextEvolutionStep: 'Открытие сердца и развитие эмоциональной близости',
      partnerInvitation: 'Вместе исследовать глубину чувств за пределами комфортной зоны'
    };
  }

  // Мотивация на основе страха (1-3 уровни)
  // ИСПРАВЛЕНО: Более строгие критерии для определения fear_based
  if ((personalMaturity <= 3) || (personalMaturity <= 5 && (hasFearBasedUnion || hasTraumaActivation || hasTraumaIndicators))) {
    return {
      primaryType: 'fear_based',
      evolutionLevel: Math.min(3, Math.max(1, personalMaturity)),
      title: '😰 Союз на основе страха выживания',
      description: 'Отношения как способ справиться с экзистенциальными страхами. Партнер рассматривается как спасение от одиночества, боли или неспособности справиться с жизнью самостоятельно.',
      drivingForces: [
        'Страх остаться одному и не справиться с жизнью',
        'Потребность в ком-то, кто "спасет" и позаботится',
        'Бегство от внутренней пустоты и боли',
        'Желание переложить ответственность за свою жизнь'
      ],
      relationshipPurpose: 'Выживание и избегание экзистенциального ужаса одиночества',
      growthOpportunities: [
        'Развитие самостоятельности и внутренней силы',
        'Исцеление глубинных травм и страхов',
        'Обучение самоуспокоению и эмоциональной регуляции',
        'Создание внутренней безопасности независимо от партнера'
      ],
      shadowAspects: [
        'Созависимость и потеря собственной идентичности',
        'Паническая реакция на угрозу разрыва',
        'Готовность терпеть абьюз ради сохранения отношений',
        'Неспособность к здоровым границам'
      ],
      nextEvolutionStep: 'Развитие самодостаточности через терапию и работу с травмами',
      partnerInvitation: 'Стать источником безопасности для исцеления, но не спасателем'
    };
  }



  // Fallback - если ничего не подошло, используем зону на основе уровня зрелости
  if (personalMaturity <= 3) {
    return {
      primaryType: 'fear_based',
      evolutionLevel: Math.max(1, personalMaturity),
      title: '😰 Союз на основе страха выживания',
      description: 'Отношения как способ справиться с экзистенциальными страхами.',
      drivingForces: ['Страх остаться одному'],
      relationshipPurpose: 'Выживание и избегание страхов',
      growthOpportunities: ['Развитие самостоятельности'],
      shadowAspects: ['Созависимость'],
      nextEvolutionStep: 'Развитие самодостаточности',
      partnerInvitation: 'Стать источником безопасности'
    };
  } else if (personalMaturity <= 6) {
    return {
      primaryType: 'comfort_based',
      evolutionLevel: Math.max(4, personalMaturity),
      title: '🏠 Союз комфорта и практичности',
      description: 'Отношения как источник стабильности и удобства.',
      drivingForces: ['Потребность в безопасности'],
      relationshipPurpose: 'Создание стабильной жизни',
      growthOpportunities: ['Углубление близости'],
      shadowAspects: ['Эмоциональное отчуждение'],
      nextEvolutionStep: 'Открытие сердца',
      partnerInvitation: 'Исследовать глубину чувств'
    };
  } else {
    return {
      primaryType: 'love_based',
      evolutionLevel: Math.max(7, personalMaturity),
      title: '💝 Союз любви и взаимного роста',
      description: 'Отношения как пространство для роста и близости.',
      drivingForces: ['Глубокая любовь к партнеру'],
      relationshipPurpose: 'Взаимный рост через любовь',
      growthOpportunities: ['Развитие безусловной любви'],
      shadowAspects: ['Идеализация партнера'],
      nextEvolutionStep: 'Любовь без ожиданий',
      partnerInvitation: 'Стать зеркалом для роста'
    };
  }
};

const RelationshipMotivationAnalysis: React.FC<RelationshipMotivationAnalysisProps> = ({
  motivationAnswers,
  indicators,
  personalMaturity,
  relationshipMaturity
}) => {
  const motivation = analyzeRelationshipMotivation(motivationAnswers, indicators, personalMaturity);

  const getMotivationColor = (type: string) => {
    switch (type) {
      case 'fear_based': return 'bg-red-50 border-red-200 text-red-800';
      case 'comfort_based': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'love_based': return 'bg-green-50 border-green-200 text-green-800';
      case 'transcendent_service': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getMotivationIcon = (type: string) => {
    switch (type) {
      case 'fear_based': return <Shield className="w-5 h-5 text-red-600" />;
      case 'comfort_based': return <Heart className="w-5 h-5 text-orange-600" />;
      case 'love_based': return <Heart className="w-5 h-5 text-green-600" />;
      case 'transcendent_service': return <Star className="w-5 h-5 text-purple-600" />;
      default: return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEvolutionPath = (currentLevel: number) => {
    const levels = [
      { range: '1-3', title: 'Выживание', color: 'bg-red-100' },
      { range: '4-6', title: 'Комфорт', color: 'bg-orange-100' },
      { range: '7-9', title: 'Любовь', color: 'bg-green-100' },
      { range: '10-12', title: 'Служение', color: 'bg-purple-100' }
    ];

    return levels.map((level, index) => {
      const isActive = currentLevel >= (index * 3 + 1) && currentLevel <= (index * 3 + 3);
      return (
        <div
          key={index}
          className={`p-2 rounded text-xs text-center ${
            isActive ? level.color + ' border-2 border-current' : 'bg-gray-100'
          }`}
        >
          <div className="font-medium">{level.range}</div>
          <div>{level.title}</div>
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {getMotivationIcon(motivation.primaryType)}
          <h3 className="text-lg font-semibold text-gray-900">
            Анализ мотивации отношений
          </h3>
        </div>
        <Tooltip
          content="Выявляет глубинные мотивы, которые движут вами в отношениях. Помогает понять, основаны ли ваши отношения на страхе, комфорте, любви или служении, и как развиваться дальше."
          title="Мотивация отношений"
          trigger="click"
          position="left"
          maxWidth="max-w-sm"
        />
      </div>

      {/* Основная мотивация */}
      <div className={`rounded-lg border p-4 mb-6 ${getMotivationColor(motivation.primaryType)}`}>
        <h4 className="font-medium text-sm mb-2">{motivation.title}</h4>
        <p className="text-sm leading-relaxed">{motivation.description}</p>
      </div>

      {/* Эволюционный уровень */}
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-indigo-800">Эволюционный уровень</h4>
          <span className="text-indigo-600 font-bold text-lg">{motivation.evolutionLevel}/12</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {getEvolutionPath(motivation.evolutionLevel)}
        </div>
      </div>

      {/* Цель отношений */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Цель отношений
        </h4>
        <p className="text-sm text-blue-700">{motivation.relationshipPurpose}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Движущие силы */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Движущие силы
          </h4>
          <ul className="space-y-2">
            {motivation.drivingForces.map((force, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-blue-500 mt-1">⚡</span>
                {force}
              </li>
            ))}
          </ul>
        </div>

        {/* Возможности роста */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            Возможности роста
          </h4>
          <ul className="space-y-2">
            {motivation.growthOpportunities.map((opportunity, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-500 mt-1">↗</span>
                {opportunity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Теневые аспекты */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Теневые аспекты для осознания
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {motivation.shadowAspects.map((shadow, index) => (
            <div key={index} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-gray-500 mt-1">⚠</span>
              {shadow}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Следующий шаг эволюции */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Следующий эволюционный шаг
          </h4>
          <p className="text-sm text-green-700">{motivation.nextEvolutionStep}</p>
        </div>

        {/* Приглашение партнеру */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Приглашение партнеру
          </h4>
          <p className="text-sm text-purple-700">{motivation.partnerInvitation}</p>
        </div>
      </div>

      {/* Особые рекомендации в зависимости от разницы в зрелости */}
      {Math.abs(personalMaturity - relationshipMaturity) > 2 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-medium text-amber-800 mb-2">
            🎭 Различие в мотивациях пары
          </h4>
          {personalMaturity > relationshipMaturity ? (
            <p className="text-sm text-amber-700">
              Ваша личная мотивация выше уровня отношений. Используйте свою зрелость 
              для терпеливого возвышения мотивации пары, не навязывая свой темп роста.
            </p>
          ) : (
            <p className="text-sm text-amber-700">
              Отношения тянут вас к более высоким мотивациям. Позвольте любви партнера 
              и безопасности отношений стать катализатором для вашего эволюционного роста.
            </p>
          )}
        </div>
      )}

      {/* Предупреждение для низких уровней */}
      {motivation.evolutionLevel <= 3 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">
            ⚠️ Важное предупреждение
          </h4>
          <p className="text-sm text-red-700">
            Мотивация на основе страха может привести к созависимости и токсичной динамике. 
            Рекомендуется индивидуальная терапия для развития самодостаточности 
            перед углублением отношений.
          </p>
        </div>
      )}

      {/* Вдохновение для высоких уровней */}
      {motivation.evolutionLevel >= 10 && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">
            ✨ Благословение высокой мотивации
          </h4>
          <p className="text-sm text-purple-700">
            Ваши отношения несут потенциал стать маяком любви и мудрости для других. 
            Помните о балансе между служением миру и заботой о простых человеческих 
            радостях в вашей паре.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default RelationshipMotivationAnalysis; 