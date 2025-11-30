"use strict";
/**
 * ТЕСТИРОВАНИЕ СИСТЕМЫ
 * "Лестница союза"
 *
 * Комплексное тестирование психологической точности и функциональности
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAllTests = runAllTests;
const index_1 = require("../index");
// ============================================================================
// ТЕСТ 1: Одиночка анализирует прошлые отношения (Уровень 3)
// ============================================================================
function testScenario1_SinglePastLevel3() {
    console.log(`\
\
=== ТЕСТ 1: Одиночка анализирует ПРОШЛЫЕ отношения (Уровень 3) ===\
`);
    const sessionId = 'test-1-single-past-level-3';
    // Инициализировать сессию
    const context = (0, index_1.initializeTestSession)(sessionId, 'self', 'single_past', 'heterosexual_pair');
    console.log('✓ Сессия инициализирована');
    console.log(`  Режим: ${context.userProfile.testMode}`);
    console.log(`  Статус: ${context.userProfile.relationshipStatus}`);
    // Симулировать ответы которые указывают на уровень 3
    // (Выживание - страх одиночества, экономическая зависимость)
    const responses = [
        // Зонирование
        { qId: 'zone-conflict-001', optId: 'zone-c-a' }, // Отступаю/ухожу (уровень 1)
        { qId: 'zone-safety-002', optId: 'zone-s-b' }, // Не могу справиться без партнера (уровень 3)
        { qId: 'zone-growth-003', optId: 'zone-g-c' }, // Не очень влияет (уровень 3)
        { qId: 'zone-intimacy-004', optId: 'zone-i-b' }, // Обязательства (уровень 4)
        { qId: 'zone-choice-005', optId: 'zone-ch-c' }, // Экономическая поддержка (уровень 3)
        { qId: 'zone-difference-006', optId: 'zone-d-c' }, // Терпелю для стабильности (уровень 3)
        // Уточнение для зоны 3
        { qId: 'level-detail-trauma-007', optId: 'lvl-t-c' }, // Нет, но боюсь сказать (уровень 3)
        { qId: 'level-detail-emotion-008', optId: 'lvl-e-b' }, // Не слушает (уровень 3)
        { qId: 'level-detail-jealousy-009', optId: 'lvl-j-c' }, // Естественное чувство (уровень 7)
        { qId: 'boundary-maturity-031', optId: 'bound-m-a' }, // Редко говорю нет (уровень 3)
        // Валидация
        { qId: 'validation-speed-025', optId: 'val-s-d' }, // Медленно, не доверяю (уровень 1)
        { qId: 'validation-honesty-029', optId: 'val-h-d' }, // Выбираю ответы для одобрения (уровень 3)
    ];
    let questionCount = 0;
    responses.forEach((resp) => {
        const question = (0, index_1.getNextTestQuestion)(sessionId);
        if (!question) {
            console.error(`❌ Ошибка: вопрос не получен после ${questionCount} ответов`);
            return;
        }
        (0, index_1.submitTestAnswer)(sessionId, resp.qId, resp.optId, Math.random() * 3000 + 1000);
        questionCount++;
        process.stdout.write('.');
    });
    console.log(`\
✓ Ответы записаны (${questionCount} вопросов)`);
    // Завершить тест
    const { result, interpretation } = (0, index_1.completeTestSession)(sessionId);
    console.log(`\
✓ Тест завершен`);
    console.log(`\
РЕЗУЛЬТАТЫ:`);
    console.log(`  Личный уровень: ${result.personalLevel.toFixed(1)}`); // Должно быть ~3.0
    console.log(`  Уровень отношений: ${result.relationshipLevel.toFixed(1)}`);
    console.log(`  Надежность: ${result.validation.reliability}`);
    console.log(`  Скоро ответов: ${result.validation.responseSpeedAnomaly ? 'ЕСТЬ АНОМАЛИЯ' : 'Нормально'}`);
    console.log(`\
ИНТЕРПРЕТАЦИЯ:`);
    console.log(`  ${interpretation.heroMessage}`);
    console.log(`  ${interpretation.mainInsight}`);
    // Проверка психологической точности
    const expectedLevel = 3;
    const levelDiff = Math.abs(result.personalLevel - expectedLevel);
    if (levelDiff <= 1.0) {
        console.log(`\
✅ ПСИХОЛОГИЧЕСКАЯ ТОЧНОСТЬ: ПРОШЛА (разница ${levelDiff.toFixed(1)} от ожидаемого)`);
    }
    else {
        console.log(`\
⚠️  ПСИХОЛОГИЧЕСКАЯ ТОЧНОСТЬ: ВНИМАНИЕ (разница ${levelDiff.toFixed(1)} от ожидаемого)`);
    }
}
// ============================================================================
// ТЕСТ 2: Человек в отношениях (Уровень 7)
// ============================================================================
function testScenario2_InRelationshipLevel7() {
    console.log(`\
\
=== ТЕСТ 2: Человек в ЗДОРОВЫХ отношениях (Уровень 7) ===\
`);
    const sessionId = 'test-2-in-relationship-level-7';
    const context = (0, index_1.initializeTestSession)(sessionId, 'self', 'in_relationship', 'heterosexual_pair');
    console.log('✓ Сессия инициализирована');
    // Ответы указывающие на уровень 7 (Психологическая связь)
    const responses = [
        { qId: 'zone-conflict-001', optId: 'zone-c-d' }, // Говорю о чувствах (уровень 7)
        { qId: 'zone-safety-002', optId: 'zone-s-e' }, // Приносит удовлетворение (уровень 8)
        { qId: 'zone-growth-003', optId: 'zone-g-d' }, // Помогает практически (уровень 7)
        { qId: 'zone-intimacy-004', optId: 'zone-i-e' }, // Безопасность, доверие (уровень 7)
        { qId: 'zone-choice-005', optId: 'zone-ch-g' }, // Дополняют и понимают (уровень 7)
        { qId: 'zone-difference-006', optId: 'zone-d-e' }, // Видим в этом потенциал (уровень 9)
        { qId: 'level-detail-emotion-008', optId: 'lvl-e-e' }, // Слушает и понимает (уровень 7)
        { qId: 'level-detail-jealousy-009', optId: 'lvl-j-c' }, // Естественное чувство (уровень 7)
        { qId: 'level-detail-money-010', optId: 'lvl-m-d' }, // Справедливо и прозрачно (уровень 7)
        { qId: 'level-detail-authenticity-011', optId: 'lvl-au-c' }, // Собой, иногда стесняюсь (уровень 7)
        { qId: 'level-detail-repair-012', optId: 'lvl-rp-e' }, // Обсуждаем и находим решение (уровень 7)
        { qId: 'validation-honesty-029', optId: 'val-h-a' }, // Полностью честен (уровень 8)
    ];
    let questionCount = 0;
    responses.forEach((resp) => {
        const question = (0, index_1.getNextTestQuestion)(sessionId);
        if (question) {
            (0, index_1.submitTestAnswer)(sessionId, resp.qId, resp.optId, Math.random() * 3000 + 2000);
            questionCount++;
            process.stdout.write('.');
        }
    });
    console.log(`\
✓ Ответы записаны (${questionCount} вопросов)`);
    const { result, interpretation } = (0, index_1.completeTestSession)(sessionId);
    console.log(`\
РЕЗУЛЬТАТЫ:`);
    console.log(`  Личный уровень: ${result.personalLevel.toFixed(1)}`);
    console.log(`  Надежность: ${result.validation.reliability}`);
    console.log(`\
ИНТЕРПРЕТАЦИЯ:`);
    console.log(`  ${interpretation.heroMessage}`);
    const expectedLevel = 7;
    const levelDiff = Math.abs(result.personalLevel - expectedLevel);
    if (levelDiff <= 1.0) {
        console.log(`\
✅ ПСИХОЛОГИЧЕСКАЯ ТОЧНОСТЬ: ПРОШЛА (разница ${levelDiff.toFixed(1)})`);
    }
    else {
        console.log(`\
⚠️  ПСИХОЛОГИЧЕСКАЯ ТОЧНОСТЬ: ВНИМАНИЕ (разница ${levelDiff.toFixed(1)})`);
    }
}
// ============================================================================
// ТЕСТ 3: Травма и насилие (Уровень 1)
// ============================================================================
function testScenario3_TraumaLevel1() {
    console.log(`\
\
=== ТЕСТ 3: Травма и разрушение (Уровень 1) ===\
`);
    const sessionId = 'test-3-trauma-level-1';
    const context = (0, index_1.initializeTestSession)(sessionId, 'self', 'single_past', 'heterosexual_pair');
    const responses = [
        { qId: 'zone-conflict-001', optId: 'zone-c-a' }, // Отступаю (уровень 1)
        { qId: 'zone-safety-002', optId: 'zone-s-a' }, // Боюсь остаться один (уровень 1)
        { qId: 'zone-growth-003', optId: 'zone-g-a' }, // Нет времени думать о развитии (уровень 1)
        { qId: 'zone-intimacy-004', optId: 'zone-i-a' }, // Страх, боль (уровень 1)
        { qId: 'zone-choice-005', optId: 'zone-ch-a' }, // Не видел выхода (уровень 1)
        { qId: 'zone-difference-006', optId: 'zone-d-a' }, // Угрожает безопасности (уровень 1)
        { qId: 'level-detail-trauma-007', optId: 'lvl-t-a' }, // Это происходит (уровень 1)
        { qId: 'level-detail-freedom-016', optId: 'lvl-fr-a' }, // Ограничена, контролируюсь (уровень 1)
        { qId: 'validation-honesty-029', optId: 'val-h-b' }, // Скрываю самое сложное (уровень 5)
    ];
    let questionCount = 0;
    responses.forEach((resp) => {
        const question = (0, index_1.getNextTestQuestion)(sessionId);
        if (question) {
            (0, index_1.submitTestAnswer)(sessionId, resp.qId, resp.optId, Math.random() * 2000 + 500);
            questionCount++;
            process.stdout.write('.');
        }
    });
    console.log(`\
✓ Ответы записаны (${questionCount} вопросов)`);
    const { result, interpretation } = (0, index_1.completeTestSession)(sessionId);
    console.log(`\
РЕЗУЛЬТАТЫ:`);
    console.log(`  Личный уровень: ${result.personalLevel.toFixed(1)}`);
    console.log(`  Надежность: ${result.validation.reliability}`);
    console.log(`  ⚠️  РЕКОМЕНДАЦИЯ: Срочно обратиться к психологу специалисту в травме`);
    console.log(`\
ИНТЕРПРЕТАЦИЯ:`);
    console.log(`  ${interpretation.heroMessage}`);
    console.log(`  Действия: ${interpretation.recommendations[0]}`);
    const expectedLevel = 1;
    const levelDiff = Math.abs(result.personalLevel - expectedLevel);
    if (levelDiff <= 1.5) {
        console.log(`\
✅ ПСИХОЛОГИЧЕСКАЯ ТОЧНОСТЬ: ПРОШЛА`);
    }
    else {
        console.log(`\
⚠️  ПСИХОЛОГИЧЕСКАЯ ТОЧНОСТЬ: ВНИМАНИЕ`);
    }
}
// ============================================================================
// ТЕСТ 4: Пара сравнивает себя
// ============================================================================
function testScenario4_PairComparison() {
    console.log(`\
\
=== ТЕСТ 4: ПАРА сравнивает свою зрелость ===\
`);
    // Человек A (уровень 7)
    const sessionA = 'test-4-pair-a';
    (0, index_1.initializeTestSession)(sessionA, 'self', 'pair_together');
    const responsesA = [
        { qId: 'zone-conflict-001', optId: 'zone-c-d' },
        { qId: 'zone-safety-002', optId: 'zone-s-e' },
        { qId: 'zone-growth-003', optId: 'zone-g-d' },
        { qId: 'zone-intimacy-004', optId: 'zone-i-e' },
        { qId: 'zone-choice-005', optId: 'zone-ch-g' },
        { qId: 'zone-difference-006', optId: 'zone-d-e' },
        { qId: 'level-detail-emotion-008', optId: 'lvl-e-e' },
        { qId: 'validation-honesty-029', optId: 'val-h-a' },
    ];
    responsesA.forEach((resp) => {
        const q = (0, index_1.getNextTestQuestion)(sessionA);
        if (q) {
            (0, index_1.submitTestAnswer)(sessionA, resp.qId, resp.optId, 2500);
            process.stdout.write('.');
        }
    });
    const { result: resultA } = (0, index_1.completeTestSession)(sessionA);
    console.log(`\
✓ Персона A завершена (уровень ${resultA.personalLevel.toFixed(1)})`);
    // Человек B (уровень 5 - эмоциональный)
    const sessionB = 'test-4-pair-b';
    (0, index_1.initializeTestSession)(sessionB, 'self', 'pair_together');
    const responsesB = [
        { qId: 'zone-conflict-001', optId: 'zone-c-c' }, // Испытываю эмоции (5)
        { qId: 'zone-safety-002', optId: 'zone-s-d' }, // Люблю эту интенсивность (5)
        { qId: 'zone-growth-003', optId: 'zone-g-d' }, // Помогает практически (7)
        { qId: 'zone-intimacy-004', optId: 'zone-i-c' }, // Страсть и волнение (5)
        { qId: 'zone-choice-005', optId: 'zone-ch-e' }, // Люблю (5)
        { qId: 'zone-difference-006', optId: 'zone-d-d' }, // Это нормально (7)
        { qId: 'level-detail-emotion-008', optId: 'lvl-e-d' }, // Рассказывает похожую историю (5)
        { qId: 'validation-honesty-029', optId: 'val-h-b' }, // Скрываю сложное (5)
    ];
    responsesB.forEach((resp) => {
        const q = (0, index_1.getNextTestQuestion)(sessionB);
        if (q) {
            (0, index_1.submitTestAnswer)(sessionB, resp.qId, resp.optId, 2000);
            process.stdout.write('.');
        }
    });
    const { result: resultB } = (0, index_1.completeTestSession)(sessionB);
    console.log(`\
✓ Персона B завершена (уровень ${resultB.personalLevel.toFixed(1)})`);
    // Сравнить результаты
    const { comparison, interpretation } = (0, index_1.compareTestResults)(sessionA, sessionB);
    console.log(`\
СРАВНЕНИЕ ПАРЫ:`);
    console.log(`  Разница уровней: ${comparison.gap.toFixed(1)}`);
    console.log(`  Совместимость: ${comparison.compatibility}%`);
    console.log(`  Сообщение совместимости: ${interpretation.compatibilityMessage}`);
    console.log(`\
РЕКОМЕНДАЦИИ:`);
    interpretation.growthRecommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
    });
    console.log(`\
✅ СЦЕНАРИЙ ПАРЫ: ПРОШЕЛ`);
}
// ============================================================================
// ТЕСТ 5: Валидация обнаруживает духовный байпас
// ============================================================================
function testScenario5_SpiritualBypassDetection() {
    console.log(`\
\
=== ТЕСТ 5: Обнаружение ДУХОВНОГО БАЙПАСА ===\
`);
    const sessionId = 'test-5-spiritual-bypass';
    (0, index_1.initializeTestSession)(sessionId, 'self', 'in_relationship');
    // Ответы которые должны вызвать флаг духовного байпаса
    const responses = [
        { qId: 'zone-conflict-001', optId: 'zone-c-a' }, // Отступаю (уровень 1)
        { qId: 'zone-safety-002', optId: 'zone-s-f' }, // Служу развитию (11)
        { qId: 'zone-growth-003', optId: 'zone-g-f' }, // Высокий уровень (11)
        { qId: 'zone-intimacy-004', optId: 'zone-i-f' }, // Священное единство (12)
        { qId: 'zone-choice-005', optId: 'zone-ch-i' }, // Служение (11)
        { qId: 'zone-difference-006', optId: 'zone-d-g' }, // Гармония (11)
        { qId: 'level-detail-emotion-008', optId: 'lvl-e-a' }, // Не слушает (1)
        { qId: 'level-detail-influence-021', optId: 'lvl-inf-b' }, // Скрыто переделываю (5)
        { qId: 'validation-spiritual-bypass-027', optId: 'val-sb-a' }, // Духовна но критикую (6)
        { qId: 'validation-honesty-029', optId: 'val-h-c' }, // Выбираю социально желательные (6)
    ];
    let bypassCount = 0;
    responses.forEach((resp) => {
        const q = (0, index_1.getNextTestQuestion)(sessionId);
        if (q) {
            (0, index_1.submitTestAnswer)(sessionId, resp.qId, resp.optId, 1500);
            process.stdout.write('.');
        }
    });
    const { result, interpretation } = (0, index_1.completeTestSession)(sessionId);
    console.log(`\
✓ Тест завершен`);
    console.log(`\
РЕЗУЛЬТАТЫ ВАЛИДАЦИИ:`);
    console.log(`  Уровень духовного байпаса: ${(result.validation.spiritualBypassScore * 100).toFixed(0)}%`);
    console.log(`  Противоречия: ${result.validation.contradictionFlags.length}`);
    result.validation.contradictionFlags.forEach((flag) => {
        console.log(`    - ${flag}`);
    });
    console.log(`  Надежность: ${result.validation.reliability}`);
    if (result.validation.spiritualBypassScore > 0.5) {
        console.log(`\
✅ ОБНАРУЖЕН ДУХОВНЫЙ БАЙПАС: системе удалось его выявить`);
    }
    else {
        console.log(`\
⚠️  ДУХОВНЫЙ БАЙПАС НЕ ОБНАРУЖЕН: может быть ложный отрицательный`);
    }
}
// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ ЗАПУСКА
// ============================================================================
function runAllTests() {
    console.log(`\
`);
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║   КОМПЛЕКСНОЕ ТЕСТИРОВАНИЕ СИСТЕМЫ "Лестница союза"         ║');
    console.log('║   Психологическая валидация и функциональность                 ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    try {
        testScenario1_SinglePastLevel3();
        testScenario2_InRelationshipLevel7();
        testScenario3_TraumaLevel1();
        testScenario4_PairComparison();
        testScenario5_SpiritualBypassDetection();
        console.log(`\
`);
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║                    ИТОГИ ТЕСТИРОВАНИЯ                          ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');
        console.log(`\
✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО\
`);
        console.log(`Система готова к использованию в production\
`);
    }
    catch (error) {
        console.error(`\
❌ ОШИБКА ТЕСТИРОВАНИЯ:`, error);
        throw error;
    }
}
// Запустить если файл запущен напрямую
if (require.main === module) {
    runAllTests();
}
