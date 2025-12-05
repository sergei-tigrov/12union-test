import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  Share2,
  Heart,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Типы и функции
import type { TestResult, UnionLevel } from '../../types';
import { interpretResult } from '../../results-interpreter';
import { getLevelDefinition } from '../../levels-definitions';
import { getActionPlan } from '../../action-library';
import UnionLadder from '../UnionLadder';
import { useTelegram } from '../../hooks/useTelegram';

// Стили
import '../../styles/design-system.css';
import '../../styles/results-page.css';

interface ModernAdaptiveResultsProps {
  result: TestResult;
  onRestart: () => void;
}

/**
 * Компонент результатов тестирования - интегрирован с новой 12-уровневой системой
 */
export const ModernAdaptiveResults: React.FC<ModernAdaptiveResultsProps> = ({
  result,
  onRestart
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'breakdown' | 'actions' | 'validation'>('summary');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(Math.round(result.personalLevel));

  // Интерпретируем результаты
  const interpretation = interpretResult(result);
  const roundedLevel = Math.round(result.personalLevel);
  const levelDef = getLevelDefinition(roundedLevel as UnionLevel);
  const actionPlan = getActionPlan(roundedLevel as UnionLevel);

  // Форматируем данные для отображения
  const completionTimeMinutes = Math.round(result.completionTime / 60000);
  const timeFormatted = completionTimeMinutes < 1
    ? `${Math.round(result.completionTime / 1000)} сек`
    : `${completionTimeMinutes} мин`;

  // Цвета для уровней
  const getLevelColor = (level: number) => {
    if (level <= 3) return '#1a0000'; // Красный
    if (level <= 6) return '#ff9800'; // Оранжевый
    if (level <= 8) return '#4CAF50'; // Зелёный
    return '#2196F3'; // Синий
  };

  const getLevelIcon = (level: number) => {
    if (level <= 3) return '🔥';
    if (level <= 6) return '⚡';
    if (level <= 8) return '💚';
    return '✨';
  };

  // Компонент для вкладки резюме
  const SummaryTab = () => (
    <div className="results-container">
      {/* Основной результат с уровнем */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="results-card"
        style={{
          background: `linear-gradient(135deg, ${getLevelColor(roundedLevel)}08 0%, white 100%)`,
          border: `2px solid ${getLevelColor(roundedLevel)}30`,
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div className="results-hero-icon" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${getLevelColor(roundedLevel)}15`,
            borderRadius: '50%',
            border: `3px solid ${getLevelColor(roundedLevel)}`
          }}>
            {getLevelIcon(roundedLevel)}
          </div>
        </div>

        <h2 className="results-hero-title" style={{
          fontWeight: '800',
          color: getLevelColor(roundedLevel),
          marginBottom: '0.25rem',
          lineHeight: '1.1'
        }}>
          {roundedLevel}
        </h2>

        <h3 className="results-hero-subtitle" style={{
          fontWeight: '700',
          color: '#333',
          marginBottom: '1.5rem'
        }}>
          {levelDef?.name}
        </h3>

        <p className="results-hero-text" style={{
          color: '#555',
          lineHeight: '1.8'
        }}>
          {interpretation.heroMessage}
        </p>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="results-stats-grid"
          style={{
            borderTop: `1px solid ${getLevelColor(roundedLevel)}20`
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div className="results-stat-label">
              Вопросов ответено
            </div>
            <div className="results-stat-value" style={{
              color: getLevelColor(roundedLevel)
            }}>
              {result.totalQuestions}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div className="results-stat-label">
              Время теста
            </div>
            <div className="results-stat-value" style={{
              color: '#4CAF50'
            }}>
              {timeFormatted}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div className="results-stat-label">
              Надёжность
            </div>
            <div className="results-stat-value" style={{
              color:
                result.validation.reliability === 'high' ? '#4CAF50' :
                  result.validation.reliability === 'medium' ? '#ff9800' : '#f44336'
            }}>
              {
                result.validation.reliability === 'high' ? '✓' :
                  result.validation.reliability === 'medium' ? '≈' : '?'
              }
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              {
                result.validation.reliability === 'high' ? 'Высокая' :
                  result.validation.reliability === 'medium' ? 'Средняя' : 'Низкая'
              }
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Лестница Союза - интерактивная пирамида */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ marginBottom: '2rem' }}
      >
        <UnionLadder
          result={result}
          selectedLevelId={selectedLevelId}
          onLevelSelect={setSelectedLevelId}
        />
      </motion.div>

      {/* Главный инсайт */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'linear-gradient(135deg, #ff6b6b08 0%, #ff6b6b04 100%)',
          border: '2px solid #ff6b6b30',
          borderRadius: '12px',
          padding: '2.5rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#333'
        }}>
          <Heart size={24} color="#ff6b6b" />
          Главный инсайт
        </h3>
        <p style={{
          fontSize: '1.05rem',
          lineHeight: '1.8',
          color: '#444'
        }}>
          {interpretation.mainInsight}
        </p>
      </motion.div>

      {/* Психологический портрет (НОВОЕ) */}
      {
        interpretation.indicatorAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            style={{
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              border: '2px solid #90caf9',
              borderRadius: '12px',
              padding: '2.5rem',
              marginBottom: '2rem'
            }}
          >
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#0d47a1'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🧠</span>
              Психологический портрет
            </h3>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: '1.8',
              color: '#1565c0'
            }}>
              {interpretation.indicatorAnalysis}
            </p>
          </motion.div>
        )
      }



      {/* Описание уровня */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          background: 'white',
          border: '1px solid #e8e8e8',
          borderRadius: '12px',
          padding: '2.5rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          marginBottom: '1.25rem',
          color: '#333'
        }}>
          📚 Что это значит?
        </h3>
        <p style={{
          fontSize: '1.05rem',
          lineHeight: '1.8',
          color: '#555'
        }}>
          {interpretation.levelDescription}
        </p>
      </motion.div>

      {/* Вызов и путь роста */}
      <div className="results-grid-2" style={{ marginBottom: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, #ff980808 0%, #ff980804 100%)',
            border: '2px solid #ff980030',
            borderRadius: '12px',
            padding: '2.5rem'
          }}
        >
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#333'
          }}>
            <AlertCircle size={22} color="#ff9800" />
            Главный вызов
          </h3>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.7',
            color: '#555'
          }}>
            {interpretation.currentChallenge}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, #4CAF5008 0%, #4CAF5004 100%)',
            border: '2px solid #4CAF5030',
            borderRadius: '12px',
            padding: '2.5rem'
          }}
        >
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#333'
          }}>
            <TrendingUp size={22} color="#4CAF50" />
            Путь роста
          </h3>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.7',
            color: '#555'
          }}>
            {interpretation.growthPath}
          </p>
        </motion.div>
      </div>

      {/* Следующий уровень */}
      {
        interpretation.nextLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '2.5rem',
              color: 'white',
              marginBottom: '2rem'
            }}
          >
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              ✨ Что дальше?
            </h3>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: '1.7',
              opacity: 0.95
            }}>
              {interpretation.nextLevel}
            </p>
          </motion.div>
        )
      }

      {/* Валидационные замечания */}
      {
        interpretation.validationNotes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              background: 'linear-gradient(135deg, #fff9e608 0%, #fff3cd04 100%)',
              border: '2px solid #ffeaa7',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'flex-start'
            }}
          >
            <AlertCircle size={24} color="#ff9800" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '0.75rem', color: '#856404', fontSize: '1.1rem' }}>
                Важно знать
              </h4>
              <p style={{ color: '#654321', fontSize: '1rem', lineHeight: '1.6' }}>
                {interpretation.validationNotes}
              </p>
            </div>
          </motion.div>
        )
      }
    </div >
  );

  // Компонент для вкладки распределения уровней
  const BreakdownTab = () => (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '2rem'
        }}
      >
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '2rem' }}>
          Распределение по уровням
        </h3>

        {result.levelScores.map((levelScore) => {
          const barWidth = Math.max(levelScore.percentage, 5);
          const isMainLevel = levelScore.level === roundedLevel;

          return (
            <div key={levelScore.level} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: isMainLevel ? '700' : '600' }}>
                  {getLevelIcon(levelScore.level)} Уровень {levelScore.level}
                  {isMainLevel && <span style={{ color: '#2196F3', marginLeft: '0.5rem' }}>(ваш уровень)</span>}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {levelScore.percentage}%
                </div>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#f0f0f0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${barWidth}%`,
                  height: '100%',
                  background: isMainLevel
                    ? getLevelColor(levelScore.level)
                    : `${getLevelColor(levelScore.level)}99`,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );

  // Компонент для вкладки действий
  const ActionsTab = () => (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {actionPlan.mainChallenge}
        </h3>
        <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Главный вызов вашего уровня
        </p>
      </motion.div>

      {actionPlan.topActions.map((action, idx) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: '#e3f2fd',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              color: '#2196F3',
              flexShrink: 0
            }}>
              {idx + 1}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {action.title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#999', marginBottom: '1rem' }}>
                ⏱️ {action.duration} мин • 📊 Сложность: {
                  action.difficulty === 'easy' ? 'Простая' :
                    action.difficulty === 'moderate' ? 'Средняя' : 'Сложная'
                }
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#555', marginBottom: '1rem' }}>
              {action.description}
            </p>
          </div>

          <div style={{
            background: '#f9f9f9',
            borderLeft: '4px solid #2196F3',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '4px'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              <strong>Пример:</strong>
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
              {action.example}
            </p>
          </div>

          <div style={{
            background: '#e8f5e9',
            borderLeft: '4px solid #4CAF50',
            padding: '1rem',
            borderRadius: '4px'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#2e7d32', marginBottom: '0.5rem' }}>
              <strong>Ожидаемый результат:</strong>
            </p>
            <p style={{ fontSize: '0.9rem', color: '#2e7d32' }}>
              {action.expected_outcome}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Компонент для вкладки валидации
  const ValidationTab = () => (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '2rem' }}>
          Надёжность результатов
        </h3>

        {/* Общий рейтинг */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: result.validation.reliability === 'high' ? '#e8f5e9' :
              result.validation.reliability === 'medium' ? '#fff9e6' : '#ffebee',
            borderRadius: '12px',
            border: `2px solid ${result.validation.reliability === 'high' ? '#4CAF50' :
              result.validation.reliability === 'medium' ? '#ff9800' : '#f44336'
              }`
          }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              Общий рейтинг надёжности
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color:
                result.validation.reliability === 'high' ? '#4CAF50' :
                  result.validation.reliability === 'medium' ? '#ff9800' : '#f44336'
            }}>
              {result.validation.reliabilityScore}/100
            </div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#666' }}>
              {
                result.validation.reliability === 'high' ? '✓ Высокая надёжность' :
                  result.validation.reliability === 'medium' ? '⚠ Средняя надёжность' : '✗ Низкая надёжность'
              }
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#f5f5f5',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              Среднее время ответа
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2196F3' }}>
              {(result.validation.averageResponseTime / 1000).toFixed(1)}сек
            </div>
          </div>
        </div>

        {/* Детальные показатели */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>
            Анализ показателей
          </h4>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {/* Социальная желательность */}
            <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Социальная желательность</span>
                <span style={{ fontWeight: '700' }}>
                  {Math.round(result.validation.socialDesirabilityScore * 100)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#e0e0e0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${result.validation.socialDesirabilityScore * 100}%`,
                  height: '100%',
                  background: result.validation.socialDesirabilityScore > 0.6 ? '#ff9800' : '#4CAF50'
                }} />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                {result.validation.socialDesirabilityScore > 0.6
                  ? 'Вы стараетесь выглядеть лучше, чем есть на самом деле'
                  : 'Ответы выглядят честными'}
              </p>
            </div>

            {/* Когерентность */}
            <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Внутренняя согласованность</span>
                <span style={{ fontWeight: '700' }}>{result.validation.coherenceScore}</span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#e0e0e0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${result.validation.coherenceScore}%`,
                  height: '100%',
                  background: result.validation.coherenceScore > 70 ? '#4CAF50' :
                    result.validation.coherenceScore > 40 ? '#ff9800' : '#f44336'
                }} />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                {result.validation.coherenceScore > 70
                  ? 'Ответы очень согласованные'
                  : result.validation.coherenceScore > 40
                    ? 'Есть некоторые противоречия'
                    : 'Много противоречий в ответах'}
              </p>
            </div>

            {/* Духовный байпас */}
            <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Духовный байпас</span>
                <span style={{ fontWeight: '700' }}>
                  {Math.round(result.validation.spiritualBypassScore * 100)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#e0e0e0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${result.validation.spiritualBypassScore * 100}%`,
                  height: '100%',
                  background: result.validation.spiritualBypassScore > 0.6 ? '#ff9800' : '#4CAF50'
                }} />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                {result.validation.spiritualBypassScore > 0.6
                  ? 'Признаки отсутствия практической основы при высоких уровнях'
                  : 'Баланс между идеалом и практикой'}
              </p>
            </div>
          </div>
        </div>

        {/* Противоречия */}
        {result.validation.contradictionFlags.length > 0 && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <h4 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#856404' }}>
              ⚠️ Обнаруженные противоречия
            </h4>
            <ul style={{ margin: '0', paddingLeft: '1.5rem', color: '#856404' }}>
              {result.validation.contradictionFlags.map((flag, idx) => (
                <li key={idx} style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );

  const { tg, isTelegram } = useTelegram();

  return (
    <div style={{
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      paddingBottom: '3rem'
    }}>
      {/* Hero Results Section */}
      {/* Compact Modern Header - скрываем в Telegram */}
      {!isTelegram && (
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            <span style={{ fontSize: '1.25rem' }}>✨</span>
            <span>Лестница Союза</span>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 'normal',
              color: '#666',
              marginLeft: '0.5rem',
              paddingLeft: '0.75rem',
              borderLeft: '1px solid #eee'
            }}>
              Результат
            </span>
          </div>
        </header>
      )}

      {/* Tabs */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isTelegram ? '1rem' : '1.5rem 1rem 1rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid #e0e0e0',
          overflowX: 'auto',
          paddingBottom: '1rem',
          // Скрываем скроллбар для чистоты
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {(['summary', 'breakdown', 'actions', 'validation'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (isTelegram) tg.HapticFeedback.impactOccurred('light');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '3px solid #2196F3' : 'none',
                fontWeight: activeTab === tab ? '700' : '500',
                color: activeTab === tab ? '#2196F3' : '#999',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {
                tab === 'summary' ? '📋 Резюме' :
                  tab === 'breakdown' ? '📊 Распределение' :
                    tab === 'actions' ? '🎯 Действия' : '✅ Валидация'
              }
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ marginBottom: '2rem' }}>
          {activeTab === 'summary' && <SummaryTab />}
          {activeTab === 'breakdown' && <BreakdownTab />}
          {activeTab === 'actions' && <ActionsTab />}
          {activeTab === 'validation' && <ValidationTab />}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            gap: '1.25rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            flexDirection: isTelegram ? 'column' : 'row' // Вертикально на мобильных в ТГ
          }}
        >
          <button
            onClick={() => {
              if (isTelegram) tg.HapticFeedback.impactOccurred('medium');
              onRestart();
            }}
            style={{
              padding: '1.1rem 2.25rem',
              borderRadius: '10px',
              border: '2px solid #e0e0e0',
              background: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
              width: isTelegram ? '100%' : 'auto'
            }}
            onMouseOver={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = '#f9f9f9';
              btn.style.borderColor = '#2196F3';
              btn.style.color = '#2196F3';
            }}
            onMouseOut={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = 'white';
              btn.style.borderColor = '#e0e0e0';
              btn.style.color = '#333';
            }}
          >
            <RotateCcw size={20} />
            Пройти тест ещё раз
          </button>

          <button
            onClick={() => {
              if (isTelegram) tg.HapticFeedback.impactOccurred('medium');

              const text = `Мой уровень в "Лестнице Союза": ${roundedLevel} - ${levelDef?.name}.\n${interpretation.heroMessage}\n\nПройди тест и узнай свой уровень:`;

              if (isTelegram) {
                // Используем нативный шеринг в Telegram
                // Формируем ссылку на бота (нужно будет заменить на реальный юзернейм бота)
                // Но лучше использовать switchInlineQuery если бот поддерживает инлайн режим
                // Или просто открыть ссылку на шеринг
                const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
                tg.openTelegramLink(url);
              } else {
                navigator.share?.({
                  title: 'Лестница Союза',
                  text,
                  url: window.location.href
                }).catch(() => {
                  navigator.clipboard.writeText(`${text}\n${window.location.href}`);
                  alert('Результат скопирован в буфер обмена');
                });
              }
            }}
            style={{
              padding: '1.1rem 2.25rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              width: isTelegram ? '100%' : 'auto'
            }}
            onMouseOver={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'translateY(-2px)';
              btn.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
            }}
            onMouseOut={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'translateY(0)';
              btn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            <Share2 size={20} />
            Поделиться результатом
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernAdaptiveResults;
