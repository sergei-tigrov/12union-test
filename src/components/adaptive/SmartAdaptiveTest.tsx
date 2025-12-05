import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTelegram } from '../../hooks/useTelegram';

// Утилиты - НОВАЯ ЛОГИКА
import {
  initializeAdaptiveTest,
  getNextQuestion,
  recordAnswer,
  completeTest,
  getCurrentLevelDetection,
  type AdaptiveTestState,
  type QuestionSelection
} from '../../adaptive-algorithm';
import { validateTestResults } from '../../validation-engine';
import { calculateTestResult } from '../../score-calculation';
import { interpretResult } from '../../results-interpreter';
import type { SmartQuestion, TestResult, TestMode, RelationshipStatus, TestScenario, UserAnswer } from '../../types';

// Стили
import '../../styles/shared-components.css';
import '../../styles/design-system.css';

interface SmartAdaptiveTestProps {
  onComplete: (result: TestResult) => void;
  testMode?: TestMode;
  relationshipStatus?: RelationshipStatus;
  testScenario?: TestScenario;
}

// Переводы фаз на русский (НОВАЯ СИСТЕМА)
const phaseTranslations = {
  'zoning': 'Определение зоны',
  'refinement': 'Уточнение уровня',
  'validation': 'Проверка результата',
  'complete': 'Завершение'
};

// Цвета для фаз
const phaseColors = {
  'zoning': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'refinement': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'validation': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'complete': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
};

// Улучшенный компонент прогресс-бара с цветовой индикацией
const ProgressBar: React.FC<{ value: number; phase: string; questionCount: number; className?: string }> = ({
  value,
  phase,
  questionCount,
  className
}) => {
  const russianPhase = phaseTranslations[phase as keyof typeof phaseTranslations] || phase;
  const phaseColor = phaseColors[phase as keyof typeof phaseColors] || 'var(--gradient-primary)';

  return (
    <div className={`w-full ${className || ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text)', minWidth: 120 }}>
          Фаза: {russianPhase}
        </span>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '0.01em', minWidth: 60, textAlign: 'center' }}>
          Вопрос {questionCount}
        </span>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', minWidth: 50, textAlign: 'right' }}>{Math.round(value)}%</span>
      </div>
      <div style={{ width: '100%', backgroundColor: 'var(--primary-200)', borderRadius: '50px', height: '12px', overflow: 'hidden' }}>
        <div
          style={{
            background: phaseColor,
            height: '100%',
            borderRadius: '50px',
            transition: 'all 0.5s ease-out',
            width: `${Math.min(100, Math.max(0, value))}%`,
            boxShadow: `0 0 10px ${phaseColor.includes('gradient') ? 'rgba(79, 172, 254, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
        />
      </div>
    </div>
  );
};

export const SmartAdaptiveTest: React.FC<SmartAdaptiveTestProps> = ({
  onComplete,
  testMode = 'self',
  relationshipStatus = 'single_potential',
  testScenario
}) => {
  const { tg, isTelegram } = useTelegram();
  const sessionId = `session-${Date.now()}`;
  const [testState, setTestState] = useState<AdaptiveTestState | null>(null);
  const [currentQuestionData, setCurrentQuestionData] = useState<QuestionSelection | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionHistory, setQuestionHistory] = useState<Array<{ question: SmartQuestion; selectedOption: string }>>([]);

  // Helper function to get the correct answer text variant based on testMode
  const getAnswerText = (optionText: any): string => {
    if (typeof optionText === 'string') {
      // Legacy format - just return as is
      return optionText;
    }
    // New format with variants
    const modeMap: Record<TestMode, keyof typeof optionText> = {
      'self': 'self',
      'partner_assessment': 'partner',
      'potential': 'potential',
      'pair_discussion': 'pair_discussion'
    };
    return optionText[modeMap[testMode]] || optionText.self;
  };

  // Инициализация теста
  useEffect(() => {
    console.log('🔄 SmartAdaptiveTest: Инициализирую новый тест');
    const newState = initializeAdaptiveTest(sessionId);
    setTestState(newState);

    // Получить первый вопрос
    const firstQuestion = getNextQuestion(newState);
    setCurrentQuestionData(firstQuestion);
    console.log('✅ SmartAdaptiveTest: Первый вопрос получен', firstQuestion?.nextQuestion.id);
  }, []);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestionData]);

  // Управление кнопкой Telegram MainButton
  useEffect(() => {
    if (!isTelegram) return;

    if (selectedOption && !isLoading) {
      tg.MainButton.setText('Далее');
      tg.MainButton.show();
      tg.MainButton.onClick(handleNext);
    } else {
      tg.MainButton.hide();
    }

    return () => {
      tg.MainButton.offClick(handleNext);
    };
  }, [selectedOption, isLoading, isTelegram, currentQuestionData]); // Зависимости для обновления обработчика

  // Управление кнопкой Telegram BackButton
  useEffect(() => {
    if (!isTelegram) return;

    if (questionHistory.length > 0) {
      tg.BackButton.show();
      tg.BackButton.onClick(handleGoBack);
    } else {
      tg.BackButton.hide();
    }

    return () => {
      tg.BackButton.offClick(handleGoBack);
    };
  }, [questionHistory, isTelegram]);


  const handleAnswerSelect = (optionId: string) => {
    setSelectedOption(optionId);
    if (isTelegram) {
      tg.HapticFeedback.impactOccurred('light');
    }
  };

  const handleNext = () => {
    if (!selectedOption || !currentQuestionData || !testState) return;

    if (isTelegram) {
      tg.HapticFeedback.impactOccurred('medium');
    }

    setIsLoading(true);

    // Получаем выбранный вариант
    const selectedAnswerOption = currentQuestionData.nextQuestion.options.find(
      (opt) => opt.id === selectedOption
    );
    if (!selectedAnswerOption) return;

    // Рассчитываем время ответа
    const responseTime = Date.now() - startTime;

    // Создаем объект UserAnswer
    const userAnswer: UserAnswer = {
      questionId: currentQuestionData.nextQuestion.id,
      selectedOptionId: selectedOption,
      selectedLevel: selectedAnswerOption.level,
      responseTime,
      timestamp: Date.now(),
      mode: testMode,
    };

    // Добавляем в историю
    setQuestionHistory(prev => [...prev, {
      question: currentQuestionData.nextQuestion,
      selectedOption
    }]);

    // Обрабатываем ответ - НОВАЯ ЛОГИКА (модифицирует state in-place)
    recordAnswer(testState, userAnswer);

    console.log('📊 Test progress:', {
      phase: testState.currentPhase,
      questionsAnswered: testState.questionsAnswered,
      detectedZone: testState.detectedZone
    });

    // Проверяем завершение теста
    if (testState.currentPhase === 'complete') {
      console.log('🎉 Тест завершен! Рассчитываю результаты...');
      completeTest(testState);
      handleCompletion(testState);
      return;
    }

    // Переходим к следующему вопросу
    const nextQuestion = getNextQuestion(testState);

    // Если вопросов больше нет - принудительно завершаем
    if (!nextQuestion) {
      console.log('⚠️ Вопросов больше нет, принудительное завершение...');
      completeTest(testState); // Это обновит фазу на complete
      handleCompletion(testState);
      return;
    }

    setCurrentQuestionData(nextQuestion);
    setSelectedOption(null);
    setIsLoading(false);
  };

  // Вынесенная логика завершения
  const handleCompletion = (finalState: AdaptiveTestState) => {
    console.log('🎉 Тест завершен! Рассчитываю результаты...');

    // Валидируем результаты
    const validationResult = validateTestResults(finalState.answers);

    // Рассчитываем финальный результат
    const finalResult = calculateTestResult(
      sessionId,
      finalState.answers,
      validationResult.metrics,
      testMode,
      relationshipStatus,
      testScenario
    );

    // Интерпретируем результат
    const interpretation = interpretResult(finalResult);

    console.log('✅ Результаты готовы:', finalResult);
    console.log('📝 Интерпретация:', interpretation);

    if (isTelegram) {
      tg.MainButton.hide();
      tg.BackButton.hide();
    }

    onComplete(finalResult);
  };

  // Effect для отлова зависаний
  useEffect(() => {
    if (testState && !currentQuestionData && !isLoading && testState.currentPhase !== 'complete') {
      console.log('🔄 Обнаружено зависание (нет вопроса, не complete) - попытка восстановления...');
      const next = getNextQuestion(testState);
      if (next) {
        setCurrentQuestionData(next);
      } else {
        // Если вопросов реально нет - завершаем
        completeTest(testState);
        handleCompletion(testState);
      }
    }
  }, [testState, currentQuestionData, isLoading]);

  const handleGoBack = () => {
    if (questionHistory.length === 0 || !testState) return;

    if (isTelegram) {
      tg.HapticFeedback.impactOccurred('light');
    }

    // Получаем предыдущий вопрос и ответ
    const previousEntry = questionHistory[questionHistory.length - 1];

    // Удаляем последний ответ из истории
    const updatedAnswers = testState.answers.slice(0, -1);
    const updatedState = { ...testState, answers: updatedAnswers };

    // Обновляем состояние
    setTestState(updatedState);
    setCurrentQuestionData({
      nextQuestion: previousEntry.question,
      phase: testState.currentPhase,
      questionsAnswered: testState.questionsAnswered - 1,
      questionsRemaining: testState.questionsAnswered > 0 ? (24 - (testState.questionsAnswered - 1)) : 24,
      estimatedLevelSoFar: getCurrentLevelDetection(updatedState)
    });
    setSelectedOption(previousEntry.selectedOption);
    setQuestionHistory(prev => prev.slice(0, -1));
  };

  if (!currentQuestionData || !testState) {
    return (
      <div className="container">
        <div style={{
          background: 'white',
          border: '1px solid var(--primary-200)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '32rem',
          margin: '0 auto'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid var(--accent-blue)',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: 'var(--color-text-muted)' }}>Завершение тестирования...</p>
        </div>
      </div>
    );
  }

  // Рассчитать прогресс
  // Максимум вопросов может варьироваться (18-24), поэтому используем адаптивный прогресс
  // Если фаза complete, то всегда 100%
  const maxQuestions = 24;
  const currentProgress = (testState.questionsAnswered / maxQuestions) * 100;
  const progress = testState.currentPhase === 'complete' ? 100 : Math.min(95, currentProgress);

  const phase = testState.currentPhase;
  const questionCount = testState.questionsAnswered + 1;
  const currentQuestion = currentQuestionData.nextQuestion;

  return (
    <div className="container" style={{ paddingBottom: isTelegram ? '80px' : '0' }}>
      {/* Прогресс */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white',
          border: '1px solid var(--primary-200)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}
      >
        <ProgressBar value={progress} phase={phase} questionCount={questionCount} className="w-full" />
      </motion.div>

      {/* Вопрос */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          background: 'white',
          border: '1px solid var(--primary-200)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '1.5rem'
        }}
      >
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--color-text)',
          marginBottom: '2rem',
          lineHeight: '1.5',
          textAlign: 'center'
        }}>
          {currentQuestion.text[testMode === 'partner_assessment' ? 'partner' : testMode]}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentQuestion.options.map((option, index: number) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                className={selectedOption === option.id ? 'gradient-button' : ''}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: selectedOption === option.id ? 'none' : '1px solid var(--primary-200)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: selectedOption === option.id ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: selectedOption === option.id ? '0 8px 25px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
                  background: selectedOption === option.id ? undefined : 'white'
                }}
                onClick={() => handleAnswerSelect(option.id)}
                data-answer={option.id}
                data-level={option.level}
                data-autoclicker-target="answer"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', width: '100%' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${selectedOption === option.id ? 'rgba(255, 255, 255, 0.8)' : 'var(--primary-300)'}`,
                    flexShrink: 0,
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selectedOption === option.id ? 'rgba(255, 255, 255, 0.9)' : 'transparent'
                  }}>
                    {selectedOption === option.id && (
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-blue)' }}></div>
                    )}
                  </div>
                  <div style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.4',
                    color: selectedOption === option.id ? 'white' : 'var(--color-text)'
                  }}>
                    {getAnswerText(option.text)}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Навигация - скрываем в Telegram, так как используем нативные кнопки */}
      {!isTelegram && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
        >
          {/* Кнопка назад */}
          {questionHistory.length > 0 && (
            <button
              onClick={handleGoBack}
              className="compact-btn compact-btn--outline"
              style={{
                minWidth: '120px',
                height: '44px',
                fontSize: '1rem',
                fontWeight: '500',
                borderRadius: '50px',
                border: '1px solid var(--primary-300)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'white',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          )}

          {/* Кнопка далее */}
          <button
            onClick={handleNext}
            disabled={!selectedOption || isLoading}
            className={selectedOption && !isLoading ? 'gradient-button' : ''}
            style={{
              minWidth: '160px',
              height: '44px',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '50px',
              border: selectedOption && !isLoading ? 'none' : '1px solid var(--primary-300)',
              cursor: selectedOption && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              background: selectedOption && !isLoading ? undefined : 'white',
              color: selectedOption && !isLoading ? undefined : 'var(--primary-500)',
              opacity: selectedOption && !isLoading ? 1 : 0.6
            }}
            data-autoclicker-target="next"
            data-testid="next-button"
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid currentColor',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span>Обработка...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span>Далее</span>
                <span>→</span>
              </div>
            )}
          </button>
        </motion.div>
      )}

    </div>
  );
};
