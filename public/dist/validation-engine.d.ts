/**
 * ДВИГАТЕЛЬ ВАЛИДАЦИИ РЕЗУЛЬТАТОВ
 * "Лестница союза"
 *
 * 4-уровневая система проверки достоверности:
 * 1. Анализ скорости ответов - быстрые ответы на чувствительные вопросы
 * 2. Обнаружение противоречий - несоответствия между похожими вопросами
 * 3. Оценка когерентности - внутренняя логическая последовательность
 * 4. Обнаружение духовного байпаса - высокие уровни без практической основы
 */
import { UserAnswer, ValidationMetrics } from './types';
export interface ValidationResult {
    metrics: ValidationMetrics;
    warnings: ValidationWarning[];
    isReliable: boolean;
    recommendations: string[];
}
export interface ValidationWarning {
    type: 'speed' | 'contradiction' | 'incoherence' | 'spiritual-bypass' | 'pattern';
    severity: 'low' | 'medium' | 'high';
    message: string;
    questionIds?: string[];
}
/**
 * Провести полную валидацию результатов тестирования
 */
export declare function validateTestResults(answers: UserAnswer[]): ValidationResult;
/**
 * Получить краткую оценку надежности
 */
export declare function getReliabilityMessage(metrics: ValidationMetrics): string;
