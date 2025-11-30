import React, { useState } from 'react';
import { Brain, Target, Zap, Clock, Sparkles } from 'lucide-react';

// UI компоненты

// Адаптивные компоненты
import { SmartAdaptiveTest } from '../components/adaptive/SmartAdaptiveTest';
import ModernAdaptiveResults from '../components/adaptive/ModernAdaptiveResults';

// Типы и утилиты
import type { TestResult } from '../types';

// Стили
import '../styles/design-system.css';

export const SmartAdaptiveTestPage: React.FC = () => {
  const [testStarted, setTestStarted] = useState(false);
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
    setTestResult(null);
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

  if (testStarted) {
    return (
      <div style={{ backgroundColor: 'white' }}>
        <div className="container">
          <SmartAdaptiveTest onComplete={handleTestComplete} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white' }}>
      <div className="container">
        {/* Главный заголовок и краткое описание */}
        <div className="text-center mb-6">
          <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.1' }}>
            Революция в психодиагностике
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-text-muted)', maxWidth: '32rem', margin: '0 auto 1.2rem', lineHeight: '1.3' }}>
            Первый адаптивный тест зрелости отношений, который за 5 минут определит ваш точный уровень из 12 возможных
          </p>
        </div>

        {/* Статистика эффективности */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--accent-green)', marginBottom: '0.15rem' }}>95%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Точность</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '0.15rem' }}>3-5</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Минут</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--accent-purple)', marginBottom: '0.15rem' }}>85%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Экономия времени</div>
          </div>
        </div>

        {/* Ключевые преимущества */}
        <div className="grid-responsive" style={{ marginBottom: '1.2rem', gap: '1rem' }}>
          <div className="gradient-card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem', boxShadow: '0 4px 10px rgba(102, 126, 234, 0.18)' }}>
              <Brain className="w-6 h-6" style={{ color: 'white' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Умный алгоритм</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
              ИИ подбирает следующий вопрос на основе ваших предыдущих ответов, точно определяя зону зрелости
            </p>
          </div>
          <div className="gradient-card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem', boxShadow: '0 4px 10px rgba(250, 112, 154, 0.18)' }}>
              <Zap className="w-6 h-6" style={{ color: 'white' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Невероятная скорость</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
              27-30 вопросов вместо 120+. Получите результат в 6 раз быстрее без потери качества
            </p>
          </div>
          <div className="gradient-card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem', boxShadow: '0 4px 10px rgba(79, 172, 254, 0.18)' }}>
              <Target className="w-6 h-6" style={{ color: 'white' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Научная точность</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
              На основе модели "Лестница Союза" с учетом психологии привязанности и теории развития
            </p>
          </div>
        </div>

        {/* Процесс тестирования */}
        <div className="gradient-card" style={{ marginBottom: '1.2rem', padding: '1.2rem', background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f5f9 100%)', border: '1px solid #e2e8f0' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.2rem', color: 'var(--color-text)' }}>
            <Sparkles className="w-5 h-5 inline-block mr-2" style={{ color: 'var(--accent-purple)' }} />
            Как работает адаптивная диагностика
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.7rem', textAlign: 'center' }}>
            <div>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 'bold', fontSize: '0.95rem' }}>1</div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.3rem', color: 'var(--color-text)', fontSize: '0.95rem' }}>Статус отношений</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
                Определяем контекст: в отношениях, свободны или в переходе
              </p>
            </div>
            <div>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 'bold', fontSize: '0.95rem' }}>2</div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.3rem', color: 'var(--color-text)', fontSize: '0.95rem' }}>Зональная детекция</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
                Алгоритм быстро находит вашу зону среди 4 основных
              </p>
            </div>
            <div>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 'bold', fontSize: '0.95rem' }}>3</div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.3rem', color: 'var(--color-text)', fontSize: '0.95rem' }}>Точная диагностика</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
                Глубокий анализ определяет конкретный уровень из 12
              </p>
            </div>
            <div>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 'bold', fontSize: '0.95rem' }}>4</div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.3rem', color: 'var(--color-text)', fontSize: '0.95rem' }}>Валидация результата</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
                Система проверок гарантирует достоверность
              </p>
            </div>
          </div>
        </div>

        {/* Призыв к действию */}
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)', padding: '0.5rem 1.1rem', borderRadius: '50px', marginBottom: '0.7rem', border: '1px solid #f59e0b' }}>
              <Clock className="w-4 h-4" style={{ color: '#92400e' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#92400e' }}>Время прохождения: 3-5 минут</span>
            </div>
          </div>
          <button 
            onClick={() => setTestStarted(true)}
            className="gradient-button"
            style={{ 
              fontSize: '1.1rem', 
              padding: '12px 32px', 
              borderRadius: '50px',
              boxShadow: '0 4px 16px rgba(79, 172, 254, 0.18)',
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 172, 254, 0.22)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(79, 172, 254, 0.18)';
            }}
          >
            🚀 Узнать свой уровень зрелости
          </button>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.7rem' }}>
            💝 Бесплатно • 🔒 Анонимно • ⚡ Мгновенный результат
          </p>
        </div>

        {/* Важные инструкции */}
        <div className="gradient-card" style={{ marginBottom: '0.7rem', padding: '1rem', background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)', border: '1px solid #f59e0b' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.7rem', color: '#92400e', textAlign: 'center' }}>
            ⚠️ Для максимально точного результата:
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.5rem', fontSize: '0.8rem', color: '#a16207' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span>🎯</span>
              <span><strong>Отвечайте честно</strong> — выбирайте реальную ситуацию, а не желаемую</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span>⏰</span>
              <span><strong>Думайте о настоящем</strong> — как происходит сейчас, не в прошлом</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span>🤔</span>
              <span><strong>Не торопитесь</strong> — внимательно читайте все варианты</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span>🔍</span>
              <span><strong>Будьте конкретны</strong> — отвечайте исходя из реального опыта</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
