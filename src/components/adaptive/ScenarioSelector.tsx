import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Target } from 'lucide-react';
import type { TestScenario } from '../../types';

interface ScenarioSelectorProps {
  onSelect: (scenario: TestScenario) => void;
}

type Step = 'relationship_status' | 'single_mode' | 'couple_mode' | 'selected';

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ onSelect }) => {
  const [step, setStep] = useState<Step>('relationship_status');

  const handleRelationshipStatus = (status: 'single' | 'coupled') => {
    if (status === 'single') {
      setStep('single_mode');
    } else {
      setStep('couple_mode');
    }
  };

  const handleSingleMode = (mode: 'reality' | 'potential') => {
    const scenario: TestScenario = mode === 'reality'
      ? 'single_reality'
      : 'single_potential';
    onSelect(scenario);
  };

  const handleCoupleMode = (mode: 'independent' | 'partner_assessment' | 'discussion') => {
    let scenario: TestScenario;
    switch (mode) {
      case 'independent':
        scenario = 'couple_independent';
        break;
      case 'partner_assessment':
        scenario = 'in_relationship_partner';
        break;
      case 'discussion':
        scenario = 'couple_discussion';
        break;
    }
    onSelect(scenario);
  };

  const handleSelfAssessment = () => {
    onSelect('in_relationship_self');
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '2rem 1rem' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: '48rem',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          {step === 'relationship_status' && (
            <>
              <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Выберите вашу ситуацию
              </h1>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '1rem' }}>
                Это поможет адаптировать тест именно под вашу ситуацию
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {/* Single Option */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRelationshipStatus('single')}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.18)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Heart className="w-12 h-12" style={{ color: 'white' }} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Я свободен(а)
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Оцени свои отношения из прошлого или потенциал будущих
                  </p>
                </motion.button>

                {/* Coupled Option */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRelationshipStatus('coupled')}
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(245, 87, 108, 0.18)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Users className="w-12 h-12" style={{ color: 'white' }} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Я в отношениях
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Оцени себя, партнера или пройди тест вместе
                  </p>
                </motion.button>
              </div>
            </>
          )}

          {step === 'single_mode' && (
            <>
              <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Что ты хочешь оценить?
              </h1>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '1rem' }}>
                Выбери между анализом прошлого опыта или своим потенциалом
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {/* Reality Option */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSingleMode('reality')}
                  style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(79, 172, 254, 0.18)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Target className="w-12 h-12" style={{ color: 'white' }} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Мой реальный уровень
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Как я вел(а) себя в прошлых отношениях — честная оценка
                  </p>
                </motion.button>

                {/* Potential Option */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSingleMode('potential')}
                  style={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(250, 112, 154, 0.18)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Heart className="w-12 h-12" style={{ color: 'white' }} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Мой потенциал
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Какой я хочу быть в отношениях — мой идеальный вариант
                  </p>
                </motion.button>
              </div>

              <button
                onClick={() => setStep('relationship_status')}
                style={{
                  marginTop: '2rem',
                  background: 'transparent',
                  border: '1px solid var(--primary-300)',
                  color: 'var(--primary-600)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                ← Вернуться назад
              </button>
            </>
          )}

          {step === 'couple_mode' && (
            <>
              <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Как вы хотите пройти тест?
              </h1>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '1rem' }}>
                Выбери режим, который лучше всего подходит вашей ситуации
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {/* Self Assessment */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSelfAssessment}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.18)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Heart className="w-12 h-12" style={{ color: 'white' }} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Только я
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Оцени только свой уровень зрелости в отношениях
                  </p>
                </motion.button>

                {/* Partner Assessment */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCoupleMode('partner_assessment')}
                  style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(79, 172, 254, 0.18)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Users className="w-12 h-12" style={{ color: 'white' }} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Я оцениваю партнера
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Ответь честно о поведении партнера в отношениях
                  </p>
                </motion.button>

                {/* Independent */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCoupleMode('independent')}
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(245, 87, 108, 0.18)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Users className="w-12 h-12" style={{ color: 'white' }} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Оба независимо
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Каждый отвечает про себя, потом сравниваем результаты
                  </p>
                </motion.button>

                {/* Discussion */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCoupleMode('discussion')}
                  style={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(250, 112, 154, 0.18)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Users className="w-12 h-12" style={{ color: 'white' }} />
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Обсуждаем вместе
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Совместное прохождение теста с обсуждением каждого ответа
                  </p>
                </motion.button>
              </div>

              <button
                onClick={() => setStep('relationship_status')}
                style={{
                  marginTop: '2rem',
                  background: 'transparent',
                  border: '1px solid var(--primary-300)',
                  color: 'var(--primary-600)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                ← Вернуться назад
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
