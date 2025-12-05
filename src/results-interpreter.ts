/**
 * ИНТЕРПРЕТАЦИЯ РЕЗУЛЬТАТОВ
 * "Лестница союза" (2025 Refactoring)
 *
 * Генерирует понятные человеческие описания результатов тестирования
 * с учетом режима тестирования, валидации и психологических индикаторов.
 */

import {
  TestResult,
  ComparisonResult,
  TestMode,
  RelationshipStatus,
  UserAnswer,
  SmartQuestion
} from './types';
import { getLevelDefinition } from './levels-definitions';
import { getActionPlan } from './action-library';
import { QUESTIONS } from './questions-database';

// ============================================================================
// ТИПЫ
// ============================================================================

export interface ResultInterpretation {
  heroMessage: string;
  mainInsight: string;
  levelDescription: string;
  currentChallenge: string;
  growthPath: string;
  recommendations: string[];
  validationNotes?: string;
  nextLevel?: string;
  indicatorAnalysis?: string; // НОВОЕ: Анализ на основе индикаторов
}

export interface PairComparisonInterpretation {
  personAInterpretation: ResultInterpretation;
  personBInterpretation: ResultInterpretation;
  gapMessage: string;
  agreementPoints: string[];
  conflictPoints: string[];
  growthRecommendations: string[];
  compatibilityScore: number;
  compatibilityMessage: string;
}

// ============================================================================
// ОСНОВНАЯ ИНТЕРПРЕТАЦИЯ
// ============================================================================

export function interpretResult(result: TestResult): ResultInterpretation {
  const roundedLevel = Math.round(result.personalLevel);
  const levelDef = getLevelDefinition(roundedLevel);

  if (!levelDef) {
    throw new Error(`Level definition not found for level ${roundedLevel}`);
  }

  const heroMessage = generateHeroMessage(roundedLevel, result.testMode, result.relationshipStatus);
  const mainInsight = generateMainInsight(roundedLevel, levelDef.shortDescription);
  const currentChallenge = generateChallenge(roundedLevel);
  const growthPath = generateGrowthPath(roundedLevel);

  const nextLevelDef = roundedLevel < 12 ? getLevelDefinition(roundedLevel + 1) : null;
  const nextLevel = nextLevelDef ? generateNextLevelPreview(nextLevelDef) : undefined;

  const actionPlan = getActionPlan(roundedLevel);
  const recommendations = actionPlan.topActions.map((a) => a.title);

  // Validation Notes
  let validationNotes: string | undefined;
  if (result.validation.reliability === 'low') {
    validationNotes = 'Внимание: результаты теста имеют низкую надежность. Возможно, вы отвечали социально желательным образом или есть внутренние противоречия.';
  } else if (result.validation.reliability === 'medium') {
    validationNotes = 'Результаты могут быть частично искажены. Обратите внимание на предупреждения системы валидации.';
  }

  // Indicator Analysis
  const indicatorAnalysis = analyzeIndicators(result.answers);

  return {
    heroMessage,
    mainInsight,
    levelDescription: levelDef.fullDescription,
    currentChallenge,
    growthPath,
    recommendations,
    validationNotes,
    nextLevel,
    indicatorAnalysis,
  };
}

// ============================================================================
// АНАЛИЗ ИНДИКАТОРОВ
// ============================================================================

function analyzeIndicators(answers: UserAnswer[]): string {
  const indicatorsCount = new Map<string, number>();
  const questionMap = new Map<string, SmartQuestion>();
  QUESTIONS.forEach(q => questionMap.set(q.id, q));

  answers.forEach(a => {
    const q = questionMap.get(a.questionId);
    if (q) {
      const opt = q.options.find(o => o.id === a.selectedOptionId);
      if (opt && opt.indicators) {
        opt.indicators.forEach(ind => {
          indicatorsCount.set(ind, (indicatorsCount.get(ind) || 0) + 1);
        });
      }
    }
  });

  // Sort indicators by frequency
  const sortedIndicators = Array.from(indicatorsCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  const topIndicators = sortedIndicators.slice(0, 5); // Берем топ-5 для анализа

  if (topIndicators.length === 0) return '';

  // Generate message based on top indicators
  const messages: string[] = [];
  const addedTopics = new Set<string>();

  // Helper to add unique messages
  const addMsg = (topic: string, msg: string) => {
    if (!addedTopics.has(topic)) {
      messages.push(msg);
      addedTopics.add(topic);
    }
  };

  // 1. СТРАХ И БЕЗОПАСНОСТЬ
  if (topIndicators.some(i => ['fear', 'anxiety', 'abandonment-terror', 'survival-fear'].some(k => i.includes(k)))) {
    addMsg('fear', 'В ваших ответах прослеживается тема тревоги и потребности в безопасности. Возможно, вам трудно расслабиться и довериться процессу.');
  }

  // 2. КОНТРОЛЬ И ВЛАСТЬ
  if (topIndicators.some(i => ['control', 'power-struggle', 'jealousy'].some(k => i.includes(k)))) {
    addMsg('control', 'Заметна тема контроля. Это часто бывает защитной реакцией на страх уязвимости.');
  }

  // 3. ИДЕАЛИЗАЦИЯ И БАЙПАС
  if (topIndicators.some(i => ['spiritual-bypass', 'idealization', 'fantasy', 'illusion'].some(k => i.includes(k)))) {
    addMsg('idealization', 'Есть склонность к идеализации или уходу в духовные концепции, чтобы избежать боли реальности.');
  }

  // 4. РОСТ И ТРАНСФОРМАЦИЯ
  if (topIndicators.some(i => ['growth', 'transformation', 'learning', 'conscious-work'].some(k => i.includes(k)))) {
    addMsg('growth', 'Вы ориентированы на рост и развитие. Кризисы для вас — это точки роста, а не тупики.');
  }

  // 5. СЛУЖЕНИЕ И МИССИЯ
  if (topIndicators.some(i => ['service', 'mission', 'transcendence', 'unity'].some(k => i.includes(k)))) {
    addMsg('service', 'Тема служения и высшего смысла является для вас ведущей мотивацией в отношениях.');
  }

  // 6. АВТОНОМИЯ И СВОБОДА
  if (topIndicators.some(i => ['autonomy', 'freedom', 'independence', 'boundaries'].some(k => i.includes(k)))) {
    addMsg('freedom', 'Вы высоко цените свободу и автономию. Важно следить, чтобы независимость не переросла в изоляцию.');
  }

  // 7. СЛИЯНИЕ И ЗАВИСИМОСТЬ
  if (topIndicators.some(i => ['enmeshment', 'dependence', 'fusion'].some(k => i.includes(k)))) {
    addMsg('fusion', 'Есть признаки склонности к слиянию с партнером. Важно укреплять свои личные границы.');
  }

  // 8. ОБРАЗ И СТАТУС
  if (topIndicators.some(i => ['image-focus', 'status', 'external-validation'].some(k => i.includes(k)))) {
    addMsg('image', 'Для вас важно, как отношения выглядят со стороны. Попробуйте сместить фокус на внутренние ощущения.');
  }

  // 9. ГАРМОНИЯ И КОМФОРТ
  if (topIndicators.some(i => ['harmony', 'comfort', 'stability', 'peace'].some(k => i.includes(k)))) {
    addMsg('harmony', 'Вы стремитесь к гармонии и покою. Это прекрасный ресурс, если он не ведет к избеганию важных конфликтов.');
  }

  if (messages.length > 0) {
    return messages.join(' ');
  }

  // Fallback если ничего специфического не найдено, но индикаторы есть
  return 'Ваш профиль показывает уникальное сочетание черт. Рекомендуем обратить внимание на детальный разбор по уровням.';
}

// ============================================================================
// ГЕНЕРАТОРЫ СООБЩЕНИЙ (Legacy + Updated)
// ============================================================================

function generateHeroMessage(level: number, mode: TestMode, status: RelationshipStatus): string {
  const levelInt = Math.round(level);
  const levelName = getLevelDefinition(levelInt)?.name || '';

  if (mode === 'self' && status === 'single_past') return `Ваш уровень в прошлых отношениях: ${levelInt} - ${levelName}.`;
  if (mode === 'self' && status === 'single_potential') return `Ваш потенциал развития: уровень ${levelInt} - ${levelName}.`;
  if (mode === 'self' && status === 'in_relationship') return `Ваш текущий уровень отношений: ${levelInt} - ${levelName}.`;
  if (mode === 'partner_assessment') return `Вы видите партнера на уровне ${levelInt} - ${levelName}.`;
  if (mode === 'pair_discussion') return `Ваш совместный уровень пары: ${levelInt} - ${levelName}.`;

  return `Ваш уровень: ${levelInt} - ${levelName}`;
}

function generateMainInsight(level: number, shortDescription: string): string {
  const levelInt = Math.round(level);

  const insights: Record<number, string> = {
    1: 'Сейчас главное — выживание и безопасность. Это не ваша вина, это состояние травмы, требующее исцеления.',
    2: 'Вы находитесь в круговороте повторяющихся сценариев. Осознание этого — первый шаг к свободе.',
    3: 'Страх одиночества или экономическая зависимость держат вас. Ваша сила — в обретении автономности.',
    4: 'Отношения стабильны, но функциональны. Не хватает глубины и живых чувств.',
    5: 'Много страсти, но мало покоя. Эмоциональные качели истощают. Путь к зрелости лежит через спокойствие.',
    6: 'Внешне все идеально, но внутри может быть пустота. Пора снять маски и рискнуть быть собой.',
    7: 'Первый уровень истинной зрелости. Вы научились договариваться и уважать границы.',
    8: 'Уровень глубокого принятия. Вы любите партнера таким, какой он есть, без попыток переделать.',
    9: 'Свобода и близость. Вы вместе не потому что "надо", а потому что выбираете друг друга каждый день.',
    10: 'Синергия. Вместе вы создаете то, что невозможно создать в одиночку.',
    11: 'Творчество жизни. Ваши отношения становятся искусством и вдохновением для других.',
    12: 'Служение. Ваша любовь стала настолько большой, что она исцеляет мир вокруг.'
  };

  return insights[levelInt] || shortDescription;
}

function generateChallenge(level: number): string {
  const levelInt = Math.round(level);
  const challenges: Record<number, string> = {
    1: 'Выйти из зоны насилия или угрозы. Найти безопасное пространство.',
    2: 'Увидеть свои кармические грабли и перестать на них наступать.',
    3: 'Взять ответственность за свою жизнь и финансы на себя.',
    4: 'Рискнуть открыться эмоционально, даже если это страшно.',
    5: 'Научиться контейнировать свои эмоции, не выплескивая их разрушительно.',
    6: 'Показать свою уязвимость и несовершенство партнеру.',
    7: 'Углублять эмпатию и учиться слышать не только слова, но и чувства.',
    8: 'Отказаться от ожиданий и претензий. Любить "просто так".',
    9: 'Сохранять свою целостность, не растворяясь в партнере.',
    10: 'Найти общую миссию, которая больше, чем просто "быть вместе".',
    11: 'Быть со-творцами своей реальности, осознанно управляя энергией пары.',
    12: 'Быть прозрачным проводником Любви, без эго.'
  };
  return challenges[levelInt] || 'Продолжать развитие осознанности.';
}

function generateGrowthPath(level: number): string {
  const levelInt = Math.round(level);
  if (levelInt <= 3) return 'Терапия травмы, работа с психологом, восстановление базовой безопасности.';
  if (levelInt <= 6) return 'Работа с эмоциональным интеллектом, честность с собой, снятие социальных масок.';
  if (levelInt <= 9) return 'Практики осознанности, глубокое общение, работа над принятием.';
  return 'Духовные практики, совместное творчество, служение миру.';
}

function generateNextLevelPreview(nextLevelDef: any): string {
  return `Следующая ступень — ${nextLevelDef.name}: ${nextLevelDef.shortDescription}`;
}

// ============================================================================
// СРАВНЕНИЕ ДЛЯ ПАР (Simplified for brevity, logic remains similar)
// ============================================================================

export function interpretPairComparison(result: ComparisonResult): PairComparisonInterpretation {
  const mainInterpretation = interpretResult(result);
  const partnerInterpretation = result.comparisonWith ? interpretResult(result.comparisonWith) : mainInterpretation;

  const gap = result.gap || 0;
  const compatibilityScore = result.compatibility || 50;

  return {
    personAInterpretation: mainInterpretation,
    personBInterpretation: partnerInterpretation,
    gapMessage: getGapMessage(gap),
    agreementPoints: ['Общие ценности (если есть)', 'Стремление к развитию'],
    conflictPoints: gap > 2 ? ['Разница в мировоззрении', 'Разные потребности в близости'] : [],
    growthRecommendations: ['Практикуйте диалог', 'Уважайте различия'],
    compatibilityScore,
    compatibilityMessage: compatibilityScore > 70 ? 'Высокая совместимость' : 'Требуется работа над отношениями',
  };
}

function getGapMessage(gap: number): string {
  if (gap < 1) return 'Вы на одной волне.';
  if (gap < 3) return 'Есть различия, но они могут обогащать.';
  return 'Существенная разница в уровнях развития. Нужен мост понимания.';
}
