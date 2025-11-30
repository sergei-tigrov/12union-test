/**
 * Общие типы для компонентов психологического анализа
 */

/**
 * Базовые свойства для всех компонентов анализа
 */
export interface BaseAnalysisProps {
  indicators: string[];
  personalMaturity: number;
  relationshipMaturity: number;
}

/**
 * Базовый результат анализа
 */
export interface BaseAnalysisResult {
  title: string;
  description: string;
  characteristics: string[];
  severity: 'minimal' | 'moderate' | 'significant' | 'critical';
}

/**
 * Анализ стилей привязанности
 */
export interface AttachmentStyleProps extends BaseAnalysisProps {
  attachmentAnswers: string[];
}

export interface AttachmentStyle extends BaseAnalysisResult {
  type: 'anxious' | 'avoidant' | 'disorganized' | 'secure' | 'anxious_high_functioning' | 'avoidant_intellectual' | 'earned_secure' | 'mixed';
  workingWith: string[];
  healthyDevelopment: string[];
  relationshipAdvice: string[];
}

/**
 * Анализ паттернов травмы
 */
export interface TraumaPatternProps extends BaseAnalysisProps {
  traumaAnswers: string[];
}

export interface TraumaPattern extends BaseAnalysisResult {
  type: 'childhood_activation' | 'karmic_loop' | 'survival_fear' | 'healthy_processing' | 'compensated_high_functioning' | 'integrated_wisdom' | 'unresolved_childhood' | 'adaptive_management' | 'moderate_trauma';
  healingPath: string[];
  therapyRecommendations: string[];
  warningSignals: string[];
}

/**
 * Анализ границ
 */
export interface BoundariesHealthProps extends BaseAnalysisProps {
  boundariesAnswers: string[];
}

export interface BoundariesHealth extends BaseAnalysisResult {
  type: 'weak' | 'rigid' | 'fluctuating' | 'healthy' | 'developing';
  practicalExercises: string[];
  boundaryStatements: string[];
}

/**
 * Анализ динамики ревности
 */
export interface JealousyDynamicsProps extends BaseAnalysisProps {
  jealousyAnswers: string[];
}

export interface JealousyDynamics extends BaseAnalysisResult {
  type: 'insecurity_based' | 'control_based' | 'trauma_based' | 'minimal' | 'healthy_concern';
  triggers: string[];
  healthyPractices: string[];
  communicationStrategies: string[];
}

/**
 * Анализ разрыва зрелости
 */
export interface MaturityGapProps extends BaseAnalysisProps {
  // Доминантная зона для уточнения рекомендаций
  dominantZone?: string;
}

export interface MaturityGapAnalysis extends BaseAnalysisResult {
  gapSize: 'none' | 'small' | 'moderate' | 'large' | 'extreme';
  direction: 'personal_higher' | 'relationship_higher' | 'balanced';
  balancingStrategies: string[];
  expectedTimeframe: string;
}

/**
 * Анализ мотивации отношений
 */
export interface RelationshipMotivationProps extends BaseAnalysisProps {
  motivationAnswers: string[];
}

export interface RelationshipMotivation extends BaseAnalysisResult {
  type: 'need_based' | 'fear_based' | 'growth_based' | 'purpose_based' | 'mixed';
  healthierAlternatives: string[];
  selfReflectionQuestions: string[];
}
