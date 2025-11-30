/**
 * ИНТЕРПРЕТАЦИЯ РЕЗУЛЬТАТОВ
 * "Лестница союза"
 *
 * Генерирует понятные человеческие описания результатов тестирования
 * с учетом режима тестирования и валидации
 */

import {
  TestResult,
  ComparisonResult,
  TestMode,
  RelationshipStatus,
  UnionLevel,
} from './types';
import { getLevelDefinition } from './levels-definitions';
import { getActionPlan } from './action-library';

// ============================================================================
// ТИПЫ
// ============================================================================

export interface ResultInterpretation {
  heroMessage: string; // Короткое 1-2 предложение для героя
  mainInsight: string; // Главный инсайт (2-3 предложения)
  levelDescription: string; // Полное описание уровня
  currentChallenge: string; // Главный вызов на этом уровне
  growthPath: string; // Как двигаться дальше
  recommendations: string[];
  validationNotes?: string; // Если есть проблемы с валидацией
  nextLevel?: string; // Что ждет на следующем уровне
}

export interface PairComparisonInterpretation {
  personAInterpretation: ResultInterpretation;
  personBInterpretation: ResultInterpretation;
  gapMessage: string; // Как рассказать о разнице
  agreementPoints: string[]; // Где они согласны
  conflictPoints: string[]; // Где они не согласны
  growthRecommendations: string[]; // Рекомендации для пары
  compatibilityScore: number; // 0-100
  compatibilityMessage: string;
}

// ============================================================================
// ОСНОВНАЯ ИНТЕРПРЕТАЦИЯ
// ============================================================================

/**
 * Интерпретировать результаты тестирования
 */
export function interpretResult(
  result: TestResult
): ResultInterpretation {
  const roundedLevel = Math.round(result.personalLevel);
  const levelDef = getLevelDefinition(roundedLevel);
  if (!levelDef) {
    throw new Error(
      `Level definition not found for level ${roundedLevel}`
    );
  }

  // Генерировать сообщения
  const heroMessage = generateHeroMessage(
    roundedLevel,
    result.testMode,
    result.relationshipStatus
  );

  const mainInsight = generateMainInsight(
    roundedLevel,
    levelDef.shortDescription
  );

  const currentChallenge = generateChallenge(
    roundedLevel
  );

  const growthPath = generateGrowthPath(
    roundedLevel
  );

  const nextLevelDef =
    roundedLevel < 12 ? getLevelDefinition(roundedLevel + 1) : null;
  const nextLevel = nextLevelDef ? generateNextLevelPreview(nextLevelDef) : undefined;

  // Генерировать рекомендации
  const actionPlan = getActionPlan(roundedLevel);
  const recommendations = actionPlan.topActions.map((a) => a.title);

  // Добавить валидационные замечания если нужны
  let validationNotes: string | undefined;
  if (result.validation.reliability === 'low') {
    validationNotes =
      'Внимание: результаты теста имеют низкую надежность из-за обнаруженных проблем. Рекомендуется пересдать тест позже, когда сможете быть более честны и вдумчивы.';
  } else if (result.validation.reliability === 'medium') {
    validationNotes =
      'Результаты могут быть частично искажены. Учитывайте рекомендации валидации при интерпретации.';
  }

  return {
    heroMessage,
    mainInsight,
    levelDescription: levelDef.fullDescription,
    currentChallenge,
    growthPath,
    recommendations,
    validationNotes,
    nextLevel,
  };
}

// ============================================================================
// ГЕНЕРАТОРЫ СООБЩЕНИЙ
// ============================================================================

/**
 * Генерировать героическое сообщение (30 сек чтения)
 */
function generateHeroMessage(
  level: number,
  mode: TestMode,
  status: RelationshipStatus
): string {
  const levelInt = Math.round(level);

  // Специфичные для режима
  if (mode === 'self' && status === 'single_past') {
    return `По результатам вашего анализа, вы находитесь на уровне ${levelInt} - ${getLevelDefinition(levelInt as UnionLevel)?.name}. Это уровень где вы в отношениях прошлого.`;
  }

  if (mode === 'self' && status === 'single_potential') {
    return `По вашей оценке потенциала, вы можете развиться до уровня ${levelInt}. Это то куда вы хотите прийти в будущих отношениях.`;
  }

  if (mode === 'self' && status === 'in_relationship') {
    return `В ваших текущих отношениях вы развили уровень ${levelInt} - ${getLevelDefinition(levelInt as UnionLevel)?.name}. Это ваша нынешняя реальность.`;
  }

  if (mode === 'partner_assessment') {
    return `По вашей оценке, ваш партнер находится на уровне ${levelInt} - ${getLevelDefinition(levelInt as UnionLevel)?.name}. Это то как вы его/её видите.`;
  }

  if (mode === 'potential' && status === 'single_potential') {
    return `Ваш потенциал развития - уровень ${levelInt}. Это достижимо при наличии подходящих условий и осознанной работы.`;
  }

  if (mode === 'pair_discussion') {
    return `Вместе вы создали союз уровня ${levelInt} - ${getLevelDefinition(levelInt as UnionLevel)?.name}. Это уровень вашей совместной зрелости.`;
  }

  return `Ваш уровень - ${levelInt}: ${getLevelDefinition(levelInt as UnionLevel)?.name}`;
}

/**
 * Генерировать главный инсайт
 */
function generateMainInsight(
  level: number,
  shortDescription: string
): string {
  const levelInt = Math.round(level);

  if (levelInt <= 3) {
    return `${shortDescription} На этом уровне основной фокус на выживание, стабильность и безопасность. Это не лень, это реальность вашего состояния.`;
  }

  if (levelInt === 4) {
    return `${shortDescription} Это уровень где отношения функционируют хорошо, но эмоциональная связь еще развивается. Вы готовы к следующему шагу.`;
  }

  if (levelInt === 5) {
    return `${shortDescription} На этом уровне много чувств, интенсивности, но часто отсутствует стабильность. Задача - научиться управлять эмоциями без их подавления.`;
  }

  if (levelInt === 6) {
    return `${shortDescription} Это уровень где имидж часто важнее реальности. Задача - найти аутентичность под ролью.`;
  }

  if (levelInt === 7) {
    return `${shortDescription} Поздравляем - вы достигли первого уровня психологической зрелости. На этом уровне есть реальное взаимопонимание и безопасность.`;
  }

  if (levelInt === 8) {
    return `${shortDescription} Это уровень безусловной любви и принятия. Вы способны любить партнера не для себя, а для его блага.`;
  }

  if (levelInt === 9) {
    return `${shortDescription} На этом уровне два полностью независимых человека выбирают друг друга ежедневно. Это редкая зрелость.`;
  }

  if (levelInt >= 10) {
    return `${shortDescription} Это редкий уровень где отношения становятся творческой силой. Вместе вы создаете значимое для мира.`;
  }

  return shortDescription;
}

/**
 * Генерировать описание текущего вызова
 */
function generateChallenge(
  level: number
): string {
  const levelInt = Math.round(level);

  const challenges: Record<number, string> = {
    1: 'Главный вызов - найти безопасность и выход из токсичной ситуации. Профессиональная помощь критична.',
    2: 'Главный вызов - осознать бессознательные паттерны и начать делать сознательные выборы.',
    3: 'Главный вызов - развить экономическую и эмоциональную независимость, чтобы отношения были выбором а не необходимостью.',
    4: 'Главный вызов - перейти от практической функции отношений к эмоциональной связи и аутентичности.',
    5: 'Главный вызов - управлять эмоциональной интенсивностью и развить способность к саморегуляции.',
    6: 'Главный вызов - найти аутентичность и перестать жить в соответствии с ожиданиями других.',
    7: 'Главный вызов - углубить психологическую близость и продолжать развиваться как пара.',
    8: 'Главный вызов - практиковать безусловное принятие и служение без ожидания взамен.',
    9: 'Главный вызов - сохранять полную автономию при глубокой связи, выбирая друг друга ежедневно.',
    10: 'Главный вызов - каналировать энергию отношений в служение миру и создание значимого.',
    11: 'Главный вызов - воплотить творческий потенциал отношений и помогать другим парам.',
    12: 'Главный вызов - жить как инструмент Божественной любви и исцелять других своим примером.',
  };

  return challenges[levelInt] || challenges[6];
}

/**
 * Генерировать путь развития
 */
function generateGrowthPath(
  level: number
): string {
  const levelInt = Math.round(level);

  if (levelInt <= 3) {
    return 'Путь развития: сначала необходима безопасность и стабильность. Затем - развитие саморефлексии и осознанности. Профессиональная помощь сильно ускорит процесс.';
  }

  if (levelInt === 4) {
    return 'Путь развития: начните говорить о чувствах. Создавайте время для эмоциональной близости. Слушайте партнера без попыток решить его проблемы.';
  }

  if (levelInt === 5) {
    return 'Путь развития: развивайте способность к саморегуляции эмоций. Медитация, йога, терапия помогут. Разделите ревность от любви.';
  }

  if (levelInt === 6) {
    return 'Путь развития: практикуйте уязвимость. Делитесь тем что вас стыдит. Осознайте что аутентичность притягивает людей больше чем имидж.';
  }

  if (levelInt === 7) {
    return 'Путь развития: углубляйте практику глубокого слушания. Используйте конфликты как возможность лучше понять друг друга. Наслаждайтесь достигнутой зрелостью.';
  }

  if (levelInt === 8) {
    return 'Путь развития: развивайте практику служения. Делайте что-то для партнера не ожидая благодарности. Расширяйте границы любви на других людей.';
  }

  if (levelInt === 9) {
    return 'Путь развития: сохраняйте собственные проекты и интересы. Практикуйте ежедневный выбор партнера. Вдохновляйте друг друга на развитие.';
  }

  if (levelInt >= 10) {
    return 'Путь развития: создавайте совместные проекты которые служат миру. Помогайте другим парам. Используйте вашу любовь как исцеляющую силу.';
  }

  return 'Путь развития: продолжайте осознанную работу над отношениями.';
}

/**
 * Генерировать превью следующего уровня
 */
function generateNextLevelPreview(
  nextLevelDef: Awaited<ReturnType<typeof getLevelDefinition>>
): string {
  if (!nextLevelDef) return '';
  return `Следующий уровень - ${nextLevelDef.name}: ${nextLevelDef.shortDescription}`;
}

// ============================================================================
// СРАВНЕНИЕ ДЛЯ ПАР
// ============================================================================

/**
 * Интерпретировать результаты сравнения для пары
 */
export function interpretPairComparison(
  result: ComparisonResult
): PairComparisonInterpretation {
  // Интерпретировать основной результат
  const mainInterpretation = interpretResult(result);

  // Интерпретировать результат партнера
  let partnerInterpretation: ResultInterpretation = {
    heroMessage: '',
    mainInsight: '',
    levelDescription: '',
    currentChallenge: '',
    growthPath: '',
    recommendations: [],
  };

  if (result.comparisonWith) {
    partnerInterpretation = interpretResult(result.comparisonWith);
  }

  // Рассчитать сообщение о разнице
  const gap = result.gap || 0;
  const gapMessage = generateGapMessage(gap);

  // Найти точки согласия и конфликта
  const agreementPoints = findAgreementPoints(
    result.personalLevel,
    result.comparisonWith?.personalLevel || 0
  );
  const conflictPoints = findConflictPoints(
    result.personalLevel,
    result.comparisonWith?.personalLevel || 0
  );

  // Генерировать рекомендации для пары
  const growthRecommendations = generatePairRecommendations(
    result.personalLevel,
    result.comparisonWith?.personalLevel || 0,
    gap
  );

  // Рассчитать совместимость
  const compatibilityScore = result.compatibility || calculateCompatibility(
    result.personalLevel,
    result.comparisonWith?.personalLevel || 0
  );
  const compatibilityMessage = generateCompatibilityMessage(compatibilityScore);

  return {
    personAInterpretation: mainInterpretation,
    personBInterpretation: partnerInterpretation,
    gapMessage,
    agreementPoints,
    conflictPoints,
    growthRecommendations,
    compatibilityScore,
    compatibilityMessage,
  };
}

/**
 * Генерировать сообщение о разнице уровней
 */
function generateGapMessage(
  gap: number
): string {
  if (Math.abs(gap) < 0.5) {
    return 'Вы находитесь практически на одном уровне развития - это хороший знак для пары.';
  }

  if (gap > 0 && gap < 1.5) {
    return 'Небольшая разница в уровнях - это создает естественную динамику где один немного тянет другого вверх.';
  }

  if (gap > 1.5 && gap < 3) {
    return 'Заметная разница в уровнях - это может создать трение но также возможность для обоих учиться друг у друга.';
  }

  if (gap >= 3) {
    return 'Значительная разница в уровнях - это требует сознательной работы обеих сторон. Партнер с более высоким уровнем может потянуть вверх, но нужна готовность к изменениям.';
  }

  return 'Различия в уровнях - это возможность для роста обоих.';
}

/**
 * Найти точки согласия
 */
function findAgreementPoints(
  level1: number,
  level2: number
): string[] {
  const agreements: string[] = [];

  const l1 = Math.round(level1);
  const l2 = Math.round(level2);

  if (l1 >= 7 && l2 >= 7) {
    agreements.push('Оба находитесь на психологически зрелом уровне');
  }

  if ((l1 >= 8 && l2 >= 8) || (l1 >= 4 && l2 >= 4)) {
    agreements.push('Можете обсуждать финансовые вопросы рационально');
  }

  if ((l1 >= 7 && l2 >= 7)) {
    agreements.push('Есть способность к глубокому пониманию');
  }

  if (Math.abs(l1 - l2) < 1) {
    agreements.push('Близость в уровне развития помогает синхронизации');
  }

  return agreements.length > 0
    ? agreements
    : ['Есть основание для работы и развития вместе'];
}

/**
 * Найти точки потенциального конфликта
 */
function findConflictPoints(
  level1: number,
  level2: number
): string[] {
  const conflicts: string[] = [];
  const gap = Math.abs(level1 - level2);

  const l1 = Math.round(level1);
  const l2 = Math.round(level2);

  if (l1 <= 2 || l2 <= 2) {
    conflicts.push('Один из вас может быть в состоянии травмы что затрудняет близость');
  }

  if ((l1 <= 3 && l2 >= 8) || (l1 >= 8 && l2 <= 3)) {
    conflicts.push('Огромная разница в уровнях - одна сторона может ждать зрелости которой нет');
  }

  if ((l1 === 5 || l2 === 5) && Math.abs(l1 - l2) > 2) {
    conflicts.push('Эмоциональная интенсивность на уровне 5 может быть сложна для партнера на другом уровне');
  }

  if ((l1 === 6 || l2 === 6) && Math.abs(l1 - l2) > 1) {
    conflicts.push('Различие в том как важен имидж - может быть невидимый конфликт');
  }

  if (gap >= 3) {
    conflicts.push('Значительная разница может требовать сознательного моста между вами');
  }

  return conflicts.length > 0
    ? conflicts
    : ['Основные точки потенциального конфликта отсутствуют'];
}

/**
 * Генерировать рекомендации для пары
 */
function generatePairRecommendations(
  level1: number,
  level2: number,
  gap: number
): string[] {
  const recommendations: string[] = [];

  if (Math.abs(gap) >= 2) {
    recommendations.push(
      'Работайте с парным терапевтом или коучем для моста между уровнями'
    );
  }

  if (Math.round(level1) <= 3 || Math.round(level2) <= 3) {
    recommendations.push('Сосредоточьтесь на безопасности и стабильности в отношениях');
  }

  if (Math.round(level1) <= 5 || Math.round(level2) <= 5) {
    recommendations.push('Развивайте регуляцию эмоций и практику глубокого слушания');
  }

  if (Math.round(level1) >= 7 && Math.round(level2) >= 7) {
    recommendations.push('Сосредоточьтесь на создании совместного проекта который служит миру');
  }

  recommendations.push('Практикуйте еженедельный "emotional check-in" где вы говорите о чувствах');

  return recommendations;
}

/**
 * Рассчитать совместимость
 */
function calculateCompatibility(
  level1: number,
  level2: number
): number {
  const gap = Math.abs(level1 - level2);
  let score = 100;

  // Штраф за расстояние
  score -= gap * 10;

  // Бонус если оба на одинаковом высоком уровне
  if (level1 >= 8 && level2 >= 8) {
    score = Math.min(100, score + 15);
  }

  // Штраф если оба на низком уровне
  if (level1 <= 2 && level2 <= 2) {
    score = Math.max(0, score - 20);
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Генерировать сообщение о совместимости
 */
function generateCompatibilityMessage(score: number): string {
  if (score >= 80) {
    return 'Высокая совместимость - у вас хороший фундамент для развития';
  } else if (score >= 60) {
    return 'Средняя совместимость - требуется сознательная работа но развитие возможно';
  } else if (score >= 40) {
    return 'Низкая совместимость - требуется серьезная работа или переоценка отношений';
  } else {
    return 'Очень низкая совместимость - без кардинальных изменений у обоих проблемы вероятны';
  }
}

