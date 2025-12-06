/**
 * ПСИХОМЕТРИЧЕСКИЙ АУДИТ ТЕСТА "ЛЕСТНИЦА СОЮЗА"
 *
 * Проверки:
 * 1. Конструктная валидность - измеряют ли вопросы то, что должны
 * 2. Дискриминантная валидность - различаются ли уровни
 * 3. Содержательная валидность - покрытие всех аспектов
 * 4. Социальная желательность - не слишком ли привлекательны высокие уровни
 * 5. Баланс по категориям и темам
 */

import { NEW_QUESTIONS } from '../src/questions-new-core';
import { SmartQuestion } from '../src/types';

// ============================================================================
// 1. АНАЛИЗ ПОКРЫТИЯ УРОВНЕЙ ПО КАТЕГОРИЯМ
// ============================================================================

function analyzeCategoryCoverage() {
    console.log('\n' + '='.repeat(70));
    console.log('1. ПОКРЫТИЕ УРОВНЕЙ ПО КАТЕГОРИЯМ');
    console.log('='.repeat(70));

    const categoryLevelMatrix: Record<string, Set<number>> = {};

    NEW_QUESTIONS.forEach(q => {
        const category = q.category || 'unknown';
        if (!categoryLevelMatrix[category]) {
            categoryLevelMatrix[category] = new Set();
        }
        q.options.forEach(opt => {
            if (opt.level > 0) {
                categoryLevelMatrix[category].add(opt.level);
            }
        });
    });

    console.log('\nМатрица покрытия (категория → уровни):');
    Object.entries(categoryLevelMatrix).forEach(([cat, levels]) => {
        const sortedLevels = Array.from(levels).sort((a, b) => a - b);
        const coverage = sortedLevels.length / 12 * 100;
        const gaps = [];
        for (let i = 1; i <= 12; i++) {
            if (!levels.has(i)) gaps.push(i);
        }

        console.log(`\n  ${cat.toUpperCase()}:`);
        console.log(`    Уровни: [${sortedLevels.join(', ')}]`);
        console.log(`    Покрытие: ${coverage.toFixed(0)}%`);
        if (gaps.length > 0) {
            console.log(`    ⚠️  Пробелы: [${gaps.join(', ')}]`);
        }
    });
}

// ============================================================================
// 2. АНАЛИЗ СОЦИАЛЬНОЙ ЖЕЛАТЕЛЬНОСТИ
// ============================================================================

function analyzeSocialDesirability() {
    console.log('\n' + '='.repeat(70));
    console.log('2. АНАЛИЗ СОЦИАЛЬНОЙ ЖЕЛАТЕЛЬНОСТИ');
    console.log('='.repeat(70));

    // Ключевые слова, повышающие привлекательность
    const attractiveWords = [
        'свобод', 'любовь', 'принятие', 'гармони', 'счастье', 'доверие',
        'рост', 'развитие', 'понимани', 'уважени', 'поддержк'
    ];

    // Ключевые слова, понижающие привлекательность
    const repulsiveWords = [
        'страх', 'боюсь', 'терплю', 'завис', 'контрол', 'ревност',
        'злюсь', 'обид', 'виноват', 'боль', 'насили', 'угроз'
    ];

    const levelAttractiveness: Record<number, { attractive: number, repulsive: number, total: number }> = {};

    for (let i = 0; i <= 12; i++) {
        levelAttractiveness[i] = { attractive: 0, repulsive: 0, total: 0 };
    }

    NEW_QUESTIONS.forEach(q => {
        q.options.forEach(opt => {
            const text = opt.text.self.toLowerCase();
            let attractiveCount = 0;
            let repulsiveCount = 0;

            attractiveWords.forEach(word => {
                if (text.includes(word)) attractiveCount++;
            });

            repulsiveWords.forEach(word => {
                if (text.includes(word)) repulsiveCount++;
            });

            levelAttractiveness[opt.level].attractive += attractiveCount;
            levelAttractiveness[opt.level].repulsive += repulsiveCount;
            levelAttractiveness[opt.level].total++;
        });
    });

    console.log('\nИндекс привлекательности по уровням:');
    console.log('(положительные слова - отрицательные слова) / кол-во вариантов\n');

    for (let i = 1; i <= 12; i++) {
        const data = levelAttractiveness[i];
        if (data.total === 0) continue;

        const index = (data.attractive - data.repulsive) / data.total;
        const bar = index > 0 ? '█'.repeat(Math.round(index * 5)) : '░'.repeat(Math.round(-index * 5));
        const sign = index > 0 ? '+' : '';

        console.log(`  Level ${i.toString().padStart(2)}: ${sign}${index.toFixed(2)} ${bar} (${data.total} вар.)`);
    }

    console.log('\n⚠️  ПРОБЛЕМА: Если высокие уровни слишком привлекательны,');
    console.log('   пользователи будут выбирать их из-за формулировки, а не реального состояния.');
}

// ============================================================================
// 3. ПРОВЕРКА ДИСКРИМИНАНТНОЙ ВАЛИДНОСТИ
// ============================================================================

function analyzeDiscriminantValidity() {
    console.log('\n' + '='.repeat(70));
    console.log('3. ДИСКРИМИНАНТНАЯ ВАЛИДНОСТЬ');
    console.log('='.repeat(70));

    // Проверяем, насколько чётко различаются соседние уровни
    const levelTexts: Record<number, string[]> = {};

    for (let i = 1; i <= 12; i++) {
        levelTexts[i] = [];
    }

    NEW_QUESTIONS.forEach(q => {
        q.options.forEach(opt => {
            if (opt.level > 0) {
                levelTexts[opt.level].push(opt.text.self);
            }
        });
    });

    console.log('\nПроверка различимости соседних уровней:');

    // Проверяем ключевые переходы
    const criticalTransitions = [
        { from: 3, to: 4, theme: 'Страх → Стабильность' },
        { from: 5, to: 6, theme: 'Страсть → Статус' },
        { from: 6, to: 7, theme: 'Маска → Близость' },
        { from: 8, to: 9, theme: 'Принятие → Свобода' },
        { from: 9, to: 10, theme: 'Свобода → Синергия' },
        { from: 11, to: 12, theme: 'Сотворчество → Служение' },
    ];

    criticalTransitions.forEach(t => {
        const fromTexts = levelTexts[t.from];
        const toTexts = levelTexts[t.to];

        console.log(`\n  ${t.from} → ${t.to} (${t.theme}):`);
        console.log(`    Level ${t.from}: ${fromTexts.length} вариантов`);
        console.log(`    Level ${t.to}: ${toTexts.length} вариантов`);

        if (fromTexts.length === 0 || toTexts.length === 0) {
            console.log(`    ❌ ПРОБЛЕМА: Недостаточно вариантов для различения!`);
        }
    });
}

// ============================================================================
// 4. ПРОВЕРКА ВНУТРЕННЕЙ СОГЛАСОВАННОСТИ ВОПРОСОВ
// ============================================================================

function analyzeQuestionConsistency() {
    console.log('\n' + '='.repeat(70));
    console.log('4. ВНУТРЕННЯЯ СОГЛАСОВАННОСТЬ ВОПРОСОВ');
    console.log('='.repeat(70));

    const issues: string[] = [];

    NEW_QUESTIONS.forEach(q => {
        const levels = q.options.map(o => o.level).filter(l => l > 0);
        const uniqueLevels = [...new Set(levels)].sort((a, b) => a - b);

        // Проверка 1: targetLevels соответствует реальным вариантам?
        const realLevels = new Set(uniqueLevels);
        const targetSet = new Set(q.targetLevels);

        const missingInTarget = uniqueLevels.filter(l => !targetSet.has(l as any));
        const extraInTarget = q.targetLevels.filter(l => !realLevels.has(l));

        if (missingInTarget.length > 0) {
            issues.push(`${q.id}: Уровни [${missingInTarget}] есть в вариантах, но нет в targetLevels`);
        }
        if (extraInTarget.length > 0) {
            issues.push(`${q.id}: Уровни [${extraInTarget}] в targetLevels, но нет вариантов`);
        }

        // Проверка 2: Есть ли большие пробелы в уровнях?
        for (let i = 0; i < uniqueLevels.length - 1; i++) {
            const gap = uniqueLevels[i + 1] - uniqueLevels[i];
            if (gap > 3) {
                issues.push(`${q.id}: Большой пробел между уровнями ${uniqueLevels[i]} и ${uniqueLevels[i + 1]}`);
            }
        }

        // Проверка 3: Есть ли дубликаты уровней?
        if (levels.length !== uniqueLevels.length) {
            const duplicates = levels.filter((l, i) => levels.indexOf(l) !== i);
            if (duplicates.length > 0) {
                issues.push(`${q.id}: Дублирующиеся уровни: [${[...new Set(duplicates)]}]`);
            }
        }
    });

    if (issues.length === 0) {
        console.log('\n✅ Все вопросы согласованы');
    } else {
        console.log(`\n❌ Найдено ${issues.length} проблем:\n`);
        issues.forEach(issue => console.log(`  - ${issue}`));
    }
}

// ============================================================================
// 5. СИМУЛЯЦИЯ ТИПИЧНЫХ ПРОФИЛЕЙ
// ============================================================================

function simulateTypicalProfiles() {
    console.log('\n' + '='.repeat(70));
    console.log('5. СИМУЛЯЦИЯ ТИПИЧНЫХ ПРОФИЛЕЙ');
    console.log('='.repeat(70));

    // Определим типичные профили пользователей
    const profiles = [
        {
            name: 'Травма (уровень 1-2)',
            targetLevels: [1, 2],
            description: 'Человек в деструктивных отношениях'
        },
        {
            name: 'Страх (уровень 3-4)',
            targetLevels: [3, 4],
            description: 'Созависимость, страх одиночества'
        },
        {
            name: 'Страсть (уровень 5-6)',
            targetLevels: [5, 6],
            description: 'Эмоциональные качели, статус'
        },
        {
            name: 'Зрелость (уровень 7-8)',
            targetLevels: [7, 8],
            description: 'Здоровые отношения, принятие'
        },
        {
            name: 'Свобода (уровень 9)',
            targetLevels: [9],
            description: 'Автономия, осознанный выбор'
        },
        {
            name: 'Трансценденция (уровень 10-12)',
            targetLevels: [10, 11, 12],
            description: 'Синергия, сотворчество, служение'
        },
    ];

    profiles.forEach(profile => {
        console.log(`\n📊 ${profile.name}`);
        console.log(`   ${profile.description}`);

        // Сколько вопросов могут выбрать люди этого профиля?
        let questionsWithOptions = 0;
        let totalOptions = 0;

        NEW_QUESTIONS.forEach(q => {
            const matchingOptions = q.options.filter(o =>
                profile.targetLevels.includes(o.level)
            );
            if (matchingOptions.length > 0) {
                questionsWithOptions++;
                totalOptions += matchingOptions.length;
            }
        });

        const coverage = (questionsWithOptions / NEW_QUESTIONS.length * 100).toFixed(0);
        console.log(`   Вопросов с подходящими вариантами: ${questionsWithOptions}/${NEW_QUESTIONS.length} (${coverage}%)`);
        console.log(`   Всего подходящих вариантов: ${totalOptions}`);

        if (parseInt(coverage) < 50) {
            console.log(`   ⚠️  ПРОБЛЕМА: Недостаточное покрытие для этого профиля!`);
        }
    });
}

// ============================================================================
// 6. ПРОВЕРКА ТЕКСТОВ НА ВСЕ 4 РЕЖИМА
// ============================================================================

function checkTextModes() {
    console.log('\n' + '='.repeat(70));
    console.log('6. ПРОВЕРКА ТЕКСТОВ НА ВСЕ 4 РЕЖИМА');
    console.log('='.repeat(70));

    const modes = ['self', 'partner', 'potential', 'pair_discussion'] as const;
    const issues: string[] = [];

    NEW_QUESTIONS.forEach(q => {
        // Проверка вопроса
        modes.forEach(mode => {
            if (!q.text[mode] || q.text[mode].trim() === '') {
                issues.push(`${q.id}: Пустой текст вопроса для режима "${mode}"`);
            }
        });

        // Проверка вариантов ответов
        q.options.forEach(opt => {
            modes.forEach(mode => {
                if (!opt.text[mode] || opt.text[mode].trim() === '') {
                    issues.push(`${q.id} → ${opt.id}: Пустой текст варианта для режима "${mode}"`);
                }
            });
        });
    });

    if (issues.length === 0) {
        console.log('\n✅ Все тексты заполнены для всех 4 режимов');
    } else {
        console.log(`\n❌ Найдено ${issues.length} проблем:\n`);
        issues.slice(0, 10).forEach(issue => console.log(`  - ${issue}`));
        if (issues.length > 10) {
            console.log(`  ... и ещё ${issues.length - 10} проблем`);
        }
    }
}

// ============================================================================
// 7. ИТОГОВАЯ ОЦЕНКА
// ============================================================================

function generateSummary() {
    console.log('\n' + '='.repeat(70));
    console.log('7. ИТОГОВАЯ ОЦЕНКА');
    console.log('='.repeat(70));

    const totalQuestions = NEW_QUESTIONS.length;
    const totalOptions = NEW_QUESTIONS.reduce((sum, q) => sum + q.options.length, 0);

    const levelCounts: Record<number, number> = {};
    for (let i = 0; i <= 12; i++) levelCounts[i] = 0;

    NEW_QUESTIONS.forEach(q => {
        q.options.forEach(opt => {
            levelCounts[opt.level]++;
        });
    });

    console.log(`\n📈 СТАТИСТИКА:`);
    console.log(`   Всего вопросов: ${totalQuestions}`);
    console.log(`   Всего вариантов ответов: ${totalOptions}`);
    console.log(`   Среднее вариантов на вопрос: ${(totalOptions / totalQuestions).toFixed(1)}`);

    console.log(`\n📊 РАСПРЕДЕЛЕНИЕ ПО УРОВНЯМ:`);
    for (let i = 1; i <= 12; i++) {
        const count = levelCounts[i];
        const bar = '█'.repeat(Math.round(count / 2));
        console.log(`   Level ${i.toString().padStart(2)}: ${count.toString().padStart(2)} ${bar}`);
    }

    // Расчёт коэффициента вариации
    const counts = Object.values(levelCounts).filter((_, i) => i >= 1);
    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance = counts.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / counts.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean * 100).toFixed(1);

    console.log(`\n📐 БАЛАНС:`);
    console.log(`   Среднее вариантов на уровень: ${mean.toFixed(1)}`);
    console.log(`   Стандартное отклонение: ${stdDev.toFixed(1)}`);
    console.log(`   Коэффициент вариации: ${cv}%`);

    if (parseFloat(cv) > 50) {
        console.log(`   ⚠️  Высокая вариативность указывает на дисбаланс`);
    } else if (parseFloat(cv) > 30) {
        console.log(`   ℹ️  Умеренная вариативность, приемлемо`);
    } else {
        console.log(`   ✅ Хороший баланс между уровнями`);
    }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    console.log('╔══════════════════════════════════════════════════════════════════════╗');
    console.log('║         ПСИХОМЕТРИЧЕСКИЙ АУДИТ ТЕСТА "ЛЕСТНИЦА СОЮЗА"                ║');
    console.log('╚══════════════════════════════════════════════════════════════════════╝');

    analyzeCategoryCoverage();
    analyzeSocialDesirability();
    analyzeDiscriminantValidity();
    analyzeQuestionConsistency();
    simulateTypicalProfiles();
    checkTextModes();
    generateSummary();

    console.log('\n' + '='.repeat(70));
    console.log('АУДИТ ЗАВЕРШЁН');
    console.log('='.repeat(70) + '\n');
}

main().catch(console.error);
