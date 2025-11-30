import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// UI компоненты


// Утилиты
import { SmartAdaptiveEngine, type SmartTestResult } from '../../utils/smart-adaptive-engine';
import type { SmartQuestion } from '../../utils/smart-adaptive-questions';

// Стили
import '../../styles/shared-components.css';
import '../../styles/design-system.css';

interface SmartAdaptiveTestProps {
  onComplete: (result: SmartTestResult) => void;
}

// Переводы фаз на русский
const phaseTranslations = {
  'relationship_status': 'Статус отношений',
  'detection': 'Определение зоны',
  'core_diagnostic': 'Основная диагностика', 
  'clarification': 'Уточнение уровня',
  'validation': 'Проверка результата'
};

// Цвета для фаз
const phaseColors = {
  'relationship_status': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'detection': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'core_diagnostic': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'clarification': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'validation': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
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

export const SmartAdaptiveTest: React.FC<SmartAdaptiveTestProps> = ({ onComplete }) => {
  const [engine] = useState(() => new SmartAdaptiveEngine());
  const [currentQuestion, setCurrentQuestion] = useState<SmartQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionHistory, setQuestionHistory] = useState<Array<{question: SmartQuestion; selectedOption: string}>>([]);

  useEffect(() => {
    // Проверяем, если тест уже завершен, загружаем результаты
    if (engine.isTestComplete()) {
      console.log('🔄 SmartAdaptiveTest: Тест уже завершен, загружаем сохраненные результаты');
      const savedResults = SmartAdaptiveEngine.loadSavedResults();
      if (savedResults) {
        console.log('🔄 SmartAdaptiveTest: Найдены сохраненные результаты, переходим к результатам');
        onComplete(savedResults);
        return;
      } else {
        console.log('🔄 SmartAdaptiveTest: Сохраненные результаты не найдены, получаем новые');
        const results = engine.getResults();
        onComplete(results);
        return;
      }
    }
    
    // Устанавливаем первый вопрос
    const firstQuestion = engine.getNextQuestion();
    setCurrentQuestion(firstQuestion);
    console.log('🔄 SmartAdaptiveTest: Установлен первый вопрос:', firstQuestion?.text);
  }, [engine, onComplete]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion]);

  const handleAnswerSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption || !currentQuestion) return;
    
    setIsLoading(true);
    
    // Добавляем в историю
    setQuestionHistory(prev => [...prev, { question: currentQuestion, selectedOption }]);
    
    // Рассчитываем время ответа
    const responseTime = Date.now() - startTime;
    
    // Обрабатываем ответ
    engine.processAnswer(currentQuestion.id, selectedOption, responseTime);
    
    console.log('Test completion check:', {
      isComplete: engine.isTestComplete(),
      phase: engine.getPhase(),
      answersCount: engine.getAnswersCount()
    });
    
    // Проверяем завершение теста
    if (engine.isTestComplete()) {
      console.log('Test completed! Getting results...');
      const result = engine.getResults();
      console.log('Results:', result);
      onComplete(result);
      return;
    }
    
    // Переходим к следующему вопросу
    const nextQuestion = engine.getNextQuestion();
    setCurrentQuestion(nextQuestion);
    setSelectedOption(null);
    setIsLoading(false);
  };

  const handleGoBack = () => {
    if (questionHistory.length === 0) return;
    
    // Получаем предыдущий вопрос и ответ
    const previousEntry = questionHistory[questionHistory.length - 1];
    
    // Удаляем последний ответ из истории (движок не поддерживает публичное удаление)
    // engine.removeLastAnswer();
    
    // Обновляем состояние
    setCurrentQuestion(previousEntry.question);
    setSelectedOption(previousEntry.selectedOption);
    setQuestionHistory(prev => prev.slice(0, -1));
  };

  if (!currentQuestion) {
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

  const progress = engine.getProgress();
  const phase = engine.getPhase();
  const questionCount = engine.getQuestionCount();

  return (
    <div className="container">
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
            {currentQuestion.text}
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
                data-zone={option.zone}
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
                    {option.text}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Навигация */}
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

    </div>
  );
};
