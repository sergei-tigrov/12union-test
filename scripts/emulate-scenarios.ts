// Minimal in-memory localStorage polyfill for Node
if (typeof globalThis.localStorage === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.localStorage = {
    _data: new Map<string, string>(),
    getItem(key: string) {
      return this._data.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      this._data.set(key, value);
    },
    removeItem(key: string) {
      this._data.delete(key);
    },
    clear() {
      this._data.clear();
    }
  } as Storage;
}

import { SmartAdaptiveEngine } from "../src/utils/smart-adaptive-engine";

interface Scenario {
  name: string;
  run: () => ReturnType<SmartAdaptiveEngine["getResults"]>;
}

// Helper that walks through the engine answering according to a chooser fn
function simulate(chooser: (options: { id: string; level: number }[]) => string): ReturnType<SmartAdaptiveEngine["getResults"]> {
  const engine = new SmartAdaptiveEngine();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const next = engine.getNextQuestion();
    if (!next) break;

    const selectedOptionId = chooser(next.options);
    engine.processAnswer(next.id, selectedOptionId);

    if (engine.isTestComplete()) break;
  }

  return engine.getResults();
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

const pickAscending = (() => {
  // as questions progress, bias more towards high level
  return (options: { id: string; level: number }[], index?: number) => {
    const sorted = [...options].sort((a, b) => a.level - b.level);
    // pick based on relative progress (approx by Math.round())
    const step = Math.min(sorted.length - 1, Math.floor(Math.random() * sorted.length));
    return sorted[step].id;
  };
})();

const pickDescending = (() => {
  return (options: { id: string; level: number }[]) => {
    // reverse ascending: bias low later
    const sorted = [...options].sort((a, b) => b.level - a.level);
    const step = Math.min(sorted.length - 1, Math.floor(Math.random() * sorted.length));
    return sorted[step].id;
  };
})();

const pickRandom = (options: { id: string }[]) => {
  const index = Math.floor(Math.random() * options.length);
  return options[index].id;
};

const scenarios: Scenario[] = [
  { name: "Lowest Levels", run: () => simulate(pickLowest) },
  { name: "Highest Levels", run: () => simulate(pickHighest) },
  { name: "Alternating Low/High", run: () => simulate(pickAlternating) },
  { name: "Random", run: () => simulate(pickRandom) }
  // Ascending/Descending removed due to unpredictable question order; may require index tracking
];

function main() {
  const results = scenarios.map(s => ({ name: s.name, result: s.run() }));

  results.forEach(({ name, result }) => {
    // eslint-disable-next-line no-console
    console.log("==============================\nScenario:", name);
    // Key numbers
    console.log("Personal maturity:", result.personalMaturity);
    console.log("Relationship maturity:", result.relationshipMaturity);
    console.log("Detected zone:", result.detectedZone);
    console.log("Confidence:", result.confidence);
    console.log("Consistency:", result.consistency);
    console.log("Indicators:", result.indicators);
  });
}

main();
