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



import { diagnoseUser } from './diagnostic-engine';

/**
 * Определить детектируемый уровень на основе текущих ответов
 * Использует новый DIAGNOSTIC ENGINE (Quantum Logic)
 */
function detectCurrentLevel(
  answers: UserAnswer[],
  questions: Map<string, SmartQuestion>
): LevelDetection {
  // Используем новый мощный движок диагностики
  const diagnosis = diagnoseUser(answers, questions);

  // Определяем зону на основе БАЗОВОГО уровня (фундамента)
  // Это критически важно: зона определяется тем, где мы стоим прочно, а не где летаем в мечтах
  let zone: 'low' | 'middle' | 'high';
  if (diagnosis.baseLevel <= 4) zone = 'low';
  else if (diagnosis.baseLevel <= 8) zone = 'middle';
  else zone = 'high';

  return {
    detectedLevel: diagnosis.currentLevel,
    confidence: 1.0, // Новый движок детерминирован
    zone,
    levelScoreDistribution: diagnosis.levelScores,
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
        'zone-responsibility-005',
        'zone-future-006',
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

    // Выбрать вопрос, который лучше всего разделяет уровни в целевом диапазоне
    const refinementQuestions = availableQuestions.filter((q) => {
      // Вопрос должен быть о уточнении, не о зонировании, не о валидации
      const isRefinement = q.id.startsWith('level-');

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
      'zone-responsibility-005',
      'zone-future-006',
    ];

    const zoningAnswered = state.answers.filter((a) =>
      zoningQIds.includes(a.questionId)
    ).length;

    if (zoningAnswered >= 6) {
      state.currentPhase = 'refinement';
    }
  } else if (state.currentPhase === 'refinement') {
    // Перейти к валидации после 12 вопросов уточнения (было 8)
    // Это даст более точную картину и больше данных для портрета
    const refinementCount = state.answers.length - 6; // Минус вопросы зонирования

    if (refinementCount >= 12) {
      state.currentPhase = 'validation';
    }
  } else if (state.currentPhase === 'validation') {
    // Завершить после 5 вопросов валидации (было 3)
    const validationCount = state.answers.length - 6 - 12; // Минус предыдущие фазы

    if (validationCount >= 5) {
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

    return createQuestionSelection(state, nextQuestionRetry);
  }

  return createQuestionSelection(state, nextQuestion);
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

  // Явно помечаем тест как завершенный
  state.currentPhase = 'complete';

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
  question: SmartQuestion
): QuestionSelection {
  const estimatedLevel =
    state.questionsAnswered > 0
      ? getCurrentLevelDetection(state)
      : undefined;

  return {
    nextQuestion: question,
    phase: state.currentPhase,
    questionsAnswered: state.questionsAnswered,
    questionsRemaining: 24 - state.questionsAnswered, // Максимум 24 вопроса
    estimatedLevelSoFar: estimatedLevel,
  };
}
