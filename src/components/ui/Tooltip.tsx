import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  title?: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  maxWidth?: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  title,
  children,
  position = 'top',
  trigger = 'hover',
  maxWidth = 'max-w-xs',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, position: position as string });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Поскольку теперь tooltip находится в fixed overlay, не нужно добавлять scroll offset
    
    // Проверяем, не находится ли элемент в контейнере с overflow
    let parentElement = triggerRef.current.parentElement;
    while (parentElement && parentElement !== document.body) {
      const parentStyle = window.getComputedStyle(parentElement);
      if (parentStyle.overflow === 'hidden' || parentStyle.overflowY === 'hidden' || parentStyle.overflowX === 'hidden') {
        // Элемент в скрытом контейнере, может потребовать корректировки
        break;
      }
      parentElement = parentElement.parentElement;
    }

    let top = 0;
    let left = 0;
    let actualPosition = position;

    // Базовое позиционирование относительно viewport
    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 12;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + 12;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - 12;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + 12;
        break;
    }

    // Умная корректировка позиции с учетом границ экрана
    const margin = 16;
    
    // Проверяем горизонтальные границы
    if (left < margin) {
      left = margin;
    } else if (left + tooltipRect.width > viewport.width - margin) {
      left = viewport.width - tooltipRect.width - margin;
    }

    // Проверяем вертикальные границы
    if (top < margin) {
      if (position === 'top') {
        // Переворачиваем tooltip вниз
        top = triggerRect.bottom + 12;
        actualPosition = 'bottom';
      } else {
        top = margin;
      }
    } else if (top + tooltipRect.height > viewport.height - margin) {
      if (position === 'bottom') {
        // Переворачиваем tooltip вверх
        top = triggerRect.top - tooltipRect.height - 12;
        actualPosition = 'top';
      } else {
        top = viewport.height - tooltipRect.height - margin;
      }
    }

    setTooltipPosition({ top, left, position: actualPosition });
  }, [position]);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => calculatePosition();
    const handleResize = () => calculatePosition();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trigger === 'click' && 
          triggerRef.current && 
          !triggerRef.current.contains(event.target as Node) &&
          tooltipRef.current &&
          !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [trigger]);

  const handleTrigger = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsVisible(false);
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleTrigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`cursor-help inline-flex items-center ${className}`}
      >
        {children || (
          <div className="text-gray-400 hover:text-gray-600 transition-colors">
            <Info className="w-5 h-5" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isVisible && (
          <div 
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{ zIndex: 99999 }}
          >
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.95, y: tooltipPosition.position === 'top' ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: tooltipPosition.position === 'top' ? 10 : -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`absolute ${maxWidth} pointer-events-none`}
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                zIndex: 99999,
              }}
            >
              <div className="bg-gray-900 text-white text-sm rounded-lg shadow-2xl border border-gray-700 overflow-hidden pointer-events-auto">
                {title && (
                  <div className="px-3 py-2 bg-gray-800 border-b border-gray-700">
                    <div className="font-medium text-gray-100">{title}</div>
                  </div>
                )}
                <div className="px-3 py-2 leading-relaxed">
                  {content}
                </div>
                
                {/* Стрелочка */}
                <div 
                  className={`absolute w-2 h-2 bg-gray-900 border transform rotate-45 ${
                    tooltipPosition.position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b border-gray-700' :
                    tooltipPosition.position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2 border-l border-t border-gray-700' :
                    tooltipPosition.position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2 border-t border-r border-gray-700' :
                    'left-[-4px] top-1/2 -translate-y-1/2 border-b border-l border-gray-700'
                  }`}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Tooltip;
