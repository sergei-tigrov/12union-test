/**
 * ГЛАВНЫЙ ЭКСПОРТ
 * "Лестница союза"
 *
 * Публичный API для использования в приложениях
 */

// Типы
export * from './types';

// Определения уровней
export { getLevelDefinition, getLevelName, getLevelIcon, getLevelColor } from './levels-definitions';

// Вопросы
export { QUESTIONS, getQuestionById, getQuestionsByCategory, getQuestionsByTargetLevel, getValidationQuestions, getCriticalQuestions, getZoningQuestions, getRefinementQuestions } from './questions-database';

// Адаптивный алгоритм
export { initializeAdaptiveTest, getNextQuestion, recordAnswer, getCurrentLevelDetection, completeTest } from './adaptive-algorithm';

// Валидация
export { validateTestResults, getReliabilityMessage } from './validation-engine';

// Действия
export { getActionPlan, getAllActionPlans, getActionById } from './action-library';

// Расчеты
export { calculateLevelScores, applyValidationAdjustments, calculateTestResult, calculateCompatibility, calculateReliabilityScore, getReliabilityRecommendation, getLevelDistribution } from './score-calculation';

// Интерпретация
export { interpretResult, interpretPairComparison } from './results-interpreter';

// Оркестратор (главный API)
export {
  initializeTestSession,
  getNextTestQuestion,
  submitTestAnswer,
  completeTestSession,
  getTestResult,
  compareTestResults,
  getSessionStatus,
  deleteTestSession,
  getAllActiveSessions,
  getAllCompletedResults,
} from './test-orchestrator';
