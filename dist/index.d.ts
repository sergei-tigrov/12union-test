/**
 * ГЛАВНЫЙ ЭКСПОРТ
 * "Лестница союза"
 *
 * Публичный API для использования в приложениях
 */
export * from './types';
export { getLevelDefinition, getLevelName, getLevelIcon, getLevelColor } from './levels-definitions';
export { QUESTIONS, getQuestionById, getQuestionsByCategory, getQuestionsByTargetLevel, getValidationQuestions, getCriticalQuestions, getZoningQuestions, getRefinementQuestions } from './questions-database';
export { initializeAdaptiveTest, getNextQuestion, recordAnswer, getCurrentLevelDetection, completeTest } from './adaptive-algorithm';
export { validateTestResults, getReliabilityMessage } from './validation-engine';
export { getActionPlan, getAllActionPlans, getActionById } from './action-library';
export { calculateLevelScores, applyValidationAdjustments, calculateTestResult, calculateCompatibility, calculateReliabilityScore, getReliabilityRecommendation, getLevelDistribution } from './score-calculation';
export { interpretResult, interpretPairComparison } from './results-interpreter';
export { initializeTestSession, getNextTestQuestion, submitTestAnswer, completeTestSession, getTestResult, compareTestResults, getSessionStatus, deleteTestSession, getAllActiveSessions, getAllCompletedResults, } from './test-orchestrator';
