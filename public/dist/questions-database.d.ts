/**
 * БАЗА ДАННЫХ ВОПРОСОВ "ЛЕСТНИЦА СОЮЗА"
 * 34 вопроса для адаптивного определения уровня психологической зрелости
 *
 * Структура:
 * - Вопросы зонирования (6 вопросов) - быстрое определение приблизительной зоны (1-4, 5-8, 9-12)
 * - Вопросы уточнения (22 вопроса) - детальное определение конкретного уровня
 * - Вопросы валидации (6 вопросов) - обнаружение противоречий и духовного байпаса
 *
 * Каждый вопрос имеет варианты для 4 режимов:
 * - self: самооценка (для одиноких и для пар)
 * - partner_assessment: оценка партнера
 * - potential: оценка потенциала (для одиноких)
 * - pair_discussion: совместное обсуждение (для пар)
 */
import { SmartQuestion, UnionLevel } from './types';
export declare const QUESTIONS: SmartQuestion[];
/**
 * Получить вопрос по ID
 */
export declare function getQuestionById(id: string): SmartQuestion | undefined;
/**
 * Получить вопросы по категории
 */
export declare function getQuestionsByCategory(category: SmartQuestion['category']): SmartQuestion[];
/**
 * Получить вопросы по целевым уровням
 */
export declare function getQuestionsByTargetLevel(level: UnionLevel): SmartQuestion[];
/**
 * Получить вопросы валидации
 */
export declare function getValidationQuestions(): SmartQuestion[];
/**
 * Получить критичные вопросы (priority 1)
 */
export declare function getCriticalQuestions(): SmartQuestion[];
/**
 * Получить вопросы для фазы зонирования
 * (быстрое определение приблизительной зоны 1-4, 5-8 или 9-12)
 */
export declare function getZoningQuestions(): SmartQuestion[];
/**
 * Получить вопросы для фазы уточнения
 */
export declare function getRefinementQuestions(): SmartQuestion[];
