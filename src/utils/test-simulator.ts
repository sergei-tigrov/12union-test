// Утилита для симуляции тестовых ответов в браузере
// Использование: вставить в консоль браузера на странице теста

/**
 * Симулирует ответы пользователя на тесте
 * @param levels - массив уровней для ответов (например: [2, 5, 7, 10, 11])
 */
function simulateTestAnswers(levels: number[]) {
    console.log(`%c🧪 СИМУЛЯЦИЯ ТЕСТА`, 'font-size: 16px; font-weight: bold; color: #3b82f6');
    console.log(`Уровни ответов: [${levels.join(', ')}]`);

    const results = {
        levels: levels,
        timestamp: new Date().toISOString(),
        expectedBaseLevel: calculateMedian(levels),
        expectedPattern: detectPattern(levels)
    };

    console.table(results);

    return results;
}

function calculateMedian(arr: number[]): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

function detectPattern(levels: number[]): string {
    const min = Math.min(...levels);
    const max = Math.max(...levels);
    const range = max - min;

    if (levels.length < 3) return 'insufficient_data';
    if (range === 0) return 'stuck';
    if (range > 6 && min <= 3 && max >= 9) return 'spiritual_bypass';
    if (range > 3) return 'gap';
    return 'harmonious';
}

// ============================================================================
// ТЕСТОВЫЕ СЦЕНАРИИ
// ============================================================================

console.log(`%c📋 ДОСТУПНЫЕ ТЕСТОВЫЕ СЦЕНАРИИ`, 'font-size: 14px; font-weight: bold; color: #10b981');

const scenarios = {
    scenario1_mixed: () => simulateTestAnswers([2, 5, 7, 10, 11]),
    scenario2_spiritual_bypass: () => simulateTestAnswers([1, 2, 10, 11, 12]),
    scenario3_harmonious: () => simulateTestAnswers([5, 6, 7, 8, 9]),
    scenario4_low: () => simulateTestAnswers([1, 2, 3]),
    scenario5_high_gaps: () => simulateTestAnswers([7, 8, 10, 11]),
    scenario6_stuck: () => simulateTestAnswers([5, 5, 5, 5]),
    scenario7_extremes: () => simulateTestAnswers([1, 12]),
    scenario8_medium_gaps: () => simulateTestAnswers([4, 5, 7, 8]),
    scenario9_all_levels: () => simulateTestAnswers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    scenario10_threshold: () => simulateTestAnswers([3, 3, 4, 4, 5, 5, 6, 6]),
};

console.log('Используйте: scenarios.scenario1_mixed() и т.д.');
console.log('Доступные сценарии:', Object.keys(scenarios));

// Экспорт в глобальную область видимости
/* eslint-disable @typescript-eslint/no-explicit-any */
(window as any).testScenarios = scenarios;
(window as any).simulateTest = simulateTestAnswers;
/* eslint-enable @typescript-eslint/no-explicit-any */

console.log(`%c✅ Утилита загружена!`, 'font-size: 14px; color: #10b981');
console.log('Используйте: \n - window.testScenarios.scenario1_mixed()\n - window.simulateTest([2, 5, 7])');
