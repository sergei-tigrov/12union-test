import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Share2 } from 'lucide-react';

import type { TestResult, UnionLevel } from '../../types';
import { interpretResult } from '../../results-interpreter';
import { getLevelDefinition } from '../../levels-definitions';
import { getActionPlan } from '../../action-library';
import UnionLadder from '../UnionLadder';
import { useTelegram } from '../../hooks/useTelegram';

import '../../styles/modern-results.css';

interface ModernAdaptiveResultsProps {
  result: TestResult;
  onRestart: () => void;
}

// Утилиты для цветов уровней
const getLevelColorClass = (level: number) => {
  if (level <= 3) return 'mr-color-1';
  if (level <= 6) return 'mr-color-4';
  if (level <= 8) return 'mr-color-7';
  return 'mr-color-9';
};

const getLevelBgClass = (level: number) => {
  if (level <= 3) return 'mr-bg-1';
  if (level <= 6) return 'mr-bg-4';
  if (level <= 8) return 'mr-bg-7';
  return 'mr-bg-9';
};

const getLevelIcon = (level: number) => {
  if (level <= 3) return '🔥';
  if (level <= 6) return '⚡';
  if (level <= 8) return '💚';
  return '✨';
};

const getLevelColorHex = (level: number) => {
  if (level <= 3) return '#ef4444';
  if (level <= 6) return '#f59e0b';
  if (level <= 8) return '#10b981';
  return '#3b82f6';
};

export const ModernAdaptiveResults: React.FC<ModernAdaptiveResultsProps> = ({
  result,
  onRestart
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'breakdown' | 'actions' | 'validation'>('summary');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(Math.round(result.personalLevel));
  const { tg, isTelegram } = useTelegram();

  const interpretation = interpretResult(result);
  const roundedLevel = Math.round(result.personalLevel);
  const levelDef = getLevelDefinition(roundedLevel as UnionLevel);
  const actionPlan = getActionPlan(roundedLevel as UnionLevel);

  const completionTimeMinutes = Math.round(result.completionTime / 60000);
  const timeFormatted = completionTimeMinutes < 1
    ? `${Math.round(result.completionTime / 1000)} сек`
    : `${completionTimeMinutes} мин`;

  // Хэндлеры
  const handleShare = () => {
    if (isTelegram) tg.HapticFeedback.impactOccurred('medium');

    const text = `Мой уровень в "Лестнице Союза": ${roundedLevel} - ${levelDef?.name}.\n${interpretation.heroMessage}\n\nПройди тест и узнай свой уровень:`;

    if (isTelegram) {
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
  };

  const handleRestart = () => {
    if (isTelegram) tg.HapticFeedback.impactOccurred('medium');
    onRestart();
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (isTelegram) tg.HapticFeedback.impactOccurred('light');
  };

  // Tab: Summary
  const SummaryTab = () => (
    <div className="mr-animate">
      {/* Hero Section */}
      <div className="mr-hero">
        <div className={`mr-hero__icon ${getLevelBgClass(roundedLevel)}`}>
          {getLevelIcon(roundedLevel)}
        </div>
        <div className={`mr-hero__level ${getLevelColorClass(roundedLevel)}`}>
          {roundedLevel}
        </div>
        <h2 className="mr-hero__name">{levelDef?.name}</h2>
        <p className="mr-hero__message">{interpretation.heroMessage}</p>
      </div>

      {/* Stats */}
      <div className="mr-stats">
        <div className="mr-stat">
          <div className="mr-stat__value">{result.totalQuestions}</div>
          <div className="mr-stat__label">Вопросов</div>
        </div>
        <div className="mr-stat">
          <div className="mr-stat__value" style={{ color: '#10b981' }}>{timeFormatted}</div>
          <div className="mr-stat__label">Время</div>
        </div>
        <div className="mr-stat">
          <div className="mr-stat__value" style={{
            color: result.validation.reliability === 'high' ? '#10b981' :
                   result.validation.reliability === 'medium' ? '#f59e0b' : '#ef4444'
          }}>
            {result.validation.reliability === 'high' ? '✓' :
             result.validation.reliability === 'medium' ? '≈' : '?'}
          </div>
          <div className="mr-stat__label">
            {result.validation.reliability === 'high' ? 'Высокая' :
             result.validation.reliability === 'medium' ? 'Средняя' : 'Низкая'}
          </div>
        </div>
      </div>

      {/* Diagnostic Profile */}
      {result.diagnosisTitle && (
        <motion.div
          className="mr-profile"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mr-profile__header">
            <span className="mr-profile__icon">🧠</span>
            <span className="mr-profile__label">Психологический профиль</span>
          </div>
          <h3 className="mr-profile__title">{result.diagnosisTitle}</h3>
          <p className="mr-profile__desc">{result.diagnosisDescription}</p>
          {result.diagnosisPattern && (
            <span className="mr-profile__badge">
              {result.diagnosisPattern.toUpperCase()}
            </span>
          )}
        </motion.div>
      )}

      {/* Compatibility CTA */}
      {result.testScenario === 'compatibility' && (
        <motion.div
          className="mr-cta"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="mr-cta__title">❤️ Узнайте вашу совместимость</h3>
          <p className="mr-cta__desc">
            Вы прошли свою часть. Отправьте тест партнеру, чтобы узнать, на каком уровне вы как пара.
          </p>
          <button
            className="mr-cta__btn"
            onClick={() => {
              const text = `Я прошел тест "Лестница Союза" и мой уровень: ${result.personalLevel}. Пройди и ты! 👇`;
              const url = 'https://t.me/UnionLadderBot';
              const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
              if (isTelegram) {
                tg.openTelegramLink(shareUrl);
              } else {
                window.open(shareUrl, '_blank');
              }
            }}
          >
            💌 Отправить партнеру
          </button>
        </motion.div>
      )}

      {/* Union Ladder */}
      <motion.div
        className="mr-ladder"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <UnionLadder
          result={result}
          selectedLevelId={selectedLevelId}
          onLevelSelect={setSelectedLevelId}
        />
      </motion.div>

      {/* Main Insight */}
      <motion.section
        className="mr-section mr-section--insight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="mr-section__header">
          <span className="mr-section__icon">❤️</span>
          Главный инсайт
        </h3>
        <div className="mr-section__content">
          <p className="mr-section__text">{interpretation.mainInsight}</p>
        </div>
      </motion.section>

      {/* Psychological Portrait */}
      {interpretation.indicatorAnalysis && (
        <motion.section
          className="mr-section mr-section--portrait"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mr-section__header">
            <span className="mr-section__icon">🧠</span>
            Психологический портрет
          </h3>
          <div className="mr-section__content">
            <p className="mr-section__text">{interpretation.indicatorAnalysis}</p>
          </div>
        </motion.section>
      )}

      {/* Level Description */}
      <motion.section
        className="mr-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="mr-section__header">
          <span className="mr-section__icon">📚</span>
          Что это значит?
        </h3>
        <div className="mr-section__content">
          <p className="mr-section__text">{interpretation.levelDescription}</p>
        </div>
      </motion.section>

      {/* Challenge & Growth */}
      <div className="mr-grid-2">
        <motion.section
          className="mr-section mr-section--challenge"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="mr-section__header">
            <span className="mr-section__icon">⚠️</span>
            Главный вызов
          </h3>
          <div className="mr-section__content">
            <p className="mr-section__text">{interpretation.currentChallenge}</p>
          </div>
        </motion.section>

        <motion.section
          className="mr-section mr-section--growth"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h3 className="mr-section__header">
            <span className="mr-section__icon">📈</span>
            Путь роста
          </h3>
          <div className="mr-section__content">
            <p className="mr-section__text">{interpretation.growthPath}</p>
          </div>
        </motion.section>
      </div>

      {/* Next Level */}
      {interpretation.nextLevel && (
        <motion.section
          className="mr-section mr-section--next"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="mr-section__header">
            <span className="mr-section__icon">✨</span>
            Что дальше?
          </h3>
          <div className="mr-section__content">
            <p className="mr-section__text">{interpretation.nextLevel}</p>
          </div>
        </motion.section>
      )}

      {/* Validation Notes */}
      {interpretation.validationNotes && (
        <motion.div
          className="mr-note"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <span className="mr-note__icon">⚠️</span>
          <div className="mr-note__content">
            <div className="mr-note__title">Важно знать</div>
            <p className="mr-note__text">{interpretation.validationNotes}</p>
          </div>
        </motion.div>
      )}
    </div>
  );

  // Tab: Breakdown
  const BreakdownTab = () => (
    <motion.div
      className="mr-breakdown mr-animate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="mr-breakdown__title">Распределение по уровням</h3>

      {result.levelScores.map((levelScore) => {
        const isMain = levelScore.level === roundedLevel;
        const barColor = getLevelColorHex(levelScore.level);

        return (
          <div key={levelScore.level} className="mr-breakdown__item">
            <div className="mr-breakdown__row">
              <span className={`mr-breakdown__label ${isMain ? 'mr-breakdown__label--main' : ''}`}>
                {getLevelIcon(levelScore.level)} Уровень {levelScore.level}
                {isMain && <span style={{ color: '#3b82f6', marginLeft: '8px' }}>(ваш)</span>}
              </span>
              <span className="mr-breakdown__value">{levelScore.percentage}%</span>
            </div>
            <div className="mr-breakdown__bar">
              <div
                className="mr-breakdown__fill"
                style={{
                  width: `${Math.max(levelScore.percentage, 3)}%`,
                  background: isMain ? barColor : `${barColor}99`
                }}
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );

  // Tab: Actions
  const ActionsTab = () => (
    <motion.div
      className="mr-actions mr-animate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mr-actions__challenge">
        <h3 className="mr-actions__challenge-title">{actionPlan.mainChallenge}</h3>
        <p className="mr-actions__challenge-subtitle">Главный вызов вашего уровня</p>
      </div>

      {actionPlan.topActions.map((action, idx) => (
        <motion.div
          key={action.id}
          className="mr-action"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className="mr-action__header">
            <div className="mr-action__number">{idx + 1}</div>
            <div>
              <h4 className="mr-action__title">{action.title}</h4>
              <p className="mr-action__meta">
                ⏱️ {action.duration} мин • {
                  action.difficulty === 'easy' ? '🟢 Простая' :
                  action.difficulty === 'moderate' ? '🟡 Средняя' : '🔴 Сложная'
                }
              </p>
            </div>
          </div>

          <p className="mr-action__desc">{action.description}</p>

          <div className="mr-action__example">
            <div className="mr-action__example-label">Пример:</div>
            <div className="mr-action__example-text">{action.example}</div>
          </div>

          <div className="mr-action__outcome">
            <div className="mr-action__outcome-label">Результат:</div>
            <div className="mr-action__outcome-text">{action.expected_outcome}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // Tab: Validation
  const ValidationTab = () => (
    <motion.div
      className="mr-validation mr-animate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="mr-validation__title">Надёжность результатов</h3>

      <div className="mr-validation__grid">
        <div className={`mr-validation__card mr-validation__card--reliability-${result.validation.reliability}`}>
          <div className="mr-validation__label">Надёжность</div>
          <div className={`mr-validation__value mr-validation__value--${result.validation.reliability}`}>
            {result.validation.reliabilityScore}/100
          </div>
          <div className="mr-validation__status">
            {result.validation.reliability === 'high' ? '✓ Высокая' :
             result.validation.reliability === 'medium' ? '≈ Средняя' : '? Низкая'}
          </div>
        </div>

        <div className="mr-validation__card">
          <div className="mr-validation__label">Время ответа</div>
          <div className="mr-validation__value" style={{ color: '#3b82f6' }}>
            {(result.validation.averageResponseTime / 1000).toFixed(1)}с
          </div>
          <div className="mr-validation__status">среднее</div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="mr-validation__item">
        <div className="mr-validation__item-header">
          <span className="mr-validation__item-name">Социальная желательность</span>
          <span className="mr-validation__item-value">
            {Math.round(result.validation.socialDesirabilityScore * 100)}%
          </span>
        </div>
        <div className="mr-validation__item-bar">
          <div
            className="mr-validation__item-fill"
            style={{
              width: `${result.validation.socialDesirabilityScore * 100}%`,
              background: result.validation.socialDesirabilityScore > 0.6 ? '#f59e0b' : '#10b981'
            }}
          />
        </div>
        <div className="mr-validation__item-hint">
          {result.validation.socialDesirabilityScore > 0.6
            ? 'Возможно стремление выглядеть лучше'
            : 'Ответы выглядят честными'}
        </div>
      </div>

      <div className="mr-validation__item">
        <div className="mr-validation__item-header">
          <span className="mr-validation__item-name">Внутренняя согласованность</span>
          <span className="mr-validation__item-value">{result.validation.coherenceScore}%</span>
        </div>
        <div className="mr-validation__item-bar">
          <div
            className="mr-validation__item-fill"
            style={{
              width: `${result.validation.coherenceScore}%`,
              background: result.validation.coherenceScore > 70 ? '#10b981' :
                         result.validation.coherenceScore > 40 ? '#f59e0b' : '#ef4444'
            }}
          />
        </div>
        <div className="mr-validation__item-hint">
          {result.validation.coherenceScore > 70 ? 'Ответы согласованы' :
           result.validation.coherenceScore > 40 ? 'Есть некоторые противоречия' : 'Много противоречий'}
        </div>
      </div>

      <div className="mr-validation__item">
        <div className="mr-validation__item-header">
          <span className="mr-validation__item-name">Духовный байпас</span>
          <span className="mr-validation__item-value">
            {Math.round(result.validation.spiritualBypassScore * 100)}%
          </span>
        </div>
        <div className="mr-validation__item-bar">
          <div
            className="mr-validation__item-fill"
            style={{
              width: `${result.validation.spiritualBypassScore * 100}%`,
              background: result.validation.spiritualBypassScore > 0.6 ? '#f59e0b' : '#10b981'
            }}
          />
        </div>
        <div className="mr-validation__item-hint">
          {result.validation.spiritualBypassScore > 0.6
            ? 'Возможен отрыв от практики'
            : 'Баланс теории и практики'}
        </div>
      </div>

      {/* Contradictions */}
      {result.validation.contradictionFlags.length > 0 && (
        <div className="mr-validation__warnings">
          <div className="mr-validation__warnings-title">⚠️ Противоречия</div>
          <ul className="mr-validation__warnings-list">
            {result.validation.contradictionFlags.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className={`mr-page ${isTelegram ? 'tg-theme' : ''}`}>
      {/* Header Section */}
      <div className="mr-header">
        <h1 className="mr-header__title">Ваши результаты</h1>
      </div>

      {/* Tabs */}
      <div className="mr-tabs">
        {(['summary', 'breakdown', 'actions', 'validation'] as const).map((tab) => (
          <button
            key={tab}
            className={`mr-tab ${activeTab === tab ? 'mr-tab--active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === 'summary' ? '📋 Резюме' :
             tab === 'breakdown' ? '📊 Уровни' :
             tab === 'actions' ? '🎯 Действия' : '✅ Проверка'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mr-container">
        {activeTab === 'summary' && <SummaryTab />}
        {activeTab === 'breakdown' && <BreakdownTab />}
        {activeTab === 'actions' && <ActionsTab />}
        {activeTab === 'validation' && <ValidationTab />}

        {/* Bottom Actions */}
        <div className={`mr-bottom-actions ${isTelegram ? 'mr-bottom-actions--tg' : ''}`}>
          <button className="mr-btn mr-btn--secondary" onClick={handleRestart}>
            <RotateCcw size={18} />
            Пройти ещё раз
          </button>
          <button className="mr-btn mr-btn--primary" onClick={handleShare}>
            <Share2 size={18} />
            Поделиться
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernAdaptiveResults;
