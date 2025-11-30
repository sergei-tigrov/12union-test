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
export interface LevelDetection {
    detectedLevel: number;
    confidence: number;
    zone: 'low' | 'middle' | 'high';
    levelScoreDistribution: Map<UnionLevel, number>;
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
    questionsAsked: Set<string>;
    levelScores: Map<UnionLevel, number>;
    testStartTime: number;
}
/**
 * Начать адаптивный тест
 */
export declare function initializeAdaptiveTest(sessionId: string): AdaptiveTestState;
/**
 * Получить следующий вопрос для пользователя
 */
export declare function getNextQuestion(state: AdaptiveTestState): QuestionSelection | null;
/**
 * Записать ответ пользователя
 */
export declare function recordAnswer(state: AdaptiveTestState, answer: UserAnswer): void;
/**
 * Получить текущую оценку уровня
 */
export declare function getCurrentLevelDetection(state: AdaptiveTestState): LevelDetection;
/**
 * Завершить тест и получить финальный результат
 */
export declare function completeTest(state: AdaptiveTestState): {
    finalLevel: LevelDetection;
    totalQuestionsAnswered: number;
    totalTimeMs: number;
};
