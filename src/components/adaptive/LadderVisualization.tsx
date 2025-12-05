import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/design-system.css';

interface LadderVisualizationProps {
  currentLevel: number;
  showLabels?: boolean;
  compact?: boolean;
}

/**
 * Красивая визуализация "Лестницы Союза" с 12 уровнями
 * Показывает текущий уровень и контекст в системе развития отношений
 */
export const LadderVisualization: React.FC<LadderVisualizationProps> = ({
  currentLevel,
  showLabels = true,
  compact = false,
}) => {
  // Определяем цвета для зон
  const getZoneColor = (level: number) => {
    if (level <= 3) return { bg: '#fee', border: '#c00', text: '#600', zone: 'Деструктивная зона' };
    if (level <= 6) return { bg: '#fef3e0', border: '#ff9800', text: '#e65100', zone: 'Эмоциональная зона' };
    if (level <= 9) return { bg: '#f1f8f5', border: '#4CAF50', text: '#2e7d32', zone: 'Зрелая зона' };
    return { bg: '#e3f2fd', border: '#2196F3', text: '#1565c0', zone: 'Трансцендентная зона' };
  };


  const levelDetails = {
    1: { icon: '🔥', emoji: '💔', description: 'Травма и разрушение' },
    2: { icon: '🔄', emoji: '🎭', description: 'Кармический сценарий' },
    3: { icon: '😰', emoji: '⛓️', description: 'Выживание' },
    4: { icon: '🏠', emoji: '💼', description: 'Ресурсы и стабильность' },
    5: { icon: '⚡', emoji: '💥', description: 'Эмоции и страсть' },
    6: { icon: '👑', emoji: '🎭', description: 'Статус и роль' },
    7: { icon: '💭', emoji: '🤝', description: 'Психологическая связь' },
    8: { icon: '❤️', emoji: '🌹', description: 'Любовь и принятие' },
    9: { icon: '🦅', emoji: '🕊️', description: 'Свобода и зрелость' },
    10: { icon: '⚡💪', emoji: '🚀', description: 'Синергия и рост' },
    11: { icon: '✨🎨', emoji: '🎼', description: 'Совместное творчество' },
    12: { icon: '🌟', emoji: '🙏', description: 'Духовный союз' },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const size = compact ? '60px' : '80px';

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: compact ? '1.5rem' : '2rem',
        background: '#fafafa',
        borderRadius: '16px',
      }}
    >
      <h3
        style={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '2rem',
          color: '#333',
        }}
      >
        Лестница Союза: Ваш путь развития
      </h3>

      <motion.div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: compact ? '1rem' : '1.5rem',
          marginBottom: '2rem',
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((level) => {
          const isCurrentLevel = Math.round(currentLevel) === level;
          const colors = getZoneColor(level);
          const details = levelDetails[level as keyof typeof levelDetails];

          return (
            <motion.div
              key={level}
              variants={isCurrentLevel ? highlightVariants : stepVariants}
              style={{
                position: 'relative',
                textAlign: 'center',
              }}
            >
              {/* Текущий уровень - выделение */}
              {isCurrentLevel && (
                <motion.div
                  layoutId="currentLevel"
                  style={{
                    position: 'absolute',
                    inset: '-8px',
                    border: `3px solid ${colors.border}`,
                    borderRadius: '12px',
                    background: `${colors.bg}40`,
                    zIndex: 0,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )}

              {/* Основной уровень */}
              <motion.div
                onClick={() => {
                  /* Could add interactivity later */
                }}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: size,
                  height: size,
                  margin: '0 auto',
                  background: isCurrentLevel ? colors.bg : '#fff',
                  border: `2px solid ${colors.border}`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: colors.text,
                  boxShadow: isCurrentLevel
                    ? `0 0 20px ${colors.border}40, inset 0 0 10px ${colors.bg}`
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                whileHover={!isCurrentLevel ? { scale: 1.05, boxShadow: `0 4px 12px ${colors.border}30` } : {}}
              >
                {level}
              </motion.div>

              {/* Иконка и название */}
              {showLabels && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    fontSize: compact ? '0.75rem' : '0.85rem',
                  }}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                    {details.emoji}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: colors.text,
                      maxWidth: '120px',
                      margin: '0 auto',
                      lineHeight: '1.2',
                    }}
                  >
                    {details.description}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Зоны информация */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        {[
          { level: '1-3', zone: '🔴 Деструктивная', color: '#fee' },
          { level: '4-6', zone: '🟡 Эмоциональная', color: '#fef3e0' },
          { level: '7-9', zone: '🟢 Зрелая', color: '#f1f8f5' },
          { level: '10-12', zone: '🔵 Трансцендентная', color: '#e3f2fd' },
        ].map((zone) => (
          <div
            key={zone.level}
            style={{
              padding: '0.75rem',
              background: zone.color,
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#333',
            }}
          >
            <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
              {zone.zone}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>уровни {zone.level}</div>
          </div>
        ))}
      </motion.div>

      {/* Текущий статус */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'white',
          borderRadius: '8px',
          borderLeft: `4px solid ${getZoneColor(Math.round(currentLevel)).border}`,
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
          Вы находитесь на <strong>уровне {Math.round(currentLevel)}</strong>
          {' '}
          {levelDetails[Math.round(currentLevel) as keyof typeof levelDetails]?.description}
        </p>
      </motion.div>
    </div>
  );
};

export default LadderVisualization;
