import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Settings, Target } from 'lucide-react';

interface AutoClickerProps {
  isActive?: boolean;
  onToggle?: (active: boolean) => void;
}

interface AutoClickerSettings {
  targetLevel: number;
  variance: number;
  speed: number;
  preferExtremes: boolean;
}

const defaultSettings: AutoClickerSettings = {
  targetLevel: 6,
  variance: 2,
  speed: 500,
  preferExtremes: false
};

// Загрузка настроек из localStorage
const loadSettings = (): AutoClickerSettings => {
  try {
    const saved = localStorage.getItem('autoClickerSettings');
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.warn('Не удалось загрузить настройки автокликера:', error);
  }
  return defaultSettings;
};

// Сохранение настроек в localStorage
const saveSettings = (settings: AutoClickerSettings) => {
  try {
    localStorage.setItem('autoClickerSettings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Не удалось сохранить настройки автокликера:', error);
  }
};

// Умная стратегия выбора ответов на основе уровня
const smartAnswerStrategy = (options: HTMLElement[], settings: AutoClickerSettings): HTMLElement => {
  const optionsWithLevels = options.map(option => {
    const levelStr = option.getAttribute('data-level');
    const zone = option.getAttribute('data-zone') || 'emotional';
    const level = levelStr ? parseInt(levelStr) : 6; // Значение по умолчанию
    const text = option.textContent?.slice(0, 50) || 'Неизвестный вариант';
    
    console.log(`📋 Вариант: "${text}..." -> Уровень: ${level}, Зона: ${zone}`);
    
    return { element: option, level, zone, text };
  });

  console.log(`🎯 Автокликер: анализирую ${optionsWithLevels.length} вариантов`);
  console.log(`🎯 Настройки: цель=${settings.targetLevel}, разброс=±${settings.variance}, крайние=${settings.preferExtremes}`);

  // Вычисляем диапазон предпочтительных уровней
  const minTarget = Math.max(1, settings.targetLevel - settings.variance);
  const maxTarget = Math.min(12, settings.targetLevel + settings.variance);

  console.log(`🎯 Целевой диапазон: ${minTarget}-${maxTarget}`);

  // Фильтруем варианты по диапазону
  const preferredOptions = optionsWithLevels.filter(o => 
    o.level >= minTarget && o.level <= maxTarget
  );

  console.log(`🎯 Подходящих вариантов в диапазоне: ${preferredOptions.length}/${optionsWithLevels.length}`);
  if (preferredOptions.length > 0) {
    console.log(`🎯 Подходящие варианты:`, preferredOptions.map(o => `${o.level}("${o.text.slice(0, 30)}...")`));
  }

  let selectedOption;

  if (preferredOptions.length > 0) {
    if (settings.preferExtremes) {
      // Предпочитаем крайние значения (1-2 или 11-12)
      const extremeOptions = preferredOptions.filter(o => o.level <= 2 || o.level >= 11);
      if (extremeOptions.length > 0) {
        selectedOption = extremeOptions[Math.floor(Math.random() * extremeOptions.length)];
        console.log(`🎯 ✅ Выбран ЭКСТРЕМАЛЬНЫЙ вариант: уровень ${selectedOption.level} - "${selectedOption.text}"`);
      } else {
        selectedOption = preferredOptions[Math.floor(Math.random() * preferredOptions.length)];
        console.log(`🎯 ✅ Выбран из предпочтительных (крайних нет): уровень ${selectedOption.level} - "${selectedOption.text}"`);
      }
    } else {
      // Выбираем ближайший к целевому уровню
      preferredOptions.sort((a, b) => 
        Math.abs(a.level - settings.targetLevel) - Math.abs(b.level - settings.targetLevel)
      );
      selectedOption = preferredOptions[0];
      console.log(`🎯 ✅ Выбран БЛИЖАЙШИЙ к цели ${settings.targetLevel}: уровень ${selectedOption.level} - "${selectedOption.text}"`);
    }
  } else {
    // Если нет вариантов в диапазоне, выбираем ближайший доступный
    optionsWithLevels.sort((a, b) => 
      Math.abs(a.level - settings.targetLevel) - Math.abs(b.level - settings.targetLevel)
    );
    selectedOption = optionsWithLevels[0];
    console.log(`🎯 ⚠️ НЕТ ВАРИАНТОВ В ДИАПАЗОНЕ! Выбран ближайший: уровень ${selectedOption.level} (цель: ${settings.targetLevel}) - "${selectedOption.text}"`);
  }

  return selectedOption.element;
};

const AutoClicker: React.FC<AutoClickerProps> = ({ 
  isActive: externalActive, 
  onToggle 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [forceVisible, setForceVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AutoClickerSettings>(loadSettings);
  const [lastSelectedLevel, setLastSelectedLevel] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Используем внешнее состояние, если передано
  const active = externalActive !== undefined ? externalActive : isActive;
  const toggle = onToggle || setIsActive;

  // Сохраняем настройки при изменении
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Проверяем, показана ли страница результатов
  const isOnResultsPage = (): boolean => {
    const pageText = document.body.textContent || '';
    const hasResultsText = pageText.includes('Ваши результаты') || 
                          pageText.includes('результаты адаптивного теста') ||
                          pageText.includes('Личная зрелость') ||
                          pageText.includes('Зрелость отношений');

    const allButtons = Array.from(document.querySelectorAll('button'));
    const restartButton = allButtons.find(btn => 
      btn.textContent && btn.textContent.includes('Пройти снова')
    );
    
    const hasQuestionElements = document.querySelector('[data-autoclicker-target="answer"]');
    const hasNextButton = document.querySelector('[data-autoclicker-target="next"]');
    
    const isResults = hasResultsText && !!restartButton && !hasQuestionElements && !hasNextButton;
    
    if (isResults) {
      console.log('🤖 AutoClicker: ОБНАРУЖЕНА СТРАНИЦА РЕЗУЛЬТАТОВ - автостоп');
    }
    
    return isResults;
  };

  useEffect(() => {
    const isDev = true; // Включено для Netlify деплоя
    setIsVisible(isDev || forceVisible);
  }, [forceVisible]);

  // Глобальная функция для показа AutoClicker
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).showAutoClicker = () => {
      setForceVisible(true);
      console.log('🤖 AutoClicker: принудительно показан');
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).hideAutoClicker = () => {
      setForceVisible(false);
      console.log('🤖 AutoClicker: скрыт');
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setForceVisible(prev => !prev);
        console.log('🤖 AutoClicker: переключен через Ctrl+Shift+A');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (active) {
      startAutoClicking();
    } else {
      stopAutoClicking();
    }
    return () => stopAutoClicking();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, settings]);

  // Наблюдаем за изменениями в DOM для автоматической остановки
  useEffect(() => {
    if (!active) return;

    const observer = new MutationObserver(() => {
      setTimeout(() => {
        if (isOnResultsPage()) {
          console.log('🤖 AutoClicker: Обнаружены результаты - остановка');
          toggle(false);
        }
      }, 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [active, toggle]);

  const getSmartAnswerButton = (): HTMLElement | null => {
    console.log('🔍 Ищем кнопки ответов...');
    
    // Сначала ищем по data-autoclicker-target
    let answerButtons: HTMLElement[] = Array.from(document.querySelectorAll('button[data-autoclicker-target="answer"]'));
    console.log(`🔍 Найдено кнопок с data-autoclicker-target="answer": ${answerButtons.length}`);
    
    // Если не нашли, пробуем альтернативные селекторы
    if (answerButtons.length === 0) {
      console.log('🔍 Пробуем альтернативные селекторы...');
      
      // Ищем кнопки с data-answer атрибутом
      answerButtons = Array.from(document.querySelectorAll('button[data-answer]'));
      console.log(`🔍 Найдено кнопок с data-answer: ${answerButtons.length}`);
      
      // Если и это не сработало, ищем по визуальным признакам
      if (answerButtons.length === 0) {
        const allButtons = document.querySelectorAll('button');
        answerButtons = Array.from(allButtons).filter(btn => {
          const hasCircle = btn.querySelector('div[style*="border-radius: 50%"]') || btn.querySelector('.rounded-full');
          const hasAnswerText = btn.textContent && btn.textContent.trim().length > 20;
          const isNotNavigation = !btn.textContent?.toLowerCase().includes('далее') && 
                                  !btn.textContent?.toLowerCase().includes('назад') &&
                                  !btn.textContent?.toLowerCase().includes('автокликер') &&
                                  !btn.disabled;
          
          const isAnswerButton = hasCircle && hasAnswerText && isNotNavigation;
          
          if (isAnswerButton) {
            console.log(`🔍 Найдена кнопка-ответ по внешним признакам: "${btn.textContent?.slice(0, 30)}..."`);
          }
          
          return isAnswerButton;
        }) as HTMLElement[];
        
        console.log(`🔍 Найдено кнопок по визуальным признакам: ${answerButtons.length}`);
      }
    }
    
    if (answerButtons.length > 0) {
      console.log('✅ Кнопки найдены, применяем умную стратегию выбора...');
      return smartAnswerStrategy(answerButtons, settings);
    }
    
    console.log('❌ Кнопки ответов не найдены');
    return null;
  };

  const findAndClickNextButton = () => {
    console.log('🔍 Ищем кнопку "Далее"...');
    
    let nextButton = document.querySelector('[data-autoclicker-target="next"]:not([disabled])') as HTMLElement;
    console.log(`🔍 Поиск по data-autoclicker-target="next": ${nextButton ? 'найдена' : 'не найдена'}`);
    
    if (!nextButton) {
      console.log('🔍 Ищем кнопку "Далее" по тексту...');
      const allButtons = Array.from(document.querySelectorAll('button:not([disabled])'));
      console.log(`🔍 Всего активных кнопок: ${allButtons.length}`);
      
      nextButton = allButtons.find(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        const isNextButton = text.includes('далее') && !btn.hasAttribute('disabled');
        if (isNextButton) {
          console.log(`🔍 Найдена кнопка "Далее" по тексту: "${btn.textContent}"`);
        }
        return isNextButton;
      }) as HTMLElement;
    }
    
    if (nextButton) {
      console.log('🤖 AutoClicker: нажимаем "Далее"');
      nextButton.click();
      return true;
    } else {
      console.log('🤖 AutoClicker: кнопка "Далее" не найдена или заблокирована');
      return false;
    }
  };

  const simulateClick = () => {
    if (isOnResultsPage()) {
      console.log('🤖 AutoClicker: Тест завершен - остановка');
      toggle(false);
      return;
    }

    console.log('🤖 ===== НАЧАЛО ЦИКЛА АВТОКЛИКЕРА =====');
    console.log('🤖 Текущие настройки:', {
      targetLevel: settings.targetLevel,
      variance: settings.variance,
      preferExtremes: settings.preferExtremes,
      speed: settings.speed
    });

    const button = getSmartAnswerButton();
    if (button) {
      const level = parseInt(button.getAttribute('data-level') || '6');
      const zone = button.getAttribute('data-zone') || 'unknown';
      const text = button.textContent?.slice(0, 50) || 'Неизвестный текст';
      
      setLastSelectedLevel(level);
      
      console.log(`🤖 ✅ ВЫБРАН ОТВЕТ:`);
      console.log(`   Уровень: ${level}`);
      console.log(`   Зона: ${zone}`);
      console.log(`   Текст: "${text}..."`);
      
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      
      button.dispatchEvent(event);
      setClickCount(prev => prev + 1);
      
      console.log(`🤖 Клик выполнен! Общее количество кликов: ${clickCount + 1}`);
      
      // Ищем кнопку "Далее"
      let attempts = 0;
      const maxAttempts = 3;
      const tryClickNext = () => {
        if (isOnResultsPage()) {
          console.log('🤖 AutoClicker: Результаты загружены - остановка');
          toggle(false);
          return;
        }

        attempts++;
        console.log(`🤖 Попытка ${attempts}/${maxAttempts} найти кнопку "Далее"...`);
        
        if (findAndClickNextButton()) {
          console.log('🤖 Кнопка "Далее" найдена и нажата');
          setTimeout(() => {
            if (isOnResultsPage()) {
              console.log('🤖 AutoClicker: Переход к результатам - остановка');
              toggle(false);
            }
          }, 1000);
          return;
        }
        
        if (attempts < maxAttempts) {
          console.log(`🤖 Кнопка "Далее" не найдена, повторная попытка через 300мс...`);
          setTimeout(tryClickNext, 300);
        } else {
          console.log('🤖 Исчерпаны попытки поиска кнопки "Далее"');
          if (isOnResultsPage()) {
            console.log('🤖 AutoClicker: Тест завершен - остановка');
            toggle(false);
          }
        }
      };
      
      setTimeout(tryClickNext, 500);
    } else {
      console.log('🤖 ❌ НЕ УДАЛОСЬ НАЙТИ КНОПКИ ОТВЕТОВ');
      if (isOnResultsPage()) {
        console.log('🤖 AutoClicker: Нет кнопок и есть результаты - остановка');
        toggle(false);
      } else {
        console.log('🤖 AutoClicker: продолжаем поиск кнопок...');
      }
    }
    console.log('🤖 ===== КОНЕЦ ЦИКЛА АВТОКЛИКЕРА =====');
  };

  const startAutoClicking = () => {
    stopAutoClicking();
    
    console.log('🤖 ===== ЗАПУСК АВТОКЛИКЕРА =====');
    console.log('🤖 Настройки:', {
      targetLevel: settings.targetLevel,
      variance: settings.variance,
      preferExtremes: settings.preferExtremes,
      speed: settings.speed,
      range: `${Math.max(1, settings.targetLevel - settings.variance)}-${Math.min(12, settings.targetLevel + settings.variance)}`
    });
    console.log('🤖 =================================');
    
    intervalRef.current = setInterval(simulateClick, settings.speed);
  };

  const stopAutoClicking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    console.log('🤖 AutoClicker: остановлен');
  };

  const handleToggle = () => {
    toggle(!active);
  };

  const handleReset = () => {
    setClickCount(0);
    setLastSelectedLevel(null);
    toggle(false);
  };

  const updateSetting = <K extends keyof AutoClickerSettings>(
    key: K, 
    value: AutoClickerSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getTargetLevelColor = (level: number): string => {
    if (level <= 3) return '#ef4444'; // Красный для деструктивной зоны
    if (level <= 6) return '#f59e0b'; // Желтый для эмоциональной зоны
    if (level <= 9) return '#10b981'; // Зеленый для зрелой зоны
    return '#8b5cf6'; // Фиолетовый для трансцендентной зоны
  };

  const getZoneName = (level: number): string => {
    if (level <= 3) return 'Деструктивная';
    if (level <= 6) return 'Эмоциональная';
    if (level <= 9) return 'Зрелая';
    return 'Трансцендентная';
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg p-3 w-80 shadow-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-yellow-500" />
        <h3 className="font-bold text-sm text-gray-800">Умный AutoClicker</h3>
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">DEV</span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="ml-auto p-1 hover:bg-gray-100 rounded"
          title="Настройки"
        >
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Настройки */}
      {showSettings && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <h4 className="font-semibold text-xs text-gray-700 mb-3 flex items-center gap-1">
            <Target className="w-3 h-3" />
            Настройки тестирования
          </h4>
          
          {/* Целевой уровень */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Целевой уровень: <span className="font-bold" style={{ color: getTargetLevelColor(settings.targetLevel) }}>
                {settings.targetLevel} ({getZoneName(settings.targetLevel)})
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={settings.targetLevel}
              onChange={(e) => updateSetting('targetLevel', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  #ef4444 0%, #ef4444 25%, 
                  #f59e0b 25%, #f59e0b 50%, 
                  #10b981 50%, #10b981 75%, 
                  #8b5cf6 75%, #8b5cf6 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span><span>3</span><span>6</span><span>9</span><span>12</span>
            </div>
          </div>

          {/* Разброс */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Разброс: ±{settings.variance} уровня
            </label>
            <input
              type="range"
              min="0"
              max="4"
              value={settings.variance}
              onChange={(e) => updateSetting('variance', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Точно</span><span>±4</span>
            </div>
          </div>

          {/* Скорость */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Скорость: {settings.speed}мс
            </label>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={settings.speed}
              onChange={(e) => updateSetting('speed', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Быстро</span><span>Медленно</span>
            </div>
          </div>

          {/* Предпочтение крайних значений */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="preferExtremes"
              checked={settings.preferExtremes}
              onChange={(e) => updateSetting('preferExtremes', e.target.checked)}
              className="w-3 h-3"
            />
            <label htmlFor="preferExtremes" className="text-xs text-gray-600">
              Предпочитать крайние уровни (1-2, 11-12)
            </label>
          </div>
        </div>
      )}

      {/* Статистика */}
      <div className="mb-3 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Кликов:</span>
          <span className="font-semibold text-blue-600">{clickCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Статус:</span>
          <span className={`font-semibold ${active ? 'text-green-600' : 'text-gray-500'}`}>
            {active ? 'Активен' : 'Остановлен'}
          </span>
        </div>
        {lastSelectedLevel && (
          <div className="flex justify-between">
            <span>Последний уровень:</span>
            <span className="font-semibold" style={{ color: getTargetLevelColor(lastSelectedLevel) }}>
              {lastSelectedLevel}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Диапазон:</span>
          <span className="font-semibold text-purple-600">
            {Math.max(1, settings.targetLevel - settings.variance)}-{Math.min(12, settings.targetLevel + settings.variance)}
          </span>
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors flex-1 justify-center ${
            active 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {active ? 'Стоп' : 'Старт'}
        </button>
        
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Сброс
        </button>
      </div>

      {/* Подсказка */}
      <div className="mt-2 text-xs text-gray-500 border-t pt-2">
        🎯 Умный выбор уровня {settings.targetLevel} ± {settings.variance}
        {settings.preferExtremes && ' (предпочтение крайним)'}
      </div>
    </div>
  );
};

export default AutoClicker; 