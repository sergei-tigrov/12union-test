/**
 * РАСЧЕТ ОЦЕНОК
 * "Лестница союза"
 *
 * Преобразование ответов тестирования в оценки личного уровня и уровня отношений
 * с применением валидационных коррекций
 */
import { UserAnswer, LevelScore, ValidationMetrics, TestResult } from './types';
/**
 * Рассчитать оценки уровней на основе ответов
 */
export declare function calculateLevelScores(answers: UserAnswer[]): {
    personalLevel: number;
    relationshipLevel: number;
    levelScores: LevelScore[];
};
/**
 * Применить коррекции валидации к результатам
 */
export declare function applyValidationAdjustments(personalLevel: number, relationshipLevel: number, validation: ValidationMetrics): {
    personalLevel: number;
    relationshipLevel: number;
};
/**
 * Рассчитать полные результаты теста
 */
export declare function calculateTestResult(sessionId: string, answers: UserAnswer[], validation: ValidationMetrics, testMode: any, relationshipStatus: any): TestResult;
/**
 * Рассчитать совместимость между двумя результатами
 */
export declare function calculateCompatibility(personalLevel1: number, personalLevel2: number): number;
/**
 * Рассчитать индекс надежности результата
 */
export declare function calculateReliabilityScore(validation: ValidationMetrics): number;
/**
 * Сгенерировать рекомендацию по надежности
 */
export declare function getReliabilityRecommendation(validation: ValidationMetrics): string[];
/**
 * Получить распределение вероятности уровней в процентах
 */
export declare function getLevelDistribution(levelScores: LevelScore[]): Record<number, number>;
