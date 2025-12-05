/**
 * БАЗА ДАННЫХ ВОПРОСОВ "ЛЕСТНИЦА СОЮЗА"
 * 
 * ОБНОВЛЕНИЕ 2025:
 * Переход на "Хирургическую замену" (Surgical Replacement).
 * Вместо 34 старых вопросов используется компактный набор из ~20 высокоточных вопросов.
 * 
 * Источник вопросов: src/questions-new-core.ts
 */

import { NEW_QUESTIONS } from './questions-new-core';
import { SmartQuestion } from './types';

export const QUESTIONS: SmartQuestion[] = NEW_QUESTIONS;

export function getQuestionById(id: string): SmartQuestion | undefined {
    return QUESTIONS.find(q => q.id === id);
}

export function getQuestionsByCategory(category: string): SmartQuestion[] {
    return QUESTIONS.filter(q => q.category === category);
}

export function getQuestionsByTargetLevel(level: number): SmartQuestion[] {
    return QUESTIONS.filter(q => q.targetLevels.includes(level));
}

export function getValidationQuestions(): SmartQuestion[] {
    return QUESTIONS.filter(q => q.isValidation);
}

export function getCriticalQuestions(): SmartQuestion[] {
    return QUESTIONS.filter(q => q.priority === 1);
}

export function getZoningQuestions(): SmartQuestion[] {
    return QUESTIONS.filter(q => q.id.startsWith('zone-'));
}

export function getRefinementQuestions(): SmartQuestion[] {
    return QUESTIONS.filter(q => q.id.startsWith('level-'));
}
