"use strict";
/**
 * ГЛАВНЫЙ ЭКСПОРТ
 * "Лестница союза"
 *
 * Публичный API для использования в приложениях
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCompletedResults = exports.getAllActiveSessions = exports.deleteTestSession = exports.getSessionStatus = exports.compareTestResults = exports.getTestResult = exports.completeTestSession = exports.submitTestAnswer = exports.getNextTestQuestion = exports.initializeTestSession = exports.interpretPairComparison = exports.interpretResult = exports.getLevelDistribution = exports.getReliabilityRecommendation = exports.calculateReliabilityScore = exports.calculateCompatibility = exports.calculateTestResult = exports.applyValidationAdjustments = exports.calculateLevelScores = exports.getActionById = exports.getAllActionPlans = exports.getActionPlan = exports.getReliabilityMessage = exports.validateTestResults = exports.completeTest = exports.getCurrentLevelDetection = exports.recordAnswer = exports.getNextQuestion = exports.initializeAdaptiveTest = exports.getRefinementQuestions = exports.getZoningQuestions = exports.getCriticalQuestions = exports.getValidationQuestions = exports.getQuestionsByTargetLevel = exports.getQuestionsByCategory = exports.getQuestionById = exports.QUESTIONS = exports.getLevelColor = exports.getLevelIcon = exports.getLevelName = exports.getLevelDefinition = void 0;
// Типы
__exportStar(require("./types"), exports);
// Определения уровней
var levels_definitions_1 = require("./levels-definitions");
Object.defineProperty(exports, "getLevelDefinition", { enumerable: true, get: function () { return levels_definitions_1.getLevelDefinition; } });
Object.defineProperty(exports, "getLevelName", { enumerable: true, get: function () { return levels_definitions_1.getLevelName; } });
Object.defineProperty(exports, "getLevelIcon", { enumerable: true, get: function () { return levels_definitions_1.getLevelIcon; } });
Object.defineProperty(exports, "getLevelColor", { enumerable: true, get: function () { return levels_definitions_1.getLevelColor; } });
// Вопросы
var questions_database_1 = require("./questions-database");
Object.defineProperty(exports, "QUESTIONS", { enumerable: true, get: function () { return questions_database_1.QUESTIONS; } });
Object.defineProperty(exports, "getQuestionById", { enumerable: true, get: function () { return questions_database_1.getQuestionById; } });
Object.defineProperty(exports, "getQuestionsByCategory", { enumerable: true, get: function () { return questions_database_1.getQuestionsByCategory; } });
Object.defineProperty(exports, "getQuestionsByTargetLevel", { enumerable: true, get: function () { return questions_database_1.getQuestionsByTargetLevel; } });
Object.defineProperty(exports, "getValidationQuestions", { enumerable: true, get: function () { return questions_database_1.getValidationQuestions; } });
Object.defineProperty(exports, "getCriticalQuestions", { enumerable: true, get: function () { return questions_database_1.getCriticalQuestions; } });
Object.defineProperty(exports, "getZoningQuestions", { enumerable: true, get: function () { return questions_database_1.getZoningQuestions; } });
Object.defineProperty(exports, "getRefinementQuestions", { enumerable: true, get: function () { return questions_database_1.getRefinementQuestions; } });
// Адаптивный алгоритм
var adaptive_algorithm_1 = require("./adaptive-algorithm");
Object.defineProperty(exports, "initializeAdaptiveTest", { enumerable: true, get: function () { return adaptive_algorithm_1.initializeAdaptiveTest; } });
Object.defineProperty(exports, "getNextQuestion", { enumerable: true, get: function () { return adaptive_algorithm_1.getNextQuestion; } });
Object.defineProperty(exports, "recordAnswer", { enumerable: true, get: function () { return adaptive_algorithm_1.recordAnswer; } });
Object.defineProperty(exports, "getCurrentLevelDetection", { enumerable: true, get: function () { return adaptive_algorithm_1.getCurrentLevelDetection; } });
Object.defineProperty(exports, "completeTest", { enumerable: true, get: function () { return adaptive_algorithm_1.completeTest; } });
// Валидация
var validation_engine_1 = require("./validation-engine");
Object.defineProperty(exports, "validateTestResults", { enumerable: true, get: function () { return validation_engine_1.validateTestResults; } });
Object.defineProperty(exports, "getReliabilityMessage", { enumerable: true, get: function () { return validation_engine_1.getReliabilityMessage; } });
// Действия
var action_library_1 = require("./action-library");
Object.defineProperty(exports, "getActionPlan", { enumerable: true, get: function () { return action_library_1.getActionPlan; } });
Object.defineProperty(exports, "getAllActionPlans", { enumerable: true, get: function () { return action_library_1.getAllActionPlans; } });
Object.defineProperty(exports, "getActionById", { enumerable: true, get: function () { return action_library_1.getActionById; } });
// Расчеты
var score_calculation_1 = require("./score-calculation");
Object.defineProperty(exports, "calculateLevelScores", { enumerable: true, get: function () { return score_calculation_1.calculateLevelScores; } });
Object.defineProperty(exports, "applyValidationAdjustments", { enumerable: true, get: function () { return score_calculation_1.applyValidationAdjustments; } });
Object.defineProperty(exports, "calculateTestResult", { enumerable: true, get: function () { return score_calculation_1.calculateTestResult; } });
Object.defineProperty(exports, "calculateCompatibility", { enumerable: true, get: function () { return score_calculation_1.calculateCompatibility; } });
Object.defineProperty(exports, "calculateReliabilityScore", { enumerable: true, get: function () { return score_calculation_1.calculateReliabilityScore; } });
Object.defineProperty(exports, "getReliabilityRecommendation", { enumerable: true, get: function () { return score_calculation_1.getReliabilityRecommendation; } });
Object.defineProperty(exports, "getLevelDistribution", { enumerable: true, get: function () { return score_calculation_1.getLevelDistribution; } });
// Интерпретация
var results_interpreter_1 = require("./results-interpreter");
Object.defineProperty(exports, "interpretResult", { enumerable: true, get: function () { return results_interpreter_1.interpretResult; } });
Object.defineProperty(exports, "interpretPairComparison", { enumerable: true, get: function () { return results_interpreter_1.interpretPairComparison; } });
// Оркестратор (главный API)
var test_orchestrator_1 = require("./test-orchestrator");
Object.defineProperty(exports, "initializeTestSession", { enumerable: true, get: function () { return test_orchestrator_1.initializeTestSession; } });
Object.defineProperty(exports, "getNextTestQuestion", { enumerable: true, get: function () { return test_orchestrator_1.getNextTestQuestion; } });
Object.defineProperty(exports, "submitTestAnswer", { enumerable: true, get: function () { return test_orchestrator_1.submitTestAnswer; } });
Object.defineProperty(exports, "completeTestSession", { enumerable: true, get: function () { return test_orchestrator_1.completeTestSession; } });
Object.defineProperty(exports, "getTestResult", { enumerable: true, get: function () { return test_orchestrator_1.getTestResult; } });
Object.defineProperty(exports, "compareTestResults", { enumerable: true, get: function () { return test_orchestrator_1.compareTestResults; } });
Object.defineProperty(exports, "getSessionStatus", { enumerable: true, get: function () { return test_orchestrator_1.getSessionStatus; } });
Object.defineProperty(exports, "deleteTestSession", { enumerable: true, get: function () { return test_orchestrator_1.deleteTestSession; } });
Object.defineProperty(exports, "getAllActiveSessions", { enumerable: true, get: function () { return test_orchestrator_1.getAllActiveSessions; } });
Object.defineProperty(exports, "getAllCompletedResults", { enumerable: true, get: function () { return test_orchestrator_1.getAllCompletedResults; } });
