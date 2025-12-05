import React, { useState } from 'react';

// UI компоненты

// Адаптивные компоненты
import { SmartAdaptiveTest } from '../components/adaptive/SmartAdaptiveTest';
import { ScenarioSelector } from '../components/adaptive/ScenarioSelector';
import ModernAdaptiveResults from '../components/adaptive/ModernAdaptiveResults';

// Типы и утилиты
import type { TestResult, TestScenario } from '../types';
import { mapScenarioToModes } from '../utils/scenario-mapper';

// Стили
import '../styles/design-system.css';

export const SmartAdaptiveTestPage: React.FC = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<TestScenario | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleTestComplete = (result: TestResult) => {
    console.log('🔥 SmartAdaptiveTestPage: handleTestComplete called with result:', result);
    setTestResult(result);
    console.log('🔥 SmartAdaptiveTestPage: testResult state updated, should render results now');
    // Сохраняем результат в localStorage
    localStorage.setItem('adaptiveTestResult', JSON.stringify(result));
  };

  const handleRestart = () => {
    console.log('🔥 SmartAdaptiveTestPage: handleRestart called');
    // Очищаем сохраненные данные
    localStorage.removeItem('adaptiveTestResult');

    setTestStarted(false);
    setSelectedScenario(null);
    setTestResult(null);
  };

  const handleScenarioSelect = (scenario: TestScenario) => {
    console.log('🎯 SmartAdaptiveTestPage: Scenario selected:', scenario);
    setSelectedScenario(scenario);
  };

  console.log('🔥 SmartAdaptiveTestPage: Render state check', {
    testResult: !!testResult,
    testStarted,
    resultType: typeof testResult,
    resultKeys: testResult ? Object.keys(testResult) : 'null'
  });

  if (testResult) {
    console.log('🔥 SmartAdaptiveTestPage: Rendering ModernAdaptiveResults with result:', testResult);
    // TODO: Update ModernAdaptiveResults to work with new TestResult type
    return <ModernAdaptiveResults result={testResult as any} onRestart={handleRestart} />;
  }

  if (testStarted && !selectedScenario) {
    return <ScenarioSelector onSelect={handleScenarioSelect} />;
  }

  if (testStarted && selectedScenario) {
    const modes = mapScenarioToModes(selectedScenario);
    return (
      <div style={{ backgroundColor: 'white' }}>
        <div className="container">
          <SmartAdaptiveTest
            onComplete={handleTestComplete}
            testMode={modes.testMode}
            relationshipStatus={modes.relationshipStatus}
            testScenario={selectedScenario}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        {/* Минималистичная инструкция */}
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '2rem 0' }}>
          {/* Заголовок */}
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            Готовы узнать свой уровень?
          </h1>

          {/* Краткое описание */}
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Пройдите быстрый тест зрелости отношений и получите точный результат из 12 уровней
          </p>

          {/* Ключевые факты */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-green)', marginBottom: '0.5rem' }}>3-5</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>минут</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>95%</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>точность</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>100%</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>конфиденциально</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setTestStarted(true)}
            className="gradient-button"
            style={{
              fontSize: '1.2rem',
              padding: '16px 48px',
              borderRadius: '50px',
              boxShadow: '0 8px 24px rgba(79, 172, 254, 0.25)',
              minWidth: '280px',
              marginBottom: '1.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(79, 172, 254, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 172, 254, 0.25)';
            }}
          >
            🚀 Начать тест
          </button>

          {/* Инструкции */}
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e40af', marginBottom: '1rem', textAlign: 'center' }}>
              💡 Как пройти тест
            </h3>
            <ul style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem' }}>
              <li><strong>Отвечайте честно</strong> — о реальной ситуации, не идеальной</li>
              <li><strong>Думайте о сейчас</strong> — как дела в отношениях прямо сейчас</li>
              <li><strong>Не спешите</strong> — внимательно прочитайте каждый вариант ответа</li>
              <li><strong>Будьте конкретны</strong> — вспомните реальные примеры из жизни</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
