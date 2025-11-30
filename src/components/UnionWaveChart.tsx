import { motion } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import type { TestResult } from '../utils/calculateResult';
import Tooltip from './ui/Tooltip';
import { levels } from '../utils/levels';

interface UnionWaveChartProps {
  result: TestResult;
}

interface DataPoint {
  level: number;
  personalScore: number;
  relationshipScore: number;
  levelName: string;
  personalPercentage: number;
  relationshipPercentage: number;
}

export default function UnionWaveChart({ result }: UnionWaveChartProps) {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Отслеживаем размер контейнера для адаптивности
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = Math.max(300, Math.min(containerRef.current.getBoundingClientRect().width - 16, 1200));
        setContainerWidth(newWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  /**
   * Подготавливаем данные для графика с более предсказуемым и плавным распределением значений
   * Используем математически осмысленную формулу для плавного убывания от центрального уровня
   */
  const chartData = useMemo(() => {
    console.log('🌊 UnionWaveChart: Создаем данные для волнового графика с улучшенным алгоритмом');
    
    const data: DataPoint[] = [];
    
    // Определяем доминирующие уровни зрелости
    const personalMaturityLevel = result.personalLevel;
    const relationshipMaturityLevel = result.relationshipLevel;
    
    // Получаем нормализованное значение согласованности (0-1)
    const coherenceNormalized = Math.min(1, (result.profile?.coherence || 80) / 100);
    
    console.log('🌊 UnionWaveChart: Доминирующие уровни - личный:', personalMaturityLevel, 'отношенческий:', relationshipMaturityLevel);
    
    for (let level = 1; level <= 12; level++) {
      const levelInfo = levels.find(l => l.id === level);
      
      /**
       * Новый алгоритм расчета значений для волнового графика:
       * 1. Используем функцию Гаусса для плавного убывания от центрального уровня
       * 2. Влияние согласованности на ширину распределения
       * 3. Без использования псевдо-случайных значений
       */
      
      // Личная зрелость - плавное распределение с пиком на центральном уровне
      const personalDistance = Math.abs(level - personalMaturityLevel);
      // Сигма уменьшается при низкой согласованности (более острый пик)
      const personalSigma = 1.2 + coherenceNormalized * 0.8; 
      // Гауссова функция для плавного убывания
      const personalGaussian = Math.exp(-(personalDistance * personalDistance) / (2 * personalSigma * personalSigma));
      // Масштабируем до 0-100%
      let personalScore = Math.min(100, Math.round(personalGaussian * 100));
      
      // Для отношенческой зрелости - аналогичный алгоритм
      const relationshipDistance = Math.abs(level - relationshipMaturityLevel);
      const relationshipSigma = 1.2 + coherenceNormalized * 0.8;
      const relationshipGaussian = Math.exp(-(relationshipDistance * relationshipDistance) / (2 * relationshipSigma * relationshipSigma));
      let relationshipScore = Math.min(100, Math.round(relationshipGaussian * 100));
      
      // Для низкой уверенности снижаем все значения (как в прогресс-барах)
      if ((result.profile?.coherence || 0.8) < 0.7) {
        personalScore = Math.round(personalScore * 0.7);
        relationshipScore = Math.round(relationshipScore * 0.7);
      }
      
      data.push({
        level,
        personalScore,
        relationshipScore,
        levelName: levelInfo?.name || `Уровень ${level}`,
        personalPercentage: personalScore,
        relationshipPercentage: relationshipScore
      });
    }
    
    console.log('🌊 UnionWaveChart: Созданные данные для волнового графика:', data);
    return data;
  }, [result]);

  // Адаптивные размеры графика
  const getResponsiveDimensions = () => {
    const isMobile = containerWidth < 480;
    const isTablet = containerWidth < 768;
    
    return {
      height: isMobile ? 200 : isTablet ? 250 : 300,
      padding: {
        top: isMobile ? 30 : 40,
        right: isMobile ? 20 : isTablet ? 30 : 60,
        bottom: isMobile ? 40 : 60,
        left: isMobile ? 20 : isTablet ? 30 : 60
      }
    };
  };

  // Адаптивные размеры элементов
  const getElementSizes = () => {
    const isMobile = containerWidth < 480;
    const isTablet = containerWidth < 768;
    
    return {
      pointRadius: isMobile ? 3 : isTablet ? 4 : 5,
      strokeWidth: isMobile ? 2 : 2.5,
      fontSize: {
        axisLabels: isMobile ? '10px' : '12px',
        levelText: isMobile ? '11px' : '14px',
        tooltipText: isMobile ? '10px' : '12px'
      }
    };
  };

  // Получаем размеры для расчетов
  const { height, padding } = getResponsiveDimensions();
  const chartWidth = containerWidth - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const elementSizes = getElementSizes();

  // Функция для обработки наведения на уровень
  const handleLevelHover = (levelNumber: number, index: number) => {
    setHoveredLevel(levelNumber);
    
    // Рассчитываем позицию тултипа относительно контейнера
    const levelX = padding.left + (index / 11) * chartWidth;
    const levelY = padding.top + chartHeight + 20;
    
    setTooltipPosition({
      x: levelX,
      y: levelY + 40 // Смещаем вниз от метки уровня
    });
  };

  const handleLevelLeave = () => {
    setHoveredLevel(null);
  };

  // Создаем точки для личностного графика
  const personalPoints = chartData.map((point, index) => ({
    x: padding.left + (index / 11) * chartWidth,
    y: padding.top + chartHeight - (point.personalPercentage / 100) * chartHeight
  }));

  // Создаем точки для отношенческого графика
  const relationshipPoints = chartData.map((point, index) => ({
    x: padding.left + (index / 11) * chartWidth,
    y: padding.top + chartHeight - (point.relationshipPercentage / 100) * chartHeight
  }));

  // Создаем области под кривыми для заливки
  const createAreaPath = (points: { x: number; y: number }[]) => {
    const curvePath = createSmoothPath(points);
    const areaPath = curvePath + 
      ` L ${points[points.length - 1].x} ${padding.top + chartHeight}` +
      ` L ${points[0].x} ${padding.top + chartHeight} Z`;
    return areaPath;
  };

  // Функция для создания пути SVG (плавная кривая)
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (i === 1) {
        // Первая точка
        const cp1x = prev.x + (curr.x - prev.x) * 0.25;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.25;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else if (i === points.length - 1) {
        // Последняя точка
        const cp1x = prev.x + (curr.x - prev.x) * 0.25;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.25;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Средние точки - более плавная интерполяция
        const prevPrev = points[i - 2] || prev;
        const cp1x = prev.x + (curr.x - prevPrev.x) * 0.15;
        const cp1y = prev.y + (curr.y - prevPrev.y) * 0.15;
        const cp2x = curr.x - (next.x - prev.x) * 0.15;
        const cp2y = curr.y - (next.y - prev.y) * 0.15;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };

  return (
    <div className="beautiful-section">
      <div className="section-header mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              🌊 Волновой профиль развития
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Те же данные что и в прогресс-барах лестницы, но в виде двух наложенных волн
            </p>
          </div>
          <Tooltip
            content="Интерактивный график, показывающий распределение вашего развития по всем 12 уровням союза. Синяя линия - личная зрелость, розовая - отношенческая. Наведите курсор на график для детальной информации."
            title="Волновой профиль"
            trigger="click"
            position="left"
            maxWidth="max-w-sm"
          />
        </div>
      </div>
      
      <div className="wave-chart-container relative overflow-hidden bg-white rounded-xl p-4" ref={containerRef}>
        {/* SVG График */}
        <svg 
          width={containerWidth} 
          height={height} 
          className="mx-auto"
          viewBox={`0 0 ${containerWidth} ${height}`}
        >
          {/* Фоновая сетка */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
            </pattern>
            
            {/* Градиенты для заливки */}
            <linearGradient id="personalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(165, 180, 252, 0.4)" />
              <stop offset="100%" stopColor="rgba(165, 180, 252, 0.05)" />
            </linearGradient>
            
            <linearGradient id="relationshipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(249, 168, 212, 0.4)" />
              <stop offset="100%" stopColor="rgba(249, 168, 212, 0.05)" />
            </linearGradient>
          </defs>
          
          {/* Сетка */}
          <rect 
            x={padding.left} 
            y={padding.top} 
            width={chartWidth} 
            height={chartHeight} 
            fill="url(#grid)" 
          />
          
          {/* Горизонтальные линии уровней */}
          {[0, 25, 50, 75, 100].map(percent => (
            <line
              key={percent}
              x1={padding.left}
              y1={padding.top + chartHeight - (percent / 100) * chartHeight}
              x2={padding.left + chartWidth}
              y2={padding.top + chartHeight - (percent / 100) * chartHeight}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray={percent === 0 || percent === 100 ? "none" : "3,3"}
            />
          ))}
          
          {/* Вертикальные линии уровней */}
          {chartData.map((point, index) => (
            <g key={point.level}>
              <line
                x1={padding.left + (index / 11) * chartWidth}
                y1={padding.top}
                x2={padding.left + (index / 11) * chartWidth}
                y2={padding.top + chartHeight}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              
              {/* Отметки уровней на оси X */}
              <text
                x={padding.left + (index / 11) * chartWidth}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                className="text-sm font-medium fill-gray-600 cursor-pointer hover:fill-gray-900 transition-colors"
                fontSize={elementSizes.fontSize.axisLabels}
                onMouseEnter={() => handleLevelHover(point.level, index)}
                onMouseLeave={handleLevelLeave}
              >
                {point.level}
              </text>
            </g>
          ))}
          
          {/* Заливка под кривыми */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            d={createAreaPath(personalPoints)}
            fill="url(#personalGradient)"
          />
          
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            d={createAreaPath(relationshipPoints)}
            fill="url(#relationshipGradient)"
          />
          
          {/* Кривые линии */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
            d={createSmoothPath(personalPoints)}
            fill="none"
            stroke="rgba(129, 140, 248, 0.8)"
            strokeWidth={elementSizes.strokeWidth}
            strokeLinecap="round"
          />
          
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            d={createSmoothPath(relationshipPoints)}
            fill="none"
            stroke="rgba(244, 114, 182, 0.8)"
            strokeWidth={elementSizes.strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Точки на графике */}
          {personalPoints.map((point, index) => (
            <motion.circle
              key={`personal-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
              cx={point.x}
              cy={point.y}
              r={elementSizes.pointRadius}
              fill="rgba(129, 140, 248, 0.9)"
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
          ))}
          
          {relationshipPoints.map((point, index) => (
            <motion.circle
              key={`relationship-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0 + index * 0.05, duration: 0.3 }}
              cx={point.x}
              cy={point.y}
              r={elementSizes.pointRadius}
              fill="rgba(244, 114, 182, 0.9)"
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
          ))}
          
          {/* Ось Y - подписи */}
          {[0, 25, 50, 75, 100].map(percent => (
            <text
              key={percent}
              x={padding.left - 10}
              y={padding.top + chartHeight - (percent / 100) * chartHeight + 4}
              textAnchor="end"
              className="text-xs fill-gray-500"
              fontSize={elementSizes.fontSize.axisLabels}
            >
              {percent}%
            </text>
          ))}
          
          {/* Заголовки осей */}
          <text
            x={padding.left + chartWidth / 2}
            y={height - 10}
            textAnchor="middle"
            className="text-sm font-medium fill-gray-700"
            fontSize={elementSizes.fontSize.levelText}
          >
            Уровни развития
          </text>
          
          <text
            x={15}
            y={padding.top + chartHeight / 2}
            textAnchor="middle"
            className="text-sm font-medium fill-gray-700"
            fontSize={elementSizes.fontSize.tooltipText}
            transform={`rotate(-90, 15, ${padding.top + chartHeight / 2})`}
          >
            Баллы (%)
          </text>
        </svg>

        {/* HTML Тултип поверх всех элементов */}
        {hoveredLevel !== null && (
          <div 
            className="absolute z-50 pointer-events-none transform -translate-x-1/2"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium max-w-xs">
              <div className="text-center">
                <div className="font-semibold text-white mb-1">
                  {chartData.find(d => d.level === hoveredLevel)?.levelName}
                </div>
                <div className="text-gray-300 text-xs">
                  Личность: {chartData.find(d => d.level === hoveredLevel)?.personalScore.toFixed(1)}% • 
                  Отношения: {chartData.find(d => d.level === hoveredLevel)?.relationshipScore.toFixed(1)}%
                </div>
              </div>
              {/* Стрелка тултипа */}
              <div className="absolute top-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        )}
        
        {/* Легенда */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mt-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(129, 140, 248, 0.9)' }}></div>
            <span className="text-sm font-medium text-gray-700">Личностное развитие</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(244, 114, 182, 0.9)' }}></div>
            <span className="text-sm font-medium text-gray-700">Развитие отношений</span>
          </div>
        </div>
        
        {/* Дополнительная информация */}
        <div className="mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
            Волновой график отображает <strong>те же процентные значения</strong> что и прогресс-бары на лестнице выше, но в виде двух наложенных волн.
            <span className="hidden sm:inline"> Наведите курсор на номер уровня, чтобы увидеть точные проценты.</span>
            <span className="sm:hidden"> Нажмите на номер уровня для просмотра процентов.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
