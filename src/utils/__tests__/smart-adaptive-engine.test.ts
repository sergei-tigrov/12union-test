import { SmartAdaptiveEngine } from '../smart-adaptive-engine';
// Импортируем findOptionById для прямого тестирования
import { findOptionById } from '../smart-adaptive-engine';
import { relationshipStatusQuestions, zoneDetectionQuestions } from '../smart-adaptive-questions';

/**
 * Helper that fully walks through the engine answering either lowest-level or highest-level options until the test is complete.
 * @param chooseHighest when true – selects the option with the **highest** `level`, otherwise – the lowest
 */
function runEngineSimulation(chooseHighest: boolean): ReturnType<SmartAdaptiveEngine['getResults']> {
  const engine = new SmartAdaptiveEngine();

  // walk until complete
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const next = engine.getNextQuestion();
    if (!next) break;

    const chosen = chooseHighest
      ? next.options.reduce((acc, opt) => (opt.level > acc.level ? opt : acc), next.options[0])
      : next.options.reduce((acc, opt) => (opt.level < acc.level ? opt : acc), next.options[0]);

    engine.processAnswer(next.id, chosen.id);

    if (engine.isTestComplete()) break;
  }

  // we should have enough answers now; get results
  return engine.getResults();
}

/**
 * Helper that answers with specific zone-level options to test narrow ranges
 * @param targetLevel target level for answers (between 1-12)
 */
function runTargetLevelSimulation(targetLevel: number): ReturnType<SmartAdaptiveEngine['getResults']> {
  const engine = new SmartAdaptiveEngine();

  // walk until complete
  while (true) {
    const next = engine.getNextQuestion();
    if (!next) break;

    // Find option closest to targetLevel or fallback to mid-range
    const optionsWithLevels = next.options.map(opt => ({ 
      option: opt, 
      distance: Math.abs(opt.level - targetLevel) 
    }));
    
    optionsWithLevels.sort((a, b) => a.distance - b.distance);
    const chosen = optionsWithLevels[0].option;

    engine.processAnswer(next.id, chosen.id);

    if (engine.isTestComplete()) break;
  }

  return engine.getResults();
}

describe('SmartAdaptiveEngine – basic adaptive walk-through', () => {
  it('produces destructive-zone results for consistently lowest-level answers', () => {
    const result = runEngineSimulation(false);

    // personal & relationship maturity expected in lower part of the scale
    expect(result.personalMaturity).toBeLessThanOrEqual(3.5);
    expect(result.relationshipMaturity).toBeLessThanOrEqual(3.5);
    expect(result.detectedZone).toBe('destructive');
  });

  it('produces transcendent-zone results for consistently highest-level answers', () => {
    const result = runEngineSimulation(true);

    expect(result.personalMaturity).toBeGreaterThanOrEqual(9.5);
    expect(result.relationshipMaturity).toBeGreaterThanOrEqual(9.5);
    expect(result.detectedZone).toBe('transcendent');
  });

  it('fills levelDistribution for all 12 levels', () => {
    const result = runEngineSimulation(true);
    const levels = Object.keys(result.levelDistribution).map(Number);
    // should contain exactly 12 levels 1..12
    expect(levels.length).toBe(12);
    expect(Math.min(...levels)).toBe(1);
    expect(Math.max(...levels)).toBe(12);
  });
});

describe('findOptionById – optimized option lookup', () => {
  it('correctly finds existing options by ID', () => {
    // Проверка первого вызова для инициализации кэша
    const firstOption = relationshipStatusQuestions[0].options[0];
    const foundOption = findOptionById(firstOption.id);
    
    expect(foundOption).not.toBeNull();
    expect(foundOption?.id).toBe(firstOption.id);
    expect(foundOption?.text).toBe(firstOption.text);
    expect(foundOption?.level).toBe(firstOption.level);
    
    // Проверка быстрого поиска из кэша
    const randomQuestion = zoneDetectionQuestions[1]; 
    const randomOption = randomQuestion.options[2];
    const cachedOption = findOptionById(randomOption.id);
    
    expect(cachedOption).not.toBeNull();
    expect(cachedOption?.id).toBe(randomOption.id);
    expect(cachedOption?.level).toBe(randomOption.level);
  });
  
  it('returns null for non-existent option IDs', () => {
    // Сначала инициализируем кэш с существующей опцией
    findOptionById(relationshipStatusQuestions[0].options[0].id);
    
    // Теперь тестируем поиск несуществующих опций
    const nonExistentOption = findOptionById('non_existent_option_id');
    expect(nonExistentOption).toBeNull();
    
    const anotherNonExistent = findOptionById('');
    expect(anotherNonExistent).toBeNull();
  });
  
  it('handles edge cases correctly', () => {
    // Проверяем, что кэш правильно работает с похожими ID
    const option1 = findOptionById('option_1');
    const option2 = findOptionById('option_1_similar');
    
    // Они должны быть разными или хотя бы один из них должен быть null
    expect(option1 === option2).toBe(option1 === null && option2 === null);
  });
});

describe('Level ranges and zone detection', () => {
  it('correctly classifies mature-zone results (levels 7-9)', () => {
    // Тестируем уровень 8 (mature zone)
    const result = runTargetLevelSimulation(8);
    
    expect(result.personalMaturity).toBeGreaterThanOrEqual(6.5); // нижняя граница mature
    expect(result.personalMaturity).toBeLessThan(9.5); // верхняя граница mature
    expect(result.detectedZone).toBe('mature');
  });
  
  it('correctly classifies emotional-zone results (levels 4-6)', () => {
    // Тестируем уровень 5 (emotional zone)
    const result = runTargetLevelSimulation(5);
    
    expect(result.personalMaturity).toBeGreaterThanOrEqual(3.5); // нижняя граница emotional
    expect(result.personalMaturity).toBeLessThan(6.5); // верхняя граница emotional
    expect(result.detectedZone).toBe('emotional');
  });
  
  it('maintains level boundaries integrity', () => {
    // Проверка, что границы между зонами соблюдаются
    const destructiveResult = runTargetLevelSimulation(2);
    const emotionalResult = runTargetLevelSimulation(5);
    const matureResult = runTargetLevelSimulation(8);
    const transcendentResult = runTargetLevelSimulation(11);
    
    // Проверяем правильные зоны
    expect(destructiveResult.detectedZone).toBe('destructive');
    expect(emotionalResult.detectedZone).toBe('emotional');
    expect(matureResult.detectedZone).toBe('mature');
    expect(transcendentResult.detectedZone).toBe('transcendent');
    
    // Проверяем правильные границы между зонами
    expect(destructiveResult.personalMaturity).toBeLessThanOrEqual(3.5);
    expect(emotionalResult.personalMaturity).toBeGreaterThanOrEqual(3.5);
    expect(emotionalResult.personalMaturity).toBeLessThan(6.5);
    expect(matureResult.personalMaturity).toBeGreaterThanOrEqual(6.5);
    expect(matureResult.personalMaturity).toBeLessThan(9.5);
    expect(transcendentResult.personalMaturity).toBeGreaterThanOrEqual(9.5);
  });
});

describe('Social desirability penalty', () => {
  // Создаем тестовый движок для проверки конкретных методов
  let engine: SmartAdaptiveEngine;
  
  beforeEach(() => {
    engine = new SmartAdaptiveEngine();
  });
  
  it('does not apply excessive penalty for normal answers', () => {
    // Тестируем встроенный метод detectSocialDesirability
    // с разумными ответами, что не должно привести к большому штрафу
    
    // Имитируем обычные смешанные ответы
    const normalAnswers = [
      { questionId: 'q1', selectedOptionId: 'opt_level_5' },
      { questionId: 'q2', selectedOptionId: 'opt_level_7' },
      { questionId: 'q3', selectedOptionId: 'opt_level_4' },
      { questionId: 'q4', selectedOptionId: 'opt_level_8' },
      { questionId: 'q5', selectedOptionId: 'opt_level_6' }
    ];
    
    // @ts-ignore: Вызов приватного метода для тестирования
    const penalty = engine.detectSocialDesirability(normalAnswers);
    
    // Штраф не должен превышать определенного порога для нормальных ответов
    expect(penalty).toBeLessThanOrEqual(0.3); // Допустимый небольшой штраф
  });
  
  it('correctly identifies and penalizes extreme socially desirable answers', () => {
    // Запустим полную симуляцию с высокими ответами для проверки наличия штрафа
    const result = runEngineSimulation(true);
    
    // Проверяем, что для очень высоких ответов применяется разумный штраф
    // через validationScore
    expect(result.validationScore).toBeLessThan(1.0);
    // При этом результат должен все равно быть в высокой зоне
    expect(result.detectedZone).toBe('transcendent');
  });
});
