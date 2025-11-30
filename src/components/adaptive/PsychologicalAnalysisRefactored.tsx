import React from 'react';
import { TestResult } from '../../utils/calculateResult';

// Импортируем рефакторинговые компоненты
import AttachmentStyleAnalysisRefactored from './AttachmentStyleAnalysisRefactored';
import TraumaPatternAnalysisRefactored from './TraumaPatternAnalysisRefactored';
import BoundariesHealthAnalysisRefactored from './BoundariesHealthAnalysisRefactored';
import JealousyDynamicsAnalysisRefactored from './JealousyDynamicsAnalysisRefactored';
import MaturityGapAnalysisRefactored from './MaturityGapAnalysisRefactored';
import RelationshipMotivationAnalysisRefactored from './RelationshipMotivationAnalysisRefactored';

interface PsychologicalAnalysisProps {
  testResult: TestResult;
  showAllAnalysis?: boolean;
}

/**
 * Интегрированный компонент психологического анализа, объединяющий все рефакторинговые модули
 */
const PsychologicalAnalysisRefactored: React.FC<PsychologicalAnalysisProps> = ({
  testResult,
  showAllAnalysis = true
}) => {
  // Извлекаем необходимые данные из testResult
  const {
    personalLevel,
    relationshipLevel
  } = testResult;
  
  // Получаем информацию о профиле, если она доступна
  const dominantZone = testResult.profile?.dominantZone || 'mature';
  
  // Для совместимости с рефакторинговыми компонентами
  const personalMaturity = personalLevel;
  const relationshipMaturity = relationshipLevel;
  
  // Индикаторы (упрощенный вариант для демонстрации)
  const indicators: string[] = [];

  // Для демонстрации - заглушки для имитации ответов на вопросы
  const traumaAnswers: string[] = ['trauma_response', 'past_trauma_trigger'];
  const boundariesAnswers: string[] = ['boundaries_weak', 'boundaries_flexible'];
  const jealousyAnswers: string[] = ['jealousy_low', 'trust_high'];
  const motivationAnswers: string[] = ['growth_motivation', 'purpose_connection'];
  const attachmentAnswers: string[] = ['secure_attachment', 'earned_secure'];

  return (
    <div className="psychological-analysis">
      {/* Разрыв зрелости - базовый анализ, показываем всегда */}
      <MaturityGapAnalysisRefactored
        personalMaturity={personalMaturity}
        relationshipMaturity={relationshipMaturity}
        indicators={indicators}
        dominantZone={dominantZone}
      />

      {/* Если включен полный анализ или имеются специфические индикаторы */}
      {(showAllAnalysis || indicators.some((i: string) => i.includes('trauma'))) && (
        <TraumaPatternAnalysisRefactored
          traumaAnswers={traumaAnswers}
          personalMaturity={personalMaturity}
          relationshipMaturity={relationshipMaturity}
          indicators={indicators}
        />
      )}

      {/* Анализ границ */}
      {(showAllAnalysis || indicators.some((i: string) => i.includes('bound'))) && (
        <BoundariesHealthAnalysisRefactored
          boundariesAnswers={boundariesAnswers}
          personalMaturity={personalMaturity}
          relationshipMaturity={relationshipMaturity}
          indicators={indicators}
        />
      )}

      {/* Анализ ревности */}
      {(showAllAnalysis || indicators.some((i: string) => i.includes('jeal'))) && (
        <JealousyDynamicsAnalysisRefactored
          jealousyAnswers={jealousyAnswers}
          personalMaturity={personalMaturity}
          relationshipMaturity={relationshipMaturity}
          indicators={indicators}
        />
      )}

      {/* Анализ мотивации */}
      <RelationshipMotivationAnalysisRefactored
        motivationAnswers={motivationAnswers}
        personalMaturity={personalMaturity}
        relationshipMaturity={relationshipMaturity}
        indicators={indicators}
      />
      
      {/* Анализ стилей привязанности */}
      {(showAllAnalysis || indicators.some((i: string) => i.includes('attach'))) && (
        <AttachmentStyleAnalysisRefactored
          attachmentAnswers={attachmentAnswers}
          personalMaturity={personalMaturity}
          relationshipMaturity={relationshipMaturity}
          indicators={indicators}
        />
      )}
    </div>
  );
};

export default PsychologicalAnalysisRefactored;
