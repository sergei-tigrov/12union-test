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

    // 1. Первичный поиск пиков (уровни с освоением > 40%)
    levels.forEach(([lvl, score]) => {
        if (score > 0.4) peaks.push(lvl);
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
    // Это самый высокий уровень непрерывной цепочки снизу
    let baseLevel: UnionLevel = 1;

    if (!peaks.includes(1)) {
        // Если даже после Backfill нет 1-го уровня, значит он был протестирован и провален
        baseLevel = 1;
    } else {
        // Ищем, где обрывается цепочка
        for (let i = 1; i <= 12; i++) {
            if (peaks.includes(i as UnionLevel)) {
                baseLevel = i as UnionLevel;
            } else {
                // Нашли дыру
                break;
            }
        }
    }

    // Поиск дыр (уровни между min и max пиками, которые не являются пиками)
    for (let i = minPeak; i <= maxPeak; i++) {
        if (!peaks.includes(i as UnionLevel)) {
            gaps.push(i as UnionLevel);
        }
    }

    // Определение паттерна
    let pattern: ProfilePattern = 'harmonious';

    if (!peaks.includes(1)) {
        pattern = 'crisis'; // Нет безопасности
    } else if (maxPeak - minPeak > 5 && gaps.length > 2) {
        pattern = 'spiritual_bypass'; // Большой разрыв между низом и верхом с дырами
    } else if (gaps.length > 0) {
        pattern = 'gap'; // Есть дыры в развитии
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
 * Детектор противоречий в ответах
 * Ищет логические несоответствия, которые указывают на:
 * - Социально желательные ответы
 * - Недопонимание вопросов
 * - Духовное избегание
 */
function detectConflicts(
    spectrogram: Map<UnionLevel, number>,
    peaks: UnionLevel[],
    gaps: UnionLevel[],
    pattern: ProfilePattern
): string[] {
    const conflicts: string[] = [];

    // КОНФЛИКТ 1: Высокие уровни без базы
    // Если взяты уровни 8-12, но провалены 1-3
    const hasHighLevels = peaks.some(p => p >= 8);
    const hasLowBase = peaks.every(p => p >= 4); // Нет уровней 1-3

    if (hasHighLevels && hasLowBase) {
        conflicts.push(
            'Противоречие: высокие результаты на уровнях 8-12 при отсутствии базовых уровней 1-3. ' +
            'Возможно, вы стремитесь к духовности, минуя эмоциональную зрелость.'
        );
    }

    // КОНФЛИКТ 2: Низкий базовый уровень, но высокие пики
    // Например: baseLevel=2, но есть пик на уровне 10
    const maxPeak = Math.max(...peaks, 1);
    const baseLevel = peaks.length > 0 ? Math.max(...peaks.filter(p => {
        for (let i = 1; i <= p; i++) {
            if (!peaks.includes(i as UnionLevel)) return false;
        }
        return true;
    }), 1) : 1;

    if (maxPeak - baseLevel > 4) {
        conflicts.push(
            `Противоречие: вы демонстрируете понимание уровня ${maxPeak}, но не освоили уровни ${baseLevel + 1}-${maxPeak - 1}. ` +
            'Это может указывать на теоретическое знание без практического опыта.'
        );
    }

    // КОНФЛИКТ 3: Большие дыры при паттерне "гармоничный"
    if (pattern === 'harmonious' && gaps.length > 0) {
        conflicts.push(
            `Внимание: обнаружены пропуски на уровнях ${gaps.join(', ')}, хотя общий паттерн выглядит гармоничным. ` +
            'Рекомендуется уделить внимание этим областям.'
        );
    }

    // КОНФЛИКТ 4: Очень низкие результаты на промежуточных уровнях
    // Если уровень 4 или 5 провален (< 20%), но выше есть успехи
    for (let lvl = 4; lvl <= 6; lvl++) {
        const score = spectrogram.get(lvl as UnionLevel) || 0;
        const hasHigherPeaks = peaks.some(p => p > lvl);

        if (score < 0.2 && hasHigherPeaks) {
            conflicts.push(
                `Предупреждение: низкий результат на уровне ${lvl} (${Math.round(score * 100)}%) при наличии успехов на более высоких уровнях. ` +
                `Уровень ${lvl} - это критически важный переход, который стоит проработать.`
            );
            break; // Одно предупреждение достаточно
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
