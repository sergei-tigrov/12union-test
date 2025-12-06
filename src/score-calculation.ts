/* eslint-disable @typescript-eslint/no-explicit-any */
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



// ============================================================================
// ОСНОВНЫЕ ФУНКЦИИ РАСЧЕТА
// ============================================================================

/**
 * Рассчитать оценки уровней на основе ответов
 */
/**
 * Рассчитать оценки уровней на основе ответов
 */
import { diagnoseUser } from './diagnostic-engine';

/**
 * Рассчитать оценки уровней на основе ответов
 * Использует новый DIAGNOSTIC ENGINE
 */
export function calculateLevelScores(
  answers: UserAnswer[]
): {
  personalLevel: number;
  relationshipLevel: number;
  levelScores: LevelScore[];
  levelDistribution: any[]; // DetailedLevelScore[]
  diagnosisTitle?: string;
  diagnosisDescription?: string;
  diagnosisPattern?: string;
} {
  // ЗАЩИТА: не показываем результаты при критически малом количестве данных
  // Минимум 15 ответов: 6 (зонирование) + 6 (уточнение) + 3 (валидация)
  // Адаптивный алгоритм с динамическими порогами гарантирует это количество
  if (answers.length < 15) {
    throw new Error(
      `Недостаточно данных для расчета результатов. ` +
      `Получено ответов: ${answers.length}, требуется минимум 15. ` +
      `Пожалуйста, завершите тест полностью.`
    );
  }

  // 1. Запускаем диагностику
  // Нам нужно преобразовать answers в Map вопросов, так как движок этого требует
  // Но движок принимает (answers, questionsMap).
  // QUESTIONS у нас уже есть импортированный.
  const questionsMap = new Map<string, any>();
  QUESTIONS.forEach(q => questionsMap.set(q.id, q));

  const diagnosis = diagnoseUser(answers, questionsMap);

  // 2. Формируем levelScores (старый формат для совместимости)
  const levelScores: LevelScore[] = [];
  const levelDistribution: any[] = [];

  // Проходим по всем уровням 1-12
  for (let level = 1; level <= 12; level++) {
    const score = diagnosis.levelScores.get(level as UnionLevel) || 0;
    const percentage = Math.round(score * 100);

    // Confidence в новом движке можно считать как силу сигнала
    const confidence = score;

    levelScores.push({
      level: level as UnionLevel,
      percentage,
      confidence
    });

    // Для распределения (старый формат требовал разделения на personal/relationship)
    // Новый движок это не разделяет так явно, поэтому используем общий скор
    // Это допустимое упрощение, так как мы переходим на целостный подход
    levelDistribution.push({
      levelId: level,
      personal: Math.round(score * 10),
      relationship: Math.round(score * 10),
      total: Math.round(score * 10),
      personalPercentage: percentage,
      relationshipPercentage: percentage
    });
  }

  // 3. Возвращаем результаты
  // Используем currentLevel из диагностики как основной результат
  return {
    personalLevel: diagnosis.currentLevel,
    relationshipLevel: diagnosis.currentLevel, // В новой логике они связаны
    levelScores,
    levelDistribution,
    diagnosisTitle: diagnosis.diagnosisTitle,
    diagnosisDescription: diagnosis.diagnosisDescription,
    diagnosisPattern: diagnosis.pattern
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
  // Рассчитать базовые оценки и диагностику
  const {
    personalLevel,
    relationshipLevel,
    levelScores,
    levelDistribution,
    diagnosisTitle,
    diagnosisDescription,
    diagnosisPattern
  } = calculateLevelScores(answers);

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
    diagnosisTitle,
    diagnosisDescription,
    diagnosisPattern,
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
