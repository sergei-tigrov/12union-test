/**
 * АНАЛИЗАТОР ТЕСТОВЫХ СЦЕНАРИЕВ
 *
 * Цель: Понять почему невозможно получить уровень выше 10
 * даже при самых высоких ответах.
 */

import { NEW_QUESTIONS } from '../src/questions-new-core';
import { diagnoseUser } from '../src/diagnostic-engine';
import { SmartQuestion, UserAnswer } from '../src/types';

// ============================================================================
// АНАЛИЗ СТРУКТУРЫ ВОПРОСОВ
// ============================================================================

function analyzeQuestionStructure() {
    console.log('\n========================================');
    console.log('АНАЛИЗ СТРУКТУРЫ ВОПРОСОВ');
    console.log('========================================\n');

    // 1. Подсчёт вопросов по фазам
    const zoningQ = NEW_QUESTIONS.filter(q => q.id.startsWith('zone-'));
    const refinementQ = NEW_QUESTIONS.filter(q => q.id.startsWith('level-'));
    const validationQ = NEW_QUESTIONS.filter(q => q.isValidation);

    console.log(`📊 Всего вопросов: ${NEW_QUESTIONS.length}`);
    console.log(`   - Зонирование: ${zoningQ.length}`);
    console.log(`   - Уточнение: ${refinementQ.length}`);
    console.log(`   - Валидация: ${validationQ.length}`);

    // 2. Анализ targetLevels для high зоны
    console.log('\n📋 Вопросы уточнения для HIGH зоны (9-12):');
    const highZoneTargets = [9, 10, 11, 12];

    refinementQ.forEach(q => {
        const overlaps = q.targetLevels.filter(l => highZoneTargets.includes(l));
        if (overlaps.length > 0) {
            console.log(`   ${q.id}:`);
            console.log(`      targetLevels: [${q.targetLevels.join(', ')}]`);
            console.log(`      варианты ответов:`);
            q.options.forEach(opt => {
                console.log(`         - level ${opt.level}: ${opt.id}`);
            });
        }
    });

    // 3. Подсчёт вариантов ответов по уровням
    console.log('\n📈 Распределение вариантов ответов по уровням:');
    const levelCounts: Record<number, number> = {};
    for (let i = 0; i <= 12; i++) levelCounts[i] = 0;

    NEW_QUESTIONS.forEach(q => {
        q.options.forEach(opt => {
            levelCounts[opt.level] = (levelCounts[opt.level] || 0) + 1;
        });
    });

    for (let i = 1; i <= 12; i++) {
        const bar = '█'.repeat(levelCounts[i]);
        console.log(`   Уровень ${i.toString().padStart(2)}: ${levelCounts[i].toString().padStart(2)} ${bar}`);
    }
    console.log(`   Уровень  0: ${levelCounts[0]} (фейковые/валидация)`);

    // 4. Критический анализ: сколько УНИКАЛЬНЫХ путей к 11-12
    console.log('\n🎯 КРИТИЧЕСКИЙ АНАЛИЗ: Пути к уровням 11-12');

    const level11Options = NEW_QUESTIONS.flatMap(q =>
        q.options.filter(opt => opt.level === 11).map(opt => ({ question: q.id, option: opt.id }))
    );
    const level12Options = NEW_QUESTIONS.flatMap(q =>
        q.options.filter(opt => opt.level === 12).map(opt => ({ question: q.id, option: opt.id }))
    );

    console.log(`   Вариантов для уровня 11: ${level11Options.length}`);
    level11Options.forEach(o => console.log(`      - ${o.question} → ${o.option}`));

    console.log(`   Вариантов для уровня 12: ${level12Options.length}`);
    level12Options.forEach(o => console.log(`      - ${o.question} → ${o.option}`));
}

// ============================================================================
// СИМУЛЯЦИЯ СЦЕНАРИЕВ
// ============================================================================

type AnswerStrategy = 'highest' | 'level-12-only' | 'mixed-high' | 'realistic-mature';

function simulateTest(strategy: AnswerStrategy): { answers: UserAnswer[], description: string } {
    const answers: UserAnswer[] = [];
    const questionsMap = new Map<string, SmartQuestion>();
    NEW_QUESTIONS.forEach(q => questionsMap.set(q.id, q));

    const description = {
        'highest': 'Всегда выбирать самый высокий уровень',
        'level-12-only': 'Выбирать только варианты уровня 12 (где возможно)',
        'mixed-high': 'Выбирать уровни 9-12 (где возможно)',
        'realistic-mature': 'Реалистичная зрелая женщина: преимущественно 9-11, иногда 12'
    }[strategy];

    NEW_QUESTIONS.forEach((q, idx) => {
        let selectedOption;

        switch (strategy) {
            case 'highest':
                // Выбрать вариант с максимальным уровнем (исключая 0)
                selectedOption = q.options
                    .filter(opt => opt.level > 0)
                    .sort((a, b) => b.level - a.level)[0];
                break;

            case 'level-12-only':
                // Выбрать уровень 12 если есть, иначе максимальный
                selectedOption = q.options.find(opt => opt.level === 12)
                    || q.options.filter(opt => opt.level > 0).sort((a, b) => b.level - a.level)[0];
                break;

            case 'mixed-high':
                // Выбрать уровень 9-12 случайно из доступных
                const highOptions = q.options.filter(opt => opt.level >= 9);
                selectedOption = highOptions.length > 0
                    ? highOptions[Math.floor(Math.random() * highOptions.length)]
                    : q.options.filter(opt => opt.level > 0).sort((a, b) => b.level - a.level)[0];
                break;

            case 'realistic-mature':
                // Реалистичная зрелая женщина:
                // - В базовых вопросах (1-4): отвечает на 7-9 (база проработана)
                // - В средних (5-8): отвечает на 8-10
                // - В высоких (9-12): отвечает на 10-12
                // - В валидации: честно (не fake)
                if (q.isValidation) {
                    // Честный ответ (не level 0)
                    selectedOption = q.options.find(opt => opt.level > 0);
                } else {
                    // Предпочтение высоким уровням, но реалистично
                    const realOptions = q.options.filter(opt => opt.level > 0);
                    const highOpts = realOptions.filter(opt => opt.level >= 9);
                    const midHighOpts = realOptions.filter(opt => opt.level >= 7 && opt.level <= 10);

                    // 60% шанс на 9+, 30% на 7-10, 10% на максимум
                    const rand = Math.random();
                    if (rand < 0.1 && highOpts.some(o => o.level >= 11)) {
                        selectedOption = highOpts.filter(o => o.level >= 11)[0];
                    } else if (rand < 0.7 && highOpts.length > 0) {
                        selectedOption = highOpts[Math.floor(Math.random() * highOpts.length)];
                    } else if (midHighOpts.length > 0) {
                        selectedOption = midHighOpts[Math.floor(Math.random() * midHighOpts.length)];
                    } else {
                        selectedOption = realOptions.sort((a, b) => b.level - a.level)[0];
                    }
                }
                break;
        }

        if (!selectedOption) {
            selectedOption = q.options[0];
        }

        answers.push({
            questionId: q.id,
            selectedOptionId: selectedOption.id,
            selectedLevel: selectedOption.level,
            responseTime: 3000,
            timestamp: Date.now() + idx * 1000,
            mode: 'self'
        });
    });

    return { answers, description };
}

function runScenario(strategy: AnswerStrategy) {
    console.log('\n----------------------------------------');
    const { answers, description } = simulateTest(strategy);
    console.log(`🧪 Сценарий: ${strategy}`);
    console.log(`   ${description}`);
    console.log(`   Ответов: ${answers.length}`);

    // Показать распределение выбранных уровней
    const levelDist: Record<number, number> = {};
    answers.forEach(a => {
        levelDist[a.selectedLevel] = (levelDist[a.selectedLevel] || 0) + 1;
    });
    console.log('   Выбранные уровни:', levelDist);

    // Запустить диагностику
    const questionsMap = new Map<string, SmartQuestion>();
    NEW_QUESTIONS.forEach(q => questionsMap.set(q.id, q));

    try {
        const result = diagnoseUser(answers, questionsMap);
        console.log('\n   📊 РЕЗУЛЬТАТ ДИАГНОСТИКИ:');
        console.log(`      currentLevel: ${result.currentLevel}`);
        console.log(`      baseLevel: ${result.baseLevel}`);
        console.log(`      pattern: ${result.pattern}`);
        console.log(`      patternStrength: ${(result.patternStrength * 100).toFixed(1)}%`);
        console.log(`      peaks: [${Array.from(result.levelScores.entries())
            .filter(([_, v]) => v > 0.3)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([k, v]) => `${k}:${(v*100).toFixed(0)}%`)
            .join(', ')}]`);
        console.log(`      gaps: [${result.gaps.join(', ')}]`);
        console.log(`      conflicts: ${result.conflicts.length > 0 ? result.conflicts.join('; ') : 'нет'}`);
        console.log(`      diagnosis: "${result.diagnosisTitle}"`);

        return result;
    } catch (e: any) {
        console.log(`   ❌ ОШИБКА: ${e.message}`);
        return null;
    }
}

// ============================================================================
// ДЕТАЛЬНЫЙ АНАЛИЗ ПОЧЕМУ НЕ 12
// ============================================================================

function analyzeWhyNot12() {
    console.log('\n========================================');
    console.log('АНАЛИЗ: ПОЧЕМУ МАКСИМУМ ~10?');
    console.log('========================================\n');

    // Симулируем идеальный сценарий: все ответы на уровень 12
    const { answers } = simulateTest('level-12-only');

    console.log('📝 Симуляция: Все ответы выбраны на максимальный уровень');
    console.log('   Распределение выбранных уровней:');

    const levelDist: Record<number, number> = {};
    answers.forEach(a => {
        levelDist[a.selectedLevel] = (levelDist[a.selectedLevel] || 0) + 1;
    });

    for (let i = 1; i <= 12; i++) {
        if (levelDist[i]) {
            console.log(`      Уровень ${i}: ${levelDist[i]} ответов`);
        }
    }

    // Запускаем диагностику
    const questionsMap = new Map<string, SmartQuestion>();
    NEW_QUESTIONS.forEach(q => questionsMap.set(q.id, q));

    const result = diagnoseUser(answers, questionsMap);

    console.log('\n🔍 ДЕТАЛЬНЫЙ АНАЛИЗ levelScores (спектрограмма):');
    const sortedScores = Array.from(result.levelScores.entries())
        .sort((a, b) => a[0] - b[0]);

    sortedScores.forEach(([level, score]) => {
        const bar = '█'.repeat(Math.round(score * 20));
        const pct = (score * 100).toFixed(1);
        console.log(`   Уровень ${level.toString().padStart(2)}: ${pct.padStart(5)}% ${bar}`);
    });

    console.log('\n⚠️  ПРОБЛЕМА: Weighted Median');
    console.log('   baseLevel рассчитывается как взвешенная медиана PEAKS');
    console.log('   Peaks = уровни со score > 30%');

    const peaks = sortedScores.filter(([_, score]) => score > 0.3).map(([level]) => level);
    console.log(`   Текущие peaks: [${peaks.join(', ')}]`);

    // Расчёт weighted median
    const peakWeights = peaks.map(lvl => ({
        level: lvl,
        weight: result.levelScores.get(lvl as any) || 0
    })).sort((a, b) => a.level - b.level);

    const totalWeight = peakWeights.reduce((sum, p) => sum + p.weight, 0);
    let cumWeight = 0;
    let medianLevel = peaks[0];

    for (const p of peakWeights) {
        cumWeight += p.weight;
        if (cumWeight >= totalWeight / 2) {
            medianLevel = p.level;
            break;
        }
    }

    console.log(`\n   Weighted Median calculation:`);
    console.log(`   Total weight: ${totalWeight.toFixed(2)}`);
    console.log(`   Median threshold: ${(totalWeight / 2).toFixed(2)}`);
    peakWeights.forEach(p => {
        console.log(`      Level ${p.level}: weight=${p.weight.toFixed(2)}`);
    });
    console.log(`   => baseLevel = ${medianLevel}`);

    console.log('\n💡 КОРНЕВАЯ ПРИЧИНА:');
    console.log('   1. Вопросы зонирования НЕ содержат вариантов уровня 11-12');
    console.log('   2. Многие refinement вопросы НЕ имеют вариантов 11-12');
    console.log('   3. Даже при выборе max уровней, большинство ответов = 9-10');
    console.log('   4. Weighted median всегда "сдвигает" к центру распределения');
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     АНАЛИЗ ТЕСТОВЫХ СЦЕНАРИЕВ "ЛЕСТНИЦА СОЮЗА"               ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');

    // 1. Анализ структуры вопросов
    analyzeQuestionStructure();

    // 2. Симуляция разных сценариев
    console.log('\n========================================');
    console.log('СИМУЛЯЦИЯ СЦЕНАРИЕВ');
    console.log('========================================');

    runScenario('highest');
    runScenario('level-12-only');
    runScenario('mixed-high');
    runScenario('realistic-mature');

    // 3. Детальный анализ
    analyzeWhyNot12();

    console.log('\n========================================');
    console.log('РЕКОМЕНДАЦИИ');
    console.log('========================================\n');

    console.log('🔧 Для достижения уровней 11-12 нужно:');
    console.log('   1. Добавить варианты уровня 11-12 в зонирующие вопросы');
    console.log('   2. Добавить больше вопросов с targetLevels [11, 12]');
    console.log('   3. Изменить расчёт baseLevel: не медиана, а максимум если профиль "высокий"');
    console.log('   4. Или: для high зоны использовать другой алгоритм baseLevel');
}

main().catch(console.error);
