import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { AutoClicker } from './dev';

// Компонент логотипа - столбиковый график роста
const UnionLadderLogo: React.FC = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Столбики роста в нежных тонах */}

      {/* Красный столбик (самый низкий) */}
      <rect
        x="4"
        y="20"
        width="5"
        height="8"
        fill="#ff9999"
        rx="2"
        opacity="0.9"
      />

      {/* Желтый столбик */}
      <rect
        x="10"
        y="16"
        width="5"
        height="12"
        fill="#ffeb9c"
        rx="2"
        opacity="0.9"
      />

      {/* Зеленый столбик */}
      <rect
        x="16"
        y="12"
        width="5"
        height="16"
        fill="#a8e6a3"
        rx="2"
        opacity="0.9"
      />

      {/* Фиолетовый столбик (самый высокий) */}
      <rect
        x="22"
        y="8"
        width="5"
        height="20"
        fill="#c8a8e9"
        rx="2"
        opacity="0.9"
      />

      {/* Тонкие блики для объема */}
      <rect x="5" y="21" width="1" height="6" fill="rgba(255,255,255,0.4)" rx="0.5" />
      <rect x="11" y="17" width="1" height="10" fill="rgba(255,255,255,0.4)" rx="0.5" />
      <rect x="17" y="13" width="1" height="14" fill="rgba(255,255,255,0.4)" rx="0.5" />
      <rect x="23" y="9" width="1" height="18" fill="rgba(255,255,255,0.4)" rx="0.5" />

      {/* Базовая линия */}
      <line x1="2" y1="29" x2="30" y2="29" stroke="#e0e0e0" strokeWidth="1" opacity="0.6" />
    </svg>
  );
};

const Header: React.FC = () => {
  const location = useLocation();
  const [showAutoClicker, setShowAutoClicker] = useState(false);

  // Проверяем, запущены ли мы в Telegram
  const isTelegram = typeof window !== 'undefined' &&
    window.Telegram?.WebApp?.initData !== '';

  if (isTelegram) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Показываем кнопку автокликера всегда (для деплоя с функциями тестирования)
  const isDev = true; // Включено для Netlify деплоя

  return (
    <header style={{
      background: 'var(--gradient-glass)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '1rem 0'
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UnionLadderLogo />
            <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
              Лестница союза
            </span>
          </Link>

          <nav>
            <ul style={{ display: 'flex', alignItems: 'center', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
              <li>
                <Link
                  to="/"
                  style={{
                    textDecoration: 'none',
                    color: isActive('/') ? 'var(--accent-blue)' : 'var(--color-text)',
                    fontWeight: isActive('/') ? '600' : '500',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  to="/smart-adaptive-test"
                  style={{
                    textDecoration: 'none',
                    color: isActive('/smart-adaptive-test') ? 'var(--accent-blue)' : 'var(--color-text)',
                    fontWeight: isActive('/smart-adaptive-test') ? '600' : '500',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Тест
                </Link>
              </li>
              {isDev && (
                <>
                  <li style={{ position: 'relative', zIndex: 10 }}>
                    <button
                      onClick={() => setShowAutoClicker(!showAutoClicker)}
                      style={{
                        background: showAutoClicker ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.1)',
                        color: showAutoClicker ? 'white' : 'var(--color-text)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease',
                        transform: 'translateZ(0)' // Создаем собственный слой
                      }}
                      title="Открыть автокликер для тестирования"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <Wrench className="w-4 h-4" />
                      <span style={{ fontSize: '0.75rem' }}>DEV</span>
                    </button>
                  </li>
                </>
              )}
              <li style={{ position: 'relative', zIndex: 5 }}>
                <Link
                  to="/smart-adaptive-test"
                  className="gradient-button"
                  style={{
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                    transform: 'translateZ(0)' // Создаем собственный слой
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateZ(0) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateZ(0) scale(1)';
                  }}
                >
                  Пройти тест
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Автокликер в выпадающей панели */}
      <AnimatePresence>
        {showAutoClicker && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: '20px',
              zIndex: 9999,
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}
          >
            <div style={{
              padding: '8px 12px',
              background: 'var(--gradient-glass)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text)' }}>
                Инструменты разработчика
              </span>
              <button
                onClick={() => setShowAutoClicker(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  fontSize: '1.25rem',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '12px' }}>
              <AutoClicker />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
