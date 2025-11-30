/**
 * ТИПЫ ДАННЫХ ТЕСТА "ЛЕСТНИЦА СОЮЗА"
 * Фундаментальная структура всей системы
 */
export type TestMode = 'self' | 'partner_assessment' | 'potential' | 'pair_discussion';
export type RelationshipStatus = 'in_relationship' | 'single_past' | 'single_potential' | 'pair_together';
export type RelationshipType = 'heterosexual_pair';
export type UnionLevel = number;
export interface UserProfile {
    sessionId: string;
    relationshipStatus: RelationshipStatus;
    relationshipType: RelationshipType;
    hasPartner: boolean;
    testMode: TestMode;
}
export interface AnswerOption {
    id: string;
    text: string;
    level: UnionLevel;
    indicators: string[];
    validation?: string;
}
export interface SmartQuestion {
    id: string;
    text: {
        self: string;
        partner: string;
        potential: string;
        pair_discussion: string;
    };
    category: 'conflict' | 'intimacy' | 'values' | 'communication' | 'growth' | 'boundaries' | 'acceptance' | 'creativity' | 'transcendence' | 'validation';
    options: AnswerOption[];
    targetLevels: UnionLevel[];
    isValidation?: boolean;
    priority?: number;
}
export interface UserAnswer {
    questionId: string;
    selectedOptionId: string;
    selectedLevel: UnionLevel;
    responseTime: number;
    timestamp: number;
    mode: TestMode;
}
export interface LevelScore {
    level: UnionLevel;
    percentage: number;
    confidence: number;
}
export interface ValidationMetrics {
    responseSpeedAnomaly: boolean;
    averageResponseTime: number;
    socialDesirabilityScore: number;
    coherenceScore: number;
    contradictionFlags: string[];
    spiritualBypassScore: number;
    reliabilityScore: number;
    reliability: 'high' | 'medium' | 'low';
}
export interface TestResult {
    sessionId: string;
    testMode: TestMode;
    relationshipStatus: RelationshipStatus;
    personalLevel: number;
    relationshipLevel: number;
    levelScores: LevelScore[];
    validation: ValidationMetrics;
    answers: UserAnswer[];
    totalQuestions: number;
    completionTime: number;
    createdAt: number;
    updatedAt: number;
}
export interface ComparisonResult extends TestResult {
    comparisonWith?: TestResult;
    gap?: number;
    compatibility?: number;
    recommendations: string[];
}
export interface ActionStep {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: 'easy' | 'moderate' | 'challenging';
    example: string;
    expected_outcome: string;
}
export interface ActionPlan {
    level: UnionLevel;
    mainChallenge: string;
    topActions: ActionStep[];
}
export interface Recommendation {
    type: 'action' | 'insight' | 'resource' | 'caution';
    text: string;
    priority: 'high' | 'medium' | 'low';
    targetLevel?: UnionLevel;
}
export interface LevelDefinition {
    level: UnionLevel;
    name: string;
    icon: string;
    color: string;
    shortDescription: string;
    fullDescription: string;
    markers: string[];
    risks: string[];
    growthPath: string;
}
export interface LadderVisualizationData {
    currentLevel: number;
    currentColor: string;
    potentialLevel?: number;
    potentialColor?: string;
    history?: Array<{
        date: number;
        level: number;
    }>;
}
export interface TestSession {
    sessionId: string;
    userProfile: UserProfile;
    results: TestResult[];
    currentStep: 'init' | 'testing' | 'results' | 'completed';
    createdAt: number;
}
export interface UserHistory {
    userId?: string;
    sessions: TestSession[];
    totalTests: number;
    averageScore: number;
    trend: 'improving' | 'stable' | 'declining';
}
