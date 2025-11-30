"use strict";
/**
 * РАСЧЕТ ОЦЕНОК
 * "Лестница союза"
 *
 * Преобразование ответов тестирования в оценки личного уровня и уровня отношений
 * с применением валидационных коррекций
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLevelScores = calculateLevelScores;
exports.applyValidationAdjustments = applyValidationAdjustments;
exports.calculateTestResult = calculateTestResult;
exports.calculateCompatibility = calculateCompatibility;
exports.calculateReliabilityScore = calculateReliabilityScore;
exports.getReliabilityRecommendation = getReliabilityRecommendation;
exports.getLevelDistribution = getLevelDistribution;
const questions_database_1 = require("./questions-database");
// ============================================================================
// КОНСТАНТЫ
// ============================================================================
// Вес для каждого типа вопроса
const QUESTION_WEIGHT = {
    'zone-conflict-001': 2.0, // Зонирование - высокий вес
    'zone-safety-002': 2.0,
    'zone-growth-003': 1.8,
    'zone-intimacy-004': 2.0,
    'zone-choice-005': 2.0,
    'zone-difference-006': 1.8,
};
// ============================================================================
// ОСНОВНЫЕ ФУНКЦИИ РАСЧЕТА
// ============================================================================
/**
 * Рассчитать оценки уровней на основе ответов
 */
function calculateLevelScores(answers) {
    // Инициализировать счетчики для каждого уровня
    const levelCounts = new Map();
    for (let level = 1; level <= 12; level++) {
        levelCounts.set(level, { sum: 0, weight: 0, count: 0 });
    }
    // Обработать каждый ответ
    answers.forEach((answer) => {
        const question = questions_database_1.QUESTIONS.find((q) => q.id === answer.questionId);
        if (!question)
            return;
        // Определить вес вопроса
        const questionWeight = QUESTION_WEIGHT[question.id] || (question.priority === 1 ? 1.5 : 1.0);
        // Выбранный уровень
        const selectedLevel = answer.selectedLevel;
        // Добавить в счет для выбранного уровня
        const current = levelCounts.get(selectedLevel);
        current.sum += selectedLevel * questionWeight;
        current.weight += questionWeight;
        current.count++;
        // Также добавить вклад в соседние уровни с убывающим весом
        // Это представляет неопределенность
        for (let level = 1; level <= 12; level++) {
            if (level === selectedLevel)
                continue;
            const distance = Math.abs(level - selectedLevel);
            const neighborWeight = Math.max(0, 1 - distance / 12) * questionWeight * 0.5;
            if (neighborWeight > 0) {
                const neighbor = levelCounts.get(level);
                neighbor.sum += level * neighborWeight;
                neighbor.weight += neighborWeight;
            }
        }
    });
    // Рассчитать средний уровень для каждого уровня
    const levelScores = [];
    let maxScore = 0;
    let topLevel = 6;
    // Рассчитать средние оценки
    const levelAverages = new Map();
    levelCounts.forEach((data, level) => {
        if (data.weight > 0) {
            const avg = data.sum / data.weight;
            levelAverages.set(level, avg);
        }
    });
    // Найти максимум для нормализации
    const maxAverage = Math.max(...Array.from(levelAverages.values()));
    // Создать LevelScore с процентами и уверенностью
    for (let level = 1; level <= 12; level++) {
        const avg = levelAverages.get(level) || 0;
        const percentage = maxAverage > 0 ? (avg / maxAverage) * 100 : 0;
        // Уверенность зависит от количества ответов
        const count = levelCounts.get(level).count;
        const confidence = Math.min(1, count / (answers.length * 0.3));
        levelScores.push({
            level,
            percentage: Math.round(percentage),
            confidence,
        });
        if (percentage > maxScore) {
            maxScore = percentage;
            topLevel = level;
        }
    }
    // Рассчитать плавающий личный уровень (1-12 с точностью 0.1)
    let personalLevel = calculateFloatingLevel(levelAverages);
    // Уровень отношений обычно рассчитывается как личный уровень
    // (в реальной системе это может быть отдельный расчет)
    let relationshipLevel = personalLevel;
    // Если это оценка партнера, это может быть интерпретировано иначе
    // Но здесь мы используем ту же логику
    return {
        personalLevel: Math.round(personalLevel * 10) / 10,
        relationshipLevel: Math.round(relationshipLevel * 10) / 10,
        levelScores,
    };
}
/**
 * Рассчитать плавающий уровень (1-12 с точностью 0.1)
 * На основе взвешенного среднего
 */
function calculateFloatingLevel(levelAverages) {
    let totalScore = 0;
    let totalWeight = 0;
    levelAverages.forEach((avg, level) => {
        totalScore += level * avg;
        totalWeight += avg;
    });
    if (totalWeight === 0) {
        return 6; // Центральное значение по умолчанию
    }
    const floatingLevel = totalScore / totalWeight;
    // Убедиться что уровень в пределах 1-12
    return Math.max(1, Math.min(12, floatingLevel));
}
/**
 * Применить коррекции валидации к результатам
 */
function applyValidationAdjustments(personalLevel, relationshipLevel, validation) {
    let adjustedPersonal = personalLevel;
    let adjustedRelationship = relationshipLevel;
    // Коррекция на основе социальной желательности
    // Если высокий социальный имидж, немного снизить оценку
    if (validation.socialDesirabilityScore > 0.6) {
        // Сдвинуть на 0.5-1.0 вниз
        const adjustment = (validation.socialDesirabilityScore - 0.6) * 2;
        adjustedPersonal = Math.max(1, adjustedPersonal - adjustment);
        adjustedRelationship = Math.max(1, adjustedRelationship - adjustment);
    }
    // Коррекция на основе противоречий
    // Каждое противоречие снижает уровень на 0.2
    if (validation.contradictionFlags.length > 0) {
        const adjustment = validation.contradictionFlags.length * 0.2;
        adjustedPersonal = Math.max(1, adjustedPersonal - adjustment);
    }
    // Коррекция на основе духовного байпаса
    // Если есть духовный байпас, снизить высокие уровни
    if (validation.spiritualBypassScore > 0.6) {
        if (adjustedPersonal >= 10) {
            const adjustment = (validation.spiritualBypassScore - 0.6) * 3;
            adjustedPersonal = Math.max(8, adjustedPersonal - adjustment);
        }
    }
    // Коррекция на основе когерентности
    // Низкая когерентность означает нестабильность
    if (validation.coherenceScore < 40) {
        // Снизить уровень и добавить неопределенность
        adjustedPersonal = Math.max(1, adjustedPersonal - 1);
    }
    // Убедиться что уровни в пределах 1-12
    adjustedPersonal = Math.max(1, Math.min(12, adjustedPersonal));
    adjustedRelationship = Math.max(1, Math.min(12, adjustedRelationship));
    return { personalLevel: adjustedPersonal, relationshipLevel: adjustedRelationship };
}
// ============================================================================
// ПУБЛИЧНЫЙ API
// ============================================================================
/**
 * Рассчитать полные результаты теста
 */
function calculateTestResult(sessionId, answers, validation, testMode, relationshipStatus) {
    // Рассчитать базовые оценки
    const { personalLevel, relationshipLevel, levelScores } = calculateLevelScores(answers);
    // Применить коррекции валидации
    const { personalLevel: adjustedPersonal, relationshipLevel: adjustedRelationship } = applyValidationAdjustments(personalLevel, relationshipLevel, validation);
    // Рассчитать время выполнения
    const completionTime = answers.length > 0
        ? answers[answers.length - 1].timestamp - answers[0].timestamp
        : 0;
    const now = Date.now();
    return {
        sessionId,
        testMode,
        relationshipStatus,
        personalLevel: adjustedPersonal,
        relationshipLevel: adjustedRelationship,
        levelScores,
        validation,
        answers,
        totalQuestions: answers.length,
        completionTime,
        createdAt: now,
        updatedAt: now,
    };
}
/**
 * Рассчитать совместимость между двумя результатами
 */
function calculateCompatibility(personalLevel1, personalLevel2) {
    const gap = Math.abs(personalLevel1 - personalLevel2);
    // Совместимость снижается с расстоянием
    let compatibility = 100 - gap * 10;
    // Бонус если оба на зрелом уровне (7+)
    if (personalLevel1 >= 7 && personalLevel2 >= 7) {
        compatibility = Math.min(100, compatibility + 15);
    }
    // Штраф если оба на низком уровне (3 и ниже)
    if (personalLevel1 <= 3 && personalLevel2 <= 3) {
        compatibility = Math.max(0, compatibility - 20);
    }
    // Штраф если есть экстремальная разница
    if (gap >= 4) {
        compatibility = Math.max(0, compatibility - 10);
    }
    return Math.max(0, Math.min(100, compatibility));
}
/**
 * Рассчитать индекс надежности результата
 */
function calculateReliabilityScore(validation) {
    let score = 100;
    // Снизить за социальную желательность
    score -= validation.socialDesirabilityScore * 30;
    // Снизить за противоречия
    score -= validation.contradictionFlags.length * 10;
    // Снизить за духовный байпас
    score -= validation.spiritualBypassScore * 20;
    // Учесть когерентность
    score -= (100 - validation.coherenceScore) * 0.3;
    // Убедиться что в пределах 0-100
    return Math.max(0, Math.min(100, score));
}
/**
 * Сгенерировать рекомендацию по надежности
 */
function getReliabilityRecommendation(validation) {
    const recommendations = [];
    if (validation.socialDesirabilityScore > 0.6) {
        recommendations.push('Старайтесь быть честнее в следующих ответах - социальный имидж может искажать результаты');
    }
    if (validation.contradictionFlags.includes('conditional-love')) {
        recommendations.push('Обратите внимание на противоречие между заявленной любовью и попытками контролировать партнера');
    }
    if (validation.contradictionFlags.includes('spiritual-bypass')) {
        recommendations.push('Проверьте не используете ли вы духовность чтобы избежать реальной работы над отношениями');
    }
    if (validation.coherenceScore < 50) {
        recommendations.push('Ваши ответы не очень согласованны - возможно, ваше поведение зависит от ситуации больше чем от убеждений');
    }
    if (validation.spiritualBypassScore > 0.5) {
        recommendations.push('Будьте осторожны с духовным байпасом - высокие идеалы должны быть подкреплены практикой');
    }
    return recommendations;
}
/**
 * Получить распределение вероятности уровней в процентах
 */
function getLevelDistribution(levelScores) {
    const distribution = {};
    levelScores.forEach((score) => {
        distribution[score.level] = score.percentage;
    });
    return distribution;
}
