import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './UnionLadder.module.css';
import { levels } from '../utils/levels';
import { getScenarioInterpretation } from '../utils/scenario-interpretations';
import type { TestResult } from '../types';

interface UnionLadderProps {
  result: TestResult | null;
  onLevelSelect: (levelId: number) => void;
  selectedLevelId: number;
}

const UnionLadder: React.FC<UnionLadderProps> = ({
  result,
  onLevelSelect,
  selectedLevelId
}) => {
  // Сортируем уровни по убыванию (12 -> 1) - ВАЖНО: создаем копию, чтобы не мутировать оригинальный массив
  const sortedLevels = [...levels].sort((a, b) => b.id - a.id);

  // Выбранный уровень для описания
  const selectedLevel = useMemo(() => {
    return levels.find(l => l.id === selectedLevelId);
  }, [selectedLevelId]);

  // Получаем сценарий-специфичную интерпретацию
  const scenarioInterpretation = useMemo(() => {
    if (!result?.testScenario || !selectedLevel) {
      return null;
    }
    try {
      return getScenarioInterpretation(selectedLevelId, result.testScenario);
    } catch (error) {
      console.warn(`Не удалось получить интерпретацию для уровня ${selectedLevelId} и сценария ${result.testScenario}:`, error);
      return null;
    }
  }, [selectedLevelId, result?.testScenario, selectedLevel]);

  // Определяем доминирующие уровни - теперь это массив  
  const dominantLevels = useMemo(() => {
    if (!result) return [];

    // Возвращаем массив доминирующих уровней
    return [
      { levelId: result.personalLevel, type: 'personal' as const },
      { levelId: result.relationshipLevel, type: 'relationship' as const },
      result.potentialLevel ? { levelId: result.potentialLevel, type: 'potential' as const } : null
    ].filter((level): level is { levelId: number; type: 'personal' | 'relationship' | 'potential' } =>
      level !== null && level.levelId > 0
    );
  }, [result]);

  // Получаем баллы для каждого уровня из новой структуры
  const getScoresForLevel = (levelId: number) => {
    if (!result?.levelDistribution) return { personal: 0, relationship: 0, total: 0 };

    const levelScore = result.levelDistribution.find(s => s.levelId === levelId);
    return {
      personal: levelScore?.personal || 0,
      relationship: levelScore?.relationship || 0,
      total: levelScore?.total || 0
    };
  };

  // Получаем проценты для прогресс-баров
  const getPercentagesForLevel = (levelId: number) => {
    if (!result?.levelDistribution) return { personalPercent: 0, relationshipPercent: 0 };

    const levelScore = result.levelDistribution.find(s => s.levelId === levelId);
    return {
      personalPercent: levelScore?.personalPercentage || 0,
      relationshipPercent: levelScore?.relationshipPercentage || 0
    };
  };

  // Проверяем, является ли уровень доминирующим
  const isDominantLevel = (levelId: number) => {
    return dominantLevels.some(l => l.levelId === levelId);
  };

  // Получаем тип доминирования
  const getDominanceType = (levelId: number): 'personal' | 'relationship' | 'potential' | null => {
    const dominantLevel = dominantLevels.find(l => l.levelId === levelId);
    return dominantLevel?.type || null;
  };

  // Детекция противоречий для визуальных индикаторов (ИСПРАВЛЕННАЯ ВЕРСИЯ v2)
  //
  // КЛЮЧЕВАЯ ЛОГИКА:
  // - "Духовный обход" = высокие уровни (9-12) при ПРОВАЛЕ базовых (1-3)
  // - Если ВСЕ уровни высокие - это НОРМА, не конфликт!
  // - Конфликт только при КОНТРАСТЕ: база слабая + верх сильный
  //
  const hasConflict = (levelId: number): {
    type: 'spiritual_bypass' | 'gap_warning' | 'no_foundation' | null;
    message: string;
    severity: 'critical' | 'warning' | 'info';
  } => {
    if (!result?.levelDistribution) return { type: null, message: '', severity: 'info' };

    const percentages = getPercentagesForLevel(levelId);
    const totalPercent = percentages.personalPercent + percentages.relationshipPercent;

    // Если уровень слабо освоен, не показываем конфликты для этого уровня
    if (totalPercent < 30) return { type: null, message: '', severity: 'info' };

    // ========================================================================
    // АНАЛИЗ КОНТЕКСТА ПРОФИЛЯ
    // ========================================================================
    const getProfileContext = () => {
      const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const levelScores = allLevels.map(l => {
        const p = getPercentagesForLevel(l);
        return { level: l, total: p.personalPercent + p.relationshipPercent };
      });

      // Значимые уровни - те, где есть реальные ответы (> 15%)
      const significantLevels = levelScores.filter(s => s.total > 15);

      if (significantLevels.length === 0) {
        return {
          avgScore: 0,
          minLevel: 1,
          maxLevel: 12,
          foundationStrong: false,
          foundationWeak: false,
          highLevelsStrong: false,
          isHarmonious: false,
          testedLevelsCount: 0
        };
      }

      // Средний балл по всем значимым уровням
      const avgScore = significantLevels.reduce((sum, s) => sum + s.total, 0) / significantLevels.length;

      const minLevel = Math.min(...significantLevels.map(s => s.level));
      const maxLevel = Math.max(...significantLevels.map(s => s.level));

      // Анализ базовых уровней (1-3)
      const foundationScores = levelScores.filter(s => s.level <= 3);
      const foundationAvg = foundationScores.reduce((sum, s) => sum + s.total, 0) / 3;
      const foundationTested = foundationScores.some(s => s.total > 10);

      // База СИЛЬНАЯ если средний результат >= 50% (хорошо освоены)
      const foundationStrong = foundationAvg >= 50;
      // База СЛАБАЯ если тестировалась и средний результат < 30%
      const foundationWeak = foundationTested && foundationAvg < 30;

      // Анализ высоких уровней (9-12)
      const highScores = levelScores.filter(s => s.level >= 9);
      const highAvg = highScores.reduce((sum, s) => sum + s.total, 0) / 4;
      const highLevelsStrong = highAvg >= 50;

      // Анализ средних уровней (4-8)
      const middleScores = levelScores.filter(s => s.level >= 4 && s.level <= 8);
      const middleAvg = middleScores.reduce((sum, s) => sum + s.total, 0) / 5;
      const middleWeak = middleAvg < 25;

      // Профиль ГАРМОНИЧНЫЙ если:
      // 1. Все значимые уровни имеют похожие баллы (разброс < 40%)
      // 2. ИЛИ средний балл высокий (> 50%) без резких провалов
      const scoreVariance = significantLevels.length > 1
        ? Math.max(...significantLevels.map(s => s.total)) - Math.min(...significantLevels.map(s => s.total))
        : 0;

      const isHarmonious = (
        // Вариант 1: Малый разброс между уровнями
        (scoreVariance < 40 && significantLevels.length >= 3) ||
        // Вариант 2: Высокий средний балл и база не провалена
        (avgScore >= 50 && !foundationWeak) ||
        // Вариант 3: База сильная (независимо от верха)
        (foundationStrong && foundationAvg >= 60)
      );

      return {
        avgScore,
        minLevel,
        maxLevel,
        foundationStrong,
        foundationWeak,
        foundationAvg,
        highLevelsStrong,
        highAvg,
        middleWeak,
        middleAvg,
        isHarmonious,
        testedLevelsCount: significantLevels.length,
        scoreVariance
      };
    };

    const context = getProfileContext();

    // ========================================================================
    // ЗАЩИТА: ГАРМОНИЧНЫЙ ПРОФИЛЬ - НЕ КОНФЛИКТ!
    // ========================================================================

    // Если профиль гармоничный - никаких конфликтов
    if (context.isHarmonious) {
      return { type: null, message: '', severity: 'info' };
    }

    // Если база СИЛЬНАЯ (>=50%) - это здоровый фундамент, не конфликт
    if (context.foundationStrong) {
      return { type: null, message: '', severity: 'info' };
    }

    // ========================================================================
    // ДЕТЕКЦИЯ РЕАЛЬНЫХ КОНФЛИКТОВ
    // ========================================================================

    // КОНФЛИКТ 1: ДУХОВНЫЙ ОБХОД (spiritual_bypass)
    // Условие: Высокие уровни СИЛЬНЫЕ + База СЛАБАЯ
    // Это реальная проблема: человек "летает в облаках" без фундамента
    if (levelId >= 9 && totalPercent >= 50) {
      if (context.foundationWeak && context.highLevelsStrong) {
        // Дополнительная проверка: разрыв между базой и верхом
        const gapSize = (context.highAvg || 0) - (context.foundationAvg || 0);

        if (gapSize > 30) { // Разрыв более 30% между базой и верхом
          return {
            type: 'spiritual_bypass',
            message: `Высокие уровни (9-12: ${Math.round(context.highAvg || 0)}%) при слабой базе (1-3: ${Math.round(context.foundationAvg || 0)}%). Рекомендуется укрепить фундамент.`,
            severity: 'critical'
          };
        }
      }
    }

    // КОНФЛИКТ 2: ПРОПУСК СЕРЕДИНЫ (gap_warning)
    // Условие: Есть база + есть верх, но середина провалена
    if (levelId >= 9 && totalPercent >= 50) {
      if (!context.foundationWeak && context.highLevelsStrong && context.middleWeak) {
        return {
          type: 'gap_warning',
          message: `Пропуск средних уровней (4-8: ${Math.round(context.middleAvg || 0)}%). Может создавать неустойчивость в развитии.`,
          severity: 'warning'
        };
      }
    }

    // КОНФЛИКТ 3: ОТСУТСТВИЕ БАЗЫ (no_foundation)
    // Условие: Высокий уровень освоен, но база вообще не тестировалась или провалена полностью
    if (levelId >= 10 && totalPercent >= 60) {
      // Проверяем что база практически пустая (< 15% в среднем)
      if ((context.foundationAvg || 0) < 15 && context.highLevelsStrong) {
        return {
          type: 'no_foundation',
          message: `Высокий уровень ${levelId} (${Math.round(totalPercent)}%) без проработки базовых потребностей (1-3: ${Math.round(context.foundationAvg || 0)}%). Возможна нестабильность.`,
          severity: 'critical'
        };
      }
    }

    return { type: null, message: '', severity: 'info' };
  };

  // Цвета ступеней по смыслу и логике уровней
  const getStepColors = (level: number, isActive: boolean, isDominant: boolean) => {
    const meaningColors: { [key: number]: string } = {
      1: isDominant ? 'from-red-500 to-red-600' : isActive ? 'from-red-400 to-red-500' : 'from-red-100 to-red-200',
      2: isDominant ? 'from-purple-500 to-purple-600' : isActive ? 'from-purple-400 to-purple-500' : 'from-purple-100 to-purple-200',
      3: isDominant ? 'from-gray-500 to-gray-600' : isActive ? 'from-gray-400 to-gray-500' : 'from-gray-100 to-gray-200',
      4: isDominant ? 'from-green-500 to-green-600' : isActive ? 'from-green-400 to-green-500' : 'from-green-100 to-green-200',
      5: isDominant ? 'from-red-600 to-pink-600' : isActive ? 'from-red-500 to-pink-500' : 'from-red-100 to-pink-100',
      6: isDominant ? 'from-blue-500 to-blue-600' : isActive ? 'from-blue-400 to-blue-500' : 'from-blue-100 to-blue-200',
      7: isDominant ? 'from-indigo-500 to-indigo-600' : isActive ? 'from-indigo-400 to-indigo-500' : 'from-indigo-100 to-indigo-200',
      8: isDominant ? 'from-teal-500 to-teal-600' : isActive ? 'from-teal-400 to-teal-500' : 'from-teal-100 to-teal-200',
      9: isDominant ? 'from-cyan-500 to-cyan-600' : isActive ? 'from-cyan-400 to-cyan-500' : 'from-cyan-100 to-cyan-200',
      10: isDominant ? 'from-orange-500 to-orange-600' : isActive ? 'from-orange-400 to-orange-500' : 'from-orange-100 to-orange-200',
      11: isDominant ? 'from-yellow-500 to-yellow-600' : isActive ? 'from-yellow-400 to-yellow-500' : 'from-yellow-100 to-yellow-200',
      12: isDominant ? 'from-emerald-500 to-emerald-600' : isActive ? 'from-emerald-400 to-emerald-500' : 'from-emerald-100 to-emerald-200'
    };
    return meaningColors[level] || 'from-gray-100 to-gray-200';
  };

  // Получение ширины ступени (все выровнены по центру)
  const getStepWidth = (levelId: number): number => {
    const baseWidth = 45;
    const increment = (levelId - 1) * 2;
    return Math.min(baseWidth + increment, 75);
  };

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const stepVariants = {
    hidden: {
      opacity: 0,
      x: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className={styles.unionLadderContainer}>
      {/* Заголовки прогресс-баров */}
      <div className={styles.progressHeaders}>
        <div className={styles.personalHeader}>Личность</div>
        <div className={styles.stepsHeader}>Лестница Союза</div>
        <div className={styles.relationshipHeader}>Отношения</div>
      </div>

      {/* Легенда индикаторов (отображается если есть конфликты) */}
      {result && sortedLevels.some(l => hasConflict(l.id).type !== null) && (
        <motion.div
          className={styles.conflictLegend}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.legendTitle}>📊 Обнаружены особенности профиля:</div>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <span className={styles.legendIcon}>⛔</span>
              <span className={styles.legendText}>Отсутствие базы (критично)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendIcon}>🔴</span>
              <span className={styles.legendText}>Духовный обход (требует внимания)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendIcon}>🟡</span>
              <span className={styles.legendText}>Пробелы в развитии (рекомендация)</span>
            </div>
          </div>
          <div className={styles.legendHint}>
            💡 Наведите курсор на индикатор для деталей
          </div>
        </motion.div>
      )}

      {/* Основной контейнер с лестницей и прогресс-барами */}
      <div className={styles.ladderWithProgress}>
        {/* Строки лестницы - каждая строка содержит левый прогресс, ступень, правый прогресс */}
        <motion.div
          className={styles.ladderRows}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedLevels.map((level) => {
            console.log('Rendering ladder level:', {
              level: typeof level,
              levelId: level?.id,
              levelName: level?.name,
              isObject: typeof level === 'object'
            });

            if (!level || typeof level !== 'object') {
              console.error('Invalid level object in UnionLadder:', level);
              return null;
            }

            const stepWidth = getStepWidth(level.id);
            const isActive = selectedLevelId === level.id;
            const isDominant = isDominantLevel(level.id);
            const dominantType = getDominanceType(level.id);
            const stepColor = getStepColors(level.id, isActive, isDominant);
            const scores = getScoresForLevel(level.id);
            const percentages = getPercentagesForLevel(level.id);
            const personalPercent = percentages.personalPercent;
            const relationshipPercent = percentages.relationshipPercent;
            const conflict = hasConflict(level.id); // Детекция противоречий

            return (
              <motion.div
                key={level.id}
                variants={stepVariants}
                className={styles.ladderRow}
              >
                {/* Иконка личного уровня (слева) */}
                <div className={styles.levelIconLeft}>
                  {dominantType === 'personal' && (
                    <span className={styles.dominantIcon} title="Ваш доминирующий личный уровень">
                      👤
                    </span>
                  )}
                </div>

                {/* Левый прогресс-бар (личность) */}
                <motion.div
                  className={`${styles.progressItem} ${styles.leftProgressItem} ${isDominant ? styles.dominant : ''} ${dominantType === 'personal' ? styles.personalDominant : ''} ${conflict.type ? styles.conflict : ''}`}
                  data-conflict-type={conflict.type || ''}
                  title={conflict.message || ''}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (12 - level.id) * 0.05 }}
                >
                  {conflict.type && (
                    <span
                      className={`${styles.conflictBadge} ${styles[`severity_${conflict.severity}`]}`}
                      title={conflict.message}
                      role="alert"
                      aria-label={`Конфликт: ${conflict.message}`}
                    >
                      {conflict.type === 'no_foundation' ? '⛔' :
                        conflict.type === 'spiritual_bypass' ? '🔴' : '🟡'}
                    </span>
                  )}
                  <div className={styles.progressScore}>{scores.personal}</div>
                  <div className={`${styles.progressBar} ${styles.leftProgressBar}`}>
                    <motion.div
                      className={styles.progressFill}
                      style={{
                        background: isDominant && dominantType === 'personal'
                          ? 'linear-gradient(90deg, #4f46e5, #6366f1)'
                          : 'linear-gradient(90deg, #818cf8, #a5b4fc)',
                        width: `${personalPercent}%`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${personalPercent}%` }}
                      transition={{ duration: 1, delay: 0.5 + (12 - level.id) * 0.05 }}
                    />
                  </div>
                </motion.div>

                {/* Ступень */}
                <div
                  className={styles.ladderStepContainer}
                  onClick={() => onLevelSelect(level.id)}
                >
                  <motion.div
                    className={`${styles.ladderStep} ${isActive ? styles.active : ''} ${isDominant ? styles.dominant : ''}`}
                    style={{
                      width: `${stepWidth}%`,
                      margin: '0 auto'
                    }}
                    whileHover={{
                      scale: 1.02,
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={styles.stepBackground}>
                      <div className={`bg-gradient-to-r ${stepColor}`}></div>
                    </div>

                    <div className={styles.stepContent}>
                      <div className={styles.stepLeft}>
                        <div className={styles.levelNumber}>{level.id}</div>
                      </div>
                      <div className={styles.stepRight}>
                        <div className={styles.levelName}>
                          {level.name}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Правый прогресс-бар (отношения) */}
                <motion.div
                  className={`${styles.progressItem} ${styles.rightProgressItem} ${isDominant ? styles.dominant : ''} ${dominantType === 'relationship' ? styles.relationshipDominant : ''} ${conflict.type ? styles.conflict : ''}`}
                  data-conflict-type={conflict.type || ''}
                  title={conflict.message || ''}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (12 - level.id) * 0.05 }}
                >
                  {conflict.type && (
                    <span
                      className={`${styles.conflictBadge} ${styles[`severity_${conflict.severity}`]}`}
                      title={conflict.message}
                      role="alert"
                      aria-label={`Конфликт: ${conflict.message}`}
                    >
                      {conflict.type === 'no_foundation' ? '⛔' :
                        conflict.type === 'spiritual_bypass' ? '🔴' : '🟡'}
                    </span>
                  )}
                  <div className={styles.progressScore}>{scores.relationship}</div>
                  <div className={`${styles.progressBar} ${styles.rightProgressBar}`}>
                    <motion.div
                      className={styles.progressFill}
                      style={{
                        background: isDominant && dominantType === 'relationship'
                          ? 'linear-gradient(90deg, #ec4899, #f472b6)'
                          : 'linear-gradient(90deg, #f472b6, #f9a8d4)',
                        width: `${relationshipPercent}%`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${relationshipPercent}%` }}
                      transition={{ duration: 1, delay: 0.7 + (12 - level.id) * 0.05 }}
                    />
                  </div>
                  <div className={styles.progressScore}>{scores.relationship}</div>
                </motion.div>

                {/* Иконка отношений (справа) */}
                <div className={styles.levelIconRight}>
                  {dominantType === 'relationship' && (
                    <span className={styles.dominantIcon} title="Ваш доминирующий уровень отношений">
                      👫
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Описание выбранного уровня */}
      {selectedLevel && (
        <motion.div
          className={styles.levelDescription}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.descriptionCard}>
            <div className={styles.descriptionHeader}>
              <div className={styles.levelBadge}>
                <span className={styles.levelNumber}>{selectedLevel.id}</span>
              </div>
              <div className={styles.levelInfo}>
                <h3 className={styles.levelTitle}>{selectedLevel.name}</h3>
                <p className={styles.levelSubtitle}>
                  {scenarioInterpretation?.description || selectedLevel.shortDescription}
                </p>
              </div>
            </div>

            <div className={styles.descriptionContent}>
              {/* Основная интерпретация */}
              <p className={styles.levelFullDescription}>
                {scenarioInterpretation?.interpretation || selectedLevel.fullDescription || selectedLevel.shortDescription}
              </p>

              {/* Фокус внимания - если есть сценарий-специфичная интерпретация */}
              {scenarioInterpretation?.focus && (
                <div className={styles.recommendations}>
                  <h4 className={styles.recommendationsTitle}>На что обратить внимание:</h4>
                  <p style={{ margin: '0.5rem 0', color: '#555', lineHeight: '1.6' }}>
                    {scenarioInterpretation.focus}
                  </p>
                </div>
              )}

              {/* Рекомендации - используем сценарий-специфичные или базовые */}
              {(scenarioInterpretation?.recommendations || selectedLevel.recommendations) && (
                <div className={styles.recommendations}>
                  <h4 className={styles.recommendationsTitle}>Рекомендации:</h4>
                  <ul className={styles.recommendationsList}>
                    {(scenarioInterpretation?.recommendations || selectedLevel.recommendations)?.slice(0, 5).map((rec, index) => (
                      <li key={index} className={styles.recommendationItem}>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Путь развития - если есть сценарий-специфичная интерпретация */}
              {scenarioInterpretation?.growthPath && (
                <div className={styles.recommendations} style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1rem', marginTop: '1rem' }}>
                  <h4 className={styles.recommendationsTitle}>Путь развития:</h4>
                  <p style={{ margin: '0.5rem 0', color: '#555', lineHeight: '1.6', fontStyle: 'italic' }}>
                    {scenarioInterpretation.growthPath}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UnionLadder;
