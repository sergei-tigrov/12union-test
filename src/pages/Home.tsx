import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Clock,
  Heart,
  TrendingUp,
  ArrowRight,
  Target,
  Shield
} from 'lucide-react';
import { levels } from '../utils/levels';
import type { Level } from '../utils/levels';

import '../styles/home.css';
import '../styles/design-system.css';

// Описание модели по умолчанию
const modelDescription = {
  title: "Лестница Союза",
  subtitle: "Многоуровневая модель развития отношений",
  description: `«Лестница Союза» — это многоуровневая модель развития отношений между людьми, которая описывает эволюцию пары от деструктивных, травматичных форм связи (страх, зависимость, выживание) до зрелых, синергичных и духовных союзов (принятие, свобода, творчество, служение).

Модель включает 12 ступеней, расположенных в последовательности от низших форм (эмоционально-негативных и незрелых) к высшим (эмоционально-устойчивым, творческим и трансцендентным).`,
  features: [
    "Каждая ступень имеет уникальные психологические потребности, паттерны поведения и ценности",
    "Представляет определённый уровень сознания и зрелости в сфере отношений",
    "Позволяет точно диагностировать, где находятся ваши отношения и куда они движутся"
  ]
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

  const handleStartAdaptiveTest = () => {
    navigate('/adaptive-test');
  };

  // Анимация для элементов
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div
      className="home-page"
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section с изображением лестницы на фоне */}
      <section className="hero-section-new">
        <div className="hero-background-image"></div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="hero-main-title">Лестница Союза:</h1>
              <h2 className="hero-subtitle">12 ступеней к идеальным отношениям</h2>

              <p className="hero-description">
                Откройте научно обоснованную модель развития отношений. Пройдите тест и узнайте, на какой ступени находятся ваши отношения прямо сейчас.
              </p>

              <div className="hero-features">
                <div className="hero-feature-item">
                  <Target className="hero-feature-icon" />
                  <span>Точная диагностика уровня отношений</span>
                </div>
                <div className="hero-feature-item">
                  <TrendingUp className="hero-feature-icon" />
                  <span>Персональная карта развития</span>
                </div>
                <div className="hero-feature-item">
                  <Heart className="hero-feature-icon" />
                  <span>Практические рекомендации</span>
                </div>
              </div>

              <button
                className="hero-cta-button gradient-button"
                onClick={handleStartAdaptiveTest}
              >
                <span>Начать тестирование</span>
                <ArrowRight className="hero-cta-icon" />
              </button>

              <div className="hero-badges">
                <div className="hero-badge">
                  <Clock className="hero-duration-icon" />
                  Тест займет 5-7 минут
                </div>
                <div className="hero-badge">
                  <Shield className="hero-badge-icon" />
                  100% конфиденциально
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Секция с пирамидой ступеней */}
      <section className="pyramid-section">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="gradient-text">Исследуйте 12 ступеней развития отношений</h2>
            <p>Каждая ступень — это уникальный этап с особыми характеристиками и задачами</p>
          </motion.div>

          <div className="pyramid-container">
            <motion.div
              className="pyramid-container-inner"
              variants={staggerContainer}
            >
              <div className="pyramid-wrapper">
                <motion.div
                  className={`pyramid-level level-model gradient-card ${selectedLevel === null ? 'selected' : ''} ${hoveredLevel === 0 ? 'hovered' : ''}`}
                  variants={fadeInUp}
                  onClick={() => setSelectedLevel(null)}
                  onMouseEnter={() => setHoveredLevel(0)}
                  onMouseLeave={() => setHoveredLevel(null)}
                  style={{
                    '--level-color': '#6a5acd',
                    '--level-gradient': 'linear-gradient(135deg, #6a5acd, #9370db)',
                    backgroundColor: hoveredLevel === 0 || selectedLevel === null ? '#6a5acd' : '#6a5acd33',
                    width: '100%'
                  } as React.CSSProperties}
                >
                  <div className="level-content">
                    <span className="level-name gradient-text">Лестница Союза</span>
                  </div>
                </motion.div>

                {[...levels].reverse().map((level) => (
                  <div key={level.id} className="pyramid-step-container">
                    <div className="step-number-container">
                      <div className="step-number">{level.id}</div>
                    </div>

                    <motion.div
                      className={`pyramid-level level-${level.id} gradient-card ${selectedLevel?.id === level.id ? 'selected' : ''} ${hoveredLevel === level.id ? 'hovered' : ''}`}
                      variants={fadeInUp}
                      onClick={() => setSelectedLevel(level)}
                      onMouseEnter={() => setHoveredLevel(level.id)}
                      onMouseLeave={() => setHoveredLevel(null)}
                      style={{
                        '--level-color': level.color,
                        '--level-gradient': level.gradient,
                        backgroundColor: level.id === hoveredLevel || level.id === selectedLevel?.id ? level.color : `${level.color}33`
                      } as React.CSSProperties}
                    >
                      <div className="level-content">
                        <span className="level-name">{level.name}</span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  className="level-details gradient-card"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedLevel ? (
                    <>
                      <div className="detail-header">
                        <h3>
                          <span className="detail-icon">{selectedLevel.icon}</span>
                          Ступень {selectedLevel.id}: {selectedLevel.name}
                        </h3>
                        <button
                          className="close-detail"
                          onClick={() => setSelectedLevel(null)}
                        >
                          ✕
                        </button>
                      </div>

                      <p className="detail-description">{selectedLevel.fullDescription}</p>

                      {selectedLevel.example && (
                        <div className="detail-example">
                          <h4>Пример из жизни:</h4>
                          <p>{selectedLevel.example}</p>
                        </div>
                      )}

                      <motion.button
                        className="detail-cta gradient-button"
                        onClick={handleStartAdaptiveTest}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Узнать свою ступень
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <div className="detail-header">
                        <h3 className="gradient-text">{modelDescription.title}</h3>
                        <p className="detail-subtitle">{modelDescription.subtitle}</p>
                      </div>

                      <p className="detail-description">{modelDescription.description}</p>

                      <div className="detail-features">
                        <h4>Ключевые особенности модели:</h4>
                        <ul>
                          {modelDescription.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      <motion.button
                        className="detail-cta gradient-button"
                        onClick={handleStartAdaptiveTest}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Пройти диагностику
                      </motion.button>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Секция преимуществ теста */}
      <section className="benefits-section">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeInUp}
          >
            <h2 className="gradient-text">Что вы получите после прохождения теста</h2>
          </motion.div>

          <motion.div
            className="benefits-grid-row"
            variants={staggerContainer}
          >
            <motion.div className="benefit-card gradient-card" variants={fadeInUp}>
              <div className="benefit-icon">
                🔬
              </div>
              <h3>Точный анализ</h3>
              <p>Определение вашего текущего уровня личной зрелости и уровня отношений на основе научной модели</p>
            </motion.div>

            <motion.div className="benefit-card gradient-card" variants={fadeInUp}>
              <div className="benefit-icon">
                🗺️
              </div>
              <h3>Карта развития</h3>
              <p>Ясное понимание следующих шагов для перехода на более высокие ступени отношений</p>
            </motion.div>

            <motion.div className="benefit-card gradient-card" variants={fadeInUp}>
              <div className="benefit-icon">
                💡
              </div>
              <h3>Практические советы</h3>
              <p>Конкретные рекомендации и упражнения для работы с текущими вызовами в отношениях</p>
            </motion.div>

            <motion.div className="benefit-card gradient-card" variants={fadeInUp}>
              <div className="benefit-icon">
                📊
              </div>
              <h3>Визуализация прогресса</h3>
              <p>Наглядные графики и диаграммы, показывающие ваши сильные стороны и зоны роста</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="final-cta-section">
        <div className="hero-overlay"></div>
        <motion.div
          className="final-cta-content"
          variants={fadeInUp}
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 3,
            padding: '80px 20px'
          }}
        >
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: '700',
            marginBottom: '2rem',
            color: 'white',
            textShadow: '1px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Готовы узнать правду<br/>о своих отношениях?
          </h2>

          <button
            className="hero-cta-button gradient-button"
            onClick={handleStartAdaptiveTest}
          >
            <span>Готова узнать!</span>
            <ArrowRight className="hero-cta-icon" />
          </button>
        </motion.div>
      </section>

    </motion.div>
  );
};

export default Home;
