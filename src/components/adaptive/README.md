# Рефакторинговые компоненты психологического анализа

## Обзор

Данная директория содержит усовершенствованные версии компонентов психологического анализа.
Рефакторинговые компоненты заменяют устаревшие версии, имея более единообразный API, улучшенную производительность и типизацию.

## Общая структура API

Все компоненты психологического анализа имеют стандартизированный API для обеспечения единообразия и предсказуемости:

```typescript
interface BaseAnalysisProps {
  indicators: string[];           // Список индикаторов для анализа
  personalMaturity: number;       // Уровень личностной зрелости (1-12 ступеней)
  relationshipMaturity?: number;  // Уровень зрелости отношений (1-12 ступеней)
}
```

## Доступные компоненты

### AttachmentStyleAnalysisRefactored

Компонент для анализа стиля привязанности. 

**Пример использования:**

```tsx
import { AttachmentStyleAnalysisRefactored } from '../adaptive';

// В компоненте-родителе:
<AttachmentStyleAnalysisRefactored 
  indicators={['secure_attachment', 'emotional_availability']} 
  personalMaturity={7.5}
  relationshipMaturity={6.2} // Опционально
/>
```

### TraumaPatternAnalysisRefactored

Компонент для анализа паттернов травмы.

**Пример использования:**

```tsx
import { TraumaPatternAnalysisRefactored } from '../adaptive';

// В компоненте-родителе:
<TraumaPatternAnalysisRefactored 
  indicators={['childhood_trauma_activation', 'survival_fear']} 
  personalMaturity={6.3}
  relationshipMaturity={5.8} // Опционально
  traumaAnswers={[/* ответы на вопросы о травме */]} // Опционально
/>
```

### BoundariesHealthAnalysisRefactored

Компонент для анализа здоровья психологических границ.

**Пример использования:**

```tsx
import { BoundariesHealthAnalysisRefactored } from '../adaptive';

// В компоненте-родителе:
<BoundariesHealthAnalysisRefactored 
  indicators={['boundaries_awareness', 'healthy_limit_setting']} 
  personalMaturity={8.2}
  relationshipMaturity={7.5} // Опционально
  boundariesAnswers={[/* ответы на вопросы о границах */]} // Опционально
/>
```

## Добавление новых компонентов

При создании новых компонентов анализа следуйте этим рекомендациям:

1. Используйте единообразный API, наследующийся от `BaseAnalysisProps`
2. Вынесите логику расчетов в отдельный утилитарный файл
3. Используйте мемоизацию для оптимизации производительности
4. Обеспечьте полную типизацию и JSDoc документацию
5. Придерживайтесь паттерна дизайна остальных компонентов

## Расчетные утилиты

Компоненты используют следующие утилиты для анализа:

- `analyzeAttachmentStyle` в `attachment-analysis.ts`
- `analyzeTraumaPattern` в `trauma-analysis.ts`
- `analyzeBoundariesHealth` в `analysis-psychology.ts`

## Правила оформления

1. Добавьте JSDoc-комментарии к каждому компоненту и функции
2. Явно указывайте значения по умолчанию для массивов и объектов
3. Используйте типизацию из `analysis-types.ts` для согласованности
