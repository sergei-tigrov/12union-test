/**
 * АДАПТИВНЫЙ АЛГОРИТМ ОПРЕДЕЛЕНИЯ УРОВНЯ
 * "Лестница союза"
 *
 * Трёхфазный адаптивный тест:
 * 1. ЗОНИРОВАНИЕ (6 вопросов) - быстро определить зону 1-4, 5-8 или 9-12
 * 2. УТОЧНЕНИЕ (8-12 вопросов) - точно определить уровень в пределах зоны
 * 3. ВАЛИДАЦИЯ (3-4 вопроса) - подтвердить результат и обнаружить искажения
n *
 *총время: 15-20 минут (20-28 вопросов максимум)
 */

import { SmartQuestion, UnionLevel, UserAnswer } from './types';
import {
  QUESTIONS,
  getZoningQuestions,
  getRefinementQuestions,
  getValidationQuestions,
  getQuestionsByTargetLevel,
} from './questions-database';

// ============================================================================
// ТИПЫ
// ============================================================================

export interface LevelDetection {
  detectedLevel: number; // 1-12 с точностью до 0.1
  confidence: number; // 0-1, уверенность в оценке
  zone: 'low' | 'middle' | 'high'; // 1-4, 5-8 или 9-12
  levelScoreDistribution: Map<UnionLevel, number>; // Распределение вероятности по уровням
}

export interface QuestionSelection {
  nextQuestion: SmartQuestion;
  phase: 'zoning' | 'refinement' | 'validation' | 'complete';
  questionsAnswered: number;
  questionsRemaining: number;
  estimatedLevelSoFar?: LevelDetection;
}

export interface AdaptiveTestState {
  sessionId: string;
  answers: UserAnswer[];
  currentPhase: 'zoning' | 'refinement' | 'validation' | 'complete';
  detectedZone?: 'low' | 'middle' | 'high';
  questionsAnswered: number;
  questionsAsked: Set<string>; // Какие вопросы уже задавались
  levelScores: Map<UnionLevel, number>; // Текущие расчёты уровней
  testStartTime: number;
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Начать адаптивный тест
 */
export function initializeAdaptiveTest(sessionId: string): AdaptiveTestState {
  return {
    sessionId,
    answers: [],
    currentPhase: 'zoning',
    questionsAnswered: 0,
    questionsAsked: new Set(),
    levelScores: new Map(),
    testStartTime: Date.now(),
  };
}

/**
 * Определить зону по ответам зонирования
 * Возвращает наиболее вероятную зону (low=1-4, middle=5-8, high=9-12)
 */
function detectZone(
  zoneAnswers: Map<string, UnionLevel>
): 'low' | 'middle' | 'high' {
  const levels: UnionLevel[] = Array.from(zoneAnswers.values());
  const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;

  if (avgLevel <= 4.5) return 'low';
  if (avgLevel <= 8.5) return 'middle';
  return 'high';
}

/**
 * Рассчитать точность по каждому уровню на основе ответов
 * Использует взвешенные очки с учетом целевых уровней вопроса
 */
function calculateLevelScores(
  answers: UserAnswer[],
  questions: Map<string, SmartQuestion>
): Map<UnionLevel, { score: number; confidence: number }> {
  const levelScores = new Map<UnionLevel, { score: number; confidence: number }>();

  // Инициализировать все уровни
  for (let level: UnionLevel = 1; level <= 12; level++) {
    levelScores.set(level, { score: 0, confidence: 0 });
  }

  // Обработать каждый ответ
  answers.forEach((answer) => {
    const question = questions.get(answer.questionId);
    if (!question) return;

    // Найти выбранный вариант ответа
    const selectedOption = question.options.find(
      (opt) => opt.id === answer.selectedOptionId
    );
    if (!selectedOption) return;

    const selectedLevel = selectedOption.level;
    const targetLevels = question.targetLevels;

    // Рассчитать вес этого ответа для каждого уровня
    // Максимальный вес если вопрос предназначен для этого уровня
    // Убывающий вес по мере удаления от выбранного уровня
    for (let level: UnionLevel = 1; level <= 12; level++) {
      const current = levelScores.get(level)!;

      // Базовый вес: попадает ли уровень в целевые уровни вопроса
      let weight = targetLevels.includes(level) ? 1.0 : 0.3;

      // Более высокий вес если ответ непосредственно указывает на этот уровень
      if (selectedLevel === level) {
        weight = 2.0;
      }

      // Снижение веса по мере удаления
      const distance = Math.abs(level - selectedLevel);
      const distancePenalty = Math.max(0, 1 - distance / 12);
      weight *= distancePenalty;

      // Добавить в итоговый счёт
      current.score += weight;
    }
  });

  // Нормализовать оценки и рассчитать уверенность
  const totalScore = Array.from(levelScores.values()).reduce(
    (sum, s) => sum + s.score,
    0
  );

  if (totalScore > 0) {
    Array.from(levelScores.values()).forEach((item) => {
      item.confidence = item.score / totalScore; // 0-1
      item.score = item.score / totalScore; // Нормализовать 0-1
    });
  }

  return levelScores;
}

/**
 * Определить детектируемый уровень на основе текущих ответов
 */
function detectCurrentLevel(
  answers: UserAnswer[],
  questions: Map<string, SmartQuestion>
): LevelDetection {
  const levelScores = calculateLevelScores(answers, questions);
  const scores = Array.from(levelScores.entries());

  // Найти уровень с наивысшим баллом
  let maxScore = 0;
  let topLevel: UnionLevel = 6;
  let topConfidence = 0;

  scores.forEach(([level, { score, confidence }]) => {
    if (score > maxScore) {
      maxScore = score;
      topLevel = level;
      topConfidence = confidence;
    }
  });

  // Определить зону
  let zone: 'low' | 'middle' | 'high';
  if (topLevel <= 4) zone = 'low';
  else if (topLevel <= 8) zone = 'middle';
  else zone = 'high';

  // Рассчитать плавающий уровень (1-12 с точностью 0.1)
  // На основе взвешенного среднего с весами
  let detectedLevel = 0;
  let totalWeight = 0;

  scores.forEach(([level, { confidence }]) => {
    detectedLevel += level * confidence;
    totalWeight += confidence;
  });

  if (totalWeight > 0) {
    detectedLevel /= totalWeight;
  }

  return {
    detectedLevel: Math.round(detectedLevel * 10) / 10,
    confidence: topConfidence,
    zone,
    levelScoreDistribution: new Map(
      scores.map(([level, { confidence }]) => [level, confidence])
    ),
  };
}

/**
 * Выбрать следующий вопрос на основе адаптивной логики
 */
function selectNextQuestion(
  state: AdaptiveTestState,
  allQuestions: Map<string, SmartQuestion>
): SmartQuestion | null {
  const availableQuestions = Array.from(allQuestions.values()).filter(
    (q) => !state.questionsAsked.has(q.id)
  );

  if (availableQuestions.length === 0) {
    return null; // Нет больше вопросов
  }

  // ФАЗА ЗОНИРОВАНИЯ: задать все вопросы зонирования
  if (state.currentPhase === 'zoning') {
    const zoningQuestions = availableQuestions.filter((q) =>
      [
        'zone-conflict-001',
        'zone-safety-002',
        'zone-growth-003',
        'zone-intimacy-004',
        'zone-choice-005',
        'zone-difference-006',
      ].includes(q.id)
    );

    if (zoningQuestions.length > 0) {
      // Вернуть первый оставшийся вопрос зонирования
      return zoningQuestions[0];
    }
  }

  // ФАЗА УТОЧНЕНИЯ: выбрать вопросы, специфичные для детектируемой зоны
  if (state.currentPhase === 'refinement') {
    if (!state.detectedZone) {
      // Определить зону, если она еще не определена
      const detection = detectCurrentLevel(state.answers, allQuestions);
      state.detectedZone = detection.zone;
    }

    // Выбрать уровень на основе детектируемой зоны
    let targetLevelRange: UnionLevel[];
    if (state.detectedZone === 'low') {
      targetLevelRange = [1, 2, 3, 4];
    } else if (state.detectedZone === 'middle') {
      targetLevelRange = [5, 6, 7, 8];
    } else {
      targetLevelRange = [9, 10, 11, 12];
    }

    // Получить текущее определение уровня
    const detection = detectCurrentLevel(state.answers, allQuestions);

    // Выбрать вопрос, который лучше всего разделяет уровни в целевом диапазоне
    const refinementQuestions = availableQuestions.filter((q) => {
      // Вопрос должен быть о уточнении, не о зонировании, не о валидации
      const isRefinement =
        q.id.startsWith('level-detail-') ||
        q.id.startsWith('boundary-') ||
        q.id.startsWith('autonomy-') ||
        q.id.startsWith('understanding-') ||
        q.id.startsWith('hope-');

      if (!isRefinement) return false;

      // Вопрос должен быть релевантен для целевого уровня
      const overlapsWithTarget = q.targetLevels.some((level) =>
        targetLevelRange.includes(level)
      );

      return overlapsWithTarget;
    });

    if (refinementQuestions.length > 0) {
      // Выбрать приоритетный вопрос
      const priorityQuestions = refinementQuestions.filter((q) => q.priority === 1);
      return priorityQuestions.length > 0
        ? priorityQuestions[0]
        : refinementQuestions[0];
    }
  }

  // ФАЗА ВАЛИДАЦИИ: задать вопросы валидации
  if (state.currentPhase === 'validation') {
    const validationQuestions = availableQuestions.filter(
      (q) => q.isValidation === true
    );

    if (validationQuestions.length > 0) {
      // Выбрать первый доступный вопрос валидации
      return validationQuestions[0];
    }
  }

  return null;
}

/**
 * Перейти к следующей фазе теста
 */
function advancePhase(state: AdaptiveTestState): void {
  if (state.currentPhase === 'zoning') {
    // Проверить, все ли вопросы зонирования отвечены
    const zoningQIds = [
      'zone-conflict-001',
      'zone-safety-002',
      'zone-growth-003',
      'zone-intimacy-004',
      'zone-choice-005',
      'zone-difference-006',
    ];

    const zoningAnswered = state.answers.filter((a) =>
      zoningQIds.includes(a.questionId)
    ).length;

    if (zoningAnswered >= 6) {
      state.currentPhase = 'refinement';
    }
  } else if (state.currentPhase === 'refinement') {
    // Перейти к валидации после 8-12 вопросов уточнения
    const refinementCount = state.answers.length - 6; // Минус вопросы зонирования

    if (refinementCount >= 8) {
      state.currentPhase = 'validation';
    }
  } else if (state.currentPhase === 'validation') {
    // Завершить после 3-4 вопросов валидации
    const validationCount = state.answers.length - 6 - 8; // Минус предыдущие фазы

    if (validationCount >= 3) {
      state.currentPhase = 'complete';
    }
  }
}

// ============================================================================
// ПУБЛИЧНЫЙ API
// ============================================================================

/**
 * Получить следующий вопрос для пользователя
 */
export function getNextQuestion(
  state: AdaptiveTestState
): QuestionSelection | null {
  // Преобразовать в Map для удобства
  const questionsMap = new Map<string, SmartQuestion>();
  QUESTIONS.forEach((q) => questionsMap.set(q.id, q));

  // Выбрать следующий вопрос
  const nextQuestion = selectNextQuestion(state, questionsMap);

  if (!nextQuestion) {
    // Перейти к следующей фазе если нет вопросов в текущей
    advancePhase(state);

    if (state.currentPhase === 'complete') {
      return null; // Тест завершен
    }

    // Попробовать выбрать вопрос из новой фазы
    const nextQuestionRetry = selectNextQuestion(state, questionsMap);
    if (!nextQuestionRetry) {
      return null; // Нет больше вопросов
    }

    return createQuestionSelection(state, nextQuestionRetry, questionsMap);
  }

  return createQuestionSelection(state, nextQuestion, questionsMap);
}

/**
 * Записать ответ пользователя
 */
export function recordAnswer(
  state: AdaptiveTestState,
  answer: UserAnswer
): void {
  state.answers.push(answer);
  state.questionsAsked.add(answer.questionId);
  state.questionsAnswered++;

  // Попробовать перейти к следующей фазе если нужно
  advancePhase(state);
}

/**
 * Получить текущую оценку уровня
 */
export function getCurrentLevelDetection(
  state: AdaptiveTestState
): LevelDetection {
  const questionsMap = new Map<string, SmartQuestion>();
  QUESTIONS.forEach((q) => questionsMap.set(q.id, q));

  return detectCurrentLevel(state.answers, questionsMap);
}

/**
 * Завершить тест и получить финальный результат
 */
export function completeTest(
  state: AdaptiveTestState
): {
  finalLevel: LevelDetection;
  totalQuestionsAnswered: number;
  totalTimeMs: number;
} {
  const questionsMap = new Map<string, SmartQuestion>();
  QUESTIONS.forEach((q) => questionsMap.set(q.id, q));

  const finalLevel = detectCurrentLevel(state.answers, questionsMap);

  return {
    finalLevel,
    totalQuestionsAnswered: state.questionsAnswered,
    totalTimeMs: Date.now() - state.testStartTime,
  };
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Создать объект QuestionSelection
 */
function createQuestionSelection(
  state: AdaptiveTestState,
  question: SmartQuestion,
  questionsMap: Map<string, SmartQuestion>
): QuestionSelection {
  const estimatedLevel =
    state.questionsAnswered > 0
      ? getCurrentLevelDetection(state)
      : undefined;

  return {
    nextQuestion: question,
    phase: state.currentPhase,
    questionsAnswered: state.questionsAnswered,
    questionsRemaining: 28 - state.questionsAnswered, // Максимум 28 вопросов
    estimatedLevelSoFar: estimatedLevel,
  };
}
