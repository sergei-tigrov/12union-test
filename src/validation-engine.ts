/**
 * ДВИГАТЕЛЬ ВАЛИДАЦИИ РЕЗУЛЬТАТОВ
 * "Лестница союза"
 *
 * 4-уровневая система проверки достоверности:
 * 1. Анализ скорости ответов - быстрые ответы на чувствительные вопросы
 * 2. Обнаружение противоречий - несоответствия между похожими вопросами
 * 3. Оценка когерентности - внутренняя логическая последовательность
 * 4. Обнаружение духовного байпаса - высокие уровни без практической основы
 */

import { UserAnswer, ValidationMetrics, UnionLevel } from './types';
import { QUESTIONS } from './questions-database';

// ============================================================================
// ТИПЫ
// ============================================================================

export interface ValidationResult {
  metrics: ValidationMetrics;
  warnings: ValidationWarning[];
  isReliable: boolean; // Стоит ли доверять результатам
  recommendations: string[]; // Что можно улучшить
}

export interface ValidationWarning {
  type: 'speed' | 'contradiction' | 'incoherence' | 'spiritual-bypass' | 'pattern';
  severity: 'low' | 'medium' | 'high';
  message: string;
  questionIds?: string[]; // Какие вопросы связаны
}

// ============================================================================
// АНАЛИЗ СКОРОСТИ ОТВЕТОВ
// ============================================================================

/**
 * Проанализировать скорость ответов
 * Быстрые ответы (< 1 сек) на чувствительные вопросы могут указывать на
 * желательность социального имиджа или поверхностное отношение
 */
function analyzeResponseSpeed(
  answers: UserAnswer[]
): {
  anomaly: boolean;
  averageTime: number;
  flags: ValidationWarning[];
  socialDesirabilityScore: number; // 0-1
} {
  const flags: ValidationWarning[] = [];

  // Определить чувствительные вопросы
  const sensitiveQuestions = [
    'level-detail-emotion-008',
    'level-detail-jealousy-009',
    'validation-contradiction-026',
    'validation-spiritual-bypass-027',
    'validation-honesty-029',
  ];

  // Рассчитать среднее время ответа
  const avgTime =
    answers.reduce((sum, a) => sum + a.responseTime, 0) / answers.length;

  // Найти очень быстрые ответы (< 1 сек)
  const fastAnswers = answers.filter((a) => a.responseTime < 1000);
  const fastSensitiveAnswers = fastAnswers.filter((a) =>
    sensitiveQuestions.includes(a.questionId)
  );

  let socialDesirabilityScore = 0;

  if (fastSensitiveAnswers.length > 2) {
    flags.push({
      type: 'speed',
      severity: 'high',
      message: `Обнаружено ${fastSensitiveAnswers.length} очень быстрых ответов на чувствительные вопросы. Это может указывать на желание выглядеть лучше.`,
      questionIds: fastSensitiveAnswers.map((a) => a.questionId),
    });
    socialDesirabilityScore = Math.min(1, fastSensitiveAnswers.length / 5);
  }

  // Очень быстрые ответы вообще (< 500мс) - поверхностное отношение
  if (fastAnswers.length > answers.length * 0.3) {
    flags.push({
      type: 'speed',
      severity: 'medium',
      message: 'Более 30% ответов даны очень быстро (< 500мс). Возможно, недостаточно глубокое размышление.',
    });
    socialDesirabilityScore += 0.2;
  }

  return {
    anomaly: flags.length > 0,
    averageTime: Math.round(avgTime),
    flags,
    socialDesirabilityScore: Math.min(1, socialDesirabilityScore),
  };
}

// ============================================================================
// ОБНАРУЖЕНИЕ ПРОТИВОРЕЧИЙ
// ============================================================================

/**
 * Обнаружить противоречия между похожими вопросами
 * Например, говорит о высокой духовности, но критикует партнера
 */
function detectContradictions(
  answers: UserAnswer[]
): {
  contradictions: ValidationWarning[];
  contradictionFlags: string[];
} {
  const contradictions: ValidationWarning[] = [];
  const contradictionFlags: string[] = [];

  // Создать карту ответов для удобства
  const answerMap = new Map<string, UserAnswer>();
  answers.forEach((a) => answerMap.set(a.questionId, a));

  // ПРАВИЛО 1: Если высокая любовь но много критики
  // Вопрос 'zone-choice-005' vs 'level-detail-influence-021'
  const q1 = answerMap.get('zone-choice-005');
  const q2 = answerMap.get('level-detail-influence-021');

  if (q1 && q2) {
    if (q1.selectedLevel >= 8 && q2.selectedLevel <= 4) {
      contradictions.push({
        type: 'contradiction',
        severity: 'high',
        message:
          'Противоречие: говорите, что выбрали партнера из любви (высокий уровень), но постоянно пытаетесь его переделать (низкий уровень). Это признак условной любви.',
        questionIds: [q1.questionId, q2.questionId],
      });
      contradictionFlags.push('conditional-love');
    }
  }

  // ПРАВИЛО 2: Если говорит о полной аутентичности, но боится показать слабости
  // 'level-detail-authenticity-011' vs 'validation-honesty-029'
  const q3 = answerMap.get('level-detail-authenticity-011');
  const q4 = answerMap.get('validation-honesty-029');

  if (q3 && q4) {
    if (q3.selectedLevel >= 8 && q4.selectedLevel <= 5) {
      contradictions.push({
        type: 'contradiction',
        severity: 'high',
        message:
          'Противоречие: утверждаете полную аутентичность, но на чувствительных вопросах выбираете социально желательные ответы. Реальная уязвимость ниже заявленной.',
        questionIds: [q3.questionId, q4.questionId],
      });
      contradictionFlags.push('inauthentic-facade');
    }
  }

  // ПРАВИЛО 3: Если говорит о росте вместе, но партнер не меняется
  // 'zone-growth-003' vs 'validation-change-028'
  const q5 = answerMap.get('zone-growth-003');
  const q6 = answerMap.get('validation-change-028');

  if (q5 && q6) {
    if (q5.selectedLevel >= 9 && q6.selectedLevel <= 2) {
      contradictions.push({
        type: 'contradiction',
        severity: 'medium',
        message:
          'Противоречие: утверждаете взаимный рост, но ничего не менялось за год. Возможно, идеализация или отрицание застоя.',
        questionIds: [q5.questionId, q6.questionId],
      });
      contradictionFlags.push('stagnation-denial');
    }
  }

  // ПРАВИЛО 4: Если говорит о высокой духовности, но отношения нестабильны
  // 'validation-spiritual-bypass-027' vs 'zone-conflict-001'
  const q7 = answerMap.get('validation-spiritual-bypass-027');
  const q8 = answerMap.get('zone-conflict-001');

  if (q7 && q8) {
    if (q7.selectedLevel >= 10 && q8.selectedLevel <= 4) {
      contradictions.push({
        type: 'contradiction',
        severity: 'high',
        message:
          'Противоречие: видите отношения как очень духовные, но при конфликте используете уход или защиту. Возможен духовный байпас - использование духовности чтобы избежать реальной работы.',
        questionIds: [q7.questionId, q8.questionId],
      });
      contradictionFlags.push('spiritual-bypass');
    }
  }

  // ПРАВИЛО 5: Если полная свобода, но ревность
  // 'level-detail-freedom-016' vs 'level-detail-jealousy-009'
  const q9 = answerMap.get('level-detail-freedom-016');
  const q10 = answerMap.get('level-detail-jealousy-009');

  if (q9 && q10) {
    if (q9.selectedLevel >= 9 && q10.selectedLevel <= 5) {
      contradictions.push({
        type: 'contradiction',
        severity: 'medium',
        message:
          'Противоречие: утверждаете полную свободу и доверие, но ревность вас не отпускает. Это признак незавершенной работы над привязанностью.',
        questionIds: [q9.questionId, q10.questionId],
      });
      contradictionFlags.push('insecure-freedom');
    }
  }

  return {
    contradictions,
    contradictionFlags,
  };
}

// ============================================================================
// ОЦЕНКА КОГЕРЕНТНОСТИ
// ============================================================================

/**
 * Рассчитать когерентность (внутреннюю логическую последовательность)
 * На основе согласованности ответов в одной категории
 */
function calculateCoherence(
  answers: UserAnswer[]
): {
  coherenceScore: number; // 0-100
  categoryScores: Map<string, number>; // Когерентность по категориям
  flags: ValidationWarning[];
} {
  const flags: ValidationWarning[] = [];

  // Сгруппировать ответы по категориям
  const questionMap = new Map();
  QUESTIONS.forEach((q) => questionMap.set(q.id, q));

  const categoryLevels = new Map<string, UnionLevel[]>();

  answers.forEach((answer) => {
    const question = questionMap.get(answer.questionId);
    if (!question) return;

    if (!categoryLevels.has(question.category)) {
      categoryLevels.set(question.category, []);
    }
    categoryLevels.get(question.category)!.push(answer.selectedLevel);
  });

  // Рассчитать стандартное отклонение для каждой категории
  const categoryScores = new Map<string, number>();
  let totalCoherence = 0;
  let categoryCount = 0;

  categoryLevels.forEach((levels, category) => {
    if (levels.length < 2) {
      categoryScores.set(category, 100);
      return;
    }

    // Рассчитать среднее и стандартное отклонение
    const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    const variance =
      levels.reduce((sum, level) => sum + Math.pow(level - avg, 2), 0) /
      levels.length;
    const stdDev = Math.sqrt(variance);

    // Рассчитать когерентность (0-100)
    // Низкое стандартное отклонение = высокая когерентность
    const coherence = Math.max(0, 100 - stdDev * 20); // Нормализовать

    categoryScores.set(category, Math.round(coherence));
    totalCoherence += coherence;
    categoryCount++;
  });

  const overallCoherence = categoryCount > 0 ? totalCoherence / categoryCount : 50;

  // Флаг если когерентность низкая (< 40%)
  if (overallCoherence < 40) {
    flags.push({
      type: 'incoherence',
      severity: 'high',
      message:
        'Низкая когерентность: ваши ответы в одной категории сильно разнятся. Возможно, непредсказуемо, как вы себя ведете, или трудно определить стабильный уровень.',
    });
  }

  return {
    coherenceScore: Math.round(overallCoherence),
    categoryScores,
    flags,
  };
}

// ============================================================================
// ОБНАРУЖЕНИЕ ДУХОВНОГО БАЙПАСА
// ============================================================================

/**
 * Обнаружить признаки духовного байпаса
 * Использование духовности чтобы избежать реальной работы над отношениями
 */
function detectSpiritualBypass(
  answers: UserAnswer[]
): {
  spiritualBypassScore: number; // 0-1
  flags: ValidationWarning[];
} {
  const flags: ValidationWarning[] = [];

  // Создать карту ответов
  const answerMap = new Map<string, UserAnswer>();
  answers.forEach((a) => answerMap.set(a.questionId, a));

  let bypassIndicators = 0;
  const totalIndicators = 5;

  // ИНДИКАТОР 1: Высокий уровень на уровне 11-12 + низкий практический уровень на конфликтах
  const q1 = answerMap.get('validation-spiritual-bypass-027');
  if (q1 && q1.selectedLevel >= 10) {
    const q2 = answerMap.get('zone-conflict-001');
    if (q2 && q2.selectedLevel <= 4) {
      bypassIndicators++;
      flags.push({
        type: 'spiritual-bypass',
        severity: 'high',
        message:
          'Возможен духовный байпас: видите отношения как священные, но на практике избегаете конфликтов или защищаетесь. Духовность может использоваться чтобы избежать реальной работы.',
      });
    }
  }

  // ИНДИКАТОР 2: Очень высокая оценка своей духовности, но низкая оценка партнера
  const q3 = answerMap.get('validation-awareness-030');
  const q4 = answerMap.get('validation-spiritual-bypass-027');

  if (q4 && q4.selectedLevel >= 10) {
    if (q3 && q3.selectedLevel <= 7) {
      bypassIndicators++;
      flags.push({
        type: 'spiritual-bypass',
        severity: 'medium',
        message:
          'Возможен духовный байпас: вы видите себя как духовного, но партнер не соответствует вашим идеалам. Это может быть духовным нарциссизмом.',
      });
    }
  }

  // ИНДИКАТОР 3: Жертвование любыми мечтами + высокая духовность
  const q5 = answerMap.get('level-detail-sacrifice-018');
  const q6 = answerMap.get('validation-spiritual-bypass-027');

  if (q6 && q6.selectedLevel >= 10) {
    if (q5 && q5.selectedLevel >= 2 && q5.selectedLevel <= 4) {
      bypassIndicators++;
      flags.push({
        type: 'spiritual-bypass',
        severity: 'medium',
        message:
          'Возможен духовный байпас: видите отношения как служение, но при этом отказываетесь от своих мечт. Истинное служение не требует полного самопожертвования.',
      });
    }
  }

  // ИНДИКАТОР 4: Все хорошо в отношениях + очень высокий уровень
  const q8 = answerMap.get('validation-spiritual-bypass-027');

  if (q8 && q8.selectedLevel >= 11) {
    // Проверить все ли другие уровни были низкие
    const avgLevel =
      answers.reduce((sum, a) => sum + a.selectedLevel, 0) / answers.length;
    if (avgLevel <= 7) {
      bypassIndicators++;
      flags.push({
        type: 'spiritual-bypass',
        severity: 'high',
        message:
          'Противоречие: утверждаете, что отношения на уровне Духовного союза, но в остальном ответе показываете более низкие уровни зрелости. Это может быть идеализация или духовный байпас.',
      });
    }
  }

  // ИНДИКАТОР 5: Заявляет о духовности, но на валидационных вопросах выбирает социально желательные ответы
  const q9 = answerMap.get('validation-spiritual-bypass-027');
  const q10 = answerMap.get('validation-honesty-029');

  if (q9 && q9.selectedLevel >= 11 && q10 && q10.selectedLevel <= 5) {
    bypassIndicators++;
    flags.push({
      type: 'spiritual-bypass',
      severity: 'high',
      message:
        'Возможен духовный байпас: заявляете о высокой духовности, но на валидационных вопросах выбираете социально желательные ответы. Истинная духовность предполагает полную честность.',
    });
  }

  const spiritualBypassScore = bypassIndicators / totalIndicators;

  return {
    spiritualBypassScore,
    flags,
  };
}

// ============================================================================
// ПУБЛИЧНЫЙ API
// ============================================================================

/**
 * Провести полную валидацию результатов тестирования
 */
export function validateTestResults(
  answers: UserAnswer[]
): ValidationResult {
  const warnings: ValidationWarning[] = [];

  // Слой 1: Анализ скорости ответов
  const speedAnalysis = analyzeResponseSpeed(answers);
  warnings.push(...speedAnalysis.flags);

  // Слой 2: Обнаружение противоречий
  const contradictionAnalysis = detectContradictions(answers);
  warnings.push(...contradictionAnalysis.contradictions);

  // Слой 3: Оценка когерентности
  const coherenceAnalysis = calculateCoherence(answers);
  warnings.push(...coherenceAnalysis.flags);

  // Слой 4: Обнаружение духовного байпаса
  const bypassAnalysis = detectSpiritualBypass(answers);
  warnings.push(...bypassAnalysis.flags);

  // Рассчитать общий score надежности
  const reliabilityScore = Math.max(
    0,
    100 -
      speedAnalysis.socialDesirabilityScore * 30 -
      (100 - coherenceAnalysis.coherenceScore) * 0.3 -
      bypassAnalysis.spiritualBypassScore * 20 -
      contradictionAnalysis.contradictions.length * 10
  );

  // Определить уровень надежности
  let reliability: 'high' | 'medium' | 'low';
  if (reliabilityScore >= 70) {
    reliability = 'high';
  } else if (reliabilityScore >= 50) {
    reliability = 'medium';
  } else {
    reliability = 'low';
  }

  // Сгенерировать рекомендации
  const recommendations: string[] = [];

  if (speedAnalysis.anomaly) {
    recommendations.push(
      'Старайтесь дольше размышлять перед ответом, особенно на сложные вопросы'
    );
  }

  if (contradictionAnalysis.contradictions.length > 0) {
    recommendations.push(
      'Обратите внимание на обнаруженные противоречия - они могут скрывать нерешённые психологические конфликты'
    );
  }

  if (coherenceAnalysis.coherenceScore < 50) {
    recommendations.push(
      'Ваши ответы в одной категории сильно варьируются - может быть полезно работать над стабильностью поведения'
    );
  }

  if (bypassAnalysis.spiritualBypassScore > 0.5) {
    recommendations.push(
      'Обратите внимание на возможный духовный байпас - баланс между идеалом и практикой очень важен'
    );
  }

  const metrics: ValidationMetrics = {
    responseSpeedAnomaly: speedAnalysis.anomaly,
    averageResponseTime: speedAnalysis.averageTime,
    socialDesirabilityScore: speedAnalysis.socialDesirabilityScore,
    coherenceScore: coherenceAnalysis.coherenceScore,
    contradictionFlags: contradictionAnalysis.contradictionFlags,
    spiritualBypassScore: bypassAnalysis.spiritualBypassScore,
    reliabilityScore: Math.round(reliabilityScore),
    reliability,
  };

  return {
    metrics,
    warnings,
    isReliable: reliability !== 'low',
    recommendations,
  };
}

/**
 * Получить краткую оценку надежности
 */
export function getReliabilityMessage(
  metrics: ValidationMetrics
): string {
  if (metrics.reliability === 'high') {
    return 'Результаты теста выглядят надежными и достоверными';
  } else if (metrics.reliability === 'medium') {
    return 'Результаты частично надежны, но рекомендуется обратить внимание на обнаруженные проблемы';
  } else {
    return 'Результаты низкой надежности - возможны искажения из-за социальной желательности, противоречий или духовного байпаса';
  }
}
