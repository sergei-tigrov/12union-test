/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * ОРКЕСТРАТОР ТЕСТИРОВАНИЯ
 * "Лестница союза"
 *
 * Управляет полным процессом тестирования:
 * - Инициализация сессии
 * - Управление вопросами
 * - Запись ответов
 * - Валидация
 * - Расчет результатов
 */

import {
  TestMode,
  RelationshipStatus,
  RelationshipType,
  UserProfile,
  TestResult,
  UserAnswer,
} from './types';
import {
  AdaptiveTestState,
  getNextQuestion,
  recordAnswer,
  getCurrentLevelDetection,
  completeTest,
  initializeAdaptiveTest,
} from './adaptive-algorithm';
import {
  validateTestResults,
} from './validation-engine';
import {
  calculateTestResult,
  calculateCompatibility,
} from './score-calculation';
import { interpretResult, interpretPairComparison } from './results-interpreter';

// ============================================================================
// ТИПЫ
// ============================================================================

export interface TestSessionContext {
  sessionId: string;
  userProfile: UserProfile;
  state: AdaptiveTestState;
  startTime: number;
}

export interface TestQuestionPresentation {
  questionId: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  phase: 'zoning' | 'refinement' | 'validation' | 'complete';
  questionsAnswered: number;
  questionsRemaining: number;
  estimatedLevel?: number;
}

export interface PartnerComparison {
  personASessionId: string;
  personBSessionId: string;
  gap: number;
  compatibility: number;
  recommendations: string[];
}

// ============================================================================
// СЕССИОННОЕ ХРАНИЛИЩЕ (в реальном коде это должно быть в БД)
// ============================================================================

const testSessions = new Map<string, TestSessionContext>();
const completedResults = new Map<string, TestResult>();

// ============================================================================
// ОСНОВНОЙ API
// ============================================================================

/**
 * Инициировать новую сессию тестирования
 */
export function initializeTestSession(
  sessionId: string,
  testMode: TestMode,
  relationshipStatus: RelationshipStatus,
  relationshipType: RelationshipType = 'heterosexual_pair'
): TestSessionContext {
  // Валидировать входные данные
  if (!testMode || !relationshipStatus) {
    throw new Error('Test mode and relationship status are required');
  }

  // Определить hasPartner на основе relationshipStatus
  const hasPartner =
    relationshipStatus === 'in_relationship' ||
    relationshipStatus === 'pair_together';

  const userProfile: UserProfile = {
    sessionId,
    relationshipStatus,
    relationshipType,
    hasPartner,
    testMode,
  };

  const state = initializeAdaptiveTest(sessionId);

  const context: TestSessionContext = {
    sessionId,
    userProfile,
    state,
    startTime: Date.now(),
  };

  testSessions.set(sessionId, context);

  return context;
}

/**
 * Получить следующий вопрос для пользователя
 */
export function getNextTestQuestion(
  sessionId: string
): TestQuestionPresentation | null {
  const context = testSessions.get(sessionId);
  if (!context) {
    throw new Error(`Test session not found: ${sessionId}`);
  }

  const questionSelection = getNextQuestion(context.state);
  if (!questionSelection) {
    return null; // Тест завершен
  }

  const testMode = context.userProfile.testMode;
  const question = questionSelection.nextQuestion;

  // Выбрать текст вопроса на основе режима
  let questionText: string;
  if (testMode === 'self') {
    questionText = question.text.self;
  } else if (testMode === 'partner_assessment') {
    questionText = question.text.partner;
  } else if (testMode === 'potential') {
    questionText = question.text.potential;
  } else if (testMode === 'pair_discussion') {
    questionText = question.text.pair_discussion;
  } else {
    questionText = question.text.self;
  }

  // Подготовить варианты ответов
  const options = question.options.map((opt) => {
    // Get the correct text variant based on testMode
    let optionText: string;
    if (typeof opt.text === 'string') {
      // Legacy format
      optionText = opt.text;
    } else {
      // New format with variants
      const modeMap: Record<string, keyof typeof opt.text> = {
        'self': 'self',
        'partner_assessment': 'partner',
        'potential': 'potential',
        'pair_discussion': 'pair_discussion'
      };
      optionText = opt.text[modeMap[testMode]] || opt.text.self;
    }

    return {
      id: opt.id,
      text: optionText,
    };
  });

  // Получить текущую оценку уровня (если уже достаточно ответов)
  const estimatedLevel =
    context.state.questionsAnswered > 0
      ? getCurrentLevelDetection(context.state).detectedLevel
      : undefined;

  return {
    questionId: question.id,
    text: questionText,
    options,
    phase: questionSelection.phase,
    questionsAnswered: questionSelection.questionsAnswered,
    questionsRemaining: questionSelection.questionsRemaining,
    estimatedLevel,
  };
}

/**
 * Записать ответ пользователя
 */
export function submitTestAnswer(
  sessionId: string,
  questionId: string,
  selectedOptionId: string,
  responseTimeMs: number
): void {
  const context = testSessions.get(sessionId);
  if (!context) {
    throw new Error(`Test session not found: ${sessionId}`);
  }

  // Найти вопрос
  const question = require('./questions-database').QUESTIONS.find(
    (q: any) => q.id === questionId
  );
  if (!question) {
    throw new Error(`Question not found: ${questionId}`);
  }

  // Найти выбранный вариант ответа
  const selectedOption = question.options.find(
    (opt: any) => opt.id === selectedOptionId
  );
  if (!selectedOption) {
    throw new Error(`Option not found: ${selectedOptionId}`);
  }

  // Создать ответ
  const answer: UserAnswer = {
    questionId,
    selectedOptionId,
    selectedLevel: selectedOption.level,
    responseTime: responseTimeMs,
    timestamp: Date.now(),
    mode: context.userProfile.testMode,
  };

  // Записать ответ
  recordAnswer(context.state, answer);
}

/**
 * Завершить тест и получить результаты
 */
export function completeTestSession(
  sessionId: string
): {
  result: TestResult;
  interpretation: any;
} {
  const context = testSessions.get(sessionId);
  if (!context) {
    throw new Error(`Test session not found: ${sessionId}`);
  }

  // Завершить тест
  completeTest(context.state);

  // Провести валидацию
  const validationResult = validateTestResults(context.state.answers);

  // Рассчитать результаты
  const testResult = calculateTestResult(
    sessionId,
    context.state.answers,
    validationResult.metrics,
    context.userProfile.testMode,
    context.userProfile.relationshipStatus
  ) as TestResult;

  // Добавить временные метаданные
  testResult.createdAt = context.startTime;
  testResult.updatedAt = Date.now();

  // Сохранить результаты
  completedResults.set(sessionId, testResult);

  // Интерпретировать результаты
  const interpretation = interpretResult(testResult);

  return {
    result: testResult,
    interpretation,
  };
}

/**
 * Получить сохраненные результаты тестирования
 */
export function getTestResult(sessionId: string): TestResult | null {
  return completedResults.get(sessionId) || null;
}

/**
 * Сравнить результаты двух тестирований (для пар)
 */
export function compareTestResults(
  sessionIdA: string,
  sessionIdB: string
): {
  comparison: PartnerComparison;
  interpretation: any;
} {
  const resultA = completedResults.get(sessionIdA);
  const resultB = completedResults.get(sessionIdB);

  if (!resultA || !resultB) {
    throw new Error('One or both test results not found');
  }

  // Рассчитать разницу и совместимость
  const gap = Math.abs(resultA.personalLevel - resultB.personalLevel);
  const compatibility = calculateCompatibility(
    resultA.personalLevel,
    resultB.personalLevel
  );

  // Сгенерировать рекомендации для пары
  const recommendations: string[] = [];
  if (gap >= 2) {
    recommendations.push(
      'Рекомендуется работа с парным психологом или коучем для преодоления разницы в уровнях'
    );
  }
  if (resultA.personalLevel <= 3 || resultB.personalLevel <= 3) {
    recommendations.push(
      'Сосредоточьтесь на создании безопасности и стабильности в отношениях'
    );
  }
  if (resultA.personalLevel >= 7 && resultB.personalLevel >= 7) {
    recommendations.push(
      'Вы оба на психологически зрелом уровне - рассмотрите совместный проект служения'
    );
  }

  const comparison: PartnerComparison = {
    personASessionId: sessionIdA,
    personBSessionId: sessionIdB,
    gap,
    compatibility,
    recommendations,
  };

  // Создать ComparisonResult для интерпретации
  const comparisonResult: any = {
    ...resultA,
    comparisonWith: resultB,
    gap,
    compatibility,
    recommendations,
  };

  const interpretation = interpretPairComparison(comparisonResult);

  return {
    comparison,
    interpretation,
  };
}

/**
 * Получить статус текущей сессии
 */
export function getSessionStatus(
  sessionId: string
): {
  currentPhase: string;
  questionsAnswered: number;
  estimatedLevel?: number;
  isComplete: boolean;
} {
  const context = testSessions.get(sessionId);
  if (!context) {
    throw new Error(`Test session not found: ${sessionId}`);
  }

  const isComplete = context.state.currentPhase === 'complete';
  const estimatedLevel =
    context.state.questionsAnswered > 0
      ? getCurrentLevelDetection(context.state).detectedLevel
      : undefined;

  return {
    currentPhase: context.state.currentPhase,
    questionsAnswered: context.state.questionsAnswered,
    estimatedLevel,
    isComplete,
  };
}

/**
 * Удалить сессию (для очистки памяти)
 */
export function deleteTestSession(sessionId: string): void {
  testSessions.delete(sessionId);
  completedResults.delete(sessionId);
}

/**
 * Получить все активные сессии (для отладки)
 */
export function getAllActiveSessions(): string[] {
  return Array.from(testSessions.keys());
}

/**
 * Получить все завершенные результаты (для отладки)
 */
export function getAllCompletedResults(): Map<string, TestResult> {
  return new Map(completedResults);
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

