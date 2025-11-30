import React from 'react';
import { motion } from 'framer-motion';
// modern.css удален при зачистке

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  currentBlock?: 'A' | 'B' | 'C';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps,
  currentBlock
}) => {
  const progress = (currentStep / totalSteps) * 100;
  
  // Определяем цвет и стиль прогресс-бара в зависимости от блока вопросов
  const getGradient = () => {
    if (currentBlock === 'A') {
      return 'linear-gradient(90deg, rgba(var(--primary), 0.9) 0%, rgba(var(--primary), 0.7) 100%)'; 
    } else if (currentBlock === 'B') {
      return 'linear-gradient(90deg, rgba(var(--secondary), 0.9) 0%, rgba(var(--secondary), 0.7) 100%)';
    } else if (currentBlock === 'C') {
      return 'linear-gradient(90deg, rgba(var(--accent), 0.9) 0%, rgba(var(--accent), 0.7) 100%)';
    }
    return 'linear-gradient(90deg, rgba(var(--accent1), 0.9) 0%, rgba(var(--accent2), 0.7) 100%)';
  };

  // Цвет фона для контейнера прогресса (более темная версия основного цвета)
  const getBackgroundGradient = () => {
    if (currentBlock === 'A') {
      return 'linear-gradient(90deg, rgba(var(--primary), 0.15) 0%, rgba(var(--primary), 0.05) 100%)';
    } else if (currentBlock === 'B') {
      return 'linear-gradient(90deg, rgba(var(--secondary), 0.15) 0%, rgba(var(--secondary), 0.05) 100%)';
    } else if (currentBlock === 'C') {
      return 'linear-gradient(90deg, rgba(var(--accent), 0.15) 0%, rgba(var(--accent), 0.05) 100%)';
    }
    return 'linear-gradient(90deg, rgba(var(--accent1), 0.15) 0%, rgba(var(--accent2), 0.05) 100%)';
  };

  // Иконка для блока
  const getBlockIcon = () => {
    if (currentBlock === 'A') return '👤';
    if (currentBlock === 'B') return '👥';
    if (currentBlock === 'C') return '⚖️';
    return '❔'; // Fallback icon
  };

  // Генерация маркеров шагов
  const renderStepMarkers = () => {
    const markers = [];
    const markersCount = 5; // Показываем только основные маркеры
    const step = totalSteps / (markersCount - 1);
    
    for (let i = 0; i < markersCount; i++) {
      const markerPosition = i * step;
      const isActive = currentStep >= markerPosition;
      const isCurrentStep = currentStep === Math.round(markerPosition);
      
      markers.push(
        <div 
          key={i} 
          className={`progress-marker ${isActive ? 'active' : ''} ${isCurrentStep ? 'current' : ''}`}
          style={{
            left: `${(markerPosition / totalSteps) * 100}%`,
          }}
        >
          {isCurrentStep && (
            <motion.div 
              className="marker-pulse"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      );
    }
    
    return markers;
  };

  return (
    <div className="modern-progress-wrapper">
      <div className="progress-header">
        <div className="progress-info">
          <motion.div 
            className="progress-block-badge"
            style={{ 
              background: getGradient(),
              boxShadow: currentBlock === 'A' 
                ? '0 0 15px rgba(var(--primary), 0.3)' 
                : currentBlock === 'B' 
                  ? '0 0 15px rgba(var(--secondary), 0.3)'
                  : '0 0 15px rgba(var(--accent), 0.3)'
            }}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {getBlockIcon()}
          </motion.div>
          
          <div className="progress-text">
            <motion.h3 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Вопрос {currentStep} из {totalSteps}
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {currentBlock === 'A' ? 'Блок A: Личная зрелость' : currentBlock === 'B' ? 'Блок B: Уровень отношений' : 'Блок C: Развитие'}
            </motion.p>
          </div>
        </div>
        
        <motion.div 
          className="progress-percentage"
          style={{ 
            background: getGradient(),
            boxShadow: currentBlock === 'A' 
              ? '0 0 15px rgba(var(--primary), 0.2)' 
              : currentBlock === 'B' 
                ? '0 0 15px rgba(var(--secondary), 0.2)'
                : '0 0 15px rgba(var(--accent), 0.2)'
          }}
          initial={{ scale: 0.9 }}
          animate={{ 
            scale: [1, 1.05, 1],
            transition: { duration: 0.5, ease: "easeOut" }
          }}
        >
          <span>{Math.round(progress)}</span>
          <small>%</small>
        </motion.div>
      </div>
      
      <div 
        className="modern-progress-container"
        style={{ background: getBackgroundGradient() }}
      >
        {renderStepMarkers()}
        
        <motion.div 
          className="modern-progress-bar"
          style={{ 
            width: `${progress}%`,
            background: getGradient(),
            boxShadow: currentBlock === 'A' 
              ? '0 0 20px rgba(var(--primary), 0.5)' 
              : currentBlock === 'B' 
                ? '0 0 20px rgba(var(--secondary), 0.5)'
                : '0 0 20px rgba(var(--accent), 0.5)'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: 0.5, 
            ease: "easeOut"
          }}
        />
      </div>
      
      {currentBlock && (
        <div className="block-indicators">
          <div className={`block-indicator ${currentBlock === 'A' ? 'active' : ''}`}>
            Блок A
          </div>
          <div className={`block-indicator ${currentBlock === 'B' ? 'active' : ''}`}>
            Блок B
          </div>
          <div className={`block-indicator ${currentBlock === 'C' ? 'active' : ''}`}>
            Блок C
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
