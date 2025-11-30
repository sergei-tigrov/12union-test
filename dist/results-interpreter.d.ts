/**
 * ИНТЕРПРЕТАЦИЯ РЕЗУЛЬТАТОВ
 * "Лестница союза"
 *
 * Генерирует понятные человеческие описания результатов тестирования
 * с учетом режима тестирования и валидации
 */
import { TestResult, ComparisonResult } from './types';
export interface ResultInterpretation {
    heroMessage: string;
    mainInsight: string;
    levelDescription: string;
    currentChallenge: string;
    growthPath: string;
    recommendations: string[];
    validationNotes?: string;
    nextLevel?: string;
}
export interface PairComparisonInterpretation {
    personAInterpretation: ResultInterpretation;
    personBInterpretation: ResultInterpretation;
    gapMessage: string;
    agreementPoints: string[];
    conflictPoints: string[];
    growthRecommendations: string[];
    compatibilityScore: number;
    compatibilityMessage: string;
}
/**
 * Интерпретировать результаты тестирования
 */
export declare function interpretResult(result: TestResult): ResultInterpretation;
/**
 * Интерпретировать результаты сравнения для пары
 */
export declare function interpretPairComparison(result: ComparisonResult): PairComparisonInterpretation;
