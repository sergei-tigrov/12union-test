// 🚀 УПРОЩЕННЫЙ АДАПТИВНЫЙ ДВИЖОК
// Замена сложной системы на простую и эффективную

import { 
  SmartQuestion, 
  QuestionOption,
  relationshipStatusQuestions,
  zoneDetectionQuestions, 
  coreDiagnosticQuestions,  // НОВАЯ ФАЗА
  zoneClarificationQuestions, 
  validationQuestions,
  allSmartQuestions
} from './smart-adaptive-questions';

// Минимальное количество ответов для расчёта результатов
// Отключено: фиксированное минимальное число ответов
// Итоги можно рассчитывать только после прохождения всех вопросов –
// когда движок переходит в фазу 'completed'.
// Поэтому отдельная переменная-порог не нужна.
// Простая функция для преобразования индикаторов в читаемый вид
const translateIndicator = (indicator: string): string => {
  return indicator
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/^\w/, c => c.toUpperCase());
};

// Индивидуальные переопределения веса (экспертная оценка)
const questionWeightOverrides: Record<string, number> = {
  // Критически важные для диагностики (повышенный вес)
  'trauma_pattern_check': 1.5,
  'boundaries_core': 1.5,
  'conflict_communication': 1.5,
  'relationship_motivation': 1.4,
  'attachment_core': 1.4,
  'jealousy_validation': 1.3,
  
  // Валидационные (пониженный вес для детекции соц.желательности)
  'perfect_partner_contradiction': 0.8,
  'shadow_work_awareness': 0.8,
  'emotional_regulation_reality': 0.9,
  
  // Остальные стандартный вес 1.0 (по умолчанию)
};

function getQuestionWeight(questionId: string): number {
  // Сначала проверяем индивидуальное переопределение
  if (questionWeightOverrides[questionId]) return questionWeightOverrides[questionId];
  // Затем определяем вес по принадлежности к фазе/категории
  if (zoneDetectionQuestions.some(q => q.id === questionId)) return 1.1; // первичная диагностика
  if (coreDiagnosticQuestions.some(q => q.id === questionId)) return 1.3; // основная диагностика
  if (validationQuestions.some(q => q.id === questionId)) return 0.9;      // валидация/честность
  if (zoneClarificationQuestions.some(q => q.id === questionId)) return 1.0; // уточняющие
  return 1.0;
}

export interface SmartTestState {
  currentPhase: 'relationship_status' | 'detection' | 'core_diagnostic' | 'clarification' | 'validation' | 'completed';
  currentQuestionIndex: number;
  detectedZone?: 'destructive' | 'emotional' | 'mature' | 'transcendent';
  relationshipStatus?: 'in_relationship' | 'single' | 'complicated';
  answers: {
    questionId: string;
    selectedOptionId: string;
    responseTime?: number;
  }[];
  zoneConfidence: {
    destructive: number;
    emotional: number;
    mature: number;
    transcendent: number;
  };
}

export interface SmartTestResult {
  personalMaturity: number;
  relationshipMaturity: number;
  potentialLevel: number; // единая потенциальная ступень
  relationshipTrend: 'growing' | 'stable' | 'declining';
  confidence: number;
  consistency: number;
  questionsAsked: number;
  indicators: string[];
  detectedZone: string;
  levelDistribution: { [level: number]: number };
  maturityGap: number;
  relationshipStatus: 'in_relationship' | 'single' | 'complicated' | null; // Новое поле
  gapAnalysis: {
    type: 'personal_higher' | 'relationship_higher' | 'balanced';
    severity: 'minimal' | 'moderate' | 'significant' | 'critical';
    psychologicalPattern: string;
    recommendations: string[];
  };
  contradictions: {
    detected: boolean;
    severity: 'low' | 'medium' | 'high';
    details: string[];
  };
  validationScore: number;
  specializedData: {
    traumaAnswers: string[];
    attachmentAnswers: string[];
    boundariesAnswers: string[];
    jealousyAnswers: string[];
    motivationAnswers: string[];
    rawIndicators: string[];
  };
  spiritualBypassDetected: boolean;
}

export class SmartAdaptiveEngine {
  private state: SmartTestState;
  private cachedResults: SmartTestResult | null = null;
  private cachedAnswersCount = 0;
  
  constructor() {
    // Пытаемся восстановить состояние из localStorage
    const savedState = this.loadState();
    
    if (savedState) {
      console.log('🔄 SmartAdaptiveEngine: Восстанавливаем состояние из localStorage:', savedState);
      this.state = savedState;
    } else {
      console.log('🔄 SmartAdaptiveEngine: Создаем новое состояние');
      this.state = {
        currentPhase: 'relationship_status',
        currentQuestionIndex: 0,
        answers: [],
        zoneConfidence: {
          destructive: 0,
          emotional: 0,
          mature: 0,
          transcendent: 0
        }
      };
    }
  }

  // Сохранение состояния в localStorage
  private saveState(): void {
    try {
      const stateToSave = {
        ...this.state,
        timestamp: Date.now()
      };
      localStorage.setItem('smartAdaptiveEngine', JSON.stringify(stateToSave));
      console.log('💾 SmartAdaptiveEngine: Состояние сохранено в localStorage');
    } catch (error) {
      console.warn('⚠️ SmartAdaptiveEngine: Ошибка сохранения в localStorage:', error);
    }
  }

  // Загрузка состояния из localStorage
  private loadState(): SmartTestState | null {
    try {
      const saved = localStorage.getItem('smartAdaptiveEngine');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Проверяем, что состояние не старше 24 часов
        const maxAge = 24 * 60 * 60 * 1000; // 24 часа
        if (parsed.timestamp && (Date.now() - parsed.timestamp) < maxAge) {
          // Удаляем timestamp перед возвратом
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { timestamp, ...state } = parsed;
          return state as SmartTestState;
        } else {
          console.log('🔄 SmartAdaptiveEngine: Сохраненное состояние устарело, создаем новое');
          localStorage.removeItem('smartAdaptiveEngine');
        }
      }
    } catch (error) {
      console.warn('⚠️ SmartAdaptiveEngine: Ошибка загрузки из localStorage:', error);
      localStorage.removeItem('smartAdaptiveEngine');
    }
    return null;
  }

  // Сохранение результатов теста отдельно
  private saveResults(results: SmartTestResult): void {
    try {
      const resultsToSave = {
        ...results,
        timestamp: Date.now()
      };
      localStorage.setItem('smartAdaptiveResults', JSON.stringify(resultsToSave));
      console.log('💾 SmartAdaptiveEngine: Результаты сохранены в localStorage');
    } catch (error) {
      console.warn('⚠️ SmartAdaptiveEngine: Ошибка сохранения результатов:', error);
    }
  }

  // Загрузка сохраненных результатов
  public static loadSavedResults(): SmartTestResult | null {
    try {
      const saved = localStorage.getItem('smartAdaptiveResults');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Проверяем, что результаты не старше 7 дней
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней
        if (parsed.timestamp && (Date.now() - parsed.timestamp) < maxAge) {
          console.log('🔄 SmartAdaptiveEngine: Загружены сохраненные результаты');
          return parsed as SmartTestResult;
        } else {
          console.log('🔄 SmartAdaptiveEngine: Сохраненные результаты устарели');
          localStorage.removeItem('smartAdaptiveResults');
        }
      }
    } catch (error) {
      console.warn('⚠️ SmartAdaptiveEngine: Ошибка загрузки результатов:', error);
      localStorage.removeItem('smartAdaptiveResults');
    }
    return null;
  }

  // Очистка всех сохраненных данных (для кнопки "Пройти снова")
  public static clearSavedData(): void {
    try {
      localStorage.removeItem('smartAdaptiveEngine');
      localStorage.removeItem('smartAdaptiveResults');
      console.log('🗑️ SmartAdaptiveEngine: Все сохраненные данные очищены');
    } catch (error) {
      console.warn('⚠️ SmartAdaptiveEngine: Ошибка очистки данных:', error);
    }
  }

  getNextQuestion(): SmartQuestion | null {
    // Если тест завершен, возвращаем null
    if (this.state.currentPhase === 'completed') return null;
    
    const next = getNextQuestion(this.state.answers, this.state.zoneConfidence, this.state.currentPhase);
    
    // Если вопросов больше нет для текущей фазы, пытаемся перейти к следующей
    if (!next) {
      console.log(`🔄 getNextQuestion: Нет вопросов для фазы ${this.state.currentPhase}, проверяем переход`);
      
      if (this.state.currentPhase === 'relationship_status') {
        console.log(`🔄 getNextQuestion: Принудительный переход relationship_status → detection`);
        this.state.currentPhase = 'detection';
        return getNextQuestion(this.state.answers, this.state.zoneConfidence, this.state.currentPhase);
      } else if (this.state.currentPhase === 'detection') {
        console.log(`🔄 getNextQuestion: Принудительный переход detection → core_diagnostic`);
        this.state.currentPhase = 'core_diagnostic';
        return getNextQuestion(this.state.answers, this.state.zoneConfidence, this.state.currentPhase);
      } else if (this.state.currentPhase === 'core_diagnostic') {
        console.log(`🔄 getNextQuestion: Принудительный переход core_diagnostic → clarification`);
        this.state.currentPhase = 'clarification';
        return getNextQuestion(this.state.answers, this.state.zoneConfidence, this.state.currentPhase);
      } else if (this.state.currentPhase === 'clarification') {
        console.log(`🔄 getNextQuestion: Принудительный переход clarification → validation`);
        this.state.currentPhase = 'validation';
        return getNextQuestion(this.state.answers, this.state.zoneConfidence, this.state.currentPhase);
      } else if (this.state.currentPhase === 'validation') {
        console.log(`🔄 getNextQuestion: Принудительный переход validation → completed`);
        this.state.currentPhase = 'completed';
        return null;
      }
    }
    
    return next;
  }

  processAnswer(questionId: string, selectedOptionId: string, responseTime?: number): void {
    console.log(`🔍 ДЕБАГ: processAnswer called с questionId=${questionId}, selectedOptionId=${selectedOptionId}`);
    
    // Находим вопрос по ID
    const question = allSmartQuestions.find(q => q.id === questionId);
    if (!question) {
      console.error(`❌ Вопрос с ID ${questionId} не найден`);
      return;
    }

    // Записываем ответ
    this.state.answers.push({
      questionId,
      selectedOptionId,
      responseTime
    });

    console.log(`🔍 ДЕБАГ: Ответ записан. Всего ответов: ${this.state.answers.length}`);
    console.log(`🔍 ДЕБАГ: Текущая фаза: ${this.state.currentPhase}`);
    console.log(`🔍 ДЕБАГ: ID вопроса: ${questionId}, ID ответа: ${selectedOptionId}`);

    // Обновляем уверенность в зонах
    this.state.zoneConfidence = calculateZoneConfidence(this.state.answers);

    // Определяем статус отношений из ответа
    if (this.state.currentPhase === 'relationship_status' && questionId === 'relationship_status_check') {
      if (selectedOptionId === 'status_in_relationship') {
        this.state.relationshipStatus = 'in_relationship';
      } else if (selectedOptionId === 'status_single_ready' || selectedOptionId === 'status_single_focused') {
        this.state.relationshipStatus = 'single';
      } else if (selectedOptionId === 'status_complicated') {
        this.state.relationshipStatus = 'complicated';
      }
      console.log(`🔍 ДЕБАГ: Определен статус отношений: ${this.state.relationshipStatus}`);
    }

    // --- НОВАЯ ЛОГИКА ПЕРЕХОДОВ ФАЗ ---
    // Переходим на следующую фазу ТОЛЬКО когда в текущей фазе
    // больше не осталось вопросов для пользователя.
    let noMoreQuestionsInPhase = false;
    if (this.state.currentPhase !== 'completed') {
      const phaseForNext = this.state.currentPhase as 'relationship_status' | 'detection' | 'core_diagnostic' | 'clarification' | 'validation';
      noMoreQuestionsInPhase = !getNextQuestion(this.state.answers, this.state.zoneConfidence, phaseForNext);
    }

    if (noMoreQuestionsInPhase) {
      switch (this.state.currentPhase) {
        case 'relationship_status':
          this.state.currentPhase = 'detection';
          console.log('🔍 ДЕБАГ: Все вопросы relationship_status заданы ➜ Переход в detection');
          break;
        case 'detection':
          this.state.currentPhase = 'core_diagnostic';
          console.log('🔍 ДЕБАГ: Все вопросы detection заданы ➜ Переход в core_diagnostic');
          break;
        case 'core_diagnostic':
          this.state.currentPhase = 'clarification';
          console.log('🔍 ДЕБАГ: Все вопросы core_diagnostic заданы ➜ Переход в clarification');
          break;
        case 'clarification':
          this.state.currentPhase = 'validation';
          console.log('🔍 ДЕБАГ: Все вопросы clarification заданы ➜ Переход в validation');
          break;
        case 'validation':
          this.state.currentPhase = 'completed';
          console.log('🔍 ДЕБАГ: Все вопросы validation заданы ➜ Тест ЗАВЕРШЁН');
          break;
        default:
          break;
      }
    }
    
    console.log(`🔍 ДЕБАГ: Итоговая фаза после обработки: ${this.state.currentPhase}`);
    
    // Сохраняем состояние после каждого ответа
    this.saveState();
  }

  isTestComplete(): boolean {
    return this.state.currentPhase === 'completed';
  }

  getCurrentPhase(): 'relationship_status' | 'detection' | 'core_diagnostic' | 'clarification' | 'validation' | 'completed' {
    return this.state.currentPhase;
  }

  getResults(): SmartTestResult {
    // Итоги можно рассчитывать ТОЛЬКО после прохождения теста полностью.
    if (!this.isTestComplete()) {
      throw new Error('Невозможно рассчитать результаты: тест ещё не завершён.');
    }

    // Если ответы не изменились – возвращаем кэш
    if (this.cachedResults && this.cachedAnswersCount === this.state.answers.length) {
      console.log('💾 getResults: возвращаем закэшированные результаты');
      return this.cachedResults;
    }
    console.log(`🔍 getResults: СТАРТ`);
    
    try {
      console.log(`🔍 getResults: 1. Вызываем calculateZoneConfidence`);
      const zoneConfidence = calculateZoneConfidence(this.state.answers);
      console.log(`🔍 getResults: 1. ✅ zoneConfidence:`, zoneConfidence);
      
      console.log(`🔍 getResults: 2. Вызываем getDominantZone`);
      const dominantZone = this.getDominantZone(zoneConfidence, this.calculateDetailedMaturity().personalMaturity, this.calculateDetailedMaturity().relationshipMaturity);
      console.log(`🔍 getResults: 2. ✅ dominantZone:`, dominantZone);
      
      console.log(`🔍 getResults: 3. Вызываем calculateDetailedMaturity`);
      const { personalMaturity, relationshipMaturity } = this.calculateDetailedMaturity();
      console.log(`🔍 getResults: 3. ✅ maturity: personal=${personalMaturity}, relationship=${relationshipMaturity}`);
      
      console.log(`🔍 getResults: 4. Вызываем calculateRelationshipTrend`);
      const relationshipTrend = this.calculateRelationshipTrend();
      console.log(`🔍 getResults: 4. ✅ relationshipTrend:`, relationshipTrend);
      
      console.log(`🔍 getResults: 5. Вызываем calculateConfidence`);
      const confidence = this.calculateConfidence();
      console.log(`🔍 getResults: 5. ✅ confidence:`, confidence);
      
      console.log(`🔍 getResults: 6. Вызываем calculateConsistency`);
      const consistency = this.calculateConsistency();
      console.log(`🔍 getResults: 6. ✅ consistency:`, consistency);
      
      console.log(`🔍 getResults: 7. Вызываем extractKeyIndicators`);
      const indicators = this.extractKeyIndicators();
      console.log(`🔍 getResults: 7. ✅ indicators:`, indicators);
      
      console.log(`🔍 getResults: 8. Вызываем calculateLevelDistribution`);
      const levelDistribution = this.calculateLevelDistribution();
      console.log(`🔍 getResults: 8. ✅ levelDistribution:`, levelDistribution);
      
      console.log(`🔍 getResults: 9. Вызываем calculateMaturityGap`);
      const maturityGap = this.calculateMaturityGap(personalMaturity, relationshipMaturity);
      console.log(`🔍 getResults: 9. ✅ maturityGap:`, maturityGap);
      
      console.log(`🔍 getResults: 10. Вызываем analyzeMaturityGap`);
      const gapAnalysis = this.analyzeMaturityGap(maturityGap, personalMaturity, relationshipMaturity);
      console.log(`🔍 getResults: 10. ✅ gapAnalysis:`, gapAnalysis);
      
      console.log(`🔍 getResults: 11. Вызываем checkContradictions`);
      const contradictions = this.checkContradictions(this.state.answers);
      console.log(`🔍 getResults: 11. ✅ contradictions:`, contradictions);
      
      console.log(`🔍 getResults: 12. Вызываем calculateValidationScore`);
      const validationScore = this.calculateValidationScore(this.state.answers);
      console.log(`🔍 getResults: 12. ✅ validationScore:`, validationScore);
      
      console.log(`🔍 getResults: 13. Создаем результирующий объект`);
      const result: SmartTestResult = {
        personalMaturity,
        relationshipMaturity,
        potentialLevel: Math.max(Math.round(personalMaturity), Math.round(relationshipMaturity)),
        relationshipTrend,
        confidence,
        consistency,
        questionsAsked: this.state.answers.length,
        indicators,
        detectedZone: dominantZone,
        levelDistribution,
        maturityGap,
        relationshipStatus: this.state.relationshipStatus || null,
        gapAnalysis,
        contradictions,
        validationScore,
        specializedData: this.extractSpecializedData(),
        spiritualBypassDetected: detectSpiritualBypass(this.state.answers)
      };
      
      console.log(`🔍 getResults: 14. ✅ РЕЗУЛЬТАТ ГОТОВ:`, result);
      
      // Сохраняем результаты в localStorage
      this.saveResults(result);
      
      // Обновляем кэш
      this.cachedResults = result;
      this.cachedAnswersCount = this.state.answers.length;
      
      return result;
      
    } catch (error) {
      console.error(`❌ ОШИБКА в getResults:`, error);
      console.error(`❌ Стек ошибки:`, (error as Error).stack);
      throw error;
    }
  }

  getAnswersCount(): number {
    return this.state.answers.length;
  }

  private calculateDetailedMaturity(): { personalMaturity: number; relationshipMaturity: number } {
    console.log(`🔍 ДЕБАГ calculateDetailedMaturity: Начинаем расчет детальной зрелости`);
    
    const personalAnswers: { questionId: string; selectedOptionId: string }[] = [];
    const relationshipAnswers: { questionId: string; selectedOptionId: string }[] = [];
    
    console.log(`🔍 ДЕБАГ calculateDetailedMaturity: Всего ответов для анализа: ${this.state.answers.length}`);
    
    // Разделяем ответы на личностные и отношенческие
    this.state.answers.forEach(answer => {
      const question = this.findQuestionById(answer.questionId);
      console.log(`🔍 ДЕБАГ calculateDetailedMaturity: Анализируем ответ ${answer.questionId}, найден вопрос:`, question ? 'Да' : 'Нет');
      if (question) {
        console.log(`🔍 ДЕБАГ calculateDetailedMaturity: Тип аспекта вопроса: ${question.aspectType}`);
        if (question.aspectType === 'personal') {
          personalAnswers.push(answer);
        } else if (question.aspectType === 'relationship') {
          relationshipAnswers.push(answer);
        } else if (question.aspectType === 'combined') {
          // «Комбинированные» ответы учитываем в обеих зрелостях
          personalAnswers.push(answer);
          relationshipAnswers.push(answer);
        }
      }
    });
    
    console.log(`🔍 ДЕБАГ calculateDetailedMaturity: Личных ответов: ${personalAnswers.length}, Отношенческих: ${relationshipAnswers.length}`);
    
    // Расчет базовой зрелости
    const rawPersonalMaturity = this.calculateMaturityFromAnswers(personalAnswers);
    const rawRelationshipMaturity = this.calculateMaturityFromAnswers(relationshipAnswers);
    
    console.log(`🔍 ДЕБАГ calculateDetailedMaturity: Базовая зрелость - Личная: ${rawPersonalMaturity}, Отношенческая: ${rawRelationshipMaturity}`);
    
    // Применяем взаимовлияние
    const { adjustedPersonal, adjustedRelationship } = this.applyMutualInfluence(
      rawPersonalMaturity, 
      rawRelationshipMaturity, 
      personalAnswers, 
      relationshipAnswers
    );
    
    console.log(`🔍 ДЕБАГ calculateDetailedMaturity: После взаимовлияния - Личная: ${adjustedPersonal}, Отношенческая: ${adjustedRelationship}`);
    
    const result = { 
      personalMaturity: Math.round(adjustedPersonal * 10) / 10, 
      relationshipMaturity: Math.round(adjustedRelationship * 10) / 10 
    };
    
    console.log(`🔍 ДЕБАГ calculateDetailedMaturity: Финальный результат:`, result);
    return result;
  }

  private calculateMaturityFromAnswers(answers: { questionId: string; selectedOptionId: string }[]): number {
    if (answers.length === 0) return 5.5; // Средний уровень по умолчанию
    
    let totalLevel = 0;
    let totalWeight = 0;
    
    answers.forEach(answer => {
      const option = findOptionById(answer.selectedOptionId);
      if (option) {
        // Используем точный уровень из опции с плавной корректировкой
        const baseLevel = option.level;
        const adjustedLevel = this.applyIndicatorAdjustments(baseLevel, option.zone, option.indicators);
        
        // Применяем весовой коэффициент
        const weight = getQuestionWeight(answer.questionId);
        totalLevel += adjustedLevel * weight;
        totalWeight += weight;
      }
    });
    
    const rawResult = totalWeight > 0 ? totalLevel / totalWeight : 5.5;
    
    // Корректируем на социальную желательность (вычитаем штраф)
    const socialDesirabilityPenalty = this.detectSocialDesirability(answers);
    
    return Math.max(1, Math.min(12, rawResult - socialDesirabilityPenalty));
  }

  // Детекция социальной желательности (пропорциональная система штрафов)
  private detectSocialDesirability(answers: { questionId: string; selectedOptionId: string }[]): number {
    // Подсчитаем доли ответов разных уровней и проверим индикаторы
    const total = answers.length;
    if (total < 10) return 0; // Недостаточно ответов для анализа

    const lowCount = answers.filter(a => {
      const opt = findOptionById(a.selectedOptionId);
      return opt && opt.level <= 3;
    }).length;

    const midCount = answers.filter(a => {
      const opt = findOptionById(a.selectedOptionId);
      return opt && opt.level > 3 && opt.level <= 6;
    }).length;
    
    const highCount = answers.filter(a => {
      const opt = findOptionById(a.selectedOptionId);
      return opt && opt.level > 6 && opt.level <= 9;
    }).length;

    const veryHighCount = answers.filter(a => {
      const opt = findOptionById(a.selectedOptionId);
      return opt && opt.level > 9 && opt.level <= 11;
    }).length;

    const perfectCount = answers.filter(a => {
      const opt = findOptionById(a.selectedOptionId);
      return opt && opt.level > 11;
    }).length;
    
    // УЛУЧШЕНО: Анализ экстремальных индикаторов для дополнительной проверки
    const extremeHighIndicators = ['spiritual_mastery', 'transcendent_consciousness', 
                              'divine_love', 'sacred_perspective', 'consciousness_expansion'];
    
    const extremeHighIndicatorCount = answers.filter(a => {
      const opt = findOptionById(a.selectedOptionId);
      return opt && opt.indicators && opt.indicators.some(ind => 
        extremeHighIndicators.some(ext => ind.includes(ext)));
    }).length;

    const lowRatio = lowCount / total;
    const midRatio = midCount / total;
    const highRatio = highCount / total;
    const veryHighRatio = veryHighCount / total;
    const perfectRatio = perfectCount / total;
    const extremeIndicatorRatio = extremeHighIndicatorCount / total;
    
    console.log(`📊 Распределение ответов: низкие ${Math.round(lowRatio*100)}%, средние ${Math.round(midRatio*100)}%, ` +
                `высокие ${Math.round(highRatio*100)}%, очень высокие ${Math.round(veryHighRatio*100)}%, ` +
                `совершенные ${Math.round(perfectRatio*100)}%, с экстр.индикаторами ${Math.round(extremeIndicatorRatio*100)}%`);

    // УЛУЧШЕНО: Если есть экстремальные индикаторы, они подтверждают подлинность высоких оценок
    const hasSubstantialExtremeIndicators = extremeIndicatorRatio >= 0.15; // >15% ответов с экстр.индикаторами
    
    // Если есть достаточное количество низких ответов (>10%) – считаем ответы искренними, штраф 0
    // (порог снижен с 15% до 10% для большей гибкости)
    if (lowRatio >= 0.10) {
      console.log(`✅ Социальная желательность: достаточно честных низких ответов (${Math.round(lowRatio*100)}%) – штраф не применяется`);
      return 0;
    }
    
    // УЛУЧШЕНО: Если есть экстремальные индикаторы, штраф не применяется или снижается
    if (hasSubstantialExtremeIndicators) {
      console.log(`🌟 Социальная желательность: высокие ответы подтверждены экстремальными индикаторами (${Math.round(extremeIndicatorRatio*100)}%) – штраф не применяется`);
      return 0;
    }

    // Рассчитываем подозрительные пропорции ответов без подтверждения индикаторами
    let suspiciousRatio = 0;
    
    // УЛУЧШЕНО: Разные категории ответов влияют на подозрительность по-разному
    if (perfectRatio > 0.2) { // Много совершенных ответов
      suspiciousRatio += perfectRatio * 1.5;
    }
    
    if (veryHighRatio > 0.35) { // Много очень высоких ответов
      suspiciousRatio += (veryHighRatio - 0.35) * 1.2;
    }
    
    // Повышенный порог невинности: до 35% высоких ответов без низких - не штрафуем
    if (suspiciousRatio <= 0.35) {
      console.log(`✅ Социальная желательность: подозрительность ${Math.round(suspiciousRatio*100)}% ниже порога 35% – штраф не применяется`);
      return 0;
    }

    // Линейный штраф от 0 до 0.7 (ограничим 0.7) – чем выше доля, тем больше штраф
    let penalty = (suspiciousRatio - 0.3) * 1.5; // при 100 % высоких будет 1.05 → обрежем

    // Учитываем «идеальные» ответы: усиливаем штраф
    if (perfectRatio > 0.2) {
      penalty += perfectRatio; // добавляем до +0.8 максимум
    }

    penalty = Math.min(0.8, penalty); // потолок 0.8 балла

    console.log(`🚨 Социальная желательность: low ${Math.round(lowRatio*100)} %, high ${Math.round(highRatio*100)} %, perfect ${Math.round(perfectRatio*100)} % → штраф ${penalty.toFixed(2)}`);

    return penalty;

  }

  private applyIndicatorAdjustments(baseLevel: number, zone: 'destructive' | 'emotional' | 'mature' | 'transcendent', indicators: string[]): number {
    let adjustment = 0;
    
    // Позитивные индикаторы (повышают уровень)
    const positiveIndicators = ['creativity', 'synergy', 'development', 'acceptance', 'service', 'freedom', 'authenticity', 'transcendent', 'divine', 'spiritual'];
    const negativeIndicators = ['trauma', 'fear', 'destruction', 'dependency', 'chaos', 'control', 'survival', 'panic', 'abandonment'];
    
    // Экстремальные индикаторы (позволяют выходить за зональные границы) - УСИЛЕННЫЕ
    const extremeHighIndicators = ['spiritual_mastery', 'transcendent_consciousness', 'divine_love', 'sacred_perspective', 'consciousness_expansion', 'sacred_conflict_wisdom', 'divine_growth_opportunity', 'spiritual_transformation'];
    const extremeLowIndicators = ['childhood_trauma_activation', 'survival_terror', 'panic_response', 'abandonment_terror', 'trauma_repetition', 'power_dynamics', 'control_obsession', 'possessive_love', 'abusive_patterns'];
    
    // Улучшенная логика обработки экстремальных индикаторов
    let extremeHighBoost = 0;
    let extremeLowPenalty = 0;
    
    indicators.forEach(indicator => {
      // Стандартная корректировка для обычных индикаторов
      if (positiveIndicators.some(pos => indicator.includes(pos))) {
        adjustment += 0.5;
      }
      if (negativeIndicators.some(neg => indicator.includes(neg))) {
        adjustment -= 0.5;
      }
      
      // УЛУЧШЕНО: Теперь экстремальные индикаторы дают дополнительный прямой буст
      if (extremeHighIndicators.some(ext => indicator.includes(ext))) {
        extremeHighBoost += 0.75; // Увеличенный буст для трансцендентных индикаторов
        console.log(`🌟 Найден высший экстремальный индикатор: ${indicator}, добавлен буст +0.75`);  
      }
      if (extremeLowIndicators.some(ext => indicator.includes(ext))) {
        extremeLowPenalty += 0.75; // Аналогичный штраф для низких индикаторов
        console.log(`⚠️ Найден низший экстремальный индикатор: ${indicator}, добавлен штраф -0.75`);  
      }
    });
    
    // Базовая корректировка с ограничением
    adjustment = Math.max(-1, Math.min(1, adjustment)); 
    
    // УЛУЧШЕНО: Сначала применяем обычную корректировку, затем добавляем экстремальные бусты
    let adjustedLevel = baseLevel + adjustment;
    
    // УЛУЧШЕНО: Применяем экстремальные бусты, но с более мягкими ограничениями
    if (extremeHighBoost > 0) {
      const maxBoost = Math.min(extremeHighBoost, 1.5); // Максимальный буст 1.5 уровня
      adjustedLevel += maxBoost;
      console.log(`🚀 Применен экстремальный буст: +${maxBoost.toFixed(2)}, новый уровень: ${adjustedLevel.toFixed(2)}`); 
    }
    
    if (extremeLowPenalty > 0) {
      const maxPenalty = Math.min(extremeLowPenalty, 1.5); // Максимальный штраф 1.5 уровня
      adjustedLevel -= maxPenalty;
      console.log(`📉 Применен экстремальный штраф: -${maxPenalty.toFixed(2)}, новый уровень: ${adjustedLevel.toFixed(2)}`);
    }
    
    // УЛУЧШЕНО: Разрешаем более гибкий выход за зональные границы при наличии экстремальных индикаторов
    if (extremeHighBoost > 0 || extremeLowPenalty > 0) {
      // При наличии экстремальных индикаторов разрешаем полный диапазон 1-12
      return Math.max(1, Math.min(12, adjustedLevel));
    }
    
    // РАСШИРЕННЫЕ зональные ограничения для большей вариативности результатов
    // УЛУЧШЕНО: Расширены перекрытия между зонами для более плавных переходов
    const zoneRanges = {
      destructive: { min: 1, max: 3.5 },   // 1-3.5 — деструктивная зона (расширена верхняя граница)
      emotional: { min: 3.5, max: 6.5 },   // 3.5-6.5 — эмоциональная зона (расширены обе границы)
      mature: { min: 6.0, max: 9.5 },      // 6.0-9.5 — зрелая зона (расширены обе границы)
      transcendent: { min: 9.0, max: 12 }  // 9.0-12 — трансцендентная зона (расширена нижняя граница)
    };
    
    const range = zoneRanges[zone];
    return Math.max(range.min, Math.min(range.max, adjustedLevel));
  }

  private applyMutualInfluence(
    personalMaturity: number, 
    relationshipMaturity: number, 
    personalAnswers: { questionId: string; selectedOptionId: string }[], 
    relationshipAnswers: { questionId: string; selectedOptionId: string }[]
  ): { adjustedPersonal: number; adjustedRelationship: number } {
    // УБРАНО: принудительное взаимовлияние, которое искусственно сближало результаты
    // Теперь возвращаем исходные значения, позволяя выявлять экстремальные расхождения
    
    // Дополнительная корректировка только на основе качества ответов (без взаимовлияния)
    const personalQuality = this.assessAnswerQuality(personalAnswers);
    const relationshipQuality = this.assessAnswerQuality(relationshipAnswers);
    
    // Легкая корректировка только в случае явно некачественных ответов
    const personalAdjustment = personalQuality < 0.3 ? -0.3 : 0;
    const relationshipAdjustment = relationshipQuality < 0.3 ? -0.3 : 0;
    
    const adjustedPersonal = Math.max(1, Math.min(12, personalMaturity + personalAdjustment));
    const adjustedRelationship = Math.max(1, Math.min(12, relationshipMaturity + relationshipAdjustment));
    
    return { adjustedPersonal, adjustedRelationship };
  }

  private assessAnswerQuality(answers: { questionId: string; selectedOptionId: string }[]): number {
    if (answers.length === 0) return 1;
    
    // Оцениваем качество ответов на основе их согласованности
    const zones = answers.map(answer => {
      const option = findOptionById(answer.selectedOptionId);
      return option?.zone;
    }).filter(Boolean);
    
    if (zones.length === 0) return 1;
    
    const zoneCounts = zones.reduce((acc, zone) => {
      acc[zone!] = (acc[zone!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const maxCount = Math.max(...Object.values(zoneCounts));
    return maxCount / zones.length;
  }

  private calculateRelationshipTrend(): 'growing' | 'stable' | 'declining' {
    // Фильтруем только ответы на вопросы об отношениях
    const relationshipAnswers = this.state.answers.filter(answer => {
      const question = this.findQuestionById(answer.questionId);
      return question && (question.aspectType === 'relationship' || question.aspectType === 'combined');
    });
    
    if (relationshipAnswers.length < 3) return 'stable';
    
    // Группируем ответы по фазам для корректного анализа тренда
    const detectionAnswers = relationshipAnswers.filter(answer => {
      const question = this.findQuestionById(answer.questionId);
      return question?.phase === 'detection';
    });
    
    const clarificationAnswers = relationshipAnswers.filter(answer => {
      const question = this.findQuestionById(answer.questionId);
      return question?.phase === 'clarification';
    });
    
    const validationAnswers = relationshipAnswers.filter(answer => {
      const question = this.findQuestionById(answer.questionId);
      return question?.phase === 'validation';
    });
    
    // Рассчитываем средние уровни по фазам
    const detectionAvg = this.calculatePhaseAverage(detectionAnswers);
    const clarificationAvg = this.calculatePhaseAverage(clarificationAnswers);
    const validationAvg = this.calculatePhaseAverage(validationAnswers);
    
    // Анализируем тренд через фазы (с весами)
    const phases = [
      { avg: detectionAvg, weight: 0.3 },
      { avg: clarificationAvg, weight: 0.5 },
      { avg: validationAvg, weight: 0.2 }
    ].filter(phase => phase.avg > 0);
    
    if (phases.length < 2) return 'stable';
    
    // Взвешенный анализ изменений
    let totalChange = 0;
    let totalWeight = 0;
    
    for (let i = 1; i < phases.length; i++) {
      const change = phases[i].avg - phases[i-1].avg;
      const weight = Math.min(phases[i].weight, phases[i-1].weight);
      totalChange += change * weight;
      totalWeight += weight;
    }
    
    const averageChange = totalWeight > 0 ? totalChange / totalWeight : 0;
    
    if (averageChange > 0.8) return 'growing';
    if (averageChange < -0.8) return 'declining';
    return 'stable';
  }

  private calculatePhaseAverage(answers: { questionId: string; selectedOptionId: string }[]): number {
    if (answers.length === 0) return 0;
    
    const levels = answers.map(answer => {
      const option = findOptionById(answer.selectedOptionId);
      return option ? this.applyIndicatorAdjustments(option.level, option.zone, option.indicators) : 5.5;
    });
    
    return levels.reduce((sum, level) => sum + level, 0) / levels.length;
  }

  private calculateConfidence(): number {
    // Чем больше ответов и чем более они согласованы, тем выше уверенность
    const answerCount = this.state.answers.length;
    const consistency = this.calculateConsistency();
    
    // Базовая уверенность растет с количеством ответов
    const baseConfidence = Math.min(0.9, 0.3 + (answerCount * 0.08));
    
    // Корректировка на основе согласованности
    const confidenceAdjustment = consistency * 0.3;
    
    // Ограничиваем итоговое значение до 100%
    let totalConfidence = Math.min(1.0, baseConfidence + confidenceAdjustment);
    
    // ИСПРАВЛЕНИЕ: Снижаем уверенность при больших разрывах зрелости
    const { personalMaturity, relationshipMaturity } = this.calculateDetailedMaturity();
    const maturityGap = Math.abs(personalMaturity - relationshipMaturity);
    
    if (maturityGap > 3) {
      const gapPenalty = (maturityGap - 3) * 0.1; // 10% за каждый балл разрыва сверх 3
      totalConfidence = Math.max(0.3, totalConfidence - gapPenalty); // Минимум 30%
      console.log(`🔧 ИСПРАВЛЕНИЕ: Снижена уверенность на ${Math.round(gapPenalty * 100)}% из-за разрыва ${maturityGap.toFixed(1)}`);
    }
    
    // УСИЛЕННАЯ ДЕТЕКЦИЯ противоречий и социальной желательности
    const contradictions = this.checkContradictions(this.state.answers);
    if (contradictions.detected) {
      const contradictionPenalty = contradictions.severity === 'high' ? 0.35 : 
                                  contradictions.severity === 'medium' ? 0.2 : 0.1;
      totalConfidence = Math.max(0.2, totalConfidence - contradictionPenalty);
      console.log(`🔧 УСИЛЕННАЯ ДЕТЕКЦИЯ: Снижена уверенность на ${Math.round(contradictionPenalty * 100)}% из-за противоречий`);
    }
    
    // НОВАЯ ДЕТЕКЦИЯ социальной желательности
    const socialDesirabilityPenalty = this.detectSocialDesirability(this.state.answers);
    if (socialDesirabilityPenalty > 0) {
      totalConfidence = Math.max(0.15, totalConfidence - socialDesirabilityPenalty);
      console.log(`🔧 ДЕТЕКЦИЯ СОЦИАЛЬНОЙ ЖЕЛАТЕЛЬНОСТИ: Снижена уверенность на ${Math.round(socialDesirabilityPenalty * 100)}%`);
    }
    
    // Возвращаем значение 0-1 (стандарт для confidence) с округлением до 2 знаков
    return Math.round(totalConfidence * 100) / 100;
  }

  private calculateConsistency(): number {
    const answersCount = this.state.answers.length;
    // Базовый уровень согласованности при малом количестве ответов
    if (answersCount < 2) return 0.6;

    // 1) Согласованность уровней (по дисперсии)
    const levels = this.state.answers
      .map(a => findOptionById(a.selectedOptionId)?.level)
      .filter((l): l is number => l !== undefined);

    if (levels.length === 0) return 0.6;

    const mean = levels.reduce((s, l) => s + l, 0) / levels.length;
    const variance =
      levels.reduce((s, l) => s + Math.pow(l - mean, 2), 0) / levels.length;
    const stdDev = Math.sqrt(variance);

    // Индекс изменчивости 0‒1 и плавное (sqrt) масштабирование
    const maxStdDev = 3.16; // ≈ stdDev для равномерного 1-12
    const variabilityIndex = Math.min(stdDev / maxStdDev, 1);
    const levelConsistency = 1 - Math.sqrt(variabilityIndex); // мягче штрафуем малый разброс

    // 2) Согласованность зон (распределение ответов по зонам)
    type Zone = 'destructive' | 'emotional' | 'mature' | 'transcendent';
    const zones = this.state.answers
      .map(a => findOptionById(a.selectedOptionId)?.zone)
      .filter((z): z is Zone => z !== undefined);

    let zoneConsistency = 0.5;
    if (zones.length > 0) {
      const zoneCounts = zones.reduce((acc: Record<Zone, number>, z) => {
        acc[z] = (acc[z] || 0) + 1;
        return acc;
      }, {} as Record<Zone, number>);
      zoneConsistency = Math.max(...Object.values(zoneCounts)) / zones.length;
    }

    // 3) Динамические веса: чем больше ответов, тем надёжнее метрика
    const answerWeight = Math.min(answersCount / 20, 1); // при ≥20 ответах вес = 1
    // Усиленный вес согласованности уровней, т.к. именно она отражает истинную последовательность ответов
    const combinedWeighted = levelConsistency * 0.7 + zoneConsistency * 0.3;
    // Повышаем базовый уровень для малых выборок до 0.7 (ранее 0.65)
    const combined = combinedWeighted * answerWeight + (1 - answerWeight) * 0.7; // базовый уровень при малом числе ответов

    // Ограничиваем 0-1 и округляем
    return Math.round(Math.max(0, Math.min(1, combined)) * 100) / 100;
  }

  private extractKeyIndicators(): string[] {
    const personalIndicators: Record<string, { count: number; totalLevel: number }> = {};
    const relationshipIndicators: Record<string, { count: number; totalLevel: number }> = {};
    
    this.state.answers.forEach(answer => {
      const question = this.findQuestionById(answer.questionId);
      const option = findOptionById(answer.selectedOptionId);
      
      if (question && option) {
        option.indicators.forEach(indicator => {
          const humanReadableIndicator = translateIndicator(indicator);
          
          if (question.aspectType === 'personal') {
            if (!personalIndicators[humanReadableIndicator]) {
              personalIndicators[humanReadableIndicator] = { count: 0, totalLevel: 0 };
            }
            personalIndicators[humanReadableIndicator].count += 1;
            personalIndicators[humanReadableIndicator].totalLevel += option.level;
          } else if (question.aspectType === 'relationship' || question.aspectType === 'combined') {
            if (!relationshipIndicators[humanReadableIndicator]) {
              relationshipIndicators[humanReadableIndicator] = { count: 0, totalLevel: 0 };
            }
            relationshipIndicators[humanReadableIndicator].count += 1;
            relationshipIndicators[humanReadableIndicator].totalLevel += option.level;
          }
        });
      }
    });
    
    // Вычисляем средние уровни зрелости для контекста
    const avgPersonalMaturity = this.calculateDetailedMaturity().personalMaturity;
    const avgRelationshipMaturity = this.calculateDetailedMaturity().relationshipMaturity;
    
    // Функция для вычисления релевантности индикатора
    const calculateRelevance = (data: { count: number; totalLevel: number }, contextMaturity: number) => {
      if (data.count === 0) return 0;
      
      const avgLevel = data.totalLevel / data.count;
      const frequency = data.count;
      // Близость к целевому уровню зрелости (0‒1)
      const levelProximity = Math.max(0, 1 - Math.abs(avgLevel - contextMaturity) / 6);
      // Вес зрелости (даёт больший вклад ответам, близким к верхним ступеням)
      const maturityWeight = avgLevel / 12;
      // Итоговая релевантность: сглаженная частота * proximity * maturityWeight, усиленная коэффициентом 3
      const relevance = Math.sqrt(frequency) * (1 + levelProximity * 3) * (0.5 + maturityWeight);
      return relevance;
    };
    
    // Получаем топ-3 из каждой категории с учетом релевантности
    const topPersonal = Object.entries(personalIndicators)
      .map(([indicator, data]) => ({
        indicator,
        relevance: calculateRelevance(data, avgPersonalMaturity)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3)
      .map(item => `Личность: ${item.indicator}`);
      
    const topRelationship = Object.entries(relationshipIndicators)
      .map(([indicator, data]) => ({
        indicator,
        relevance: calculateRelevance(data, avgRelationshipMaturity)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3)
      .map(item => `Отношения: ${item.indicator}`);
    
    return [...topPersonal, ...topRelationship].slice(0, 6);
  }

  private calculateLevelDistribution(): { [level: number]: number } {
    // Сумма весов по каждому уровню
    const levelWeights: { [level: number]: number } = {};
    let totalWeight = 0;
    
    this.state.answers.forEach(answer => {
      const option = findOptionById(answer.selectedOptionId);
      if (option) {
        const level = this.applyIndicatorAdjustments(option.level, option.zone, option.indicators);
        const weight = getQuestionWeight(answer.questionId);
        levelWeights[level] = (levelWeights[level] || 0) + weight;
        totalWeight += weight;
      }
    });
    
    const distribution: { [level: number]: number } = {};
    Object.entries(levelWeights).forEach(([level, w]) => {
      distribution[parseInt(level)] = Math.round((w / totalWeight) * 100);
    });

    // Гарантируем наличие всех 12 уровней в распределении
    for (let lvl = 1; lvl <= 12; lvl++) {
      if (distribution[lvl] === undefined) {
        distribution[lvl] = 0;
      }
    }
    
    return distribution;
  }

  private findQuestionById(questionId: string): SmartQuestion | null {
    const allQuestions = [...relationshipStatusQuestions, ...zoneDetectionQuestions, ...coreDiagnosticQuestions, ...zoneClarificationQuestions, ...validationQuestions];
    return allQuestions.find(q => q.id === questionId) || null;
  }

  private getDominantZone(zoneConfidence: { destructive: number; emotional: number; mature: number; transcendent: number }, personalMaturity?: number, relationshipMaturity?: number): string {
    // Если есть данные о зрелости, учитываем их при определении зоны
    if (personalMaturity !== undefined && relationshipMaturity !== undefined) {
      const avgMaturity = (personalMaturity + relationshipMaturity) / 2;
      const maturityGap = Math.abs(personalMaturity - relationshipMaturity);
      
      // ИСПРАВЛЕНИЕ: При большом разрыве используем НИЖНИЙ уровень, а не средний
      if (maturityGap > 3) {
        const lowerMaturity = Math.min(personalMaturity, relationshipMaturity);
        console.log(`🔧 ИСПРАВЛЕНИЕ: Большой разрыв ${maturityGap.toFixed(1)}, используем нижний уровень: ${lowerMaturity}`);
        
        // ДОПОЛНИТЕЛЬНОЕ ИСПРАВЛЕНИЕ: При критическом разрыве (>4) применяем мягкий штраф
        let adjustedLowerMaturity = lowerMaturity;
        if (maturityGap > 4) {
          adjustedLowerMaturity = Math.max(adjustedLowerMaturity - 1.5, 1); // Более мягкий штраф
          console.log(`🔧 КРИТИЧЕСКИЙ РАЗРЫВ: Дополнительно снижаем зону с ${lowerMaturity} до ${adjustedLowerMaturity}`);
        }
        
        // ОБНОВЛЕННЫЕ ГРАНИЦЫ ЗОН в соответствии с расширенными диапазонами
        if (adjustedLowerMaturity >= 9.5) {
          return 'transcendent';
        } else if (adjustedLowerMaturity >= 6.5) {
          return 'mature';
        } else if (adjustedLowerMaturity >= 4) {
          return 'emotional';
        } else {
          return 'destructive';
        }
      }
      
      // ОБНОВЛЕННЫЕ ГРАНИЦЫ ЗОН для стандартного определения
      if (avgMaturity >= 9.5) {
        return 'transcendent';
      } else if (avgMaturity >= 6.5) {
        return 'mature';
      } else if (avgMaturity >= 4) {
        return 'emotional';
      } else {
        return 'destructive';
      }
    }
    
    // Если данных о зрелости нет, используем только распределение ответов
    return Object.entries(zoneConfidence).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0];
  }

  getProgress(): number {
    const totalQuestions = this.getTotalQuestions();
    return Math.round((this.state.answers.length / totalQuestions) * 100);
  }

  getPhase(): string {
    return this.state.currentPhase;
  }

  getQuestionCount(): number {
    return this.state.answers.length + 1; // +1 для текущего вопроса
  }

  getPhaseDescription(): string {
    switch (this.state.currentPhase) {
      case 'detection':
        return 'Определение общей зоны зрелости';
      case 'core_diagnostic':
        return 'Ключевая психологическая диагностика';
      case 'clarification':
        return 'Уточнение уровня внутри зоны';
      case 'validation':
        return 'Проверка честности ответов';
      case 'completed':
        return 'Анализ завершен';
      default:
        return 'Неизвестная фаза';
    }
  }

  private getTotalQuestions(): number {
    return zoneDetectionQuestions.length + coreDiagnosticQuestions.length + zoneClarificationQuestions.length + Math.min(validationQuestions.length, 8);
  }

  private calculateMaturityGap(personalMaturity: number, relationshipMaturity: number): number {
    return Math.abs(personalMaturity - relationshipMaturity);
  }

  private analyzeMaturityGap(maturityGap: number, personalMaturity: number, relationshipMaturity: number): {
    type: 'personal_higher' | 'relationship_higher' | 'balanced';
    severity: 'minimal' | 'moderate' | 'significant' | 'critical';
    psychologicalPattern: string;
    recommendations: string[];
  } {
    const isRelationshipHigher = relationshipMaturity > personalMaturity;
    
    if (maturityGap < 1.5) {
      return {
        type: 'balanced',
        severity: 'minimal',
        psychologicalPattern: 'Гармоничное развитие личности и отношений создает основу для глубокой, взаимообогащающей связи',
        recommendations: [
          'Продолжайте развиваться в обеих сферах одновременно',
          'Используйте синергию личного и отношенческого роста',
          'Делитесь опытом развития с партнером'
        ]
      };
    }
    
    if (isRelationshipHigher) {
      const severity = maturityGap > 4 ? 'critical' : maturityGap > 2.5 ? 'significant' : 'moderate';
      
      return {
        type: 'relationship_higher',
        severity,
        psychologicalPattern: severity === 'critical' 
          ? 'Критический разрыв: риск потери себя в отношениях и созависимости'
          : 'Хорошие навыки отношений при недостаточном личностном развитии',
        recommendations: severity === 'critical' ? [
          'СРОЧНО: работайте с психологом над личными границами',
          'Изучите тему созависимости',
          'Развивайте индивидуальные интересы и хобби',
          'Практикуйте время наедине с собой',
          'Учитесь говорить "нет" и отстаивать свои потребности'
        ] : [
          'Уделите время саморазвитию и самопознанию',
          'Развивайте личные интересы отдельно от партнера',
          'Работайте над личными границами',
          'Изучайте свои истинные потребности и ценности',
          'Практикуйте автономность внутри отношений'
        ]
      };
    } else {
      const severity = maturityGap > 4 ? 'critical' : maturityGap > 2.5 ? 'significant' : 'moderate';
      
      return {
        type: 'personal_higher',
        severity,
        psychologicalPattern: severity === 'critical' 
          ? 'Критический разрыв: высокая личная зрелость может создавать изоляцию в отношениях'
          : 'Личная зрелость опережает способность к близости и совместному росту',
        recommendations: severity === 'critical' ? [
          'СРОЧНО: обратитесь к семейному психологу',
          'Изучите техники эмоциональной близости',
          'Практикуйте уязвимость и открытость с партнером',
          'Развивайте эмпатию и эмоциональный интеллект',
          'Учитесь принимать несовершенства партнера'
        ] : [
          'Направьте энергию саморазвития на углубление отношений',
          'Изучите психологию отношений и близости',
          'Практикуйте активное слушание партнера',
          'Развивайте эмоциональную доступность',
          'Участвуйте в парной терапии или тренингах'
        ]
      };
    }
  }

  private checkContradictions(answers: { questionId: string; selectedOptionId: string; responseTime?: number }[]): {
    detected: boolean;
    severity: 'low' | 'medium' | 'high';
    details: string[];
  } {
    console.log('🔍 checkContradictions: Начинаем анализ противоречий');
    
    const contradictions: string[] = [];
    
    // Собираем индикаторы для анализа
    const allIndicators: string[] = [];
    const traumaIndicators: string[] = [];
    const attachmentIndicators: string[] = [];
    
    answers.forEach(answer => {
      const question = this.findQuestionById(answer.questionId);
      const option = findOptionById(answer.selectedOptionId);
      
      if (question && option) {
        allIndicators.push(...option.indicators);
        
        // Классифицируем индикаторы
        option.indicators.forEach(indicator => {
          if (indicator.includes('trauma') || indicator.includes('terror') || indicator.includes('survival')) {
            traumaIndicators.push(indicator);
          }
          if (indicator.includes('attachment') || indicator.includes('abandonment') || indicator.includes('avoidant')) {
            attachmentIndicators.push(indicator);
          }
        });
      }
    });
    
    // УБИРАЕМ базовые противоречия - нормально иметь destructive или transcendent ответы
    // Противоречия должны быть РЕАЛЬНЫМИ противоречиями, а не просто низкими/высокими ответами
    
    // НОВОЕ: Детекция скрытых травматических паттернов
    const { personalMaturity, relationshipMaturity } = this.calculateDetailedMaturity();
    const avgMaturity = (personalMaturity + relationshipMaturity) / 2;
    
    // УЖЕСТОЧЁННАЯ ДЕТЕКЦИЯ компенсированной травмы - должна быть ДЕЙСТВИТЕЛЬНО критической
    if (avgMaturity >= 9 && traumaIndicators.length >= 4) { // Намного более строгие критерии
      const consistency = this.calculateConsistency();
      if (consistency < 0.5) { // Очень низкий порог консистентности
        contradictions.push('🎭 КРИТИЧНО: Компенсированная травма - высокая функциональность маскирует множественные травматические паттерны');
        console.log('❌ checkContradictions: Обнаружена компенсированная травма');
      }
    }
    
    // УБИРАЕМ проверки на смешанные стили - это нормально
    
    // УЖЕСТОЧАЕМ проверку контроля как нездоровых границ
    const controlIndicators = allIndicators.filter(i => 
      i.includes('control') || i.includes('rigid') || i.includes('perfection')
    ).length;
    const healthyBoundariesIndicators = allIndicators.filter(i => i.includes('healthy_boundaries')).length;
    
    if (controlIndicators >= 4 && healthyBoundariesIndicators >= 2) { // Намного более строгие пороги
      contradictions.push('⚠️ Множественные признаки жесткого контроля при заявлениях о здоровых границах');
      console.log('❌ checkContradictions: Обнаружен контроль под видом границ');
    }
    
    // КРИТИЧЕСКИ УЖЕСТОЧЁННАЯ ДЕТЕКЦИЯ социальной желательности 
    const highLevelAnswers = answers.filter(answer => {
      const option = findOptionById(answer.selectedOptionId);
      return option && option.level >= 10; // Повышен порог
    }).length;
    
    const perfectAnswers = answers.filter(answer => {
      const option = findOptionById(answer.selectedOptionId);
      return option && option.level >= 11;
    }).length;
    
    const highRatio = highLevelAnswers / answers.length;
    const perfectRatio = perfectAnswers / answers.length;
    
    // НАМНОГО более строгие критерии для социальной желательности
    if (perfectRatio > 0.6 && traumaIndicators.length >= 5) { // Повышены пороги
      contradictions.push('📊 КРИТИЧНО: Экстремальная социальная желательность - большинство "идеальных" ответов при множественных травматических маркерах');
      console.log('❌ checkContradictions: Обнаружена экстремальная социальная желательность');
    } else if (highRatio > 0.85 && traumaIndicators.length >= 4) { // Очень высокие пороги
      contradictions.push('📊 ВНИМАНИЕ: Возможная социальная желательность при множественных травматических индикаторах');
      console.log('⚠️ checkContradictions: Возможная социальная желательность');
    }
    
    console.log(`🔍 checkContradictions: Найдено противоречий: ${contradictions.length}`, contradictions);
    
    if (contradictions.length === 0) {
      console.log('✅ checkContradictions: Противоречий не обнаружено');
      return {
        detected: false,
        severity: 'low',
        details: []
      };
    } else {
      // ИСПРАВЛЕННАЯ ЛОГИКА определения серьезности
      let severity: 'low' | 'medium' | 'high' = 'low';
      
      // Критичные случаи требуют высокой серьезности
      if (contradictions.some(c => c.includes('КРИТИЧНО'))) {
        severity = 'high';
      } else if (contradictions.some(c => c.includes('компенсированная травма')) || 
                 contradictions.some(c => c.includes('социальная желательность'))) {
        severity = 'medium';
      } else if (contradictions.length > 3) {
        severity = 'medium';
      } else if (contradictions.length > 1) {
        severity = 'low';
      }
      
      console.log(`❌ checkContradictions: Обнаружены противоречия с серьезностью: ${severity}`, contradictions);
      
      return {
        detected: true,
        severity,
        details: contradictions
      };
    }
  }

  private calculateValidationScore(answers: { questionId: string; selectedOptionId: string; responseTime?: number }[]): number {
    const validationQuestionsCount = validationQuestions.length;
    const answeredValidationQuestions = answers.filter(a => 
      validationQuestions.some(vq => vq.id === a.questionId)
    );
    
    const baseScore = Math.round((answeredValidationQuestions.length / validationQuestionsCount) * 100);
    
    // НОВОЕ: Кросс-модульная валидация
    const crossValidationPenalty = this.performCrossModuleValidation(answers);
    const adjustedScore = Math.max(0, baseScore - crossValidationPenalty);
    
    if (crossValidationPenalty > 0) {
      console.log(`🔧 КРОСС-ВАЛИДАЦИЯ: Снижение валидации на ${crossValidationPenalty}% из-за межмодульных противоречий`);
    }
    
    return adjustedScore;
  }

  // Новый метод кросс-модульной валидации
  private performCrossModuleValidation(answers: { questionId: string; selectedOptionId: string; responseTime?: number }[]): number {
    let totalPenalty = 0;
    const { personalMaturity, relationshipMaturity } = this.calculateDetailedMaturity();
    const specializedData = this.extractSpecializedData();
    
    // 1. Валидация травмы vs зрелости
    // СМЯГЧЕНО: Увеличены пороги допустимых различий
    const traumaLevel = this.analyzeTraumaFromAnswers(specializedData.traumaAnswers);
    const traumaMaturityGap = Math.abs(traumaLevel - personalMaturity);
    
    if (traumaMaturityGap > 3.5) { // Увеличен порог с 2 до 3.5
      totalPenalty += 10; // Снижен штраф с 15 до 10
      console.log(`❌ Несоответствие: анализ травмы (${traumaLevel}) vs личная зрелость (${personalMaturity.toFixed(1)})`);
    }
    
    // 2. Валидация привязанности vs отношений
    // СМЯГЧЕНО: Увеличены пороги допустимых различий
    const attachmentLevel = this.analyzeAttachmentFromAnswers(specializedData.attachmentAnswers);
    const attachmentRelationshipGap = Math.abs(attachmentLevel - relationshipMaturity);
    
    if (attachmentRelationshipGap > 3.5) { // Увеличен порог с 2 до 3.5
      totalPenalty += 10; // Снижен штраф с 15 до 10
      console.log(`❌ Несоответствие: стиль привязанности (${attachmentLevel}) vs зрелость отношений (${relationshipMaturity.toFixed(1)})`);
    }
    
    // 3. Валидация границ vs средняя зрелость
    // СМЯГЧЕНО: Увеличены пороги допустимых различий
    const boundariesLevel = this.analyzeBoundariesFromAnswers(specializedData.boundariesAnswers);
    const avgMaturity = (personalMaturity + relationshipMaturity) / 2;
    const boundariesMaturityGap = Math.abs(boundariesLevel - avgMaturity);
    
    if (boundariesMaturityGap > 4) { // Увеличен порог с 2.5 до 4
      totalPenalty += 5; // Снижен штраф с 10 до 5
      console.log(`❌ Несоответствие: здоровье границ (${boundariesLevel}) vs средняя зрелость (${avgMaturity.toFixed(1)})`);
    }
    
    // 4. Валидация мотивации vs общий профиль  
    // СМЯГЧЕНО: Увеличены пороги допустимых различий
    const motivationLevel = this.analyzeMotivationFromAnswers(specializedData.motivationAnswers);
    const motivationProfileGap = Math.abs(motivationLevel - avgMaturity);
    
    if (motivationProfileGap > 4) { // Увеличен порог с 3 до 4
      totalPenalty += 5; // Снижен штраф с 10 до 5
      console.log(`❌ Несоответствие: мотивация (${motivationLevel}) vs общий профиль (${avgMaturity.toFixed(1)})`);
    }
    
    // 5. Детекция социально желательных ответов при противоречиях
    // СМЯГЧЕНО: Более строгие критерии для детекции
    const highLevelAnswers = answers.filter(answer => {
      const option = findOptionById(answer.selectedOptionId);
      return option && option.level >= 10; // Повышен порог с 9 до 10
    }).length;
    
    const highLevelRatio = highLevelAnswers / answers.length;
    if (highLevelRatio > 0.8 && totalPenalty > 25) { // Повышены пороги
      totalPenalty += 15; // Снижен штраф с 25 до 15
      console.log(`❌ Возможная социальная желательность: ${Math.round(highLevelRatio * 100)}% высоких ответов при противоречиях`);
    }
    
    return Math.min(totalPenalty, 40); // Снижен максимальный штраф с 60% до 40%
  }

  // ИСПРАВЛЕННЫЙ анализ травмы с более точной диагностикой
  private analyzeTraumaFromAnswers(traumaAnswers: string[]): number {
    if (traumaAnswers.length === 0) return 6; // Нет данных = средний уровень
    
    const activationIndicators = traumaAnswers.filter(a => 
      a.includes('activation') || a.includes('terror') || a.includes('survival') || 
      a.includes('freeze') || a.includes('hypervigilance') || a.includes('dissociation')
    ).length;
    
    const healingIndicators = traumaAnswers.filter(a => 
      a.includes('processing') || a.includes('integration') || a.includes('wisdom') ||
      a.includes('recovery') || a.includes('resilience') || a.includes('healing')
    ).length;
    
    const traumaScore = activationIndicators * 2; // Удваиваем вес активных симптомов
    const healingScore = healingIndicators;
    
    // Более точная градация
    if (traumaScore > healingScore * 2) return 1.5; // Критическая травма
    if (traumaScore > healingScore) return 3; // Активная травма
    if (healingScore > traumaScore * 1.5) return 8; // Хорошее восстановление
    if (healingScore > traumaScore) return 6; // Процесс исцеления
    return 4; // Смешанное состояние
  }

  // ИСПРАВЛЕННЫЙ анализ привязанности с лучшей детекцией избегающего типа
  private analyzeAttachmentFromAnswers(attachmentAnswers: string[]): number {
    if (attachmentAnswers.length === 0) return 6; // Нет данных = средний уровень
    
    const secureCount = attachmentAnswers.filter(a => 
      a.includes('secure') || a.includes('trusting') || a.includes('comfortable_intimacy')
    ).length;
    
    const anxiousCount = attachmentAnswers.filter(a => 
      a.includes('anxious') || a.includes('clinging') || a.includes('abandonment_fear') || a.includes('jealousy')
    ).length;
    
    const avoidantCount = attachmentAnswers.filter(a => 
      a.includes('avoidant') || a.includes('dismissive') || a.includes('emotional_distance') || 
      a.includes('independence_focus') || a.includes('vulnerability_fear')
    ).length;
    
    const disorganizedCount = attachmentAnswers.filter(a => 
      a.includes('disorganized') || a.includes('fearful') || a.includes('chaotic_patterns')
    ).length;
    
    // ИСПРАВЛЕННАЯ ЛОГИКА для избегающего типа
    if (disorganizedCount > 1) return 1.5; // Критическая дезорганизация
    if (avoidantCount > anxiousCount + secureCount) return 3.5; // Ярко выраженный избегающий тип
    if (anxiousCount > avoidantCount + secureCount) return 3; // Ярко выраженный тревожный тип
    if (avoidantCount > secureCount && avoidantCount > 1) return 4.5; // Умеренно избегающий
    if (anxiousCount > secureCount && anxiousCount > 1) return 4; // Умеренно тревожный
    if (secureCount > avoidantCount + anxiousCount) return 8.5; // Надежная привязанность
    return 5.5; // Смешанный тип
  }

  private analyzeBoundariesFromAnswers(boundariesAnswers: string[]): number {
    if (boundariesAnswers.length === 0) return 6; // Нет данных = средний уровень
    
    const healthyCount = boundariesAnswers.filter(a => a.includes('healthy') || a.includes('assertive')).length;
    const weakCount = boundariesAnswers.filter(a => a.includes('weak') || a.includes('collapse')).length;
    const rigidCount = boundariesAnswers.filter(a => a.includes('rigid') || a.includes('walls')).length;
    
    if (rigidCount > healthyCount) return 3; // Жесткие границы
    if (weakCount > healthyCount) return 3; // Слабые границы
    if (healthyCount > 0) return 8; // Здоровые границы
    return 5; // Промежуточные
  }

  private analyzeMotivationFromAnswers(motivationAnswers: string[]): number {
    if (motivationAnswers.length === 0) return 6; // Нет данных = средний уровень
    
    const survivalCount = motivationAnswers.filter(a => 
      a.includes('survival') || a.includes('fear') || a.includes('safety')
    ).length;
    
    const comfortCount = motivationAnswers.filter(a => 
      a.includes('comfort') || a.includes('stability') || a.includes('approval')
    ).length;
    
    const growthCount = motivationAnswers.filter(a => 
      a.includes('growth') || a.includes('authentic') || a.includes('development')
    ).length;
    
    const serviceCount = motivationAnswers.filter(a => 
      a.includes('service') || a.includes('transcendent') || a.includes('world')
    ).length;
    
    if (serviceCount > 0) return 11; // Трансцендентная мотивация
    if (growthCount > comfortCount + survivalCount) return 8; // Мотивация роста
    if (comfortCount > survivalCount) return 5; // Мотивация комфорта  
    if (survivalCount > 0) return 2; // Мотивация выживания
    return 6; // Смешанная мотивация
  }

  private extractSpecializedData(): {
    traumaAnswers: string[];
    attachmentAnswers: string[];
    boundariesAnswers: string[];
    jealousyAnswers: string[];
    motivationAnswers: string[];
    rawIndicators: string[];
  } {
    const traumaAnswers: string[] = [];
    const attachmentAnswers: string[] = [];
    const boundariesAnswers: string[] = [];
    const jealousyAnswers: string[] = [];
    const motivationAnswers: string[] = [];
    const rawIndicators: string[] = [];

    this.state.answers.forEach(answer => {
      const question = this.findQuestionById(answer.questionId);
      const option = findOptionById(answer.selectedOptionId);
      
      if (question && option) {
        // Собираем сырые индикаторы для анализа
        rawIndicators.push(...option.indicators);
        
        // Классифицируем ответы по типам анализа
        if (question.id === 'trauma_pattern_check') {
          traumaAnswers.push(option.id);
        }
        
        if (question.id === 'attachment_core') {
          attachmentAnswers.push(option.id);
        }
        
        if (question.id === 'boundaries_core') {
          boundariesAnswers.push(option.id);
        }
        
        if (question.id === 'jealousy_validation') {
          jealousyAnswers.push(option.id);
        }
        
        if (question.id === 'relationship_motivation') {
          motivationAnswers.push(option.id);
        }
        
        // Также проверяем индикаторы на соответствие типам
        option.indicators.forEach(indicator => {
          if (indicator.includes('trauma') || indicator.includes('terror') || indicator.includes('karmic')) {
            traumaAnswers.push(indicator);
          }
          
          if (indicator.includes('attachment') || indicator.includes('abandonment') || indicator.includes('secure')) {
            attachmentAnswers.push(indicator);
          }
          
          if (indicator.includes('boundary') || indicator.includes('boundaries') || indicator.includes('people_pleasing')) {
            boundariesAnswers.push(indicator);
          }
          
          if (indicator.includes('jealousy') || indicator.includes('possession') || indicator.includes('dramatic')) {
            jealousyAnswers.push(indicator);
          }
          
          if (indicator.includes('motivation') || indicator.includes('fear_based') || indicator.includes('love_based') || indicator.includes('co_creation')) {
            motivationAnswers.push(indicator);
          }
        });
      }
    });

    return {
      traumaAnswers: [...new Set(traumaAnswers)], // Убираем дубликаты
      attachmentAnswers: [...new Set(attachmentAnswers)],
      boundariesAnswers: [...new Set(boundariesAnswers)],
      jealousyAnswers: [...new Set(jealousyAnswers)],
      motivationAnswers: [...new Set(motivationAnswers)],
      rawIndicators: [...new Set(rawIndicators)]
    };
  }
}

// Адаптивная логика для экстремальных вопросов
const getAdaptiveExtremeQuestion = (
  history: { questionId: string; selectedOptionId: string; responseTime?: number }[],
  answeredIds: string[]
): SmartQuestion | null => {
  if (history.length < 8) return null; // Слишком мало данных
  
  // Предварительная оценка зрелости по ответам
  const personalAnswers = history.filter(answer => {
    const question = coreDiagnosticQuestions.find(q => q.id === answer.questionId);
    return question && question.aspectType === 'personal';
  });
  
  const relationshipAnswers = history.filter(answer => {
    const question = coreDiagnosticQuestions.find(q => q.id === answer.questionId);
    return question && question.aspectType === 'relationship';
  });
  
  if (personalAnswers.length < 2 || relationshipAnswers.length < 2) return null;
  
  // Вычисляем примерные уровни зрелости
  const personalLevels = personalAnswers.map(a => findOptionById(a.selectedOptionId)?.level || 6);
  const relationshipLevels = relationshipAnswers.map(a => findOptionById(a.selectedOptionId)?.level || 6);
  
  const avgPersonal = personalLevels.reduce((a, b) => a + b, 0) / personalLevels.length;
  const avgRelationship = relationshipLevels.reduce((a, b) => a + b, 0) / relationshipLevels.length;
  
  // Проверяем наличие высоких духовных/интеллектуальных показателей
  const hasHighSpiritualIndicators = history.some(answer => {
    const option = findOptionById(answer.selectedOptionId);
    return option && option.indicators.some(ind => 
      ind.includes('transcendent') || ind.includes('spiritual') || ind.includes('consciousness') || 
      ind.includes('divine') || ind.includes('sacred')
    );
  });
  
  const hasHighIntellectualIndicators = history.some(answer => {
    const option = findOptionById(answer.selectedOptionId);
    return option && option.indicators.some(ind => 
      ind.includes('analysis') || ind.includes('understanding') || ind.includes('awareness') ||
      ind.includes('pattern_recognition') || ind.includes('psychological')
    );
  });
  
  // Проверяем наличие травм/проблем в отношениях
  const hasTraumaIndicators = history.some(answer => {
    const option = findOptionById(answer.selectedOptionId);
    return option && option.indicators.some(ind => 
      ind.includes('trauma') || ind.includes('abandonment') || ind.includes('fear') ||
      ind.includes('panic') || ind.includes('survival')
    );
  });
  
  // СЦЕНАРИЙ 1: Высокая духовность + травма в отношениях
  if (hasHighSpiritualIndicators && hasTraumaIndicators && !answeredIds.includes('spiritual_vs_attachment_gap')) {
    const question = coreDiagnosticQuestions.find(q => q.id === 'spiritual_vs_attachment_gap');
    if (question) {
      console.log('🔍 getAdaptiveExtremeQuestion: Выявлен потенциал духовного развития с травмой, показываем spiritual_vs_attachment_gap');
      return question;
    }
  }
  
  // СЦЕНАРИЙ 2: Высокий интеллект + низкая эмоциональная зрелость в отношениях  
  if (hasHighIntellectualIndicators && avgRelationship < avgPersonal - 1.5 && !answeredIds.includes('intellect_vs_emotional_gap')) {
    const question = coreDiagnosticQuestions.find(q => q.id === 'intellect_vs_emotional_gap');
    if (question) {
      console.log('🔍 getAdaptiveExtremeQuestion: Выявлен разрыв интеллект-эмоции, показываем intellect_vs_emotional_gap');
      return question;
    }
  }
  
  return null;
};

// Умное определение следующего вопроса
const getNextQuestion = (
  history: { questionId: string; selectedOptionId: string; responseTime?: number }[], 
  zoneConfidence: { destructive: number; emotional: number; mature: number; transcendent: number },
  phase: 'relationship_status' | 'detection' | 'core_diagnostic' | 'clarification' | 'validation'
): SmartQuestion | null => {
  const answeredIds = history.map(qa => qa.questionId);
  
  switch (phase) {
    case 'relationship_status': {
      const unansweredStatus = relationshipStatusQuestions.filter(q => !answeredIds.includes(q.id));
      return unansweredStatus[0] || null;
    }

    case 'detection': {
      // Получаем статус отношений из истории ответов
      const relationshipStatus = getRelationshipStatusFromHistory(history);
      
      // Фильтруем вопросы по контексту отношений
      const contextualQuestions = zoneDetectionQuestions.filter(q => {
        if (!q.relationshipContext || q.relationshipContext === 'both') {
          return true; // Показываем всем
        }
        
        if (q.relationshipContext === 'in_relationship') {
          return relationshipStatus === 'in_relationship' || relationshipStatus === 'complicated';
        }
        
        if (q.relationshipContext === 'single') {
          return relationshipStatus === 'single';
        }
        
        return true;
      });
      
      const unansweredDetection = contextualQuestions.filter(q => !answeredIds.includes(q.id));
      return unansweredDetection[0] || null;
    }

    case 'core_diagnostic': {
      // Сначала показываем обычные core_diagnostic вопросы
      const standardQuestions = coreDiagnosticQuestions.filter(q => 
        !answeredIds.includes(q.id) && 
        q.aspectType !== 'combined'
      );
      
      if (standardQuestions.length > 0) {
        return standardQuestions[0];
      }
      
      // Затем проверяем, нужны ли адаптивные вопросы для экстремальных сценариев
      const extremeQuestion = getAdaptiveExtremeQuestion(history, answeredIds);
      if (extremeQuestion) {
        return extremeQuestion;
      }
      
      return null;
    }
      
    case 'clarification': {
      // Сортируем зоны по убыванию уверенности
      const sortedZones = Object.entries(zoneConfidence)
        .sort(([,a], [,b]) => b - a)
        .map(([zone]) => zone) as ('destructive' | 'emotional' | 'mature' | 'transcendent')[];
      
      console.log(`🔍 getNextQuestion CLARIFICATION: sortedZones:`, sortedZones.map(z => `${z}:${zoneConfidence[z]}`));
      console.log(`🔍 getNextQuestion CLARIFICATION: answeredIds:`, answeredIds);
      
      // Ищем неотвеченные вопросы clarification для каждой зоны по порядку
      for (const zone of sortedZones) {
        const clarificationForZone = zoneClarificationQuestions.filter(q => 
          q.targetZones?.includes(zone) && 
          !answeredIds.includes(q.id)
        );
        
        if (clarificationForZone.length > 0) {
          console.log(`🔍 getNextQuestion CLARIFICATION: найден вопрос для зоны ${zone}: ${clarificationForZone[0].id}`);
          return clarificationForZone[0];
        }
      }
      
      console.log(`🔍 getNextQuestion CLARIFICATION: вопросы закончились, возвращаем null`);
      return null;
    }
      
    case 'validation': {
      const unansweredValidation = validationQuestions.filter(q => !answeredIds.includes(q.id));
      return unansweredValidation[0] || null;
    }
      
    default:
      return null;
  }
};

// Расчет уверенности по зонам на основе ответов
const calculateZoneConfidence = (answers: { questionId: string; selectedOptionId: string; responseTime?: number }[]): { destructive: number; emotional: number; mature: number; transcendent: number } => {
  const zoneCounts = {
    destructive: 0,
    emotional: 0,
    mature: 0,
    transcendent: 0
  };
  
  answers.forEach(answer => {
    const option = findOptionById(answer.selectedOptionId);
    if (option) {
      zoneCounts[option.zone]++;
    }
  });
  
  const total = Object.values(zoneCounts).reduce((sum, count) => sum + count, 0);
  
  return {
    destructive: total > 0 ? zoneCounts.destructive / total : 0,
    emotional: total > 0 ? zoneCounts.emotional / total : 0,
    mature: total > 0 ? zoneCounts.mature / total : 0,
    transcendent: total > 0 ? zoneCounts.transcendent / total : 0
  };
};

// Вспомогательная функция для поиска опции по ID с кэшированием для оптимизации
let optionsCache: Record<string, QuestionOption> | null = null;

// Экспортируем для доступа из тестов
export const findOptionById = (optionId: string): QuestionOption | null => {
  // Инициализируем кэш при первом вызове
  if (!optionsCache) {
    console.log('📦 findOptionById: Инициализация кэша опций для оптимизации поиска');
    optionsCache = {};
    const allQuestions = [...relationshipStatusQuestions, ...zoneDetectionQuestions, ...coreDiagnosticQuestions, ...zoneClarificationQuestions, ...validationQuestions];
    
    // Заполняем кэш
    for (const question of allQuestions) {
      for (const option of question.options) {
        optionsCache[option.id] = option;
      }
    }
    console.log(`📦 findOptionById: Кэш опций создан, ${Object.keys(optionsCache).length} опций добавлено в кэш`);
  }
  
  // Быстрый поиск по ключу
  return optionsCache[optionId] || null;
};

// Вспомогательная функция для определения статуса отношений из истории ответов
const getRelationshipStatusFromHistory = (history: { questionId: string; selectedOptionId: string; responseTime?: number }[]): 'in_relationship' | 'single' | 'complicated' | null => {
  const statusAnswer = history.find(answer => answer.questionId === 'relationship_status_check');
  
  if (!statusAnswer) return null;
  
  if (statusAnswer.selectedOptionId === 'status_in_relationship') {
    return 'in_relationship';
  } else if (statusAnswer.selectedOptionId === 'status_single_ready' || statusAnswer.selectedOptionId === 'status_single_focused') {
    return 'single';
  } else if (statusAnswer.selectedOptionId === 'status_complicated') {
    return 'complicated';
  }
  
  return null;
};

// === ДЕТЕКЦИЯ ДУХОВНОГО БАЙПАСА ===
function detectSpiritualBypass(answers: { questionId: string; selectedOptionId: string }[]): boolean {
  console.log('🔍 detectSpiritualBypass: Начинаем анализ духовного байпаса');
  
  // Ключевые слова для "духовных" и "избегающих" паттернов
  const spiritualKeys = [
    'transcendent', 'spiritual', 'divine', 'sacred', 'synergy', 'service', 'conscious', 'mission',
    'enlightenment', 'awakening', 'higher_self', 'soul', 'universal'
  ];
  const avoidanceKeys = [
    'avoidance', 'control', 'fear', 'survival', 'postponed', 'status', 'self_focused', 'complicated',
    'emotional_distance', 'vulnerability_fear', 'independence_focus', 'dismissive'
  ];

  let spiritualCount = 0;
  let avoidanceCount = 0;
  let totalAnswers = 0;
  let highLevelAnswers = 0; // Уровень 9+

  for (const answer of answers) {
    const opt = findOptionById(answer.selectedOptionId);
    if (!opt) continue;
    
    totalAnswers++;
    if (opt.level >= 9) highLevelAnswers++;
    
    // Проверяем индикаторы и id
    const allFields = [opt.id, ...(opt.indicators || [])].join(' ').toLowerCase();
    
    if (spiritualKeys.some(key => allFields.includes(key))) {
      spiritualCount++;
      console.log(`🟡 detectSpiritualBypass: Духовный ответ найден: ${opt.id}`);
    }
    
    if (avoidanceKeys.some(key => allFields.includes(key))) {
      avoidanceCount++;
      console.log(`🔴 detectSpiritualBypass: Избегающий ответ найден: ${opt.id}`);
    }
  }

  // ИСПРАВЛЕННАЯ ЛОГИКА: более строгие критерии
  const spiritualRatio = spiritualCount / totalAnswers;
  const highLevelRatio = highLevelAnswers / totalAnswers;
  
  // Духовный байпас определяется если:
  // 1. Высокий процент духовных ответов (>30%) 
  // 2. И высокий процент высокоуровневых ответов (>40%)
  // 3. И есть признаки избегания (минимум 2)
  // 4. И общее количество ответов достаточно для анализа (>8)
  
  const isDetected = totalAnswers > 8 && 
                   spiritualRatio > 0.3 && 
                   highLevelRatio > 0.4 && 
                   avoidanceCount >= 2 &&
                   spiritualCount >= 4; // Абсолютное количество тоже должно быть значительным

  console.log(`🔍 detectSpiritualBypass: Статистика:`, {
    totalAnswers,
    spiritualCount,
    avoidanceCount,
    highLevelAnswers,
    spiritualRatio: (spiritualRatio * 100).toFixed(1) + '%',
    highLevelRatio: (highLevelRatio * 100).toFixed(1) + '%',
    isDetected
  });

  return isDetected;
}
