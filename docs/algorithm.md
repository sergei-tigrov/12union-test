# Алгоритм функции `calculateResult`

Функция `calculateResult` предназначена для анализа ответов пользователя в диагностическом тесте "12 Союз" и вычисления итоговых результатов. Она определяет ключевые уровни развития личных качеств и качеств в отношениях, а также предоставляет обобщенную картину состояния пользователя.

## Входные данные

Функция принимает на вход массив объектов `Answer[]`, где каждый объект представляет ответ пользователя на один из вопросов и имеет следующую структуру:

```typescript
interface MultipleChoiceAnswer {
  questionId: number;
  answerType: 'multipleChoice';
  selectedLevelId: number; // ID уровня, выбранного пользователем
}

interface ScalingAnswer {
  questionId: number;
  answerType: 'scaling';
  value: number; // Значение, выбранное пользователем на шкале
}

export type Answer = MultipleChoiceAnswer | ScalingAnswer;
```

## Выходные данные

Функция возвращает объект `TestResult`, содержащий следующие поля:

```typescript
export interface TestResult {
  personalLevelId: number;       // Доминирующий уровень личного развития
  relationshipLevelId: number; // Доминирующий уровень развития отношений
  dominantLevel: number;         // Общий доминирующий уровень (наиболее частый из всех ответов)
  trend: 'up' | 'down' | 'stable'; // Тренд развития (сравнение personal и relationship)
  distribution: Array<{        // Распределение ответов по уровням
    levelId: number;
    levelName: string;
    personalCount: number;
    relationshipCount: number;
    totalCount: number; // Сумма очков для уровня от всех типов вопросов
    description: string;
  }>;
  strengths: string[];           // Сильные стороны (описания доминирующих уровней)
  areasToImprove: string[];      // Зоны роста (описания уровней ниже доминирующих)
}
```

## Логика работы

1.  **Инициализация**: 
    *   Создается карта `levelCounts` для подсчета очков (`personal`, `relationship`, `total`) для каждого уровня.
    *   Все уровни из `levels.ts` добавляются в `levelCounts` с начальными нулевыми значениями.

2.  **Обработка ответов**:
    *   Функция итерирует по каждому ответу пользователя.
    *   Для каждого ответа находится соответствующий вопрос в `questions.ts`.
    *   Если вопрос не найден или тип ответа не соответствует типу вопроса, ответ игнорируется (с выводом предупреждения в консоль).

    *   **Для вопросов типа `multipleChoice`**:
        *   Определяется, к какому блоку принадлежит вопрос (`A` - личный, `B` - отношения).
        *   Если Блок `A`: `personalCount` для `selectedLevelId` увеличивается на 1.
        *   Если Блок `B`: `relationshipCount` для `selectedLevelId` увеличивается на 1.
        *   В обоих случаях `totalCount` для `selectedLevelId` увеличивается на 1.

    *   **Для вопросов типа `scaling` (Блок `C`)**:
        *   Ответ пользователя (`value`) на шкале (например, от 1 до 5) определяет, как распределяется 1 очко между `lowEndLevelId` и `highEndLevelId`, указанными для этого вопроса.
        *   Рассчитываются веса: `weightForHighEnd = (value - scaleMin) / (scaleMax - scaleMin)` и `weightForLowEnd = 1 - weightForHighEnd`.
        *   `totalCount` для `lowEndLevelId` увеличивается на `weightForLowEnd`.
        *   `totalCount` для `highEndLevelId` увеличивается на `weightForHighEnd`.
        *   Ответы на масштабируемые вопросы не влияют напрямую на `personalCount` или `relationshipCount`, только на `totalCount`.

3.  **Определение доминирующих уровней**:
    *   `personalLevelId`: Определяется как `levelId` с наибольшим `personalCount`. Если таких несколько или нет ответов Блока А, по умолчанию используется уровень 1.
    *   `relationshipLevelId`: Определяется как `levelId` с наибольшим `relationshipCount`. Если таких несколько или нет ответов Блока B, по умолчанию используется уровень 1.
    *   `dominantLevel`: Определяется как `levelId` с наибольшим `totalCount` из всех уровней. Приоритет отдается более высокому уровню в случае равенства очков. Если нет ответов, по умолчанию 1.

4.  **Определение тренда (`trend`)**:
    *   Сравниваются `personalLevelId` и `relationshipLevelId`.
    *   Если `personalLevelId < relationshipLevelId`, тренд - `up`.
    *   Если `personalLevelId > relationshipLevelId`, тренд - `down`.
    *   Иначе тренд - `stable`.

5.  **Формирование `distribution`**:
    *   Преобразует карту `levelCounts` в массив объектов, добавляя `levelName` и `description` из `levels.ts`.

6.  **Определение сильных сторон (`strengths`) и зон роста (`areasToImprove`)**:
    *   `strengths`: Включает описания `personalLevelId`, `relationshipLevelId` и `dominantLevel` (если они разные).
    *   `areasToImprove`: Включает описания уровней, которые ниже `dominantLevel` и имеют `totalCount > 0`.

## Обработка некорректных данных

*   **Несуществующий `questionId`**: Ответ игнорируется, выводится предупреждение.
*   **Несоответствие `answerType` и типа вопроса**: Ответ игнорируется, выводится предупреждение.
*   **Пустой массив ответов**: Функция вернет результат с уровнями по умолчанию (обычно уровень 1).
