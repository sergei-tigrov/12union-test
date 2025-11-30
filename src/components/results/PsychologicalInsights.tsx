import React from 'react';
import { Brain } from 'lucide-react';
import { FaInfoCircle } from 'react-icons/fa';
import { ModernSection } from '../modern/ModernResultsLayout';
import type { TestResult } from '../../utils/calculateResult';

// Интерфейс для психологических инсайтов
interface Insight {
  title: string;
  description: string;
  details: string[];
  priority: number;
  icon?: React.ReactNode;
  source: 'attachment' | 'trauma' | 'gap' | 'trend' | 'zone' | 'recommendations';
}

interface PsychologicalInsightsProps {
  results: TestResult;
  className?: string;
}

// Функция для получения русского названия зоны развития с более теплыми и понятными формулировками
const getDominantZoneNameRus = (zone: string): string => {
  const zoneMap: Record<string, string> = {
    destructive: 'Поиска безопасности', // Менее патологизирующее название
    survival: 'Базовой устойчивости', // Более ресурсное название
    emotional: 'Эмоционального развития',
    psychological: 'Осознанного взаимодействия',
    spiritual: 'Глубинной связи',
    transcendent: 'Высшей гармонии', // Более понятно для обычного человека
    construction: 'Созидания отношений',
    mature: 'Зрелого партнёрства'
  };
  
  return zoneMap[zone] || 'Переходной';
};

// Функция для интерпретации разрыва между личностной и отношенческой зрелостью с практичными рекомендациями
const getGapInterpretation = (personalLevel: number, relationshipLevel: number): string => {
  const gap = Math.abs(personalLevel - relationshipLevel);
  const higher = personalLevel > relationshipLevel ? 'личностная' : 'отношенческая';
  
  if (gap > 4) {
    if (higher === 'личностная') {
      return `В вашей паре вы как личность существенно опережаете развитие ваших отношений. Вы можете чувствовать, что "тянете" отношения или что партнёр не соответствует вашим внутренним запросам. Важно находить способы делиться своим внутренним миром так, чтобы партнёр мог вас услышать.`;
    } else {
      return `Ваши отношения развиваются заметно быстрее, чем ваша внутренняя готовность к ним. Возможно, вы чувствуете, что вас "затягивают" в более глубокую связь, чем вы готовы принять. Постарайтесь честно говорить о своих границах и темпе.`;
    }
  } else if (gap > 2) {
    if (higher === 'личностная') {
      return `Ваше личностное развитие немного опережает состояние ваших отношений. У вас есть внутренний ресурс, чтобы вывести отношения на новый уровень. Делитесь своими инсайтами и практиками с партнёром, приглашая его к совместному росту.`;
    } else {
      return `Ваши отношения создают для вас пространство роста, предлагая чуть больше глубины, чем вы привыкли. Это прекрасная возможность для личностного развития - позвольте себе учиться через эту связь.`;
    }
  } else {
    return `Ваша личность и отношения развиваются в гармоничном темпе. Такой баланс создаёт устойчивую основу для дальнейшего роста и углубления связи. Продолжайте практики, которые питают обе стороны вашей жизни.`;
  }
};

// Интерпретации для разных трендов с практическими рекомендациями
const trendInterpretations: Record<string, Record<string, string>> = {
  growing: {
    high: 'Ваши отношения сейчас в фазе расцвета. Вы оба вкладываетесь в развитие связи и создаете что-то по-настоящему особенное. Чтобы поддержать этот рост, регулярно отмечайте ваши достижения как пары и благодарите друг друга за усилия.',
    medium: 'В ваших отношениях заметен постепенный подъем — то, что раньше давалось с трудом, сейчас становится естественным. Поддержите этот процесс, внедряя новые совместные практики и больше делясь своими мечтами.',
    low: 'В ваших отношениях видны первые ростки положительных изменений. Это хрупкий процесс, требующий бережного отношения. Отмечайте даже маленькие улучшения и осознанно выбирайте новые, более здоровые способы взаимодействия.'
  },
  stable: {
    high: 'Ваши отношения находятся в фазе устойчивой зрелости. Это ценный период, когда можно углубить вашу связь через новые совместные проекты или исследование более тонких аспектов близости. Избегайте рутины — вносите элемент новизны.',
    medium: 'Ваши отношения стабильны, но могут нуждаться в новых импульсах для развития. Попробуйте вместе выйти из зоны комфорта — новое хобби, путешествие или просто неординарное свидание могут вдохнуть свежесть в вашу связь.',
    low: 'Ваши отношения застряли на повторяющихся сценариях, которые не приносят радости, но стали привычными. Чтобы выйти из этого круга, попробуйте кардинально изменить хотя бы один аспект вашего взаимодействия — например, стиль общения или способ решения конфликтов.'
  },
  declining: {
    high: 'В ваших в целом благополучных отношениях появились тревожные сигналы. Не игнорируйте их — за видимым благополучием могут скрываться серьезные разногласия. Создайте безопасное пространство для обсуждения того, что вас беспокоит.',
    medium: 'Ваши отношения переживают период спада. Это не обязательно конец, а скорее приглашение к переосмыслению. Выделите время, чтобы честно поговорить о том, что перестало работать, и что каждый из вас хотел бы изменить.',
    low: 'Ваши отношения находятся в критической точке. Текущие способы взаимодействия приносят обоим больше боли, чем радости. Если вы хотите сохранить отношения, необходима помощь специалиста и готовность обоих к существенным изменениям.'
  }
};

// Функция для интерпретации тренда развития отношений
const getTrendInterpretation = (trend: 'growing' | 'stable' | 'declining', maturityLevel: number): string => {
  let qualityBracket: 'high' | 'medium' | 'low';
  
  if (maturityLevel >= 8) {
    qualityBracket = 'high';
  } else if (maturityLevel >= 5) {
    qualityBracket = 'medium';
  } else {
    qualityBracket = 'low';
  }
  
  return trendInterpretations[trend][qualityBracket];
};

// Функция для получения специализированных психологических инсайтов с фокусом на практической пользе
const getSpecializedInsights = (results: TestResult): Insight[] => {
  const insights: Insight[] = [];
  const personalLevel = results.personalLevel;
  const relationshipLevel = results.relationshipLevel;
  const dominantZone = results.profile?.dominantZone || 'construction';
  
  // Анализ разрыва между личностным и отношенческим уровнем с более глубоким пониманием
  const gap = Math.abs(personalLevel - relationshipLevel);
  if (gap > 2) {
    insights.push({
      title: 'Баланс вас и отношений',
      description: getGapInterpretation(personalLevel, relationshipLevel),
      details: [
        `Ваш внутренний мир: ${personalLevel.toFixed(1)}`,
        `Пространство отношений: ${relationshipLevel.toFixed(1)}`,
        `Разница: ${gap.toFixed(1)} — ${gap > 3 ? 'требует внимания' : 'в пределах нормы'}`
      ],
      priority: 80,
      source: 'gap'
    });
  }
  
  // Анализ тренда отношений с более практичными формулировками
  if (results.profile?.developmentVector) {
    // Преобразуем названия трендов в нужный формат
    const trendMap: Record<string, 'growing' | 'stable' | 'declining'> = {
      ascending: 'growing',
      balanced: 'stable',
      contradictory: 'declining'
    };
    
    const trend = trendMap[results.profile.developmentVector] || 'stable';
    
    // Более человечные названия для трендов
    const trendNames: Record<string, string> = {
      growing: 'Позитивное развитие',
      stable: 'Устойчивое состояние',
      declining: 'Период испытаний'
    };
    
    insights.push({
      title: 'Динамика ваших отношений',
      description: getTrendInterpretation(trend, relationshipLevel),
      details: [
        `Направление: ${trendNames[trend]}`,
        `Фаза: ${trend === 'growing' ? 'Период возможностей' : trend === 'stable' ? 'Время закрепления навыков' : 'Время для переосмысления'}`
      ],
      priority: 75,
      source: 'trend'
    });
  }
  
  // Добавляем основные рекомендации из интерпретации с более теплыми формулировками
  if (results.interpretation?.recommendations?.length) {
    insights.push({
      title: 'Что поможет именно вам',
      description: results.interpretation.keyInsight || 'Эти шаги особенно важны на вашем текущем этапе:',
      details: results.interpretation.recommendations.map((rec: string) => rec),
      priority: 85,
      icon: <FaInfoCircle />,
      source: 'recommendations'
    });
  }
  
  // Добавляем информацию о зоне развития с более полезным контекстом
  insights.push({
    title: 'Ваш текущий этап отношений',
    description: `Сейчас вы находитесь в зоне ${getDominantZoneNameRus(dominantZone)}. Это не приговор и не диагноз — это понимание текущего этапа вашего пути, с которого можно двигаться дальше.`,
    details: [
      `Ваш личностный ресурс: ${personalLevel.toFixed(1)} из 12`,
      `Качество отношений: ${relationshipLevel.toFixed(1)} из 12`,
      `Внутренняя согласованность: ${results.profile?.coherence ? results.profile.coherence.toFixed(0) : '?'}%`
    ],
    priority: 70,
    source: 'zone'
  });
  
  // Сортируем по приоритету и возвращаем только три наиболее важных
  return insights
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
};

// Компонент психологических инсайтов
const PsychologicalInsights: React.FC<PsychologicalInsightsProps> = ({ results, className = '' }) => {
  const insights = getSpecializedInsights(results);
  
  return (
    <div className={`psychological-insights ${className}`}>
      {insights.map((insight, index) => (
        <ModernSection
          key={`insight-${index}`}
          title={insight.title}
          icon={insight.icon || <Brain size={20} />}
        >
          <div className="insight-content">
            <p className="insight-description">{insight.description}</p>
            {insight.details && insight.details.length > 0 && (
              <ul className="insight-details">
                {insight.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        </ModernSection>
      ))}
    </div>
  );
};

export default PsychologicalInsights;
