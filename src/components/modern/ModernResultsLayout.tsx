import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Eye,
  EyeOff
} from 'lucide-react';
import '../../styles/design-system.css';

interface ModernSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'purple';
  collapsible?: boolean;
  defaultExpanded?: boolean;
  priority?: 'high' | 'medium' | 'low';
  children: ReactNode;
  className?: string;
}

// Современная секция с возможностью сворачивания
export const ModernSection: React.FC<ModernSectionProps> = ({
  title,
  subtitle,
  icon,
  variant = 'primary',
  collapsible = true,
  defaultExpanded = true,
  priority = 'medium',
  children,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const priorityClasses = {
    high: 'ring-2 ring-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50',
    medium: '',
    low: ''
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`modern-card modern-card--${variant} ${priorityClasses[priority]} ${className}`}
    >
      {/* Заголовок секции */}
      <div 
        className={`flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-baseline gap-3">
          {icon && (
            <div className={`p-2 rounded-lg ${
              variant === 'primary' ? 'bg-blue-100 text-blue-600' :
              variant === 'success' ? 'bg-green-100 text-green-600' :
              variant === 'warning' ? 'bg-orange-100 text-orange-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              {icon}
            </div>
          )}
          <div>
            <h3 className="heading-3 mb-1">{title}</h3>
            {subtitle && (
              <p className="text-sm text-muted">{subtitle}</p>
            )}
          </div>
        </div>
        
        {collapsible && (
          <button 
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Контент секции */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : {}}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: 'blue' | 'green' | 'purple' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

// Компактная карточка для метрик
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  color = 'blue',
  size = 'md',
  icon
}) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 text-blue-700 border-blue-200',
    green: 'from-green-50 to-green-100 text-green-700 border-green-200',
    purple: 'from-purple-50 to-purple-100 text-purple-700 border-purple-200',
    orange: 'from-orange-50 to-orange-100 text-orange-700 border-orange-200'
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const valueSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`
      bg-gradient-to-br ${colorClasses[color]} 
      border rounded-xl ${sizeClasses[size]}
      transition-all duration-300 hover:shadow-md hover:-translate-y-1
    `}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-baseline gap-2">
          {icon && <span className="opacity-70">{icon}</span>}
          <span className="text-sm font-medium opacity-80">{title}</span>
        </div>
        {trend && (
          <div className="flex items-center">
            {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
            {trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
          </div>
        )}
      </div>
      <div className={`font-bold ${valueSizes[size]} mb-1`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-xs opacity-70">{subtitle}</div>
      )}
    </div>
  );
};

interface InsightCardProps {
  title: string;
  content: string;
  type?: 'insight' | 'recommendation' | 'warning' | 'tip';
  compact?: boolean;
}

// Карточка для инсайтов и рекомендаций
export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  content,
  type = 'insight',
  compact = false
}) => {
  const typeStyles = {
    insight: 'border-l-blue-400 bg-blue-50',
    recommendation: 'border-l-green-400 bg-green-50',
    warning: 'border-l-orange-400 bg-orange-50',
    tip: 'border-l-purple-400 bg-purple-50'
  };

  const iconColors = {
    insight: 'text-blue-600',
    recommendation: 'text-green-600',
    warning: 'text-orange-600',
    tip: 'text-purple-600'
  };

  return (
    <div className={`
      border-l-4 ${typeStyles[type]} 
      rounded-r-lg p-4 transition-all duration-300 hover:shadow-md
      ${compact ? 'p-3' : 'p-4'}
    `}>
      <div className="flex items-baseline gap-3">
        <Info className={`w-4 h-4 ${iconColors[type]} flex-shrink-0`} />
        <div className="min-w-0">
          <h4 className={`font-semibold ${iconColors[type]} ${compact ? 'text-sm' : 'text-base'} mb-1`}>
            {title}
          </h4>
          <p className={`${iconColors[type]} opacity-80 ${compact ? 'text-xs' : 'text-sm'} leading-relaxed`}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

interface ProgressIndicatorProps {
  label: string;
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showValue?: boolean;
  size?: 'sm' | 'md';
}

// Современный индикатор прогресса
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  label,
  value,
  max = 100,
  color = 'blue',
  showValue = true,
  size = 'md'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  const bgColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100'
  };

  return (
    <div className={size === 'sm' ? 'space-y-1' : 'space-y-2'}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
          {label}
        </span>
        {showValue && (
          <span className={`${size === 'sm' ? 'text-sm' : 'text-base'} font-semibold`}>
            {value}{max === 100 ? '%' : `/${max}`}
          </span>
        )}
      </div>
      <div className={`${bgColorClasses[color]} rounded-full ${size === 'sm' ? 'h-1.5' : 'h-2'} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`${colorClasses[color]} h-full rounded-full`}
        />
      </div>
    </div>
  );
};

interface TabsProps {
  tabs: Array<{
    id: string;
    label: string;
    content: ReactNode;
    badge?: string | number;
  }>;
  defaultTab?: string;
  compact?: boolean;
}

// Современные табы для группировки контента
export const ModernTabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  compact = false
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="space-y-4">
      {/* Заголовки табов */}
      <div className={`flex overflow-x-auto ${compact ? 'gap-1' : 'gap-2'} pb-2`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${compact ? 'text-sm px-3 py-1.5' : 'text-base'}
              ${activeTab === tab.id 
                ? 'bg-blue-100 text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
              }
              whitespace-nowrap
            `}
          >
            {tab.label}
            {tab.badge && (
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${activeTab === tab.id ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'}
              `}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Контент активного таба */}
      <AnimatePresence mode="wait">
        {tabs.map((tab) => 
          activeTab === tab.id && (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab.content}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

interface QuickStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: {
      value: number;
      type: 'up' | 'down' | 'stable';
    };
    color?: 'blue' | 'green' | 'purple' | 'orange';
  }>;
}

// Компактная панель быстрой статистики
export const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <MetricCard
          key={index}
          title={stat.label}
          value={stat.value}
          trend={stat.change?.type}
          color={stat.color}
          size="sm"
        />
      ))}
    </div>
  );
};

interface ToggleViewProps {
  children: ReactNode;
  label?: string;
  defaultVisible?: boolean;
  variant?: 'simple' | 'detailed';
}

// Переключатель видимости контента
export const ToggleView: React.FC<ToggleViewProps> = ({
  children,
  label = 'Показать детали',
  defaultVisible = false,
  variant = 'simple'
}) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-baseline gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {isVisible ? 'Скрыть детали' : label}
      </button>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {variant === 'detailed' ? (
              <div className="p-4 bg-gray-50 rounded-lg border">
                {children}
              </div>
            ) : (
              children
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default {
  ModernSection,
  MetricCard,
  InsightCard,
  ProgressIndicator,
  ModernTabs,
  QuickStats,
  ToggleView
}; 