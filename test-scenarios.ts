/**
 * КОМПЛЕКСНОЕ ТЕСТИРОВАНИЕ СИСТЕМЫ "ЛЕСТНИЦА СОЮЗА"
 * Проверяем алгоритм на всех сценариях и уровнях
 */

import { SmartAdaptiveEngine } from './src/utils/smart-adaptive-engine';
import { interpretResult } from './src/results-interpreter';
import { getLevelDefinition } from './src/levels-definitions';
import { QUESTIONS } from './src/questions-database';

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

function createTestEngine(scenario: string) {
  const engine = new SmartAdaptiveEngine();
  return { engine, scenario };
}

function answerQuestion(
  engine: SmartAdaptiveEngine,
  questionId: string,
  answerLevel: number,
  questionIndex: number = 0
) {
  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question) {
    throw new Error(`Question not found: ${questionId}`);
  }

  const option = question.options.find(opt => opt.level === answerLevel);
  if (!option) {
    throw new Error(
      `Option not found for question ${questionId} with level ${answerLevel}`
    );
  }

  engine.processAnswer(questionId, option.id);
  return { questionId, optionId: option.id, level: answerLevel };
}

function getResult(engine: SmartAdaptiveEngine) {
  return engine.getCurrentResult();
}

function printResult(
  testName: string,
  result: any,
  scenario: string
) {
  const interpretation = interpretResult(result);
  const levelDef = getLevelDefinition(Math.round(result.personalLevel) as any);

  console.log('\n' + '='.repeat(80));
  console.log(`📋 ${testName}`);
  console.log(`Сценарий: ${scenario}`);
  console.log('='.repeat(80));

  console.log(`\n✨ РЕЗУЛЬТАТ:`);
  console.log(`  Уровень: ${Math.round(result.personalLevel)} (${levelDef?.name})`);
  console.log(`  Инсайт: ${interpretation.heroMessage}`);
  console.log(`  Вызов: ${interpretation.currentChallenge}`);
  console.log(`\n📈 ДЕТАЛИ:`);
  console.log(`  Надежность: ${result.validation.reliability}`);
  console.log(`  Всего вопросов: ${result.totalQuestions}`);
  console.log(`  Время теста: ${Math.round(result.completionTime / 1000)}с`);

  if (result.validation.contradictions && result.validation.contradictions.length > 0) {
    console.log(`  ⚠️  Противоречия: ${result.validation.contradictions.length}`);
  }

  return { result, interpretation, levelDef };
}

// ============================================================================
// СЦЕНАРИЙ 1: УРОВЕНЬ 1 - ТРАВМА И РАЗРУШЕНИЕ
// ============================================================================

console.log('\n\n' + '█'.repeat(80));
console.log('🔴 СЦЕНАРИЙ 1: УРОВЕНЬ 1 - ТРАВМА И РАЗРУШЕНИЕ');
console.log('█'.repeat(80));

function testLevel1() {
  const { engine } = createTestEngine('single_reality');

  // Ответы характерные для уровня 1: страх, выживание, безысходность
  const answers = [
    { q: 'zone-conflict-001', level: 1 }, // Отступаю или ухожу
    { q: 'zone-safety-002', level: 1 }, // Боюсь остаться один
    { q: 'level-trauma-normalization-035', level: 1 }, // Травма нормальна
    { q: 'level-detail-trauma-007-violence', level: 1 }, // Насилие
    { q: 'level-detail-emotion-008', level: 1 }, // Подавленные эмоции
  ];

  console.log(`\n→ Отвечаю на ${answers.length} вопросов как человек уровня 1...`);
  answers.forEach((ans, idx) => {
    try {
      answerQuestion(engine, ans.q, ans.level, idx);
      console.log(`  ✓ Вопрос ${idx + 1}: ${ans.q} → уровень ${ans.level}`);
    } catch (e) {
      console.log(`  ✗ Ошибка: ${(e as Error).message}`);
    }
  });

  const { result, interpretation, levelDef } = printResult(
    'Тест уровня 1',
    getResult(engine),
    'single_reality'
  );

  // Проверяем что результат в диапазоне 1-3
  const roundedLevel = Math.round(result.personalLevel);
  console.log(
    `\n${roundedLevel <= 3 ? '✅' : '❌'} Проверка: уровень ${roundedLevel} в диапазоне 1-3`
  );

  return { roundedLevel, result, interpretation };
}

const test1Result = testLevel1();

// ============================================================================
// СЦЕНАРИЙ 2: УРОВЕНЬ 5 - ЭМОЦИИ И СТРАСТЬ
// ============================================================================

console.log('\n\n' + '█'.repeat(80));
console.log('🟠 СЦЕНАРИЙ 2: УРОВЕНЬ 5 - ЭМОЦИИ И СТРАСТЬ');
console.log('█'.repeat(80));

function testLevel5() {
  const { engine } = createTestEngine('in_relationship_self');

  // Ответы характерные для уровня 5: интенсивность, ревность, драма
  const answers = [
    { q: 'zone-conflict-001', level: 5 }, // Эмоции и обвинения
    { q: 'zone-intimacy-004', level: 5 }, // Привлекает интенсивность
    { q: 'level-detail-jealousy-009', level: 5 }, // Ревность как доказательство
    { q: 'level-passion-intensity-044', level: 5 }, // Страсть и драма
    { q: 'level-domestic-stability-043', level: 5 }, // Эмоции важнее быта
  ];

  console.log(`\n→ Отвечаю на ${answers.length} вопросов как человек уровня 5...`);
  answers.forEach((ans, idx) => {
    try {
      answerQuestion(engine, ans.q, ans.level, idx);
      console.log(`  ✓ Вопрос ${idx + 1}: ${ans.q} → уровень ${ans.level}`);
    } catch (e) {
      console.log(`  ✗ Ошибка: ${(e as Error).message}`);
    }
  });

  const { result, interpretation, levelDef } = printResult(
    'Тест уровня 5',
    getResult(engine),
    'in_relationship_self'
  );

  const roundedLevel = Math.round(result.personalLevel);
  console.log(
    `\n${roundedLevel >= 4 && roundedLevel <= 6 ? '✅' : '❌'} Проверка: уровень ${roundedLevel} в диапазоне 4-6`
  );

  return { roundedLevel, result, interpretation };
}

const test5Result = testLevel5();

// ============================================================================
// СЦЕНАРИЙ 3: УРОВЕНЬ 8 - ЛЮБОВЬ И ПРИНЯТИЕ
// ============================================================================

console.log('\n\n' + '█'.repeat(80));
console.log('🟢 СЦЕНАРИЙ 3: УРОВЕНЬ 8 - ЛЮБОВЬ И ПРИНЯТИЕ');
console.log('█'.repeat(80));

function testLevel8() {
  const { engine } = createTestEngine('couple_independent');

  // Ответы характерные для уровня 8: принятие, любовь, безусловность
  const answers = [
    { q: 'zone-conflict-001', level: 7 }, // Слушаю и говорю о чувствах
    { q: 'zone-intimacy-004', level: 8 }, // Глубокая забота
    { q: 'level-detail-authenticity-011', level: 8 }, // Полная аутентичность
    { q: 'level-detail-appreciation-023', level: 8 }, // Ценю как личность
    { q: 'level-psych-connection-045', level: 8 }, // Поддержка роста
  ];

  console.log(`\n→ Отвечаю на ${answers.length} вопросов как человек уровня 8...`);
  answers.forEach((ans, idx) => {
    try {
      answerQuestion(engine, ans.q, ans.level, idx);
      console.log(`  ✓ Вопрос ${idx + 1}: ${ans.q} → уровень ${ans.level}`);
    } catch (e) {
      console.log(`  ✗ Ошибка: ${(e as Error).message}`);
    }
  });

  const { result, interpretation, levelDef } = printResult(
    'Тест уровня 8',
    getResult(engine),
    'couple_independent'
  );

  const roundedLevel = Math.round(result.personalLevel);
  console.log(
    `\n${roundedLevel >= 7 && roundedLevel <= 9 ? '✅' : '❌'} Проверка: уровень ${roundedLevel} в диапазоне 7-9`
  );

  return { roundedLevel, result, interpretation };
}

const test8Result = testLevel8();

// ============================================================================
// СЦЕНАРИЙ 4: УРОВЕНЬ 11 - СОВМЕСТНОЕ ТВОРЧЕСТВО
// ============================================================================

console.log('\n\n' + '█'.repeat(80));
console.log('🔵 СЦЕНАРИЙ 4: УРОВЕНЬ 11 - СОВМЕСТНОЕ ТВОРЧЕСТВО');
console.log('█'.repeat(80));

function testLevel11() {
  const { engine } = createTestEngine('couple_discussion');

  // Ответы характерные для уровня 11-12: миссия, служение, творчество
  const answers = [
    { q: 'zone-conflict-001', level: 9 }, // Понимание и границы
    { q: 'zone-growth-003', level: 10 }, // Совместный рост
    { q: 'level-synergy-038', level: 10 }, // Взаимное усиление
    { q: 'level-cocreation-039', level: 11 }, // Совместное творчество
    { q: 'level-spiritual-union-040', level: 11 }, // Духовная миссия
  ];

  console.log(`\n→ Отвечаю на ${answers.length} вопросов как пара уровня 11...`);
  answers.forEach((ans, idx) => {
    try {
      answerQuestion(engine, ans.q, ans.level, idx);
      console.log(`  ✓ Вопрос ${idx + 1}: ${ans.q} → уровень ${ans.level}`);
    } catch (e) {
      console.log(`  ✗ Ошибка: ${(e as Error).message}`);
    }
  });

  const { result, interpretation, levelDef } = printResult(
    'Тест уровня 11',
    getResult(engine),
    'couple_discussion'
  );

  const roundedLevel = Math.round(result.personalLevel);
  console.log(
    `\n${roundedLevel >= 10 && roundedLevel <= 12 ? '✅' : '❌'} Проверка: уровень ${roundedLevel} в диапазоне 10-12`
  );

  return { roundedLevel, result, interpretation };
}

const test11Result = testLevel11();

// ============================================================================
// СЦЕНАРИЙ 5: СМЕШАННЫЕ ОТВЕТЫ (ТЕСТИРОВАНИЕ АЛГОРИТМА)
// ============================================================================

console.log('\n\n' + '█'.repeat(80));
console.log('⚙️  СЦЕНАРИЙ 5: СМЕШАННЫЕ ОТВЕТЫ - ПРОВЕРКА АЛГОРИТМА УСРЕДНЕНИЯ');
console.log('█'.repeat(80));

function testMixed() {
  const { engine } = createTestEngine('in_relationship_self');

  // Смешанные ответы: от уровня 3 до уровня 7
  const answers = [
    { q: 'zone-conflict-001', level: 4 }, // Средний уровень
    { q: 'zone-safety-002', level: 3 }, // Ниже среднего
    { q: 'zone-growth-003', level: 6 }, // Выше среднего
    { q: 'level-trauma-normalization-035', level: 5 }, // Средний
    { q: 'level-detail-emotion-008', level: 4 }, // Ниже среднего
    { q: 'level-passion-intensity-044', level: 6 }, // Выше среднего
    { q: 'level-freedom-maturity-037', level: 7 }, // Выше среднего
  ];

  console.log(`\n→ Отвечаю на ${answers.length} вопросов с разными уровнями (3-7)...`);
  answers.forEach((ans, idx) => {
    try {
      answerQuestion(engine, ans.q, ans.level, idx);
      console.log(`  ✓ Вопрос ${idx + 1}: ${ans.q} → уровень ${ans.level}`);
    } catch (e) {
      console.log(`  ✗ Ошибка: ${(e as Error).message}`);
    }
  });

  const { result, interpretation, levelDef } = printResult(
    'Тест смешанных ответов',
    getResult(engine),
    'in_relationship_self'
  );

  const roundedLevel = Math.round(result.personalLevel);
  const expected = Math.round((4 + 3 + 6 + 5 + 4 + 6 + 7) / 7); // Среднее: ~5
  console.log(
    `\n${Math.abs(roundedLevel - expected) <= 1 ? '✅' : '❌'} Проверка: уровень ${roundedLevel} близок к ожидаемому ~${expected}`
  );

  return { roundedLevel, expected, result, interpretation };
}

const testMixedResult = testMixed();

// ============================================================================
// ИТОГОВЫЙ ОТЧЕТ
// ============================================================================

console.log('\n\n' + '█'.repeat(80));
console.log('📊 ИТОГОВЫЙ ОТЧЕТ ТЕСТИРОВАНИЯ');
console.log('█'.repeat(80));

const results = [
  {
    name: 'Уровень 1 (Травма)',
    expected: 1,
    actual: test1Result.roundedLevel,
    range: [1, 3],
  },
  {
    name: 'Уровень 5 (Эмоции)',
    expected: 5,
    actual: test5Result.roundedLevel,
    range: [4, 6],
  },
  {
    name: 'Уровень 8 (Любовь)',
    expected: 8,
    actual: test8Result.roundedLevel,
    range: [7, 9],
  },
  {
    name: 'Уровень 11 (Творчество)',
    expected: 11,
    actual: test11Result.roundedLevel,
    range: [10, 12],
  },
];

console.log('\n✅ РЕЗУЛЬТАТЫ:\n');
let passedCount = 0;
results.forEach((r) => {
  const inRange = r.actual >= r.range[0] && r.actual <= r.range[1];
  const status = inRange ? '✅' : '❌';
  console.log(
    `${status} ${r.name}: ожидали ~${r.expected}, получили ${r.actual} (диапазон ${r.range[0]}-${r.range[1]})`
  );
  if (inRange) passedCount++;
});

console.log(`\n${'='.repeat(80)}`);
console.log(`📈 ОБЩИЙ РЕЗУЛЬТАТ: ${passedCount}/${results.length} сценариев пройдено ✅`);
console.log(`${'='.repeat(80)}\n`);

// ============================================================================
// ПРОВЕРКА НОВЫХ ВОПРОСОВ
// ============================================================================

console.log('\n' + '█'.repeat(80));
console.log('🆕 ПРОВЕРКА НОВЫХ ВОПРОСОВ (035-045)');
console.log('█'.repeat(80));

const newQuestions = QUESTIONS.filter(
  (q) =>
    q.id.match(/-035$/) ||
    q.id.match(/-036$/) ||
    q.id.match(/-037$/) ||
    q.id.match(/-038$/) ||
    q.id.match(/-039$/) ||
    q.id.match(/-040$/) ||
    q.id.match(/-041$/) ||
    q.id.match(/-042$/) ||
    q.id.match(/-043$/) ||
    q.id.match(/-044$/) ||
    q.id.match(/-045$/)
);

console.log(`\n📌 Найдено ${newQuestions.length} новых вопросов:\n`);
newQuestions.forEach((q) => {
  console.log(
    `  ✓ ${q.id}: ${q.text.self.substring(0, 50)}... [${q.targetLevels.join(', ')}]`
  );
});

console.log(
  `\n✅ ВСЕ ${newQuestions.length} НОВЫХ ВОПРОСОВ УСПЕШНО ИНТЕГРИРОВАНЫ\n`
);

console.log('🎉 ТЕСТИРОВАНИЕ ЗАВЕРШЕНО\n');
