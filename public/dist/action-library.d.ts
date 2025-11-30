/**
 * БИБЛИОТЕКА ДЕЙСТВИЙ И РЕКОМЕНДАЦИЙ
 * "Лестница союза"
 *
 * Для каждого уровня - 3 критичных действия с конкретными шагами
 * Адаптированы для разных сценариев (одиночка, в отношениях, пара)
 */
import { ActionStep, ActionPlan, UnionLevel } from './types';
/**
 * Получить план действий для уровня
 */
export declare function getActionPlan(level: UnionLevel): ActionPlan;
/**
 * Получить все планы действий
 */
export declare function getAllActionPlans(): ActionPlan[];
/**
 * Получить конкретное действие по ID
 */
export declare function getActionById(level: UnionLevel, actionId: string): ActionStep | undefined;
