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
import { TestMode, RelationshipStatus, RelationshipType, UserProfile, TestResult } from './types';
import { AdaptiveTestState } from './adaptive-algorithm';
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
/**
 * Инициировать новую сессию тестирования
 */
export declare function initializeTestSession(sessionId: string, testMode: TestMode, relationshipStatus: RelationshipStatus, relationshipType?: RelationshipType): TestSessionContext;
/**
 * Получить следующий вопрос для пользователя
 */
export declare function getNextTestQuestion(sessionId: string): TestQuestionPresentation | null;
/**
 * Записать ответ пользователя
 */
export declare function submitTestAnswer(sessionId: string, questionId: string, selectedOptionId: string, responseTimeMs: number): void;
/**
 * Завершить тест и получить результаты
 */
export declare function completeTestSession(sessionId: string): {
    result: TestResult;
    interpretation: any;
};
/**
 * Получить сохраненные результаты тестирования
 */
export declare function getTestResult(sessionId: string): TestResult | null;
/**
 * Сравнить результаты двух тестирований (для пар)
 */
export declare function compareTestResults(sessionIdA: string, sessionIdB: string): {
    comparison: PartnerComparison;
    interpretation: any;
};
/**
 * Получить статус текущей сессии
 */
export declare function getSessionStatus(sessionId: string): {
    currentPhase: string;
    questionsAnswered: number;
    estimatedLevel?: number;
    isComplete: boolean;
};
/**
 * Удалить сессию (для очистки памяти)
 */
export declare function deleteTestSession(sessionId: string): void;
/**
 * Получить все активные сессии (для отладки)
 */
export declare function getAllActiveSessions(): string[];
/**
 * Получить все завершенные результаты (для отладки)
 */
export declare function getAllCompletedResults(): Map<string, TestResult>;
