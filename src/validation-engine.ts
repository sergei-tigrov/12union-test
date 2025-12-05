/**
 * ДВИГАТЕЛЬ ВАЛИДАЦИИ РЕЗУЛЬТАТОВ
 * "Лестница союза" (2025 Refactoring)
 */

import { UserAnswer, ValidationMetrics, ValidationWarning } from './types';

export interface ValidationResult {
  metrics: ValidationMetrics;
  warnings: ValidationWarning[];
  isReliable: boolean;
  recommendations: string[];
}

// ============================================================================
// АНАЛИЗ СКОРОСТИ ОТВЕТОВ
// ============================================================================

function analyzeResponseSpeed(answers: UserAnswer[]): {
  anomaly: boolean;
  averageTime: number;
  flags: ValidationWarning[];
  socialDesirabilityScore: number;
} {
  const flags: ValidationWarning[] = [];
  const sensitiveQuestions = [
    'validation-honesty-001',
    'validation-bypass-002',
    'level-5-passion-intensity',
    'zone-conflict-001'
  ];

  const avgTime = answers.reduce((sum, a) => sum + a.responseTime, 0) / Math.max(1, answers.length);
  const fastAnswers = answers.filter((a) => a.responseTime < 1000);
  const fastSensitiveAnswers = fastAnswers.filter((a) => sensitiveQuestions.includes(a.questionId));

  let socialDesirabilityScore = 0;

  if (fastSensitiveAnswers.length > 1) {
    flags.push({
      type: 'speed',
      severity: 'high',
      message: `Слишком быстрые ответы на чувствительные вопросы. Возможно, вы отвечаете "на автомате" или как "надо".`,
      questionIds: fastSensitiveAnswers.map((a) => a.questionId),
    });
    socialDesirabilityScore += 0.4;
  }

  if (fastAnswers.length > answers.length * 0.3) {
    flags.push({
      type: 'speed',
      severity: 'medium',
      message: 'Вы отвечаете очень быстро. Попробуйте задуматься глубже.',
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

function detectContradictions(answers: UserAnswer[]): {
  contradictions: ValidationWarning[];
  contradictionFlags: string[];
} {
  const contradictions: ValidationWarning[] = [];
  const contradictionFlags: string[] = [];
  const answerMap = new Map<string, UserAnswer>();
  answers.forEach((a) => answerMap.set(a.questionId, a));

  // RULE 1: Authenticity vs Social Desirability
  // Claiming total freedom (L9) but denying any anger (Validation Honesty L0)
  const qAuth = answerMap.get('level-9-freedom-maturity');
  const qHonesty = answerMap.get('validation-honesty-001');

  if (qAuth && qHonesty) {
    if (qAuth.selectedLevel >= 9 && qHonesty.selectedLevel === 0) {
      contradictions.push({
        type: 'contradiction',
        severity: 'high',
        message: 'Вы говорите о полной свободе и осознанности, но отрицаете естественные человеческие чувства (гнев, раздражение). Это похоже на идеализацию.',
        questionIds: [qAuth.questionId, qHonesty.questionId],
      });
      contradictionFlags.push('idealization');
    }
  }

  // RULE 2: Spirituality vs Reality
  // Claiming spiritual union (L12) but engaging in destructive conflict (Zone Conflict L2)
  const qSpirit = answerMap.get('level-12-service'); // or validation-bypass-002
  const qConflict = answerMap.get('zone-conflict-001');

  if (qSpirit && qConflict) {
    if (qSpirit.selectedLevel >= 11 && qConflict.selectedLevel <= 3) {
      contradictions.push({
        type: 'contradiction',
        severity: 'high',
        message: 'Вы описываете отношения как высший духовный союз, но конфликты проходят деструктивно. Духовность не должна быть способом убежать от проблем.',
        questionIds: [qSpirit.questionId, qConflict.questionId],
      });
      contradictionFlags.push('spiritual-bypass');
    }
  }

  // RULE 3: Growth vs Stagnation
  // Claiming synergy (L10) but feeling stuck (Zone Growth L2)
  const qSynergy = answerMap.get('level-10-synergy');
  const qGrowth = answerMap.get('zone-growth-003');

  if (qSynergy && qGrowth) {
    if (qSynergy.selectedLevel >= 10 && qGrowth.selectedLevel <= 3) {
      contradictions.push({
        type: 'contradiction',
        severity: 'high',
        message: 'Вы говорите о синергии, но в вопросе о развитии указываете на застой. Это противоречие.',
        questionIds: [qSynergy.questionId, qGrowth.questionId],
      });
      contradictionFlags.push('stagnation-denial');
    }
  }

  return { contradictions, contradictionFlags };
}

// ============================================================================
// ОЦЕНКА КОГЕРЕНТНОСТИ
// ============================================================================

function calculateCoherence(answers: UserAnswer[]): {
  coherenceScore: number;
  flags: ValidationWarning[];
} {
  const flags: ValidationWarning[] = [];

  // Calculate variance of levels
  const levels = answers.map(a => a.selectedLevel).filter(l => l > 0); // Exclude validation L0
  if (levels.length < 3) return { coherenceScore: 100, flags: [] };

  const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
  const variance = levels.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / levels.length;
  const stdDev = Math.sqrt(variance);

  // High stdDev means low coherence (scattering across levels)
  // Max expected stdDev is around 4-5 (e.g. mix of L1 and L12)
  const coherenceScore = Math.max(0, Math.min(100, 100 - (stdDev * 20)));

  if (coherenceScore < 40) {
    flags.push({
      type: 'incoherence',
      severity: 'medium',
      message: 'Ваши ответы разбросаны по очень разным уровням. Возможно, отношения нестабильны или вы по-разному проявляетесь в разных сферах.',
    });
  }

  return { coherenceScore: Math.round(coherenceScore), flags };
}

// ============================================================================
// ОБНАРУЖЕНИЕ ДУХОВНОГО БАЙПАСА
// ============================================================================

function detectSpiritualBypass(answers: UserAnswer[]): {
  spiritualBypassScore: number;
  flags: ValidationWarning[];
} {
  const flags: ValidationWarning[] = [];
  const answerMap = new Map<string, UserAnswer>();
  answers.forEach((a) => answerMap.set(a.questionId, a));

  let indicators = 0;

  // 1. Validation Bypass Question
  const qBypass = answerMap.get('validation-bypass-002');
  if (qBypass && qBypass.selectedLevel === 0) {
    indicators += 1;
    flags.push({
      type: 'spiritual-bypass',
      severity: 'high',
      message: 'Склонность к "духовному избеганию" — игнорированию материальных проблем ради "высокого".',
    });
  }

  // 2. High Spirituality + Low Responsibility
  const qSpirit = answerMap.get('level-12-service');
  const qResp = answerMap.get('zone-responsibility-005');
  if (qSpirit && qResp) {
    if (qSpirit.selectedLevel >= 11 && qResp.selectedLevel <= 4) {
      indicators += 1;
      flags.push({
        type: 'spiritual-bypass',
        severity: 'medium',
        message: 'Высокие слова о служении, но перекладывание ответственности за счастье на партнера.',
      });
    }
  }

  return {
    spiritualBypassScore: Math.min(1, indicators * 0.5),
    flags,
  };
}

// ============================================================================
// ПУБЛИЧНЫЙ API
// ============================================================================

export function validateTestResults(answers: UserAnswer[]): ValidationResult {
  const warnings: ValidationWarning[] = [];

  const speed = analyzeResponseSpeed(answers);
  warnings.push(...speed.flags);

  const contradictions = detectContradictions(answers);
  warnings.push(...contradictions.contradictions);

  const coherence = calculateCoherence(answers);
  warnings.push(...coherence.flags);

  const bypass = detectSpiritualBypass(answers);
  warnings.push(...bypass.flags);

  // Calculate Reliability
  let reliabilityScore = 100;
  reliabilityScore -= speed.socialDesirabilityScore * 20;
  reliabilityScore -= contradictions.contradictions.length * 15;
  reliabilityScore -= (100 - coherence.coherenceScore) * 0.2;
  reliabilityScore -= bypass.spiritualBypassScore * 20;

  reliabilityScore = Math.max(0, Math.round(reliabilityScore));

  let reliability: 'high' | 'medium' | 'low' = 'high';
  if (reliabilityScore < 50) reliability = 'low';
  else if (reliabilityScore < 75) reliability = 'medium';

  const recommendations: string[] = [];
  if (reliability === 'low') recommendations.push('Попробуйте пройти тест еще раз, отвечая максимально честно.');
  if (bypass.spiritualBypassScore > 0) recommendations.push('Обратите внимание на заземление: духовность не должна отрывать от реальности.');

  return {
    metrics: {
      responseSpeedAnomaly: speed.anomaly,
      averageResponseTime: speed.averageTime,
      socialDesirabilityScore: speed.socialDesirabilityScore,
      coherenceScore: coherence.coherenceScore,
      contradictionFlags: contradictions.contradictionFlags,
      spiritualBypassScore: bypass.spiritualBypassScore,
      reliabilityScore,
      reliability,
    },
    warnings,
    isReliable: reliability !== 'low',
    recommendations,
  };
}

export function getReliabilityMessage(metrics: ValidationMetrics): string {
  if (metrics.reliability === 'high') return 'Результат надежен.';
  if (metrics.reliability === 'medium') return 'Результат в целом достоверен, но есть нюансы.';
  return 'Результат может быть неточным из-за противоречий или идеализации.';
}
