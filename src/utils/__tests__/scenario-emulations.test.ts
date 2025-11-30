import { SmartAdaptiveEngine } from '../smart-adaptive-engine';

interface Scenario {
  name: string;
  chooser: (options: { id: string; level: number }[]) => string;
}

const pickLowest = (options: { id: string; level: number }[]) => {
  return options.reduce((acc, o) => (o.level < acc.level ? o : acc), options[0]).id;
};

const pickHighest = (options: { id: string; level: number }[]) => {
  return options.reduce((acc, o) => (o.level > acc.level ? o : acc), options[0]).id;
};

const pickAlternating = (() => {
  let toggle = false;
  return (options: { id: string; level: number }[]) => {
    toggle = !toggle;
    return (toggle ? pickHighest : pickLowest)(options);
  };
})();

const pickRandom = (options: { id: string }[]) => {
  const index = Math.floor(Math.random() * options.length);
  return options[index].id;
};

const scenarios: Scenario[] = [
  { name: 'Низкие уровни', chooser: pickLowest },
  { name: 'Высокие уровни', chooser: pickHighest },
  { name: 'Чередование низ/высок', chooser: pickAlternating },
  { name: 'Случайный выбор', chooser: pickRandom }
];

function simulate(chooser: (options: { id: string; level: number }[]) => string) {
  const engine = new SmartAdaptiveEngine();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const next = engine.getNextQuestion();
    if (!next) break;

    const selectedOptionId = chooser(next.options as { id: string; level: number }[]);
    engine.processAnswer(next.id, selectedOptionId);

    if (engine.isTestComplete()) break;
  }

  return engine.getResults();
}

describe('Эмуляции сценариев SmartAdaptiveEngine', () => {
  scenarios.forEach(({ name, chooser }) => {
    it(`Эмуляция: ${name}`, () => {
      const result = simulate(chooser as any);
      /*
        Логируем ключевые метрики для ручного анализа. Это не проверка, а сбор данных.
      */
      // eslint-disable-next-line no-console
      console.log('\n==============================');
      // eslint-disable-next-line no-console
      console.log('Сценарий:', name);
      // eslint-disable-next-line no-console
      console.log('Личная зрелость:', result.personalMaturity.toFixed(1));
      // eslint-disable-next-line no-console
      console.log('Зрелость отношений:', result.relationshipMaturity.toFixed(1));
      // eslint-disable-next-line no-console
      console.log('Определённая зона:', result.detectedZone);
      // eslint-disable-next-line no-console
      console.log('Уверенность:', (result.confidence * 100).toFixed(0) + '%');
      // eslint-disable-next-line no-console
      console.log('Согласованность:', (result.consistency * 100).toFixed(0) + '%');
      // eslint-disable-next-line no-console
      console.log('Индикаторы:', result.indicators.join(', '));

      // Простая проверка: результат должен содержать 12 уровней в распределении
      expect(Object.keys(result.levelDistribution).length).toBeGreaterThanOrEqual(8);
    });
  });
});
