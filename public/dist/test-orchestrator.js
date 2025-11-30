"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTestSession = initializeTestSession;
exports.getNextTestQuestion = getNextTestQuestion;
exports.submitTestAnswer = submitTestAnswer;
exports.completeTestSession = completeTestSession;
exports.getTestResult = getTestResult;
exports.compareTestResults = compareTestResults;
exports.getSessionStatus = getSessionStatus;
exports.deleteTestSession = deleteTestSession;
exports.getAllActiveSessions = getAllActiveSessions;
exports.getAllCompletedResults = getAllCompletedResults;
const adaptive_algorithm_1 = require("./adaptive-algorithm");
const validation_engine_1 = require("./validation-engine");
const score_calculation_1 = require("./score-calculation");
const results_interpreter_1 = require("./results-interpreter");
// ============================================================================
// СЕССИОННОЕ ХРАНИЛИЩЕ (в реальном коде это должно быть в БД)
// ============================================================================
const testSessions = new Map();
const completedResults = new Map();
// ============================================================================
// ОСНОВНОЙ API
// ============================================================================
/**
 * Инициировать новую сессию тестирования
 */
function initializeTestSession(sessionId, testMode, relationshipStatus, relationshipType = 'heterosexual_pair') {
    // Валидировать входные данные
    if (!testMode || !relationshipStatus) {
        throw new Error('Test mode and relationship status are required');
    }
    // Определить hasPartner на основе relationshipStatus
    const hasPartner = relationshipStatus === 'in_relationship' ||
        relationshipStatus === 'pair_together';
    const userProfile = {
        sessionId,
        relationshipStatus,
        relationshipType,
        hasPartner,
        testMode,
    };
    const state = (0, adaptive_algorithm_1.initializeAdaptiveTest)(sessionId);
    const context = {
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
function getNextTestQuestion(sessionId) {
    const context = testSessions.get(sessionId);
    if (!context) {
        throw new Error(`Test session not found: ${sessionId}`);
    }
    const questionSelection = (0, adaptive_algorithm_1.getNextQuestion)(context.state);
    if (!questionSelection) {
        return null; // Тест завершен
    }
    const testMode = context.userProfile.testMode;
    const question = questionSelection.nextQuestion;
    // Выбрать текст вопроса на основе режима
    let questionText;
    if (testMode === 'self') {
        questionText = question.text.self;
    }
    else if (testMode === 'partner_assessment') {
        questionText = question.text.partner;
    }
    else if (testMode === 'potential') {
        questionText = question.text.potential;
    }
    else if (testMode === 'pair_discussion') {
        questionText = question.text.pair_discussion;
    }
    else {
        questionText = question.text.self;
    }
    // Подготовить варианты ответов
    const options = question.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
    }));
    // Получить текущую оценку уровня (если уже достаточно ответов)
    const estimatedLevel = context.state.questionsAnswered > 0
        ? (0, adaptive_algorithm_1.getCurrentLevelDetection)(context.state).detectedLevel
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
function submitTestAnswer(sessionId, questionId, selectedOptionId, responseTimeMs) {
    const context = testSessions.get(sessionId);
    if (!context) {
        throw new Error(`Test session not found: ${sessionId}`);
    }
    // Найти вопрос
    const question = require('./questions-database').QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
        throw new Error(`Question not found: ${questionId}`);
    }
    // Найти выбранный вариант ответа
    const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) {
        throw new Error(`Option not found: ${selectedOptionId}`);
    }
    // Создать ответ
    const answer = {
        questionId,
        selectedOptionId,
        selectedLevel: selectedOption.level,
        responseTime: responseTimeMs,
        timestamp: Date.now(),
        mode: context.userProfile.testMode,
    };
    // Записать ответ
    (0, adaptive_algorithm_1.recordAnswer)(context.state, answer);
}
/**
 * Завершить тест и получить результаты
 */
function completeTestSession(sessionId) {
    const context = testSessions.get(sessionId);
    if (!context) {
        throw new Error(`Test session not found: ${sessionId}`);
    }
    // Завершить тест и получить финальный уровень
    const { finalLevel } = (0, adaptive_algorithm_1.completeTest)(context.state);
    // Провести валидацию
    const validationResult = (0, validation_engine_1.validateTestResults)(context.state.answers);
    // Рассчитать результаты
    const testResult = (0, score_calculation_1.calculateTestResult)(sessionId, context.state.answers, validationResult.metrics, context.userProfile.testMode, context.userProfile.relationshipStatus);
    // Добавить временные метаданные
    testResult.createdAt = context.startTime;
    testResult.updatedAt = Date.now();
    // Сохранить результаты
    completedResults.set(sessionId, testResult);
    // Интерпретировать результаты
    const interpretation = (0, results_interpreter_1.interpretResult)(testResult);
    return {
        result: testResult,
        interpretation,
    };
}
/**
 * Получить сохраненные результаты тестирования
 */
function getTestResult(sessionId) {
    return completedResults.get(sessionId) || null;
}
/**
 * Сравнить результаты двух тестирований (для пар)
 */
function compareTestResults(sessionIdA, sessionIdB) {
    const resultA = completedResults.get(sessionIdA);
    const resultB = completedResults.get(sessionIdB);
    if (!resultA || !resultB) {
        throw new Error('One or both test results not found');
    }
    // Рассчитать разницу и совместимость
    const gap = Math.abs(resultA.personalLevel - resultB.personalLevel);
    const compatibility = (0, score_calculation_1.calculateCompatibility)(resultA.personalLevel, resultB.personalLevel);
    // Сгенерировать рекомендации для пары
    const recommendations = [];
    if (gap >= 2) {
        recommendations.push('Рекомендуется работа с парным психологом или коучем для преодоления разницы в уровнях');
    }
    if (resultA.personalLevel <= 3 || resultB.personalLevel <= 3) {
        recommendations.push('Сосредоточьтесь на создании безопасности и стабильности в отношениях');
    }
    if (resultA.personalLevel >= 7 && resultB.personalLevel >= 7) {
        recommendations.push('Вы оба на психологически зрелом уровне - рассмотрите совместный проект служения');
    }
    const comparison = {
        personASessionId: sessionIdA,
        personBSessionId: sessionIdB,
        gap,
        compatibility,
        recommendations,
    };
    // Создать ComparisonResult для интерпретации
    const comparisonResult = {
        ...resultA,
        comparisonWith: resultB,
        gap,
        compatibility,
        recommendations,
    };
    const interpretation = (0, results_interpreter_1.interpretPairComparison)(comparisonResult);
    return {
        comparison,
        interpretation,
    };
}
/**
 * Получить статус текущей сессии
 */
function getSessionStatus(sessionId) {
    const context = testSessions.get(sessionId);
    if (!context) {
        throw new Error(`Test session not found: ${sessionId}`);
    }
    const isComplete = context.state.currentPhase === 'complete';
    const estimatedLevel = context.state.questionsAnswered > 0
        ? (0, adaptive_algorithm_1.getCurrentLevelDetection)(context.state).detectedLevel
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
function deleteTestSession(sessionId) {
    testSessions.delete(sessionId);
    completedResults.delete(sessionId);
}
/**
 * Получить все активные сессии (для отладки)
 */
function getAllActiveSessions() {
    return Array.from(testSessions.keys());
}
/**
 * Получить все завершенные результаты (для отладки)
 */
function getAllCompletedResults() {
    return new Map(completedResults);
}
// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================
/**
 * Валидировать параметры теста
 */
function validateTestParameters(testMode, relationshipStatus) {
    const validModes = ['self', 'partner_assessment', 'potential', 'pair_discussion'];
    if (!validModes.includes(testMode)) {
        throw new Error(`Invalid test mode: ${testMode}. Must be one of: ${validModes.join(', ')}`);
    }
    const validStatuses = [
        'in_relationship',
        'single_past',
        'single_potential',
        'pair_together',
    ];
    if (!validStatuses.includes(relationshipStatus)) {
        throw new Error(`Invalid relationship status: ${relationshipStatus}. Must be one of: ${validStatuses.join(', ')}`);
    }
}
