import { UnionLevel, UserAnswer, SmartQuestion } from './types';

// ============================================================================
// ТИПЫ ДИАГНОСТИКИ
// ============================================================================

export type ProfilePattern =
    | 'harmonious'       // Гармоничный рост (последовательные уровни)
    | 'gap'              // Разрыв (есть база, потом дыра, потом снова ответы)
    | 'spiritual_bypass' // Духовное избегание (низ + верх, без середины)
    | 'crisis'           // Кризис (хаотичные ответы, нет базы)
    | 'stuck'            // Застревание (много ответов на одном уровне)
    | 'potential';       // Потенциал (устойчивая база + вектор вверх)

export interface DiagnosticResult {
    // Основные метрики
    baseLevel: UnionLevel;        // Реальный освоенный уровень (фундамент)
    currentLevel: number;         // Точка сборки (где сейчас фокус внимания)
    potentialLevel: UnionLevel;   // Зона ближайшего развития

    // Анализ профиля
    pattern: ProfilePattern;
    patternStrength: number;      // 0-1, насколько ярко выражен паттерн

    // Детализация
    levelScores: Map<UnionLevel, number>; // "Спектрограмма" (0-100% освоения уровня)
    gaps: UnionLevel[];           // Пропущенные уровни (дыры)
    conflicts: string[];          // Текстовые описания найденных противоречий

    // Интерпретация
    diagnosisTitle: string;       // Заголовок диагноза (напр. "Гармоничный Развиватель")
    diagnosisDescription: string; // Психологическое описание состояния
    recommendationFocus: string;  // На чем сфокусироваться (напр. "Закрыть дыру на уровне 4")
}

// ============================================================================
// ЯДРО ДИАГНОСТИКИ (QUANTUM ENGINE)
// ============================================================================

/**
 * Рассчитывает "Спектрограмму" - степень освоения каждого уровня
 * Не использует сглаживание! Только жесткие факты ответов.
 */
function calculateSpectrogram(
    answers: UserAnswer[],
    questions: Map<string, SmartQuestion>
): { normalizedScores: Map<UnionLevel, number>; maxPossibleScores: Map<UnionLevel, number> } {
    const scores = new Map<UnionLevel, number>();
    const maxPossibleScores = new Map<UnionLevel, number>();

    // Инициализация
    for (let i = 1; i <= 12; i++) {
        scores.set(i as UnionLevel, 0);
        maxPossibleScores.set(i as UnionLevel, 0.01); // Защита от деления на 0
    }

    answers.forEach(answer => {
        const question = questions.get(answer.questionId);
        if (!question) return;

        const selectedOption = question.options.find(opt => opt.id === answer.selectedOptionId);
        if (!selectedOption) return;

        // 1. Прямое попадание (Direct Hit)
        // Если выбран ответ конкретного уровня, этот уровень получает очки
        const level = selectedOption.level;

        // Вес ответа зависит от типа вопроса
        // Вопросы "Зонирования" дают широкий сигнал, "Уточнения" - узкий и сильный
        let weight = 1.0;
        if (question.id.startsWith('level-')) weight = 2.0; // Уточняющие вопросы важнее
        if (question.isValidation) weight = 3.0; // Валидация - это "детектор лжи", самый высокий вес

        // Начисляем очки выбранному уровню
        scores.set(level, (scores.get(level) || 0) + weight);
        maxPossibleScores.set(level, (maxPossibleScores.get(level) || 0) + weight);

        // 2. Негативный сигнал (Negative Signal)
        // Если вопрос предполагал выбор из уровней 1, 2, 3, а человек выбрал 1,
        // то уровни 2 и 3 получают "штраф" или просто 0 из возможного максимума.
        // В данной реализации мы просто увеличиваем maxPossibleScores для всех таргетируемых уровней,
        // но очки даем только выбранному. Это автоматически снижает % освоения невыбранных.
        question.targetLevels.forEach(targetLvl => {
            if (targetLvl !== level) {
                // Мы могли бы набрать очки здесь, но не набрали
                // Добавляем вес в знаменатель, но не в числитель
                maxPossibleScores.set(targetLvl, (maxPossibleScores.get(targetLvl) || 0) + (weight * 0.5));
            }
        });
    });

    // Нормализация в проценты (0-100)
    const normalizedScores = new Map<UnionLevel, number>();
    for (let i = 1; i <= 12; i++) {
        const score = scores.get(i as UnionLevel) || 0;
        const max = maxPossibleScores.get(i as UnionLevel) || 1;
        // Если по уровню не было вопросов, считаем его неопределенным (0)
        // Если были, считаем % успеха
        let percent = max > 0.1 ? (score / max) : 0;

        // Квантование: убираем шум. Если меньше 15% - это шум.
        if (percent < 0.15) percent = 0;

        normalizedScores.set(i as UnionLevel, percent);
    }

    return { normalizedScores, maxPossibleScores };
}

/**
 * Анализирует паттерн профиля на основе спектрограммы
 */
function analyzePattern(
    spectrogram: Map<UnionLevel, number>,
    maxPossibleScores: Map<UnionLevel, number>
): {
    pattern: ProfilePattern;
    baseLevel: UnionLevel;
    gaps: UnionLevel[];
    peaks: UnionLevel[];
} {
    const levels = Array.from(spectrogram.entries()).sort((a, b) => a[0] - b[0]);
    let peaks: UnionLevel[] = [];
    const gaps: UnionLevel[] = [];

    // 1. Первичный поиск пиков (уровни с освоением > 30%)
    // Понижен порог с 40% до 30% для более гибкой диагностики
    levels.forEach(([lvl, score]) => {
        if (score > 0.3) peaks.push(lvl);
    });

    // 2. УМНОЕ ЗАПОЛНЕНИЕ (Smart Backfill)
    // Если уровень X взят, а уровень X-1 не тестировался (не было вопросов),
    // мы считаем X-1 пройденным "автоматом".
    // Но если вопросы БЫЛИ, а пика нет - значит это реальный провал.

    if (peaks.length > 0) {
        const maxPeak = Math.max(...peaks);

        // Идем сверху вниз от самого высокого достижения
        for (let lvl = maxPeak; lvl >= 1; lvl--) {
            const level = lvl as UnionLevel;

            // Если уровень уже в пиках - отлично
            if (peaks.includes(level)) continue;

            // Если уровня нет в пиках, проверяем: мы его тестировали?
            const wasTested = (maxPossibleScores.get(level) || 0) > 0.1;

            if (!wasTested) {
                // Не тестировали -> Считаем пройденным (Implicit Pass)
                peaks.push(level);
            } else {
                // Тестировали и не сдали -> Это реальная дыра, оставляем как есть
            }
        }

        // Сортируем пики после добавления
        peaks.sort((a, b) => a - b);
    }

    if (peaks.length === 0) {
        return { pattern: 'crisis', baseLevel: 1, gaps: [], peaks: [] };
    }

    const minPeak = Math.min(...peaks);
    const maxPeak = Math.max(...peaks);

    // Поиск Базового Уровня (Base Level)
    // НОВАЯ ЛОГИКА: Weighted Median (центр масс)
    // Вместо требования непрерывной цепочки используем взвешенную медиану пиков
    let baseLevel: UnionLevel = 1;

    if (peaks.length === 0) {
        baseLevel = 1;
    } else {
        // Создаём взвешенные пики
        const weightedPeaks = peaks.map(lvl => ({
            level: lvl,
            weight: spectrogram.get(lvl) || 0
        })).sort((a, b) => a.level - b.level);

        const totalWeight = weightedPeaks.reduce((sum, p) => sum + p.weight, 0);

        if (totalWeight > 0) {
            let cumulativeWeight = 0;
            const medianThreshold = totalWeight / 2;

            // Находим взвешенную медиану
            for (const peak of weightedPeaks) {
                cumulativeWeight += peak.weight;
                if (cumulativeWeight >= medianThreshold) {
                    baseLevel = peak.level;
                    break;
                }
            }
        } else {
            // Fallback: обычная медиана
            baseLevel = peaks[Math.floor(peaks.length / 2)];
        }
    }

    // Поиск дыр (уровни между min и max пиками, которые не являются пиками)
    for (let i = minPeak; i <= maxPeak; i++) {
        if (!peaks.includes(i as UnionLevel)) {
            gaps.push(i as UnionLevel);
        }
    }

    // Определение паттерна (ИСПРАВЛЕННАЯ ЛОГИКА v2)
    let pattern: ProfilePattern = 'harmonious';

    // Анализ средних значений по группам для правильной детекции
    const foundationLevels: UnionLevel[] = [1, 2, 3];
    const highLevelsGroup: UnionLevel[] = [9, 10, 11, 12];

    const getGroupAvg = (levels: UnionLevel[]): number => {
        const sum = levels.reduce((acc, lvl) => acc + (spectrogram.get(lvl) || 0), 0);
        return sum / levels.length;
    };

    const foundationAvg = getGroupAvg(foundationLevels);
    const highAvg = getGroupAvg(highLevelsGroup);

    // База сильная если >= 50%, слабая если < 30%
    const foundationStrong = foundationAvg >= 0.5;
    const foundationWeak = foundationAvg < 0.3;
    const highStrong = highAvg >= 0.5;

    // Проверка разброса для определения гармоничности
    const significantScores = Array.from(spectrogram.values()).filter(s => s > 0.15);
    const scoreVariance = significantScores.length > 1
        ? Math.max(...significantScores) - Math.min(...significantScores)
        : 0;

    // Профиль гармоничный если малый разброс или высокий средний без провала базы
    const isHarmoniousProfile = (
        (scoreVariance < 0.4 && significantScores.length >= 3) ||
        (foundationStrong && foundationAvg >= 0.5)
    );

    // Обновлённая детекция паттернов
    if (peaks.length < 3) {
        pattern = 'crisis'; // Недостаточно данных
    } else if (highStrong && foundationWeak && (highAvg - foundationAvg > 0.3)) {
        // НОВАЯ ЛОГИКА: Духовный обход только при КОНТРАСТЕ
        // Высокий верх (>=50%) + слабая база (<30%) + разрыв > 30%
        pattern = 'spiritual_bypass';
    } else if (isHarmoniousProfile) {
        // Гармоничный профиль - приоритет над gap
        pattern = 'harmonious';
    } else if (gaps.length > 0 && !foundationStrong) {
        // Дыры только если база не сильная
        pattern = 'gap';
    } else if (peaks.length === 1 || (maxPeak - minPeak <= 1)) {
        pattern = 'stuck'; // Узкая специализация
    } else {
        // Проверка на потенциал (если база высокая и есть пик выше)
        const nextLevel = (baseLevel + 1) as UnionLevel;
        const nextScore = spectrogram.get(nextLevel) || 0;
        if (nextScore > 0.2 && nextScore < 0.4) {
            pattern = 'potential';
        } else {
            pattern = 'harmonious';
        }
    }

    return { pattern, baseLevel, gaps, peaks };
}

/**
 * Генерирует диагноз и рекомендации
 */
function generateDiagnosis(
    pattern: ProfilePattern,
    baseLevel: UnionLevel,
    peaks: UnionLevel[],
    gaps: UnionLevel[]
): { title: string; description: string; focus: string } {
    const maxPeak = Math.max(...peaks, 1);

    switch (pattern) {
        case 'crisis':
            return {
                title: 'Фундаментальный Кризис',
                description: 'Ваше внимание рассеяно, а базовые потребности в безопасности (Уровень 1) не закрыты. Без фундамента невозможно построить прочный дом отношений.',
                focus: 'Срочно восстановить чувство безопасности и личные границы (Уровень 1).'
            };
        case 'spiritual_bypass':
            return {
                title: 'Иллюзия Высоты',
                description: `Вы тянетесь к высоким материям (Уровень ${maxPeak}), но игнорируете земные основы. Это создает хрупкую конструкцию, которая может рухнуть от стресса.`,
                focus: `Вернуться назад и проработать пропущенные уровни: ${gaps.join(', ')}.`
            };
        case 'gap':
            return {
                title: 'Неравномерное Развитие',
                description: `У вас отличная база до Уровня ${baseLevel}, но затем следует провал. Вы пытаетесь перепрыгнуть через ступеньки.`,
                focus: `Заполнить пробел на Уровне ${gaps[0]}, прежде чем двигаться дальше.`
            };
        case 'stuck':
            return {
                title: 'Зона Комфорта',
                description: `Вы мастерски освоили Уровень ${baseLevel}, но застряли на нем. Развитие остановилось, потому что вы боитесь потерять стабильность.`,
                focus: `Рискнуть и сделать шаг на Уровень ${baseLevel + 1}.`
            };
        case 'harmonious':
            return {
                title: 'Гармоничный Рост',
                description: `Ваше развитие идет последовательно и устойчиво. Вы прочно стоите на Уровне ${baseLevel}.`,
                focus: `Спокойно осваивать Уровень ${Math.min(baseLevel + 1, 12)}.`
            };
        case 'potential':
            return {
                title: 'Активный Рост',
                description: `Вы уже переросли Уровень ${baseLevel} и активно штурмуете следующую высоту.`,
                focus: `Закрепить успехи на Уровне ${baseLevel + 1}.`
            };
        default:
            return {
                title: 'Неопределенный статус',
                description: 'Требуется больше данных.',
                focus: 'Продолжать наблюдение.'
            };
    }
}

/**
 * Детектор противоречий в ответах (ИСПРАВЛЕННАЯ ВЕРСИЯ v2)
 *
 * КЛЮЧЕВАЯ ЛОГИКА:
 * - Конфликт = КОНТРАСТ между уровнями (низ слабый + верх сильный)
 * - Если ВСЕ уровни высокие - это НОРМА, НЕ конфликт!
 * - Если база сильная (>=50%) - фундамент в порядке
 *
 * Ищет:
 * - Духовное избегание (высокий верх при провале базы)
 * - Пропуск середины (база + верх есть, середины нет)
 */
function detectConflicts(
    spectrogram: Map<UnionLevel, number>,
    peaks: UnionLevel[],
    gaps: UnionLevel[],
    _pattern: ProfilePattern // Сохраняем для совместимости API, но не используем
): string[] {
    const conflicts: string[] = [];

    // ========================================================================
    // АНАЛИЗ ПРОФИЛЯ
    // ========================================================================

    // Средние значения по группам уровней
    const foundationLevels: UnionLevel[] = [1, 2, 3];
    const middleLevels: UnionLevel[] = [4, 5, 6, 7, 8];
    const highLevels: UnionLevel[] = [9, 10, 11, 12];

    const getGroupAverage = (levels: UnionLevel[]): number => {
        const sum = levels.reduce((acc, lvl) => acc + (spectrogram.get(lvl) || 0), 0);
        return sum / levels.length;
    };

    const foundationAvg = getGroupAverage(foundationLevels);
    const middleAvg = getGroupAverage(middleLevels);
    const highAvg = getGroupAverage(highLevels);

    // Определяем состояние групп
    const foundationStrong = foundationAvg >= 0.5; // >= 50%
    const foundationWeak = foundationAvg < 0.3;    // < 30%
    const middleWeak = middleAvg < 0.25;           // < 25%
    const highStrong = highAvg >= 0.5;             // >= 50%

    // Общий средний балл
    const allScores = Array.from(spectrogram.values());
    const overallAvg = allScores.length > 0
        ? allScores.reduce((a, b) => a + b, 0) / allScores.length
        : 0;

    // Проверяем разброс (variance)
    const significantScores = allScores.filter(s => s > 0.15);
    const scoreVariance = significantScores.length > 1
        ? Math.max(...significantScores) - Math.min(...significantScores)
        : 0;

    // ========================================================================
    // ЗАЩИТА: ГАРМОНИЧНЫЙ ПРОФИЛЬ - НЕ ДОБАВЛЯЕМ КОНФЛИКТЫ
    // ========================================================================

    // Если профиль гармоничный (малый разброс или высокий средний)
    const isHarmonious = (
        (scoreVariance < 0.4 && significantScores.length >= 3) ||
        (overallAvg >= 0.5 && !foundationWeak) ||
        (foundationStrong && foundationAvg >= 0.6)
    );

    if (isHarmonious) {
        // Гармоничный профиль - не добавляем конфликты
        return conflicts;
    }

    // Если база сильная - не конфликт
    if (foundationStrong) {
        return conflicts;
    }

    // ========================================================================
    // ДЕТЕКЦИЯ РЕАЛЬНЫХ КОНФЛИКТОВ
    // ========================================================================

    // КОНФЛИКТ 1: Духовный обход (spiritual_bypass)
    // Условие: высокие уровни сильные + база слабая + большой разрыв
    if (highStrong && foundationWeak) {
        const gapSize = highAvg - foundationAvg;

        if (gapSize > 0.3) { // Разрыв более 30%
            conflicts.push(
                `Духовный обход: высокие уровни (9-12: ${Math.round(highAvg * 100)}%) при слабой базе (1-3: ${Math.round(foundationAvg * 100)}%). ` +
                'Рекомендуется укрепить фундамент эмоциональной безопасности и личных границ.'
            );
        }
    }

    // КОНФЛИКТ 2: Пропуск середины
    // Условие: есть база + есть верх, но середина провалена
    if (!foundationWeak && highStrong && middleWeak) {
        conflicts.push(
            `Пропуск средних уровней (4-8: ${Math.round(middleAvg * 100)}%). ` +
            'Развитие может быть неустойчивым без проработки этих переходных этапов.'
        );
    }

    // КОНФЛИКТ 3: Отсутствие базы
    // Условие: база практически пустая (< 15%) при сильном верхе
    if (foundationAvg < 0.15 && highStrong) {
        conflicts.push(
            `Отсутствие фундамента: высокие уровни достигнуты (${Math.round(highAvg * 100)}%) без проработки базовых потребностей (1-3: ${Math.round(foundationAvg * 100)}%). ` +
            'Это может создавать нестабильность в отношениях.'
        );
    }

    // КОНФЛИКТ 4: Большие дыры в середине при наличии высоких пиков
    // (только если это не гармоничный профиль)
    if (gaps.length > 2 && peaks.some(p => p >= 9)) {
        const gapLevelsInMiddle = gaps.filter(g => g >= 4 && g <= 8);
        if (gapLevelsInMiddle.length >= 2) {
            conflicts.push(
                `Обнаружены пробелы на уровнях ${gapLevelsInMiddle.join(', ')}. ` +
                'Рекомендуется уделить внимание этим областям для более устойчивого развития.'
            );
        }
    }

    return conflicts;
}

/**
 * Расчет силы (уверенности) паттерна
 * Возвращает число от 0 до 1, где:
 * - 1.0 = паттерн очень четкий, диагноз уверенный
 * - 0.5 = паттерн размытый, есть неопределенность
 * - 0.0 = данных недостаточно
 */
function calculatePatternStrength(
    pattern: ProfilePattern,
    peaks: UnionLevel[],
    gaps: UnionLevel[],
    spectrogram: Map<UnionLevel, number>
): number {
    // Базовая сила зависит от количества данных
    const totalPeaks = peaks.length;
    if (totalPeaks === 0) return 0.0;

    // Чем больше уровней протестировано, тем выше уверенность (но не более 1.0)
    let baseStrength = Math.min(totalPeaks / 6, 1.0);

    // Модификаторы для разных паттернов
    switch (pattern) {
        case 'harmonious':
            // Гармоничный паттерн - сильный, если нет дыр
            if (gaps.length === 0 && totalPeaks >= 3) {
                return Math.min(baseStrength + 0.3, 1.0);
            }
            return baseStrength;

        case 'spiritual_bypass':
            // Духовное избегание - сильный сигнал, если контраст явный
            const minPeak = Math.min(...peaks);
            const maxPeak = Math.max(...peaks);
            const contrast = maxPeak - minPeak;

            if (contrast >= 6 && gaps.length >= 3) {
                return Math.min(baseStrength + 0.2, 1.0);
            }
            return baseStrength * 0.8; // Немного снижаем, так как паттерн настораживающий

        case 'gap':
            // Разрыв - уверенность зависит от четкости дыры
            if (gaps.length === 1 && totalPeaks >= 4) {
                return Math.min(baseStrength + 0.2, 1.0);
            }
            return baseStrength;

        case 'crisis':
            // Кризис - если совсем нет пиков, уверенность низкая
            return Math.max(baseStrength - 0.3, 0.3);

        case 'stuck':
            // Застревание - если один уровень сильно доминирует
            const dominantLevel = peaks[0];
            const dominantScore = spectrogram.get(dominantLevel) || 0;

            if (dominantScore > 0.8 && totalPeaks <= 2) {
                return Math.min(baseStrength + 0.25, 1.0);
            }
            return baseStrength;

        case 'potential':
            // Потенциал - если есть прогресс на следующем уровне
            const maxLevel = Math.max(...peaks);
            const nextLevel = Math.min(maxLevel + 1, 12) as UnionLevel;
            const nextScore = spectrogram.get(nextLevel) || 0;

            if (nextScore > 0.2 && nextScore < 0.4) {
                return Math.min(baseStrength + 0.15, 1.0);
            }
            return baseStrength * 0.9; // Немного снижаем, так как прогресс не подтвержден

        default:
            return baseStrength;
    }
}

// ============================================================================
// ПУБЛИЧНЫЙ API
// ============================================================================

export function diagnoseUser(
    answers: UserAnswer[],
    questions: Map<string, SmartQuestion>
): DiagnosticResult {
    // 1. Строим спектрограмму
    const { normalizedScores, maxPossibleScores } = calculateSpectrogram(answers, questions);

    // 2. Анализируем паттерн
    const analysis = analyzePattern(normalizedScores, maxPossibleScores);

    // 3. Генерируем тексты
    const diagnosis = generateDiagnosis(
        analysis.pattern,
        analysis.baseLevel,
        analysis.peaks,
        analysis.gaps
    );

    // 4. Рассчитываем "Текущий Уровень" (Точку сборки)
    // Это не просто база, это взвешенная позиция с учетом векторов
    let currentLevel = analysis.baseLevel;

    // Если паттерн гармоничный или потенциал, добавляем дробную часть
    if (analysis.pattern === 'harmonious' || analysis.pattern === 'potential') {
        const nextLvl = Math.min(analysis.baseLevel + 1, 12) as UnionLevel;
        const nextScore = normalizedScores.get(nextLvl) || 0;
        currentLevel += (nextScore * 0.8); // Добавляем прогресс следующего уровня
    }

    // Если разрыв, то текущий уровень "падает" до базы, так как выше идти опасно
    // Если избегание, то тоже база, так как верх - иллюзия.

    // 5. Детектируем конфликты
    const conflicts = detectConflicts(
        normalizedScores,
        analysis.peaks,
        analysis.gaps,
        analysis.pattern
    );

    // 6. Рассчитываем силу паттерна
    const patternStrength = calculatePatternStrength(
        analysis.pattern,
        analysis.peaks,
        analysis.gaps,
        normalizedScores
    );

    return {
        baseLevel: analysis.baseLevel,
        currentLevel: Math.round(currentLevel * 10) / 10,
        potentialLevel: Math.min(analysis.baseLevel + 1, 12) as UnionLevel,
        pattern: analysis.pattern,
        patternStrength,
        levelScores: normalizedScores,
        gaps: analysis.gaps,
        conflicts,
        diagnosisTitle: diagnosis.title,
        diagnosisDescription: diagnosis.description,
        recommendationFocus: diagnosis.focus
    };
}
