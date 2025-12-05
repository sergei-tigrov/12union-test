/**
 * РАСЧЕТ ОЦЕНОК
 * "Лестница союза"
 *
 * Преобразование ответов тестирования в оценки личного уровня и уровня отношений
 * с применением валидационных коррекций
 */

import {
  UserAnswer,
  LevelScore,
  UnionLevel,
  ValidationMetrics,
  TestResult,
  TestScenario,
} from './types';
import { QUESTIONS } from './questions-database';

// ============================================================================
// КОНСТАНТЫ
// ============================================================================

// Вес для каждого типа вопроса
const QUESTION_WEIGHT: Record<string, number> = {
  'zone-conflict-001': 2.0, // Зонирование - высокий вес
  'zone-safety-002': 2.0,
  'zone-growth-003': 1.8,
  'zone-intimacy-004': 2.0,
  'zone-choice-005': 2.0,
  'zone-difference-006': 1.8,
};

// ============================================================================
// ОСНОВНЫЕ ФУНКЦИИ РАСЧЕТА
// ============================================================================

/**
 * Рассчитать оценки уровней на основе ответов
 */
/**
 * Рассчитать оценки уровней на основе ответов
 */
export function calculateLevelScores(
  answers: UserAnswer[]
): {
  personalLevel: number;
  relationshipLevel: number;
  levelScores: LevelScore[];
  levelDistribution: any[]; // DetailedLevelScore[]
} {
  // Инициализировать счетчики для каждого уровня
  const levelCounts = new Map<UnionLevel, {
    sum: number;
    weight: number;
    count: number;
    personalSum: number;
    personalWeight: number;
    relationshipSum: number;
    relationshipWeight: number;
  }>();

  for (let level: UnionLevel = 1; level <= 12; level++) {
    levelCounts.set(level, {
      sum: 0, weight: 0, count: 0,
      personalSum: 0, personalWeight: 0,
      relationshipSum: 0, relationshipWeight: 0
    });
  }

  // Категории вопросов
  const personalCategories = ['values', 'growth', 'freedom', 'creation', 'transcendence', 'emotions', 'trauma', 'patterns'];
  // Все остальные считаем relationship (conflict, intimacy, boundaries, acceptance, communication, validation)

  // Обработать каждый ответ
  answers.forEach((answer) => {
    const question = QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) return;

    // Определить тип вопроса (Личность vs Отношения)
    const isPersonal = personalCategories.includes(question.category);

    // Определить вес вопроса
    const questionWeight =
      QUESTION_WEIGHT[question.id] || (question.priority === 1 ? 1.5 : 1.0);

    // Выбранный уровень
    const selectedLevel = answer.selectedLevel;

    // Пропускаем уровни вне диапазона 1-12 (например, валидационные 0)
    if (selectedLevel < 1 || selectedLevel > 12) return;

    // Добавить в счет для выбранного уровня - более высокий вес
    const current = levelCounts.get(selectedLevel)!;
    current.sum += selectedLevel * questionWeight;
    current.weight += questionWeight;
    current.count++;

    if (isPersonal) {
      current.personalSum += selectedLevel * questionWeight;
      current.personalWeight += questionWeight;
    } else {
      current.relationshipSum += selectedLevel * questionWeight;
      current.relationshipWeight += questionWeight;
    }

    // МИНИМАЛЬНЫЙ вклад в ближайшие соседи (±1 уровень)
    const maxNeighborDistance = 1;
    for (let level: UnionLevel = 1; level <= 12; level++) {
      if (level === selectedLevel) continue;

      const distance = Math.abs(level - selectedLevel);
      if (distance > maxNeighborDistance) continue; // Пропускаем далекие уровни

      // Очень маленький вес для соседей (±1 уровень)
      const neighborWeight = (1 - distance / (maxNeighborDistance + 1)) * questionWeight * 0.1;

      if (neighborWeight > 0) {
        const neighbor = levelCounts.get(level)!;
        neighbor.sum += level * neighborWeight;
        neighbor.weight += neighborWeight;

        if (isPersonal) {
          neighbor.personalSum += level * neighborWeight;
          neighbor.personalWeight += neighborWeight;
        } else {
          neighbor.relationshipSum += level * neighborWeight;
          neighbor.relationshipWeight += neighborWeight;
        }
      }
    }
  });

  // Рассчитать средний уровень для каждого уровня
  const levelScores: LevelScore[] = [];
  const levelDistribution: any[] = [];

  // Рассчитать средние оценки для каждого уровня
  let totalWeightedScore = 0;
  let totalWeight = 0;

  let totalPersonalScore = 0;
  let totalPersonalWeight = 0;

  let totalRelationshipScore = 0;
  let totalRelationshipWeight = 0;

  // Находим максимальные веса для нормализации процентов
  const maxWeight = Math.max(...Array.from(levelCounts.values()).map(d => d.weight));
  const maxPersonalWeight = Math.max(...Array.from(levelCounts.values()).map(d => d.personalWeight));
  const maxRelationshipWeight = Math.max(...Array.from(levelCounts.values()).map(d => d.relationshipWeight));

  for (let level: UnionLevel = 1; level <= 12; level++) {
    const data = levelCounts.get(level)!;

    if (data.weight > 0) {
      totalWeightedScore += level * data.weight;
      totalWeight += data.weight;
    }

    if (data.personalWeight > 0) {
      totalPersonalScore += level * data.personalWeight;
      totalPersonalWeight += data.personalWeight;
    }

    if (data.relationshipWeight > 0) {
      totalRelationshipScore += level * data.relationshipWeight;
      totalRelationshipWeight += data.relationshipWeight;
    }

    const percentage = maxWeight > 0 ? Math.round((data.weight / maxWeight) * 100) : 0;
    const confidence = Math.min(1, data.count / Math.max(1, answers.length * 0.5));

    levelScores.push({
      level,
      percentage,
      confidence,
    });

    // Detailed distribution for UnionLadder
    levelDistribution.push({
      levelId: level,
      personal: Math.round(data.personalWeight * 10), // Scale up for display
      relationship: Math.round(data.relationshipWeight * 10),
      total: Math.round(data.weight * 10),
      personalPercentage: maxPersonalWeight > 0 ? Math.round((data.personalWeight / maxPersonalWeight) * 100) : 0,
      relationshipPercentage: maxRelationshipWeight > 0 ? Math.round((data.relationshipWeight / maxRelationshipWeight) * 100) : 0
    });
  }

  // Рассчитать плавающий личный уровень
  let personalLevel = 6; // По умолчанию
  if (totalPersonalWeight > 0) {
    personalLevel = totalPersonalScore / totalPersonalWeight;
  } else if (totalWeight > 0) {
    // Fallback to total if no personal questions (unlikely)
    personalLevel = totalWeightedScore / totalWeight;
  }

  // Рассчитать уровень отношений
  let relationshipLevel = personalLevel;
  if (totalRelationshipWeight > 0) {
    relationshipLevel = totalRelationshipScore / totalRelationshipWeight;
  }

  return {
    personalLevel: Math.round(personalLevel * 10) / 10,
    relationshipLevel: Math.round(relationshipLevel * 10) / 10,
    levelScores,
    levelDistribution
  };
}

/**
 * Рассчитать оценки по измерениям (Мандала Союза)
 */
function calculateDimensionsScore(answers: UserAnswer[]): any {
  const dimensions = {
    safety: { sum: 0, count: 0, categories: ['trauma', 'patterns', 'conflict', 'safety', 'boundaries'] },
    connection: { sum: 0, count: 0, categories: ['emotions', 'intimacy', 'acceptance', 'communication'] },
    growth: { sum: 0, count: 0, categories: ['growth', 'freedom', 'values'] },
    mission: { sum: 0, count: 0, categories: ['creation', 'transcendence', 'synergy'] }
  };

  answers.forEach(answer => {
    const question = QUESTIONS.find(q => q.id === answer.questionId);
    if (!question) return;

    // Найти подходящее измерение
    for (const data of Object.values(dimensions)) {
      if (data.categories.includes(question.category)) {
        // Используем выбранный уровень как показатель качества в этом измерении
        // Уровень 1 = 8.3%, Уровень 12 = 100%
        data.sum += answer.selectedLevel;
        data.count++;
        break;
      }
    }
  });

  const calculateScore = (data: { sum: number, count: number }) => {
    if (data.count === 0) return 0;
    const avgLevel = data.sum / data.count;
    // Нормализация: 1..12 -> 0..100
    // Но чтобы 1 уровень не был 0, сделаем линейную шкалу
    return Math.round((avgLevel / 12) * 100);
  };

  return {
    safety: calculateScore(dimensions.safety),
    connection: calculateScore(dimensions.connection),
    growth: calculateScore(dimensions.growth),
    mission: calculateScore(dimensions.mission)
  };
}


/**
 * Применить коррекции валидации к результатам
 */
export function applyValidationAdjustments(
  personalLevel: number,
  relationshipLevel: number,
  validation: ValidationMetrics
): { personalLevel: number; relationshipLevel: number } {
  let adjustedPersonal = personalLevel;
  let adjustedRelationship = relationshipLevel;

  // Коррекция на основе социальной желательности
  // Если высокий социальный имидж, немного снизить оценку
  if (validation.socialDesirabilityScore > 0.6) {
    // Сдвинуть на 0.5-1.0 вниз
    const adjustment = (validation.socialDesirabilityScore - 0.6) * 2;
    adjustedPersonal = Math.max(1, adjustedPersonal - adjustment);
    adjustedRelationship = Math.max(1, adjustedRelationship - adjustment);
  }

  // Коррекция на основе противоречий
  // Каждое противоречие снижает уровень на 0.2
  if (validation.contradictionFlags.length > 0) {
    const adjustment = validation.contradictionFlags.length * 0.2;
    adjustedPersonal = Math.max(1, adjustedPersonal - adjustment);
  }

  // Коррекция на основе духовного байпаса
  // Если есть духовный байпас, снизить высокие уровни
  if (validation.spiritualBypassScore > 0.6) {
    if (adjustedPersonal >= 10) {
      const adjustment = (validation.spiritualBypassScore - 0.6) * 3;
      adjustedPersonal = Math.max(8, adjustedPersonal - adjustment);
    }
  }

  // Коррекция на основе когерентности
  // Низкая когерентность означает нестабильность
  if (validation.coherenceScore < 40) {
    // Снизить уровень и добавить неопределенность
    adjustedPersonal = Math.max(1, adjustedPersonal - 1);
  }

  // Убедиться что уровни в пределах 1-12
  adjustedPersonal = Math.max(1, Math.min(12, adjustedPersonal));
  adjustedRelationship = Math.max(1, Math.min(12, adjustedRelationship));

  return { personalLevel: adjustedPersonal, relationshipLevel: adjustedRelationship };
}

// ============================================================================
// ПУБЛИЧНЫЙ API
// ============================================================================

/**
 * Рассчитать полные результаты теста
 */
export function calculateTestResult(
  sessionId: string,
  answers: UserAnswer[],
  validation: ValidationMetrics,
  testMode: any,
  relationshipStatus: any,
  testScenario?: TestScenario
): TestResult {
  // Рассчитать базовые оценки
  const { personalLevel, relationshipLevel, levelScores, levelDistribution } = calculateLevelScores(answers);

  // Рассчитать оценки по измерениям
  const dimensionsScore = calculateDimensionsScore(answers);

  // Применить коррекции валидации
  const { personalLevel: adjustedPersonal, relationshipLevel: adjustedRelationship } =
    applyValidationAdjustments(personalLevel, relationshipLevel, validation);

  // Рассчитать время выполнения
  const completionTime =
    answers.length > 0
      ? answers[answers.length - 1].timestamp - answers[0].timestamp
      : 0;

  const now = Date.now();

  return {
    sessionId,
    testMode,
    testScenario,
    relationshipStatus,
    personalLevel: adjustedPersonal,
    relationshipLevel: adjustedRelationship,
    levelScores,
    levelDistribution,
    dimensionsScore, // Added this
    validation,
    answers,
    totalQuestions: answers.length,
    completionTime,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Рассчитать совместимость между двумя результатами
 */
export function calculateCompatibility(
  personalLevel1: number,
  personalLevel2: number
): number {
  const gap = Math.abs(personalLevel1 - personalLevel2);

  // Совместимость снижается с расстоянием
  let compatibility = 100 - gap * 10;

  // Бонус если оба на зрелом уровне (7+)
  if (personalLevel1 >= 7 && personalLevel2 >= 7) {
    compatibility = Math.min(100, compatibility + 15);
  }

  // Штраф если оба на низком уровне (3 и ниже)
  if (personalLevel1 <= 3 && personalLevel2 <= 3) {
    compatibility = Math.max(0, compatibility - 20);
  }

  // Штраф если есть экстремальная разница
  if (gap >= 4) {
    compatibility = Math.max(0, compatibility - 10);
  }

  return Math.max(0, Math.min(100, compatibility));
}

/**
 * Рассчитать индекс надежности результата
 */
export function calculateReliabilityScore(
  validation: ValidationMetrics
): number {
  let score = 100;

  // Снизить за социальную желательность
  score -= validation.socialDesirabilityScore * 30;

  // Снизить за противоречия
  score -= validation.contradictionFlags.length * 10;

  // Снизить за духовный байпас
  score -= validation.spiritualBypassScore * 20;

  // Учесть когерентность
  score -= (100 - validation.coherenceScore) * 0.3;

  // Убедиться что в пределах 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Сгенерировать рекомендацию по надежности
 */
export function getReliabilityRecommendation(
  validation: ValidationMetrics
): string[] {
  const recommendations: string[] = [];

  if (validation.socialDesirabilityScore > 0.6) {
    recommendations.push(
      'Старайтесь быть честнее в следующих ответах - социальный имидж может искажать результаты'
    );
  }

  if (validation.contradictionFlags.includes('conditional-love')) {
    recommendations.push(
      'Обратите внимание на противоречие между заявленной любовью и попытками контролировать партнера'
    );
  }

  if (validation.contradictionFlags.includes('spiritual-bypass')) {
    recommendations.push(
      'Проверьте не используете ли вы духовность чтобы избежать реальной работы над отношениями'
    );
  }

  if (validation.coherenceScore < 50) {
    recommendations.push(
      'Ваши ответы не очень согласованны - возможно, ваше поведение зависит от ситуации больше чем от убеждений'
    );
  }

  if (validation.spiritualBypassScore > 0.5) {
    recommendations.push(
      'Будьте осторожны с духовным байпасом - высокие идеалы должны быть подкреплены практикой'
    );
  }

  return recommendations;
}

/**
 * Получить распределение вероятности уровней в процентах
 */
export function getLevelDistribution(
  levelScores: LevelScore[]
): Record<number, number> {
  const distribution: Record<number, number> = {};

  levelScores.forEach((score) => {
    distribution[score.level] = score.percentage;
  });

  return distribution;
}
