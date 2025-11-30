/**
 * ТИПЫ ДАННЫХ ТЕСТА "ЛЕСТНИЦА СОЮЗА"
 * Фундаментальная структура всей системы
 */

// ============================================================================
// ОСНОВНЫЕ ТИПЫ
// ============================================================================

export type TestMode = 'self' | 'partner_assessment' | 'potential' | 'pair_discussion';
export type RelationshipStatus = 'in_relationship' | 'single_past' | 'single_potential' | 'pair_together';
export type RelationshipType = 'heterosexual_pair'; // Только м/ж пары

export type UnionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface UserProfile {
  sessionId: string;
  relationshipStatus: RelationshipStatus;
  relationshipType: RelationshipType;
  hasPartner: boolean;
  testMode: TestMode;
  // Рф контекст - больше ничего не нужно
}

// ============================================================================
// ВОПРОСЫ И ОТВЕТЫ
// ============================================================================

export interface AnswerOption {
  id: string;
  text: string;
  level: UnionLevel; // На каком уровне этот ответ
  indicators: string[]; // Психологические индикаторы
  validation?: string; // Дополнительный вопрос валидации
}

export interface SmartQuestion {
  id: string;
  text: {
    self: string; // "Я обычно..."
    partner: string; // "Партнер обычно..."
    potential: string; // "Я хотел бы..."
    pair_discussion: string; // "Мы обычно..."
  };
  category: 'conflict' | 'intimacy' | 'values' | 'communication' | 'growth' | 'boundaries' | 'acceptance' | 'creativity' | 'transcendence' | 'validation';
  options: AnswerOption[];
  targetLevels: UnionLevel[]; // На каких уровнях этот вопрос хорошо работает
  isValidation?: boolean; // Это вопрос валидации?
  priority?: number; // 1 = критичный, 3 = дополнительный
}

// ============================================================================
// РЕЗУЛЬТАТЫ ОТВЕТОВ
// ============================================================================

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  selectedLevel: UnionLevel;
  responseTime: number; // milliseconds
  timestamp: number;
  mode: TestMode;
}

// ============================================================================
// РАСЧЕТЫ РЕЗУЛЬТАТОВ
// ============================================================================

export interface LevelScore {
  level: UnionLevel;
  percentage: number; // 0-100, как часто выбирался этот уровень
  confidence: number; // 0-1, уверенность в оценке
}

export interface ValidationMetrics {
  responseSpeedAnomaly: boolean;
  averageResponseTime: number;
  socialDesirabilityScore: number; // 0-1, насколько ответы выглядят идеально
  coherenceScore: number; // 0-100, внутренняя последовательность
  contradictionFlags: string[]; // Обнаруженные противоречия
  spiritualBypassScore: number; // 0-1, признаки духовного байпаса
  reliabilityScore: number; // 0-100
  reliability: 'high' | 'medium' | 'low';
}

export interface TestResult {
  sessionId: string;
  testMode: TestMode;
  relationshipStatus: RelationshipStatus;

  // Основные результаты
  personalLevel: number; // 1-12, личностная зрелость (с точностью до 0.1)
  relationshipLevel: number; // 1-12, зрелость в отношениях

  // Распределение по уровням
  levelScores: LevelScore[];

  // Валидация
  validation: ValidationMetrics;

  // История ответов
  answers: UserAnswer[];
  totalQuestions: number;
  completionTime: number; // milliseconds

  // Временные метаданные
  createdAt: number;
  updatedAt: number;
}

export interface ComparisonResult extends TestResult {
  comparisonWith?: TestResult; // Для сравнения self vs partner
  gap?: number; // Разница между уровнями
  compatibility?: number; // 0-100, совместимость
  recommendations: string[];
}

// ============================================================================
// ДЕЙСТВИЯ И РЕКОМЕНДАЦИИ
// ============================================================================

export interface ActionStep {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: 'easy' | 'moderate' | 'challenging';
  example: string; // Конкретный пример выполнения
  expected_outcome: string;
}

export interface ActionPlan {
  level: UnionLevel;
  mainChallenge: string;
  topActions: ActionStep[]; // 3 главных действия
}

export interface Recommendation {
  type: 'action' | 'insight' | 'resource' | 'caution';
  text: string;
  priority: 'high' | 'medium' | 'low';
  targetLevel?: UnionLevel;
}

// ============================================================================
// ЛЕСТНИЦА И ВИЗУАЛИЗАЦИЯ
// ============================================================================

export interface LevelDefinition {
  level: UnionLevel;
  name: string; // "Травма и разрушение", "Духовный союз"
  icon: string; // 🔥, 🔄, ⚙️, 🏠, 🔥, 🎭, 🌊, 💚, 🦋, ⚡, 🎨, ⭐
  color: string; // hex color
  shortDescription: string; // 1 строка
  fullDescription: string; // 3-5 предложений
  markers: string[]; // 5-7 ключевых признаков
  risks: string[]; // На какие проблемы обратить внимание
  growthPath: string; // Как подняться выше
}

export interface LadderVisualizationData {
  currentLevel: number;
  currentColor: string;
  potentialLevel?: number;
  potentialColor?: string;
  history?: Array<{ date: number; level: number }>;
}

// ============================================================================
// СЕССИЯ И ИСТОРИЯ
// ============================================================================

export interface TestSession {
  sessionId: string;
  userProfile: UserProfile;
  results: TestResult[];
  currentStep: 'init' | 'testing' | 'results' | 'completed';
  createdAt: number;
}

export interface UserHistory {
  userId?: string; // Optional, если хранится история
  sessions: TestSession[];
  totalTests: number;
  averageScore: number;
  trend: 'improving' | 'stable' | 'declining';
}
