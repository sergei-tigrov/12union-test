/**
 * ГЛУБОКИЙ АНАЛИЗ ПРОБЛЕМЫ ЗАВЫШЕНИЯ РЕЗУЛЬТАТОВ
 *
 * Проблема: При выборе ответов уровня 9, система выдает 11
 */

import { NEW_QUESTIONS } from '../src/questions-new-core';
import { diagnoseUser } from '../src/diagnostic-engine';
import { SmartQuestion, UserAnswer } from '../src/types';

// ============================================================================
// АНАЛИЗ СТРУКТУРЫ ВОПРОСОВ
// ============================================================================

function analyzeQuestionStructure() {
    console.log('\n' + '='.repeat(70));
    console.log('АНАЛИЗ СТРУКТУРЫ ВОПРОСОВ');
    console.log('='.repeat(70));

    // 1. Какие уровни доступны в каждом вопросе?
    console.log('\n📋 ДОСТУПНЫЕ УРОВНИ ПО КАЖДОМУ ВОПРОСУ:\n');

    const levelAvailability: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) levelAvailability[i] = [];

    NEW_QUESTIONS.forEach(q => {
        const levels = q.options.map(o => o.level).filter(l => l > 0).sort((a, b) => a - b);
        console.log(`  ${q.id.padEnd(35)} → уровни: [${levels.join(', ')}]`);

        levels.forEach(l => {
            levelAvailability[l].push(q.id);
        });
    });

    // 2. Сколько вопросов имеют опцию для каждого уровня?
    console.log('\n📊 СКОЛЬКО ВОПРОСОВ ИМЕЮТ ОПЦИЮ ДЛЯ КАЖДОГО УРОВНЯ:\n');
    for (let i = 1; i <= 12; i++) {
        const count = levelAvailability[i].length;
        const bar = '█'.repeat(count);
        console.log(`  Уровень ${i.toString().padStart(2)}: ${count.toString().padStart(2)} вопросов ${bar}`);
    }

    // 3. КРИТИЧНО: Вопросы без уровня 9
    console.log('\n⚠️  ВОПРОСЫ БЕЗ ОПЦИИ УРОВНЯ 9:');
    NEW_QUESTIONS.forEach(q => {
        const hasLevel9 = q.options.some(o => o.level === 9);
        if (!hasLevel9) {
            const levels = q.options.map(o => o.level).filter(l => l > 0).sort((a, b) => a - b);
            console.log(`  ❌ ${q.id}: [${levels.join(', ')}]`);
        }
    });

    // 4. Валидационные вопросы особенно важны
    console.log('\n🔍 ВАЛИДАЦИОННЫЕ ВОПРОСЫ (isValidation=true):');
    NEW_QUESTIONS.filter(q => q.isValidation).forEach(q => {
        const levels = q.options.map(o => `${o.id}→level ${o.level}`).join(', ');
        console.log(`  ${q.id}:`);
        console.log(`    Опции: ${levels}`);
    });
}

// ============================================================================
// СИМУЛЯЦИЯ "ОТВЕТОВ НА УРОВНЕ 9"
// ============================================================================

function simulateLevel9Answers(): UserAnswer[] {
    const answers: UserAnswer[] = [];

    console.log('\n' + '='.repeat(70));
    console.log('СИМУЛЯЦИЯ: ПОЛЬЗОВАТЕЛЬ ХОЧЕТ ОТВЕЧАТЬ НА УРОВНЕ 9');
    console.log('='.repeat(70));
    console.log('\n📝 Выбор ответов (желаемый уровень = 9):\n');

    NEW_QUESTIONS.forEach((q, idx) => {
        // Ищем опцию с уровнем 9
        let selectedOption = q.options.find(o => o.level === 9);

        // Если нет уровня 9, выбираем ближайший (но не fake = 0)
        if (!selectedOption) {
            const validOptions = q.options.filter(o => o.level > 0);
            // Сортируем по близости к 9
            validOptions.sort((a, b) => Math.abs(a.level - 9) - Math.abs(b.level - 9));
            selectedOption = validOptions[0];
        }

        if (!selectedOption) {
            console.log(`  ⚠️  ${q.id}: НЕТ ВАЛИДНЫХ ОПЦИЙ!`);
            return;
        }

        const wantedLevel = 9;
        const gotLevel = selectedOption.level;
        const diff = gotLevel - wantedLevel;
        const indicator = diff === 0 ? '✓' : diff > 0 ? `↑+${diff}` : `↓${diff}`;

        console.log(`  ${indicator.padEnd(4)} ${q.id.padEnd(35)} → level ${gotLevel} (хотел 9)`);

        answers.push({
            questionId: q.id,
            selectedOptionId: selectedOption.id,
            selectedLevel: selectedOption.level,
            responseTime: 3000,
            timestamp: Date.now() + idx * 1000,
            mode: 'self'
        });
    });

    return answers;
}

// ============================================================================
// ДЕТАЛЬНЫЙ АНАЛИЗ ДИАГНОСТИКИ
// ============================================================================

function analyzeWithDetails(answers: UserAnswer[]) {
    console.log('\n' + '='.repeat(70));
    console.log('ДЕТАЛЬНЫЙ АНАЛИЗ ДИАГНОСТИКИ');
    console.log('='.repeat(70));

    // Создаем карту вопросов
    const questionsMap = new Map<string, SmartQuestion>();
    NEW_QUESTIONS.forEach(q => questionsMap.set(q.id, q));

    // Статистика выбранных уровней
    const levelCounts: Record<number, number> = {};
    answers.forEach(a => {
        levelCounts[a.selectedLevel] = (levelCounts[a.selectedLevel] || 0) + 1;
    });

    console.log('\n📊 ФАКТИЧЕСКОЕ РАСПРЕДЕЛЕНИЕ ВЫБРАННЫХ УРОВНЕЙ:');
    for (let i = 1; i <= 12; i++) {
        if (levelCounts[i]) {
            const bar = '█'.repeat(levelCounts[i]);
            console.log(`  Уровень ${i.toString().padStart(2)}: ${levelCounts[i].toString().padStart(2)} ответов ${bar}`);
        }
    }

    // Средний выбранный уровень
    const totalAnswers = answers.length;
    const sumLevels = answers.reduce((sum, a) => sum + a.selectedLevel, 0);
    const avgLevel = sumLevels / totalAnswers;
    console.log(`\n  📈 Средний уровень ответов: ${avgLevel.toFixed(2)}`);
    console.log(`  📈 Ожидаемый уровень: 9.0`);
    console.log(`  📈 Отклонение: ${(avgLevel - 9).toFixed(2)}`);

    // Запускаем диагностику
    try {
        const result = diagnoseUser(answers, questionsMap);

        console.log('\n' + '-'.repeat(40));
        console.log('РЕЗУЛЬТАТ ДИАГНОСТИКИ:');
        console.log('-'.repeat(40));
        console.log(`  currentLevel: ${result.currentLevel}`);
        console.log(`  baseLevel: ${result.baseLevel}`);
        console.log(`  pattern: ${result.pattern}`);
        console.log(`  patternStrength: ${(result.patternStrength * 100).toFixed(1)}%`);

        // Спектрограмма
        console.log('\n📊 СПЕКТРОГРАММА (levelScores):');
        const sortedScores = Array.from(result.levelScores.entries())
            .sort((a, b) => a[0] - b[0]);

        sortedScores.forEach(([level, score]) => {
            const bar = '█'.repeat(Math.round(score * 20));
            const pct = (score * 100).toFixed(1);
            console.log(`  Уровень ${level.toString().padStart(2)}: ${pct.padStart(5)}% ${bar}`);
        });

        // Анализ почему такой результат
        console.log('\n' + '-'.repeat(40));
        console.log('АНАЛИЗ ПРИЧИН:');
        console.log('-'.repeat(40));

        // Пики
        const peaks = sortedScores.filter(([_, score]) => score > 0.3).map(([level]) => level);
        console.log(`  Пики (score > 30%): [${peaks.join(', ')}]`);

        // Веса
        const weights = peaks.map(lvl => ({
            level: lvl,
            weight: result.levelScores.get(lvl as any) || 0
        }));
        const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);

        console.log('\n  Веса пиков:');
        weights.forEach(w => {
            const pct = ((w.weight / totalWeight) * 100).toFixed(1);
            console.log(`    Level ${w.level}: ${(w.weight * 100).toFixed(1)}% (${pct}% от общего)`);
        });

        // Анализ highRatio и topRatio
        const highLevelPeaks = weights.filter(w => w.level >= 9);
        const highLevelWeight = highLevelPeaks.reduce((sum, w) => sum + w.weight, 0);
        const topPeaks = weights.filter(w => w.level >= 11);
        const topWeight = topPeaks.reduce((sum, w) => sum + w.weight, 0);

        const highRatio = totalWeight > 0 ? highLevelWeight / totalWeight : 0;
        const topRatio = totalWeight > 0 ? topWeight / totalWeight : 0;

        console.log(`\n  highRatio (9-12): ${(highRatio * 100).toFixed(1)}%`);
        console.log(`  topRatio (11-12): ${(topRatio * 100).toFixed(1)}%`);

        // База
        const baseLevels = [1, 2, 3, 4];
        const baseWeight = baseLevels.reduce((sum, lvl) =>
            sum + (result.levelScores.get(lvl as any) || 0), 0);
        const baseAvg = baseWeight / 4;
        console.log(`  baseAvg (1-4): ${(baseAvg * 100).toFixed(1)}%`);

        // Условия для isTopProfile
        const baseNotTested = baseAvg < 0.1;
        const baseStrong = baseAvg >= 0.5;
        const baseOkForHighProfile = baseNotTested || baseStrong;
        const isHighProfile = highRatio > 0.6 && baseOkForHighProfile;
        const isTopProfile = topRatio > 0.3 && highRatio > 0.5 && baseOkForHighProfile;

        console.log('\n  🔍 УСЛОВИЯ ПРОФИЛЯ:');
        console.log(`    baseNotTested (< 10%): ${baseNotTested}`);
        console.log(`    baseStrong (>= 50%): ${baseStrong}`);
        console.log(`    baseOkForHighProfile: ${baseOkForHighProfile}`);
        console.log(`    isHighProfile (highRatio > 0.6): ${isHighProfile}`);
        console.log(`    isTopProfile (topRatio > 0.3 && highRatio > 0.5): ${isTopProfile}`);

        // ПРОБЛЕМА!
        if (isTopProfile || isHighProfile) {
            console.log('\n  ⚠️  ПРОБЛЕМА: Включен режим "топ-профиля"!');
            console.log('     Это приводит к завышению baseLevel');
        }

        return result;
    } catch (e: any) {
        console.log(`\n  ❌ ОШИБКА: ${e.message}`);
        return null;
    }
}

// ============================================================================
// СИМУЛЯЦИЯ РАЗНЫХ СЦЕНАРИЕВ
// ============================================================================

function simulateScenario(name: string, targetLevel: number) {
    console.log('\n' + '='.repeat(70));
    console.log(`СЦЕНАРИЙ: ${name} (target = ${targetLevel})`);
    console.log('='.repeat(70));

    const answers: UserAnswer[] = [];

    NEW_QUESTIONS.forEach((q, idx) => {
        const validOptions = q.options.filter(o => o.level > 0);

        // Ищем опцию с нужным уровнем или ближайшую
        let selectedOption = validOptions.find(o => o.level === targetLevel);

        if (!selectedOption) {
            validOptions.sort((a, b) => Math.abs(a.level - targetLevel) - Math.abs(b.level - targetLevel));
            selectedOption = validOptions[0];
        }

        if (selectedOption) {
            answers.push({
                questionId: q.id,
                selectedOptionId: selectedOption.id,
                selectedLevel: selectedOption.level,
                responseTime: 3000,
                timestamp: Date.now() + idx * 1000,
                mode: 'self'
            });
        }
    });

    // Статистика
    const levelCounts: Record<number, number> = {};
    answers.forEach(a => {
        levelCounts[a.selectedLevel] = (levelCounts[a.selectedLevel] || 0) + 1;
    });

    console.log('\n📊 Распределение выбранных уровней:');
    for (let i = 1; i <= 12; i++) {
        if (levelCounts[i]) {
            console.log(`  Level ${i}: ${levelCounts[i]} ответов`);
        }
    }

    const questionsMap = new Map<string, SmartQuestion>();
    NEW_QUESTIONS.forEach(q => questionsMap.set(q.id, q));

    try {
        const result = diagnoseUser(answers, questionsMap);
        console.log('\n📈 РЕЗУЛЬТАТ:');
        console.log(`  Ожидали: ~${targetLevel}`);
        console.log(`  Получили: baseLevel=${result.baseLevel}, currentLevel=${result.currentLevel}`);
        console.log(`  Pattern: ${result.pattern}`);

        const diff = result.baseLevel - targetLevel;
        if (Math.abs(diff) > 1) {
            console.log(`  ⚠️  ОТКЛОНЕНИЕ: ${diff > 0 ? '+' : ''}${diff} уровней!`);
        } else {
            console.log(`  ✓ Результат в пределах нормы`);
        }
    } catch (e: any) {
        console.log(`  ❌ Ошибка: ${e.message}`);
    }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    console.log('╔══════════════════════════════════════════════════════════════════════╗');
    console.log('║       ГЛУБОКИЙ АНАЛИЗ ПРОБЛЕМЫ ЗАВЫШЕНИЯ РЕЗУЛЬТАТОВ                 ║');
    console.log('╚══════════════════════════════════════════════════════════════════════╝');

    // 1. Анализ структуры
    analyzeQuestionStructure();

    // 2. Симуляция "уровень 9"
    const answers = simulateLevel9Answers();
    analyzeWithDetails(answers);

    // 3. Тестирование разных уровней
    console.log('\n\n' + '═'.repeat(70));
    console.log('ТЕСТИРОВАНИЕ ВСЕХ ЦЕЛЕВЫХ УРОВНЕЙ');
    console.log('═'.repeat(70));

    for (let target = 5; target <= 12; target++) {
        simulateScenario(`Уровень ${target}`, target);
    }

    // 4. Выводы
    console.log('\n\n' + '═'.repeat(70));
    console.log('ВЫВОДЫ И РЕКОМЕНДАЦИИ');
    console.log('═'.repeat(70));
    console.log(`
ОБНАРУЖЕННЫЕ ПРОБЛЕМЫ:

1. СТРУКТУРА ВОПРОСОВ:
   - Не все вопросы имеют опцию уровня 9
   - Валидационные вопросы дают очки 10 и 12 (нет альтернативы)
   - При желании выбрать "9" система вынуждена выбирать 8 или 10

2. АЛГОРИТМ isTopProfile/isHighProfile:
   - Если topRatio > 0.3 И highRatio > 0.5 - включается режим "топ-профиля"
   - В этом режиме baseLevel рассчитывается ТОЛЬКО среди уровней 9-12
   - Уровни 11-12 получают буст 1.5x
   - Это искусственно завышает результат

3. ВАЛИДАЦИОННЫЕ ВОПРОСЫ:
   - validation_honesty: fake=0 или 10
   - validation_bypass: fake=0 или 12
   - Нет варианта для уровня 9!
   - Честный ответ автоматически дает 10 или 12

РЕКОМЕНДАЦИИ:

1. Убрать или снизить буст 1.5x для уровней 11-12
2. Не использовать режим "топ-профиля" при наличии выборки на разных уровнях
3. Использовать weighted median для ВСЕХ профилей
4. ИЛИ: Добавить опции уровня 9 в валидационные вопросы
`);
}

main().catch(console.error);
