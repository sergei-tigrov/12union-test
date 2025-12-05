import type { Answer } from './types';
import type { TestScenario } from '../types';

// Психологически обоснованная конфигурация алгоритма
export const PSYCHOLOGICAL_CONFIG = {
  // Минимальное количество ответов для надежного результата
  minAnswersForReliability: 10,
  
  // Пороги для определения качества данных
  thresholds: {
    // Минимальная вариативность ответов (избежание "плоских" профилей)
    minVariance: 0.5,
    
    // Максимальный допустимый разброс между личностным и отношенческим (выявление противоречий)
    maxPersonalRelationshipGap: 4,
    
    // Минимальная концентрация ответов для определения доминантного уровня
    minDominanceThreshold: 0.3
  },
  
  // Зоны развития согласно модели "Лестница Союза"
  developmentZones: {
    destructive: [1, 2],        // Деструктивная зона
    survival: [3, 4],           // Зона выживания  
    emotional: [5, 6],          // Эмоциональная зона
    psychological: [7, 8],      // Психологическая зона
    spiritual: [9, 10, 11, 12]  // Духовная зона
  }
};

// Интерфейс для подсчета ответов по уровням
interface LevelScore {
  personal: number;      // Количество ответов (не взвешенный счет!)
  relationship: number;  // Количество ответов (не взвешенный счет!)
  total: number;        // Общее количество ответов
}

export interface LevelDistributionItem {
  levelId: number;
  personal: number;
  relationship: number; 
  total: number;
  personalPercentage: number;
  relationshipPercentage: number;
  totalPercentage: number;
}

export interface ValidationResult {
  isReliable: boolean;
  reliabilityScore: number;
  message: string;
  warnings: string[];
}

export interface TestResult {
  // Сценарий тестирования
  testScenario?: TestScenario;
  // Основные результаты
  personalLevel: number;
  relationshipLevel: number;
  potentialLevel: number;  
  // Распределение по уровням (в процентах)
  levelDistribution: LevelDistributionItem[];
  // Совместимость с компонентами - добавлены недостающие поля
  dominantLevels: Array<{ levelId: number; type: 'personal' | 'relationship' | 'potential' }>;
  levelScores: Array<{ levelId: number; personalScore: number; relationshipScore: number; totalScore: number }>;
  // Психологические характеристики
  profile: {
    dominantZone: string;
    developmentVector: 'ascending' | 'balanced' | 'contradictory';
    coherence: number; // Согласованность профиля (0-100)
    maturity: number;  // Общая зрелость (0-100)
  };
  // Валидация и надежность
  validation: ValidationResult;
  // Интерпретация
  interpretation: {
    title: string;
    description: string;
    corePattern: string;
    keyInsight: string;
    growthAreas: string[];
    recommendations: string[];
    risks: string[];
  };
  // Метаданные
  timestamp: number;
  answersCount: number;
}

export function calculateResult(answers: Answer[]): TestResult {
  // 1. ПОДГОТОВКА ДАННЫХ
  const levelScores = new Map<number, LevelScore>();
  
  // Инициализация счетчиков для всех 12 уровней
  for (let i = 1; i <= 12; i++) {
    levelScores.set(i, { personal: 0, relationship: 0, total: 0 });
  }
  
  // 2. ПОДСЧЕТ ОТВЕТОВ БЕЗ ИСКУССТВЕННЫХ ВЕСОВ
  answers.forEach(answer => {
    if (!answer.levelId) return;
    
    const currentScore = levelScores.get(answer.levelId);
    if (!currentScore) return;
    
    // Простое увеличение счетчика для всех ответов
    currentScore.personal += 1;
    currentScore.total += 1;
  });

  // 3. ОПРЕДЕЛЕНИЕ ДОМИНАНТНЫХ УРОВНЕЙ (без искусственных весов)
  let maxPersonal = 0;
  let maxRelationship = 0;
  let personalLevel = 1;
  let relationshipLevel = 1;
  
  levelScores.forEach((scores, levelId) => {
    if (scores.personal > maxPersonal) {
      maxPersonal = scores.personal;
      personalLevel = levelId;
    }
    if (scores.relationship > maxRelationship) {
      maxRelationship = scores.relationship;
      relationshipLevel = levelId;
    }
  });

  // 4. РАСЧЕТ РАСПРЕДЕЛЕНИЯ В ПРОЦЕНТАХ
  const totalPersonalAnswers = Array.from(levelScores.values()).reduce((sum, score) => sum + score.personal, 0);
  const totalRelationshipAnswers = Array.from(levelScores.values()).reduce((sum, score) => sum + score.relationship, 0);
  const totalAllAnswers = Array.from(levelScores.values()).reduce((sum, score) => sum + score.total, 0);

  const levelDistribution: LevelDistributionItem[] = Array.from(levelScores.entries()).map(([levelId, scores]) => ({
    levelId,
    personal: scores.personal,
    relationship: scores.relationship,
    total: scores.total,
    personalPercentage: totalPersonalAnswers > 0 ? (scores.personal / totalPersonalAnswers) * 100 : 0,
    relationshipPercentage: totalRelationshipAnswers > 0 ? (scores.relationship / totalRelationshipAnswers) * 100 : 0,
    totalPercentage: totalAllAnswers > 0 ? (scores.total / totalAllAnswers) * 100 : 0
  }));

  // 5. ОПРЕДЕЛЕНИЕ ПОТЕНЦИАЛЬНОГО УРОВНЯ
  const potentialLevel = Math.max(personalLevel, relationshipLevel);

  // 6. УПРОЩЕННЫЙ ПРОФИЛЬ (без устаревшего calculatePsychologicalProfile)
  // Рассчитываем согласованность на основе различий между личным и отношенческим уровнями
  const gap = Math.abs(personalLevel - relationshipLevel);
  const calculatedCoherence = Math.max(0, 100 - gap * 15); // При большой разнице согласованность уменьшается
  
  const profile = {
    dominantZone: 'modern',
    developmentVector: gap > 2 ? 'contradictory' as const : gap === 0 ? 'balanced' as const : 'ascending' as const,
    coherence: calculatedCoherence,
    // Стандартизируем расчет общей зрелости до шкалы 0-100%
    maturity: Math.round(((personalLevel + relationshipLevel) / 24) * 100)
  };

  // 7. ВАЛИДАЦИЯ РЕЗУЛЬТАТОВ
  const validation = validateResults(levelDistribution, answers.length, personalLevel, relationshipLevel);

  // 8. ИНТЕРПРЕТАЦИЯ - упрощенная версия без устаревших компонентов
  const interpretation = {
    title: `Личная зрелость: ${personalLevel}, Отношения: ${relationshipLevel}`,
    description: "Результаты обрабатываются современной адаптивной системой анализа",
    corePattern: "Анализируется через специализированные компоненты",
    keyInsight: "Детальный анализ доступен в отдельных модулях результатов",
    growthAreas: ["Развитие через адаптивную систему", "Работа с выявленными паттернами"],
    recommendations: ["Изучите детальные результаты в специализированных компонентах"],
    risks: ["Результаты могут требовать профессиональной интерпретации"]
  };

  // Добавляем недостающие поля dominantLevels и levelScores
  const dominantLevels = [
    { levelId: personalLevel, type: 'personal' as const },
    { levelId: relationshipLevel, type: 'relationship' as const },
    { levelId: potentialLevel, type: 'potential' as const }
  ];
  const levelScoresArray = Array.from(levelScores.entries()).map(([levelId, scores]) => ({
    levelId,
    personalScore: scores.personal,
    relationshipScore: scores.relationship,
    totalScore: scores.total
  }));

  return {
    personalLevel,
    relationshipLevel,
    potentialLevel,
    levelDistribution,
    dominantLevels,
    levelScores: levelScoresArray,
    profile,
    validation,
    interpretation,
    timestamp: Date.now(),
    answersCount: answers.length
  };
}

// Функция calculatePsychologicalProfile удалена - заменена упрощенным профилем

// Валидация результатов
function validateResults(
  levelDistribution: LevelDistributionItem[], 
  answersCount: number, 
  personalLevel: number, 
  relationshipLevel: number
): ValidationResult {
  const warnings: string[] = [];
  let reliabilityScore = 0;

  // Проверка количества ответов
  if (answersCount < PSYCHOLOGICAL_CONFIG.minAnswersForReliability) {
    warnings.push(`Недостаточно ответов для надежного результата (${answersCount}/${PSYCHOLOGICAL_CONFIG.minAnswersForReliability})`);
  } else {
    reliabilityScore += 40;
  }

  // Проверка разброса между личностным и отношенческим уровнями
  const gap = Math.abs(personalLevel - relationshipLevel);
  if (gap > PSYCHOLOGICAL_CONFIG.thresholds.maxPersonalRelationshipGap) {
    warnings.push('Значительное противоречие между личностным и отношенческим развитием');
  } else {
    reliabilityScore += 30;
  }

  // Проверка вариативности ответов
  const nonZeroLevels = levelDistribution.filter(item => item.total > 0).length;
  const variance = nonZeroLevels / 12;
  
  if (variance < PSYCHOLOGICAL_CONFIG.thresholds.minVariance) {
    warnings.push('Низкая вариативность ответов может указывать на недостаточную самрефлексию');
  } else {
    reliabilityScore += 30;
  }

  const isReliable = reliabilityScore >= 70;
  const message = isReliable 
    ? 'Результаты достаточно надежны для интерпретации'
    : 'Результаты требуют осторожной интерпретации';

  return {
    isReliable,
    reliabilityScore,
    message,
    warnings
  };
}

// Функции для работы с результатами
export function saveResult(result: TestResult): string {
  const id = Math.random().toString(36).substr(2, 9);
  localStorage.setItem(`union-test-result-${id}`, JSON.stringify(result));
  return id;
}

export function loadResult(id: string): TestResult | null {
  try {
    const data = localStorage.getItem(`union-test-result-${id}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
