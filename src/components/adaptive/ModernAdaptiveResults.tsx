import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { selectPersonalIndicators, selectRelationshipIndicators } from '../../utils/indicators-filters';
import { 
  Heart, 
  User, 
  Users, 
  Target,
  RotateCcw,
  Download,
  Share2,
  Home,
  Award,
  BarChart3,
  Layers,
  Zap,
  Info
} from 'lucide-react';

// Современные компоненты
import { 
  ModernSection, 
  MetricCard, 
  ModernTabs, 
  ToggleView,
  ProgressIndicator
} from '../modern/ModernResultsLayout';

// Существующие компоненты
import { UnionLadder, UnionWaveChart, CompatibilityAnalysis } from '../index';
import MaturityGapAnalysis from './MaturityGapAnalysis';
import ContradictionAnalysis from './ContradictionAnalysis';
import EnhancedIndicatorsSummary from './EnhancedIndicatorsSummary';

// Новые компоненты для дебага и интерпретации
// import TestDebugInfo from '../results/TestDebugInfo';
import PsychologicalInsights from '../results/PsychologicalInsights';

// Специализированные анализы
import TraumaPatternAnalysisRefactored from './TraumaPatternAnalysisRefactored';
import AttachmentStyleAnalysisRefactored from './AttachmentStyleAnalysisRefactored';
import BoundariesHealthAnalysisRefactored from './BoundariesHealthAnalysisRefactored';
import JealousyDynamicsAnalysis from './JealousyDynamicsAnalysis';
import RelationshipMotivationAnalysis from './RelationshipMotivationAnalysis';
import PersonalizedRecommendations from './PersonalizedRecommendations';

// Типы и утилиты
import { SmartTestResult } from '../../utils/smart-adaptive-engine';
import { TestResult, LevelDistributionItem, ValidationResult } from '../../utils/calculateResult';
import { levels } from '../../utils/levels';
import { generatePDF } from '../../utils/pdfGenerator';
import ErrorBoundary from '../ErrorBoundary';

// UI компоненты
import Tooltip from '../ui/Tooltip';

// Стили
import '../../styles/design-system.css';
import '../../styles/results-page.css';

interface ModernAdaptiveResultsProps {
  result: SmartTestResult;
  onRestart: () => void;
}

// Функция для получения текстового описания тренда
const getTrendText = (trend: string): string => {
  switch (trend) {
    case 'growing': return 'Отношения развиваются';
    case 'declining': return 'Отношения деградируют';
    default: return 'Отношения стабильны';
  }
};

// ИСПРАВЛЕННАЯ функция конвертации - убираем фальсификацию данных
const convertAdaptiveToTestResult = (adaptiveResult: SmartTestResult): TestResult => {
  console.log('🔄 convertAdaptiveToTestResult: Начинаем конвертацию с данными:', adaptiveResult);
  
  const levelDistribution: LevelDistributionItem[] = [];
  const levelScores: Array<{ levelId: number; personalScore: number; relationshipScore: number; totalScore: number }> = [];
  
  const personalMaturityLevel = Math.round(adaptiveResult.personalMaturity);
  const relationshipMaturityLevel = Math.round(adaptiveResult.relationshipMaturity);
  
  // ИСПРАВЛЕНО: Используем реальное распределение вместо fake данных
  for (let levelId = 1; levelId <= 12; levelId++) {
    let personalPercentage = 0;
    let relationshipPercentage = 0;
    
    // Реальное распределение на основе фактических данных
    const personalDistance = Math.abs(levelId - adaptiveResult.personalMaturity);
    const relationshipDistance = Math.abs(levelId - adaptiveResult.relationshipMaturity);
    
    // Логистическая функция для распределения
    personalPercentage = Math.round(100 * Math.exp(-personalDistance * 0.7) * adaptiveResult.confidence);
    relationshipPercentage = Math.round(100 * Math.exp(-relationshipDistance * 0.7) * adaptiveResult.confidence);
    
    // Главный уровень всегда получает максимальный процент
    if (levelId === personalMaturityLevel) {
      personalPercentage = Math.max(personalPercentage, 85);
    }
    if (levelId === relationshipMaturityLevel) {
      relationshipPercentage = Math.max(relationshipPercentage, 85);
    }
    
    const personalScore = personalPercentage;
    const relationshipScore = relationshipPercentage;
    const totalScore = Math.round((personalScore + relationshipScore) / 2);
    
    levelDistribution.push({
      levelId,
      personal: personalScore,
      relationship: relationshipScore,
      total: totalScore,
      personalPercentage,
      relationshipPercentage,
      totalPercentage: totalScore
    });
    
    levelScores.push({
      levelId,
      personalScore,
      relationshipScore,
      totalScore
    });
  }
  
  const validation: ValidationResult = {
    isReliable: adaptiveResult.confidence >= 0.7,
    reliabilityScore: Math.round(adaptiveResult.confidence * 100),
    message: adaptiveResult.confidence >= 0.7 ? 'Адаптивный тест успешно завершен' : 'Результаты требуют осторожной интерпретации',
    warnings: adaptiveResult.confidence < 0.7 ? ['Низкая уверенность в результатах'] : []
  };
  
  // Используем оптимизированную систему фильтрации индикаторов
  const personalIndicators = selectPersonalIndicators(adaptiveResult.indicators);
  const relationshipIndicators = selectRelationshipIndicators(adaptiveResult.indicators);
  
  const result: TestResult = {
    personalLevel: Math.round(adaptiveResult.personalMaturity),
    relationshipLevel: Math.round(adaptiveResult.relationshipMaturity),
    potentialLevel: Math.max(Math.round(adaptiveResult.personalMaturity), Math.round(adaptiveResult.relationshipMaturity)),
    levelDistribution,
    dominantLevels: [
      { levelId: Math.round(adaptiveResult.personalMaturity), type: 'personal' as const },
      { levelId: Math.round(adaptiveResult.relationshipMaturity), type: 'relationship' as const }
    ],
    levelScores,
    profile: {
      dominantZone: adaptiveResult.detectedZone,
      // Синхронизируем логику с calculateResult.ts
      developmentVector: (() => {
        const gap = Math.abs(Math.round(adaptiveResult.personalMaturity) - Math.round(adaptiveResult.relationshipMaturity));
        return gap > 2 ? 'contradictory' as const : gap === 0 ? 'balanced' as const : 'ascending' as const;
      })(),
      coherence: Math.min(100, Math.round(adaptiveResult.consistency * 100)),
      // Стандартизируем расчет общей зрелости согласно алгоритму в calculateResult
      maturity: Math.round(((adaptiveResult.personalMaturity + adaptiveResult.relationshipMaturity) / 24) * 100)
    },
    validation,
    interpretation: {
      title: `Уровень ${Math.round(adaptiveResult.personalMaturity)} → ${Math.round(adaptiveResult.relationshipMaturity)}`,
      description: `Личная зрелость: ${adaptiveResult.personalMaturity.toFixed(1)} ступень, Зрелость отношений: ${adaptiveResult.relationshipMaturity.toFixed(1)} ступень`,
      corePattern: adaptiveResult.detectedZone,
      keyInsight: `${getTrendText(adaptiveResult.relationshipTrend)} с тенденцией к ${adaptiveResult.relationshipTrend === 'growing' ? 'развитию' : adaptiveResult.relationshipTrend === 'declining' ? 'стагнации' : 'стабильности'}`,
      growthAreas: personalIndicators.slice(0, 3),
      recommendations: adaptiveResult.gapAnalysis.recommendations.slice(0, 5),
      risks: relationshipIndicators.slice(0, 3)
    },
    timestamp: Date.now(),
    answersCount: adaptiveResult.questionsAsked
  };
  
  return result;
};

export default function ModernAdaptiveResults({ result, onRestart }: ModernAdaptiveResultsProps) {
  console.log('🎯 ModernAdaptiveResults: КОМПОНЕНТ ЗАПУЩЕН с result:', result);
  
  const navigate = useNavigate();
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  
  const convertedResult = convertAdaptiveToTestResult(result);

  const getAdaptiveTitle = (): string => {
    switch (result.relationshipStatus) {
      case 'in_relationship':
        return 'Анализ ваших отношений';
      case 'single':
        return 'Ваш профиль готовности';
      case 'complicated':
        return 'Анализ переходного периода';
      default:
        return 'Ваши результаты';
    }
  };

  const getAdaptiveDescription = (): string => {
    switch (result.relationshipStatus) {
      case 'in_relationship':
        return 'Глубокий анализ качества и потенциала развития ваших текущих отношений по модели "Лестница Союза"';
      case 'single':
        return 'Анализ вашей готовности к отношениям и рекомендации по подготовке к осознанному союзу';
      case 'complicated':
        return 'Анализ текущей ситуации и пути к гармонизации отношений в переходный период';
      default:
        return 'Адаптивный тест "Лестница Союза" — ваш персональный путь к осознанным отношениям';
    }
  };

  const getPersonalMaturityTitle = (): string => {
    switch (result.relationshipStatus) {
      case 'in_relationship':
        return 'Ваша зрелость';
      case 'single':
        return 'Личная готовность';
      case 'complicated':
        return 'Внутренние ресурсы';
      default:
        return 'Личная зрелость';
    }
  };

  const getPersonalMaturityTooltip = (): string => {
    switch (result.relationshipStatus) {
      case 'in_relationship':
        return 'Ваша способность быть зрелым партнером: самопознание, эмоциональная регуляция, личностный рост';
      case 'single':
        return 'Ваша готовность к созданию отношений: самопознание, эмоциональная стабильность, личные границы';
      case 'complicated':
        return 'Ваши внутренние ресурсы для прохождения кризиса: стрессоустойчивость, самоподдержка, способность к изменениям';
      default:
        return 'Способность к самопознанию, эмоциональной регуляции и личностному росту';
    }
  };

  const getRelationshipMaturityTitle = (): string => {
    switch (result.relationshipStatus) {
      case 'in_relationship':
        return 'Качество отношений';
      case 'single':
        return 'Потенциал для союза';
      case 'complicated':
        return 'Навыки преодоления кризиса';
      default:
        return 'Зрелость отношений';
    }
  };

  const getRelationshipMaturityTooltip = (): string => {
    switch (result.relationshipStatus) {
      case 'in_relationship':
        return 'Качество ваших текущих отношений: способность к близости, разрешению конфликтов, совместному росту';
      case 'single':
        return 'Ваш потенциал для создания здоровых отношений: навыки близости, коммуникации, эмпатии';
      case 'complicated':
        return 'Ваши навыки преодоления кризиса в отношениях: способность к диалогу, поиску решений, сохранению связи';
      default:
        return 'Способность строить здоровые, гармоничные отношения с партнером';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Мои результаты адаптивного теста "Лестница Союза"',
          text: `Я прошел адаптивный тест "Лестница Союза" и получил интересные результаты! Личная зрелость: ${Math.round(result.personalMaturity)}, Зрелость отношений: ${Math.round(result.relationshipMaturity)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleDownload = async () => {
    try {
      await generatePDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  // Группировка индикаторов (данные доступны для будущего использования)

  // Подготовка табов для детального анализа
  const detailedAnalysisTabs = [
    {
      id: 'compatibility',
      label: 'Совместимость',
      badge: '🎯',
      content: (
        <ErrorBoundary>
          <CompatibilityAnalysis
            personalMaturity={result.personalMaturity}
            relationshipMaturity={result.relationshipMaturity}
          />
        </ErrorBoundary>
      )
    },
    {
      id: 'maturity-gap',
      label: 'Анализ зрелости',
      badge: '📊',
      content: (
        <ErrorBoundary>
          <MaturityGapAnalysis
            personalMaturity={result.personalMaturity}
            relationshipMaturity={result.relationshipMaturity}
            gapAnalysis={result.gapAnalysis}
          />
        </ErrorBoundary>
      )
    },
    {
      id: 'quality',
      label: 'Качество ответов',
      badge: '🔍',
      content: (
        <ErrorBoundary>
          <ContradictionAnalysis
            contradictions={result.contradictions}
            consistency={result.consistency}
            validationScore={result.validationScore}
            questionsAsked={result.questionsAsked}
          />
        </ErrorBoundary>
      )
    }
  ];

  // Подготовка табов для специализированных анализов
  const specializedAnalysisTabs = [
    {
      id: 'personalized',
      label: 'Персональные рекомендации',
      content: (
        <ErrorBoundary>
          <PersonalizedRecommendations 
            personalMaturity={result.personalMaturity}
            relationshipMaturity={result.relationshipMaturity}
            relationshipStatus={result.relationshipStatus}
            gapAnalysis={result.gapAnalysis}
          />
        </ErrorBoundary>
      )
    },
    {
      id: 'trauma',
      label: 'Травматические паттерны',
      content: (
        <ErrorBoundary>
          <TraumaPatternAnalysisRefactored 
            traumaAnswers={result.specializedData.traumaAnswers}
            indicators={result.specializedData.rawIndicators}
            personalMaturity={result.personalMaturity}
            relationshipMaturity={result.relationshipMaturity}
          />
        </ErrorBoundary>
      )
    },
    {
      id: 'attachment',
      label: 'Стиль привязанности',
      content: (
        <ErrorBoundary>
          <AttachmentStyleAnalysisRefactored 
            attachmentAnswers={result.specializedData.attachmentAnswers}
            indicators={result.specializedData.rawIndicators}
            personalMaturity={result.personalMaturity}
            relationshipMaturity={result.relationshipMaturity}
          />
        </ErrorBoundary>
      )
    },
    {
      id: 'boundaries',
      label: 'Границы',
      content: (
        <ErrorBoundary>
          <BoundariesHealthAnalysisRefactored 
            boundariesAnswers={result.specializedData.boundariesAnswers}
            indicators={result.specializedData.rawIndicators}
            personalMaturity={result.personalMaturity}
            relationshipMaturity={result.relationshipMaturity}
          />
        </ErrorBoundary>
      )
    },
    {
      id: 'jealousy',
      label: 'Ревность',
      content: (
        <ErrorBoundary>
          <JealousyDynamicsAnalysis 
            jealousyAnswers={result.specializedData.jealousyAnswers}
            indicators={result.specializedData.rawIndicators}
            personalMaturity={result.personalMaturity}
            relationshipMaturity={result.relationshipMaturity}
          />
        </ErrorBoundary>
      )
    },
    {
      id: 'motivation',
      label: 'Мотивация',
      content: (
        <ErrorBoundary>
          <RelationshipMotivationAnalysis 
            motivationAnswers={result.specializedData.motivationAnswers}
            indicators={result.specializedData.rawIndicators}
            personalMaturity={result.personalMaturity}
            relationshipMaturity={result.relationshipMaturity}
          />
        </ErrorBoundary>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50" data-testid="results-page">
      <div className="container">
        
        {/* Заголовок и быстрые действия */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', paddingTop: '3rem', marginBottom: '3rem' }}
        >
          <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' }}>
            {getAdaptiveTitle()}
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', maxWidth: '32rem', margin: '0 auto 1.5rem' }}>
            {getAdaptiveDescription()}
          </p>
          
          {/* Быстрые действия */}
          <div className="action-buttons">
            <button 
              onClick={onRestart} 
              className="compact-btn compact-btn--primary"
            >
              <RotateCcw className="w-3 h-3" />
              Пройти снова
            </button>
            <button 
              onClick={handleShare} 
              className="compact-btn compact-btn--outline"
            >
              <Share2 className="w-3 h-3" />
              Поделиться
            </button>
            <button 
              onClick={handleDownload} 
              className="pdf-button compact-btn compact-btn--outline"
              aria-label="Скачать результаты в PDF"
            >
              <Download className="w-3 h-3" />
              Скачать PDF
            </button>
            <button 
              onClick={goHome} 
              className="compact-btn compact-btn--outline"
            >
              <Home className="w-3 h-3" />
              На главную
            </button>
          </div>
        </motion.div>



        {/* Основные результаты */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
          style={{ marginBottom: '4rem' }}
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 min-h-[140px] flex flex-col">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-semibold text-blue-800">{getPersonalMaturityTitle()}</h3>
              </div>
              <Tooltip content={getPersonalMaturityTooltip()}>
                <Info className="w-4 h-4 text-blue-400 hover:text-blue-600 cursor-help" />
              </Tooltip>
            </div>
            
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {Math.round(result.personalMaturity)} уровень
            </div>
            
            <div className="text-sm font-medium text-blue-600 mb-1">
              {levels.find(l => l.id === Math.round(result.personalMaturity))?.name || 'Связь'}
            </div>
            
            <div className="text-xs text-gray-700 flex-1">
              {levels.find(l => l.id === Math.round(result.personalMaturity))?.shortDescription || 'Доверие, интерес, открытость, диалог, уважение границ'}
            </div>
          </div>

          {/* Центральный блок динамики отношений */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 text-center min-h-[140px] flex flex-col">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-semibold text-purple-800">Динамика отношений</h3>
              </div>
              <Tooltip content="Анализ текущего состояния и траектории развития отношений">
                <Info className="w-4 h-4 text-purple-400 hover:text-purple-600 cursor-help" />
              </Tooltip>
            </div>
            
            {/* Основной индикатор */}
            <div className="text-lg font-bold text-purple-700 mb-1" style={{ whiteSpace: 'pre-line' }}>
              {getTrendText(result.relationshipTrend) === 'Отношения деградируют' ? 'Отношения\nдеградируют' : getTrendText(result.relationshipTrend)}
            </div>
            <div className="text-sm text-purple-600 mb-3">Текущий тренд</div>

            {/* Дополнительная аналитика */}
            <div className="flex justify-center items-center gap-3 text-xs text-gray-600 mt-auto">
              <div className="text-center">
                <div className="font-semibold text-gray-800">{Math.round(result.confidence * 100)}%</div>
                <div>Уверенность</div>
              </div>
              <div className="w-px h-4 bg-purple-300"></div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">{Math.abs(result.personalMaturity - result.relationshipMaturity).toFixed(1)}</div>
                <div>Разрыв</div>
              </div>
              <div className="w-px h-4 bg-purple-300"></div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">{Math.round(result.consistency * 100)}%</div>
                <div>Согласованность</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 min-h-[140px] flex flex-col">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <Users className="w-5 h-5 text-green-600" />
                <h3 className="text-base font-semibold text-green-800">{getRelationshipMaturityTitle()}</h3>
              </div>
              <Tooltip content={getRelationshipMaturityTooltip()}>
                <Info className="w-4 h-4 text-green-400 hover:text-green-600 cursor-help" />
              </Tooltip>
            </div>
            
            <div className="text-2xl font-bold text-green-700 mb-1">
              {Math.round(result.relationshipMaturity)} уровень
            </div>
            
            <div className="text-sm font-medium text-green-600 mb-1">
              {levels.find(l => l.id === Math.round(result.relationshipMaturity))?.name || 'Статус'}
            </div>
            
            <div className="text-xs text-gray-700 flex-1">
              {levels.find(l => l.id === Math.round(result.relationshipMaturity))?.shortDescription || 'Образ, социальная функция, имидж, традиция, фасад'}
            </div>
          </div>
        </motion.div>



        {/* Лестница Союза */}
        <div style={{ marginBottom: '4rem' }}>
          <ModernSection
            title="Интерактивная лестница развития"
            subtitle="Нажмите на любую ступень, чтобы узнать больше о каждом уровне"
            icon={<Layers className="w-5 h-5" />}
            variant="primary"
            priority="high"
            collapsible={false}
          >
          <ErrorBoundary>
            <UnionLadder 
              result={convertedResult}
              selectedLevelId={selectedLevelId || Math.round(result.personalMaturity)}
              onLevelSelect={setSelectedLevelId}
            />
          </ErrorBoundary>
        </ModernSection>
        </div>

        {/* Углублённая психологическая интерпретация */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginBottom: '4rem' }}
        >
          <ErrorBoundary>
            <PsychologicalInsights 
              results={convertAdaptiveToTestResult(result)}
              className="mb-6"
            />
          </ErrorBoundary>
        </motion.div>

        {/* Детальный анализ */}
        <div style={{ marginBottom: '4rem' }}>
          <ModernSection
            title="Детальный психологический анализ"
            subtitle="Углубленное исследование различных аспектов вашей личности и отношений"
            icon={<BarChart3 className="w-5 h-5" />}
            variant="success"
            priority="medium"
          >
            <ModernTabs tabs={detailedAnalysisTabs} defaultTab="compatibility" />
          </ModernSection>
        </div>

        {/* Специализированные анализы */}
        <div style={{ marginBottom: '4rem' }}>
          <ModernSection
            title="Специализированные психологические анализы"
            subtitle="Глубокий анализ конкретных паттернов поведения и психологических особенностей"
            icon={<Zap className="w-5 h-5" />}
            variant="purple"
            priority="medium"
            defaultExpanded={false}
          >
            <ModernTabs tabs={specializedAnalysisTabs} defaultTab="trauma" compact />
          </ModernSection>
        </div>

        {/* Визуализации */}
        <div style={{ marginBottom: '4rem' }}>
          <ModernSection
            title="Визуализация результатов"
            subtitle="Графическое представление ваших результатов для лучшего понимания"
            icon={<Award className="w-5 h-5" />}
            variant="warning"
            priority="low"
            defaultExpanded={false}
          >
          <div className="space-y-6">
            {/* Волновой график */}
            <div>
              <h4 className="font-semibold mb-4">Волновой график развития</h4>
              <ErrorBoundary>
                <UnionWaveChart result={convertAdaptiveToTestResult(result)} />
              </ErrorBoundary>
            </div>
            
            {/* Прогресс индикаторы */}
            <div>
              <h4 className="font-semibold mb-4">Показатели развития</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ProgressIndicator
                  label="Личная зрелость"
                  value={Math.round(result.personalMaturity * 8.33)}
                  color="blue"
                />
                <ProgressIndicator
                  label="Зрелость отношений"
                  value={Math.round(result.relationshipMaturity * 8.33)}
                  color="green"
                />
                <ProgressIndicator
                  label="Уверенность диагностики"
                  value={result.confidence}
                  color="purple"
                />
                <ProgressIndicator
                  label="Согласованность ответов"
                  value={Math.round(result.consistency * 100)}
                  color="orange"
                />
              </div>
            </div>

            {/* Улучшенные индикаторы */}
            <ToggleView label="Показать расширенный анализ индикаторов">
              <ErrorBoundary>
                <EnhancedIndicatorsSummary
                  indicators={result.indicators}
                  personalMaturity={result.personalMaturity}
                  relationshipMaturity={result.relationshipMaturity}
                  detectedZone={result.detectedZone}
                />
              </ErrorBoundary>
            </ToggleView>
          </div>
        </ModernSection>
        </div>

        {/* Статистика адаптивного теста */}
        <div style={{ marginBottom: '4rem' }}>
          <ModernSection
            title="Статистика адаптивного тестирования"
            subtitle="Метрики качества и эффективности алгоритма"
            icon={<Target className="w-5 h-5" />}
            variant="primary"
            priority="low"
            defaultExpanded={false}
          >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Задано вопросов"
              value={result.questionsAsked}
              subtitle="вместо обычных 25+"
              color="blue"
              size="sm"
            />
            <MetricCard
              title="Уверенность"
                                value={`${Math.round(result.confidence * 100)}%`}
              subtitle="в точности диагностики"
              color="green"
              size="sm"
            />
            <MetricCard
              title="Согласованность"
              value={`${Math.round(result.consistency * 100)}%`}
              subtitle="ответов"
              color="purple"
              size="sm"
            />
            <MetricCard
              title="Время"
              value="~3-5 мин"
              subtitle="прохождения"
              color="orange"
              size="sm"
            />
          </div>
        </ModernSection>
        </div>

        {/* Маркетинговый призыв к действию */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
          style={{ marginTop: '5rem', marginBottom: '4rem' }}
        >
          <div className="modern-card modern-card--primary max-w-4xl mx-auto">
            <div className="text-center">
              <Heart className="w-16 h-16 text-pink-500 mx-auto mb-6" />
              <h2 className="heading-2 mb-6" style={{ fontSize: '2.5rem', color: 'var(--color-text)' }}>
                Готовы поднять ваши отношения на новый уровень?
              </h2>
              
              <div className="text-left max-w-3xl mx-auto mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">
                    🎯 Диагностика — это только начало вашего пути!
                  </h3>
                  <p className="text-purple-700 text-center text-lg leading-relaxed">
                    Знание своего текущего уровня дает вам карту, но чтобы двигаться дальше, 
                    нужны конкретные инструменты и пошаговый план действий. 
                    Именно это вы получите в <strong>бесплатном марафоне "12 ступеней к идеальным отношениям"</strong>
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">5 дней</div>
                    <div className="text-sm text-yellow-700">интенсивной работы</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">700.000+</div>
                    <div className="text-sm text-blue-700">женщин изменили жизнь</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">15 лет</div>
                    <div className="text-sm text-green-700">опыта автора</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <a 
                  href="https://coachingacademy.su/12steps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="gradient-button"
                  style={{ 
                    fontSize: '1.25rem', 
                    padding: '20px 40px', 
                    borderRadius: '50px',
                    display: 'inline-block',
                    textDecoration: 'none',
                    marginBottom: '1rem'
                  }}
                >
                  🚀 ПРИСОЕДИНИТЬСЯ К БЕСПЛАТНОМУ МАРАФОНУ
                </a>
                <p className="text-sm text-gray-600">
                  ⏰ Начните движение к отношениям вашей мечты уже сегодня
                </p>
              </div>
              
              <div className="border-t pt-6">
                <p className="text-gray-500 text-sm mb-4">
                  Или изучите ваши результаты глубже:
                </p>
                <div className="action-buttons">
                  <button onClick={onRestart} className="compact-btn compact-btn--outline">
                    <RotateCcw className="w-3 h-3" />
                    Пройти тест снова
                  </button>
                  <button onClick={handleShare} className="compact-btn compact-btn--outline">
                    <Share2 className="w-3 h-3" />
                    Поделиться результатами
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 