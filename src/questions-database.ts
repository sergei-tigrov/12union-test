/**
 * БАЗА ДАННЫХ ВОПРОСОВ "ЛЕСТНИЦА СОЮЗА"
 * 34 вопроса для адаптивного определения уровня психологической зрелости
 *
 * Структура:
 * - Вопросы зонирования (6 вопросов) - быстрое определение приблизительной зоны (1-4, 5-8, 9-12)
 * - Вопросы уточнения (22 вопроса) - детальное определение конкретного уровня
 * - Вопросы валидации (6 вопросов) - обнаружение противоречий и духовного байпаса
 *
 * Каждый вопрос имеет варианты для 4 режимов:
 * - self: самооценка (для одиноких и для пар)
 * - partner_assessment: оценка партнера
 * - potential: оценка потенциала (для одиноких)
 * - pair_discussion: совместное обсуждение (для пар)
 */

import { SmartQuestion, UnionLevel } from './types';

export const QUESTIONS: SmartQuestion[] = [
  // ============================================================================
  // БЛОК ЗОНИРОВАНИЯ (6 вопросов) - быстрое определение зоны 1-4, 5-8 или 9-12
  // ============================================================================

  {
    id: 'zone-conflict-001',
    text: {
      self: 'Когда между вами возникает конфликт, вы обычно:',
      partner: 'Когда возникает конфликт, мой партнер обычно:',
      potential: 'В идеальных отношениях при конфликте я бы:',
      pair_discussion: 'Когда между нами возникает конфликт, мы обычно:',
    },
    category: 'conflict',
    options: [
      {
        id: 'zone-c-a',
        text: 'Отступаю или ухожу, чтобы избежать боли',
        level: 1,
        indicators: ['avoidance', 'fear', 'pain-avoidance'],
      },
      {
        id: 'zone-c-b',
        text: 'Защищаюсь, доказываю свою правоту',
        level: 4,
        indicators: ['defensiveness', 'logic-based', 'control'],
      },
      {
        id: 'zone-c-c',
        text: 'Испытываю сильные эмоции, бросаю обвинения',
        level: 5,
        indicators: ['emotional-intensity', 'blame', 'passion'],
      },
      {
        id: 'zone-c-d',
        text: 'Говорю о своих чувствах и слушаю партнера',
        level: 7,
        indicators: ['vulnerability', 'listening', 'emotional-awareness'],
      },
      {
        id: 'zone-c-e',
        text: 'Стараюсь понять, что нужно партнеру, и высказываю свои границы',
        level: 9,
        indicators: ['empathy', 'boundaries', 'understanding'],
      },
    ],
    targetLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    priority: 1, // Критичный вопрос - различает все основные зоны
  },

  {
    id: 'zone-safety-002',
    text: {
      self: 'Я остаюсь в отношениях даже если больно, потому что:',
      partner: 'Мой партнер остается в отношениях, потому что:',
      potential: 'Я бы был в отношениях только если бы:',
      pair_discussion: 'Мы остаемся вместе, потому что:',
    },
    category: 'values',
    options: [
      {
        id: 'zone-s-a',
        text: 'Боюсь остаться один, это хуже чем боль',
        level: 1,
        indicators: ['fear-of-loneliness', 'desperation', 'no-choice'],
      },
      {
        id: 'zone-s-b',
        text: 'Не могу справиться без партнера, зависим экономически',
        level: 3,
        indicators: ['dependency', 'economic-fear', 'helplessness'],
      },
      {
        id: 'zone-s-c',
        text: 'Это удобно, стабильно, мне это нравится',
        level: 4,
        indicators: ['comfort-seeking', 'stability', 'pragmatism'],
      },
      {
        id: 'zone-s-d',
        text: 'Люблю эту интенсивность, это волнует',
        level: 5,
        indicators: ['emotional-intensity', 'passion-seeking', 'excitement'],
      },
      {
        id: 'zone-s-e',
        text: 'Это приносит удовлетворение, делает меня лучше',
        level: 8,
        indicators: ['growth', 'fulfillment', 'positive-influence'],
      },
      {
        id: 'zone-s-f',
        text: 'Это ощущается как высшая ценность, служу его развитию',
        level: 11,
        indicators: ['transcendence', 'purpose', 'service'],
      },
    ],
    targetLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priority: 1,
  },

  {
    id: 'zone-growth-003',
    text: {
      self: 'Мой партнер влияет на мое развитие:',
      partner: 'Я влияю на развитие своего партнера:',
      potential: 'Идеальный партнер бы помогал мне:',
      pair_discussion: 'Мы помогаем друг другу развиваться:',
    },
    category: 'growth',
    options: [
      {
        id: 'zone-g-a',
        text: 'Нет, мне некогда думать о развитии, нужно выжить',
        level: 1,
        indicators: ['survival-mode', 'no-energy', 'trauma-focused'],
      },
      {
        id: 'zone-g-b',
        text: 'Влияет, но повторяя то, что было в семье',
        level: 2,
        indicators: ['karmic-patterns', 'unconscious', 'repetition'],
      },
      {
        id: 'zone-g-c',
        text: 'Не очень, мы живем рядом, но в своих мирах',
        level: 3,
        indicators: ['parallel-lives', 'disconnection', 'separate-worlds'],
      },
      {
        id: 'zone-g-d',
        text: 'Помогает практически, показывает пример',
        level: 7,
        indicators: ['modeling', 'practical-support', 'inspiration'],
      },
      {
        id: 'zone-g-e',
        text: 'Да, мы вместе растем, видим потенциал друг друга',
        level: 9,
        indicators: ['mutual-growth', 'recognition', 'shared-development'],
      },
      {
        id: 'zone-g-f',
        text: 'Абсолютно, вместе создаем новое и помогаем другим',
        level: 11,
        indicators: ['synergy', 'co-creation', 'service-to-others'],
      },
    ],
    targetLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priority: 1,
  },

  {
    id: 'zone-intimacy-004',
    text: {
      self: 'В интимной близости с партнером я чувствую:',
      partner: 'Мой партнер в интимной близости показывает:',
      potential: 'Я хотел бы чувствовать в интимной жизни:',
      pair_discussion: 'В интимной жизни между нами:',
    },
    category: 'intimacy',
    options: [
      {
        id: 'zone-i-a',
        text: 'Страх, боль, небезопасность',
        level: 1,
        indicators: ['fear', 'pain', 'trauma-response'],
      },
      {
        id: 'zone-i-b',
        text: 'Нужно выполнять роль, обязательства',
        level: 4,
        indicators: ['duty', 'obligation', 'role-performance'],
      },
      {
        id: 'zone-i-c',
        text: 'Страсть и волнение, потом опустошение',
        level: 5,
        indicators: ['passion', 'intensity', 'emotional-rollercoaster'],
      },
      {
        id: 'zone-i-d',
        text: 'Близость, но без полной уязвимости',
        level: 6,
        indicators: ['facade', 'partial-connection', 'image-consciousness'],
      },
      {
        id: 'zone-i-e',
        text: 'Безопасность, доверие, полную себя',
        level: 7,
        indicators: ['safety', 'trust', 'authenticity'],
      },
      {
        id: 'zone-i-f',
        text: 'Служение и дарение, священное единство',
        level: 12,
        indicators: ['transcendence', 'service', 'spiritual-connection'],
      },
    ],
    targetLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priority: 1,
  },

  {
    id: 'zone-choice-005',
    text: {
      self: 'Я остался с этим партнером потому что:',
      partner: 'Мой партнер со мной потому что:',
      potential: 'В идеальных отношениях партнер выбирал бы меня:',
      pair_discussion: 'Мы вместе потому что:',
    },
    category: 'values',
    options: [
      {
        id: 'zone-ch-a',
        text: 'Потому что не видел выхода, не было других вариантов',
        level: 1,
        indicators: ['no-choice', 'trapped', 'desperation'],
      },
      {
        id: 'zone-ch-b',
        text: 'Исторически так сложилось, трудно менять',
        level: 2,
        indicators: ['inertia', 'habituation', 'karmic'],
      },
      {
        id: 'zone-ch-c',
        text: 'Нужна экономическая поддержка и безопасность',
        level: 3,
        indicators: ['survival', 'economic-dependency', 'fear-of-loneliness'],
      },
      {
        id: 'zone-ch-d',
        text: 'Все работает хорошо, комфортно и привычно',
        level: 4,
        indicators: ['comfort', 'pragmatism', 'stability'],
      },
      {
        id: 'zone-ch-e',
        text: 'Потому что люблю, испытываю сильные чувства',
        level: 5,
        indicators: ['passion', 'emotional-attachment', 'intensity'],
      },
      {
        id: 'zone-ch-f',
        text: 'Потому что это подходит нашему имиджу и окружению',
        level: 6,
        indicators: ['social-status', 'facade', 'image'],
      },
      {
        id: 'zone-ch-g',
        text: 'Потому что нас дополняют и понимают друг друга',
        level: 7,
        indicators: ['understanding', 'complementarity', 'psychological-safety'],
      },
      {
        id: 'zone-ch-h',
        text: 'Потому что развиваюсь и становлюсь лучше, в отношениях',
        level: 9,
        indicators: ['growth', 'mutual-inspiration', 'positive-influence'],
      },
      {
        id: 'zone-ch-i',
        text: 'Потому что вместе создаем смысл и служим высшему',
        level: 11,
        indicators: ['purpose', 'co-creation', 'transcendence'],
      },
    ],
    targetLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priority: 1,
  },

  {
    id: 'zone-difference-006',
    text: {
      self: 'Когда партнер отличается от меня:',
      partner: 'Когда я отличаюсь от партнера:',
      potential: 'Я бы хотел, чтобы партнер:',
      pair_discussion: 'Когда мы отличаемся друг от друга:',
    },
    category: 'acceptance',
    options: [
      {
        id: 'zone-d-a',
        text: 'Это угрожает безопасности, я боюсь потерять контроль',
        level: 1,
        indicators: ['fear', 'need-for-control', 'insecurity'],
      },
      {
        id: 'zone-d-b',
        text: 'Я повторяю попытки сделать его как я или как родитель',
        level: 2,
        indicators: ['unconscious-patterns', 'control-attempts', 'projection'],
      },
      {
        id: 'zone-d-c',
        text: 'Это немного напрягает, но нужно мириться для стабильности',
        level: 3,
        indicators: ['tolerance', 'resentment', 'survival-mode'],
      },
      {
        id: 'zone-d-d',
        text: 'Нужно его переделать, мы не совместимы',
        level: 5,
        indicators: ['criticism', 'control-needs', 'contempt'],
      },
      {
        id: 'zone-d-e',
        text: 'Это нормально, нужно соблюдать границы и уважать',
        level: 7,
        indicators: ['respect', 'boundaries', 'acceptance'],
      },
      {
        id: 'zone-d-f',
        text: 'Это обогащает нас, видим в этом потенциал друг друга',
        level: 9,
        indicators: ['appreciation', 'growth-mindset', 'complementarity'],
      },
      {
        id: 'zone-d-g',
        text: 'Это творчество и гармония, разные ноты в одной симфонии',
        level: 11,
        indicators: ['synergy', 'integration', 'co-creation'],
      },
    ],
    targetLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    priority: 1,
  },

  // ============================================================================
  // БЛОК УТОЧНЕНИЯ (22 вопроса) - детальное определение уровня
  // ============================================================================

  {
    id: 'level-detail-trauma-007',
    text: {
      self: 'В отношении к физическому насилию или угрозам:',
      partner: 'По отношению к физическому насилию мой партнер:',
      potential: 'Я совершенно не хочу:',
      pair_discussion: 'У нас совершенно исключено:',
    },
    category: 'boundaries',
    options: [
      {
        id: 'lvl-t-a',
        text: 'Это происходит, и это нормально в отношениях',
        level: 1,
        indicators: ['trauma-normalization', 'violence-acceptance'],
      },
      {
        id: 'lvl-t-b',
        text: 'Это было, но я пытаюсь изменить ситуацию',
        level: 2,
        indicators: ['trauma-awareness', 'hope-for-change'],
      },
      {
        id: 'lvl-t-c',
        text: 'Нет, но я боюсь сказать об этом',
        level: 3,
        indicators: ['fear', 'boundaries-not-held'],
      },
      {
        id: 'lvl-t-d',
        text: 'Абсолютно исключено, это мои границы',
        level: 7,
        indicators: ['firm-boundaries', 'self-respect'],
      },
    ],
    targetLevels: [1, 2, 3, 7],
    priority: 2,
  },

  {
    id: 'level-detail-emotion-008',
    text: {
      self: 'Когда я грущу, партнер обычно:',
      partner: 'Когда партнер грустит, я обычно:',
      potential: 'Я хотел бы, чтобы партнер:',
      pair_discussion: 'Когда один из нас грустит, мы:',
    },
    category: 'communication',
    options: [
      {
        id: 'lvl-e-a',
        text: 'Раздражается или уходит, не слушает',
        level: 1,
        indicators: ['emotional-abandonment', 'unavailability'],
      },
      {
        id: 'lvl-e-b',
        text: 'Слушает, но потом возвращает разговор к себе',
        level: 3,
        indicators: ['emotional-unavailability', 'narcissism'],
      },
      {
        id: 'lvl-e-c',
        text: 'Слушает, но потом дает советы как решить',
        level: 4,
        indicators: ['problem-solving-focus', 'lack-of-empathy'],
      },
      {
        id: 'lvl-e-d',
        text: 'Рассказывает похожую историю, как пережил сам',
        level: 5,
        indicators: ['ego-focus', 'empathy-struggles', 'self-centeredness'],
      },
      {
        id: 'lvl-e-e',
        text: 'Слушает, пытается понять и поддержать',
        level: 7,
        indicators: ['empathy', 'emotional-attunement', 'support'],
      },
      {
        id: 'lvl-e-f',
        text: 'Слушает, поддерживает, верит в мою силу',
        level: 8,
        indicators: ['unconditional-support', 'empowerment'],
      },
    ],
    targetLevels: [1, 3, 4, 5, 7, 8],
    priority: 1,
  },

  {
    id: 'level-detail-jealousy-009',
    text: {
      self: 'Ревность в отношениях - это:',
      partner: 'Мой партнер относится к ревности как:',
      potential: 'Я хотел бы, чтобы ревность была:',
      pair_discussion: 'У нас с ревностью дело обстоит:',
    },
    category: 'communication',
    options: [
      {
        id: 'lvl-j-a',
        text: 'Доказательство любви, без ревности - не любит',
        level: 5,
        indicators: ['unhealthy-attachment', 'insecurity', 'possession'],
      },
      {
        id: 'lvl-j-b',
        text: 'Нужно скрывать, чтобы не конфликтовать',
        level: 6,
        indicators: ['facade', 'hidden-feelings', 'people-pleasing'],
      },
      {
        id: 'lvl-j-c',
        text: 'Естественное чувство, но не контролирует поведение',
        level: 7,
        indicators: ['emotional-awareness', 'self-regulation'],
      },
      {
        id: 'lvl-j-d',
        text: 'Редкое явление, я доверяю и честен',
        level: 9,
        indicators: ['secure-attachment', 'trust', 'transparency'],
      },
    ],
    targetLevels: [5, 6, 7, 9],
    priority: 2,
  },

  {
    id: 'level-detail-money-010',
    text: {
      self: 'Деньги в отношениях - это:',
      partner: 'Мой партнер смотрит на деньги как:',
      potential: 'Я хотел бы, чтобы финансы были:',
      pair_discussion: 'Финансовые вопросы между нами:',
    },
    category: 'values',
    options: [
      {
        id: 'lvl-m-a',
        text: 'Главное условие выживания и безопасности',
        level: 3,
        indicators: ['survival-anxiety', 'dependency', 'financial-fear'],
      },
      {
        id: 'lvl-m-b',
        text: 'Инструмент стабильности и комфорта',
        level: 4,
        indicators: ['pragmatism', 'resource-focus', 'stability-seeking'],
      },
      {
        id: 'lvl-m-c',
        text: 'Инструмент власти и статуса',
        level: 6,
        indicators: ['control-needs', 'status-consciousness', 'power-dynamics'],
      },
      {
        id: 'lvl-m-d',
        text: 'Ресурс, который делим справедливо и прозрачно',
        level: 7,
        indicators: ['transparency', 'fairness', 'partnership'],
      },
      {
        id: 'lvl-m-e',
        text: 'Инструмент для совместного создания и служения',
        level: 11,
        indicators: ['purpose-driven', 'co-creation', 'generosity'],
      },
    ],
    targetLevels: [3, 4, 6, 7, 11],
    priority: 2,
  },

  {
    id: 'level-detail-authenticity-011',
    text: {
      self: 'С партнером я:',
      partner: 'Со мной мой партнер:',
      potential: 'Я хотел бы быть со своим партнером:',
      pair_discussion: 'Между нами:',
    },
    category: 'acceptance',
    options: [
      {
        id: 'lvl-au-a',
        text: 'Стараюсь скрывать неловкие стороны и успехи',
        level: 3,
        indicators: ['shame', 'hiding', 'inauthenticity'],
      },
      {
        id: 'lvl-au-b',
        text: 'Показываю только лучшую версию себя',
        level: 6,
        indicators: ['facade', 'perfectionism', 'image-management'],
      },
      {
        id: 'lvl-au-c',
        text: 'Могу быть собой, но иногда стесняюсь слабостей',
        level: 7,
        indicators: ['growing-authenticity', 'selective-vulnerability'],
      },
      {
        id: 'lvl-au-d',
        text: 'Полностью аутентичен, могу быть любым',
        level: 8,
        indicators: ['full-authenticity', 'unconditional-acceptance'],
      },
      {
        id: 'lvl-au-e',
        text: 'Аутентичен и вдохновляю партнера быть собой',
        level: 10,
        indicators: ['modeling', 'mutual-authenticity', 'synergy'],
      },
    ],
    targetLevels: [3, 6, 7, 8, 10],
    priority: 2,
  },

  {
    id: 'level-detail-repair-012',
    text: {
      self: 'После ссоры мы обычно:',
      partner: 'После ссоры со мной мой партнер обычно:',
      potential: 'Я хотел бы после ссоры:',
      pair_discussion: 'После наших ссор мы обычно:',
    },
    category: 'conflict',
    options: [
      {
        id: 'lvl-rp-a',
        text: 'Замораживаем отношения на несколько дней',
        level: 1,
        indicators: ['conflict-avoidance', 'freeze-response', 'no-repair'],
      },
      {
        id: 'lvl-rp-b',
        text: 'Один извиняется, даже если прав, ради мира',
        level: 3,
        indicators: ['appeasement', 'false-reconciliation', 'self-abandonment'],
      },
      {
        id: 'lvl-rp-c',
        text: 'Спор переходит в привычку, но мы живем вместе',
        level: 4,
        indicators: ['unresolved-conflict', 'parallel-lives', 'emotional-distance'],
      },
      {
        id: 'lvl-rp-d',
        text: 'Один из нас идет на компромисс, второй побеждает',
        level: 5,
        indicators: ['power-dynamics', 'winner-loser', 'resentment'],
      },
      {
        id: 'lvl-rp-e',
        text: 'Обсуждаем, что произошло, и находим решение',
        level: 7,
        indicators: ['conflict-resolution', 'mutual-understanding', 'repair'],
      },
      {
        id: 'lvl-rp-f',
        text: 'Видим учение в конфликте, становимся ближе',
        level: 9,
        indicators: ['growth-from-conflict', 'deepening', 'resilience'],
      },
    ],
    targetLevels: [1, 3, 4, 5, 7, 9],
    priority: 1,
  },

  {
    id: 'level-detail-external-013',
    text: {
      self: 'Когда люди говорят о наших отношениях:',
      partner: 'Когда люди говорят о наших отношениях, я:',
      potential: 'Мне хотелось бы, чтобы о моих отношениях:',
      pair_discussion: 'Когда окружающие говорят о нас:',
    },
    category: 'values',
    options: [
      {
        id: 'lvl-ex-a',
        text: 'Я контролирую ответ, чтобы выглядеть хорошо',
        level: 6,
        indicators: ['image-management', 'people-pleasing', 'facade'],
      },
      {
        id: 'lvl-ex-b',
        text: 'Остаюсь честным, но немного беспокоюсь об имидже',
        level: 7,
        indicators: ['authenticity-with-caution', 'social-awareness'],
      },
      {
        id: 'lvl-ex-c',
        text: 'Не забочусь, рассказываю правду как есть',
        level: 8,
        indicators: ['authenticity', 'no-pretense', 'self-assurance'],
      },
      {
        id: 'lvl-ex-d',
        text: 'Меня вдохновляет помогать им увидеть лучшее в любви',
        level: 10,
        indicators: ['modeling', 'inspiration', 'service'],
      },
    ],
    targetLevels: [6, 7, 8, 10],
    priority: 2,
  },

  {
    id: 'level-detail-sex-014',
    text: {
      self: 'Сексуальность в отношениях для меня это:',
      partner: 'Мой партнер смотрит на сексуальность как:',
      potential: 'Я хотел бы, чтобы секс был:',
      pair_discussion: 'Секс между нами это:',
    },
    category: 'intimacy',
    options: [
      {
        id: 'lvl-sx-a',
        text: 'Источник боли и страха',
        level: 1,
        indicators: ['trauma', 'fear', 'aversion'],
      },
      {
        id: 'lvl-sx-b',
        text: 'Обязательство, которое нужно выполнять',
        level: 4,
        indicators: ['duty', 'obligation', 'disconnection'],
      },
      {
        id: 'lvl-sx-c',
        text: 'Главный способ быть близко, без разговоров',
        level: 5,
        indicators: ['sex-as-communication', 'avoidance-of-intimacy', 'intensity'],
      },
      {
        id: 'lvl-sx-d',
        text: 'Способ получить утешение и внимание',
        level: 5,
        indicators: ['emotional-need', 'external-validation'],
      },
      {
        id: 'lvl-sx-e',
        text: 'Деятельность с доверием и уязвимостью',
        level: 7,
        indicators: ['trust', 'vulnerability', 'emotional-safety'],
      },
      {
        id: 'lvl-sx-f',
        text: 'Священное соединение и служение друг другу',
        level: 12,
        indicators: ['sacredness', 'spiritual-connection', 'transcendence'],
      },
    ],
    targetLevels: [1, 4, 5, 7, 12],
    priority: 2,
  },

  {
    id: 'level-detail-future-015',
    text: {
      self: 'О будущем с партнером я думаю:',
      partner: 'Мой партнер о будущем со мной думает:',
      potential: 'Я хотел бы, чтобы в будущем:',
      pair_discussion: 'О нашем будущем вместе мы думаем:',
    },
    category: 'values',
    options: [
      {
        id: 'lvl-fu-a',
        text: 'Не думаю, это день за днем, выживаю',
        level: 1,
        indicators: ['no-hope', 'survival-mode', 'trauma-focus'],
      },
      {
        id: 'lvl-fu-b',
        text: 'Боюсь, что повторится история родителей',
        level: 2,
        indicators: ['karmic-fears', 'unconscious-patterns', 'hopelessness'],
      },
      {
        id: 'lvl-fu-c',
        text: 'Надеюсь, что будет стабильно и хорошо',
        level: 3,
        indicators: ['survival-hope', 'basic-security', 'limited-vision'],
      },
      {
        id: 'lvl-fu-d',
        text: 'Планируем дом, детей, пенсию',
        level: 4,
        indicators: ['practical-planning', 'stability-focus', 'linear-thinking'],
      },
      {
        id: 'lvl-fu-e',
        text: 'Мечтаем о приключениях и новых эмоциях',
        level: 5,
        indicators: ['passion-seeking', 'adventure-focus', 'excitement'],
      },
      {
        id: 'lvl-fu-f',
        text: 'Строим жизнь, которая будет выглядеть успешной',
        level: 6,
        indicators: ['image-focus', 'status-seeking', 'external-validation'],
      },
      {
        id: 'lvl-fu-g',
        text: 'Вместе растем и развиваемся как люди',
        level: 8,
        indicators: ['growth-focus', 'mutual-development', 'long-term-vision'],
      },
      {
        id: 'lvl-fu-h',
        text: 'Создаем что-то значимое вместе для мира',
        level: 11,
        indicators: ['purpose-driven', 'legacy-focus', 'service'],
      },
    ],
    targetLevels: [1, 2, 3, 4, 5, 6, 8, 11],
    priority: 1,
  },

  {
    id: 'level-detail-freedom-016',
    text: {
      self: 'Моя личная свобода в отношениях:',
      partner: 'Мой партнер дает мне свободу:',
      potential: 'Я хотел бы, чтобы партнер:',
      pair_discussion: 'В отношениях мы оба имеем свободу:',
    },
    category: 'boundaries',
    options: [
      {
        id: 'lvl-fr-a',
        text: 'Ограничена, я должен отчитываться, контролируюсь',
        level: 1,
        indicators: ['control', 'surveillance', 'coercion'],
      },
      {
        id: 'lvl-fr-b',
        text: 'Ограничена, но я это принял как норму',
        level: 3,
        indicators: ['learned-helplessness', 'resignation', 'accepted-limitation'],
      },
      {
        id: 'lvl-fr-c',
        text: 'Есть, но только если делаю "правильное"',
        level: 5,
        indicators: ['conditional-freedom', 'control-through-approval'],
      },
      {
        id: 'lvl-fr-d',
        text: 'Есть, но вызывает ревность и конфликты',
        level: 5,
        indicators: ['insecurity', 'jealousy-based-control'],
      },
      {
        id: 'lvl-fr-e',
        text: 'Полная, мы доверяем друг другу и честны',
        level: 9,
        indicators: ['trust', 'transparency', 'autonomy'],
      },
      {
        id: 'lvl-fr-f',
        text: 'Полная, и это укрепляет нашу связь',
        level: 10,
        indicators: ['secure-attachment', 'mature-relationship', 'synergy'],
      },
    ],
    targetLevels: [1, 3, 5, 9, 10],
    priority: 2,
  },

  {
    id: 'level-detail-responsibility-017',
    text: {
      self: 'За проблемы в отношениях я считаю виноватым:',
      partner: 'Когда возникают проблемы, мой партнер:',
      potential: 'Я хотел бы, чтобы проблемы в отношениях:',
      pair_discussion: 'Когда у нас возникают проблемы:',
    },
    category: 'communication',
    options: [
      {
        id: 'lvl-resp-a',
        text: 'Я, полностью, я во всем виноват',
        level: 1,
        indicators: ['self-blame', 'shame', 'internalized-criticism'],
      },
      {
        id: 'lvl-resp-b',
        text: 'Партнера, он такой, я это терпелю',
        level: 3,
        indicators: ['blame-external', 'victimhood', 'resentment'],
      },
      {
        id: 'lvl-resp-c',
        text: 'Меня или его, смотря как спросишь',
        level: 5,
        indicators: ['blame-shifting', 'defensiveness'],
      },
      {
        id: 'lvl-resp-d',
        text: 'Обоих - мы создаем эту динамику вместе',
        level: 7,
        indicators: ['shared-responsibility', 'systemic-thinking'],
      },
      {
        id: 'lvl-resp-e',
        text: 'Это возможность для обоих научиться',
        level: 9,
        indicators: ['growth-mindset', 'learning-orientation'],
      },
    ],
    targetLevels: [1, 3, 5, 7, 9],
    priority: 2,
  },

  {
    id: 'level-detail-sacrifice-018',
    text: {
      self: 'Я готов ради отношений жертвовать:',
      partner: 'Мой партнер ради отношений жертвует:',
      potential: 'Я хотел бы для отношений:',
      pair_discussion: 'Ради наших отношений мы готовы:',
    },
    category: 'values',
    options: [
      {
        id: 'lvl-sac-a',
        text: 'Всем - мечтами, друзьями, собой',
        level: 2,
        indicators: ['self-abandonment', 'enmeshment', 'loss-of-self'],
      },
      {
        id: 'lvl-sac-b',
        text: 'Многим, это естественно в отношениях',
        level: 4,
        indicators: ['role-sacrifice', 'duty-based', 'resentment-building'],
      },
      {
        id: 'lvl-sac-c',
        text: 'Многим, потому что люблю его сильнее чем себя',
        level: 5,
        indicators: ['love-as-sacrifice', 'unhealthy-attachment', 'dependency'],
      },
      {
        id: 'lvl-sac-d',
        text: 'Некоторым, но не основным мечтам',
        level: 7,
        indicators: ['boundaries', 'mutual-respect'],
      },
      {
        id: 'lvl-sac-e',
        text: 'Смешивать границы, но отстаивать свое развитие',
        level: 8,
        indicators: ['autonomy-within-connection', 'healthy-boundaries'],
      },
      {
        id: 'lvl-sac-f',
        text: 'Служить, потому что это приносит радость, не жертву',
        level: 11,
        indicators: ['service-not-sacrifice', 'joy-in-giving', 'transcendence'],
      },
    ],
    targetLevels: [2, 4, 5, 7, 8, 11],
    priority: 2,
  },

  {
    id: 'level-detail-partners-emotion-019',
    text: {
      self: 'Когда партнер расстроен, я:',
      partner: 'Когда я расстроена/расстроен, партнер:',
      potential: 'Я хотел бы, чтобы партнер:',
      pair_discussion: 'Когда один расстроен, другой:',
    },
    category: 'communication',
    options: [
      {
        id: 'lvl-pe-a',
        text: 'Становлюсь еще более тревожным или рассерженным',
        level: 1,
        indicators: ['emotional-contagion', 'dysregulation', 'lack-of-boundaries'],
      },
      {
        id: 'lvl-pe-b',
        text: 'Уходу, чтобы не испортить свое настроение',
        level: 3,
        indicators: ['avoidance', 'low-empathy', 'self-focus'],
      },
      {
        id: 'lvl-pe-c',
        text: 'Стараюсь исправить ситуацию, чтобы вернуть мир',
        level: 4,
        indicators: ['peace-seeking', 'problem-solving-focus'],
      },
      {
        id: 'lvl-pe-d',
        text: 'Слушаю, но фокусирую на его ошибках',
        level: 5,
        indicators: ['blame-focus', 'defensive-listening'],
      },
      {
        id: 'lvl-pe-e',
        text: 'Слушаю, стараюсь понять его мир',
        level: 7,
        indicators: ['empathy', 'presence', 'attunement'],
      },
      {
        id: 'lvl-pe-f',
        text: 'Слушаю, поддерживаю и верю в его способность измениться',
        level: 8,
        indicators: ['empowerment', 'faith', 'unconditional-support'],
      },
      {
        id: 'lvl-pe-g',
        text: 'Мы вместе изучаем, что стоит под его эмоциями',
        level: 10,
        indicators: ['mutual-exploration', 'depth', 'co-growth'],
      },
    ],
    targetLevels: [1, 3, 4, 5, 7, 8, 10],
    priority: 1,
  },

  {
    id: 'level-detail-need-020',
    text: {
      self: 'В отношениях я главно нуждаюсь в:',
      partner: 'Мой партнер главно нуждается в:',
      potential: 'Я хотел бы нуждаться в отношениях в:',
      pair_discussion: 'В отношениях мы главно нуждаемся в:',
    },
    category: 'values',
    options: [
      {
        id: 'lvl-nd-a',
        text: 'Выживании и безопасности',
        level: 1,
        indicators: ['survival-needs', 'safety-seeking'],
      },
      {
        id: 'lvl-nd-b',
        text: 'Стабильности и финансовой безопасности',
        level: 3,
        indicators: ['economic-security', 'stability'],
      },
      {
        id: 'lvl-nd-c',
        text: 'Комфорте и удобстве',
        level: 4,
        indicators: ['comfort-seeking', 'pleasure-seeking'],
      },
      {
        id: 'lvl-nd-d',
        text: 'Эмоциональной интенсивности и волнении',
        level: 5,
        indicators: ['excitement-seeking', 'emotional-intensity'],
      },
      {
        id: 'lvl-nd-e',
        text: 'Подтверждении статуса и признании',
        level: 6,
        indicators: ['validation-seeking', 'status-needs'],
      },
      {
        id: 'lvl-nd-f',
        text: 'Подлинной связи и понимании',
        level: 7,
        indicators: ['connection-seeking', 'emotional-intimacy'],
      },
      {
        id: 'lvl-nd-g',
        text: 'Росте и развитии вместе',
        level: 9,
        indicators: ['growth-seeking', 'development', 'mutual-evolution'],
      },
      {
        id: 'lvl-nd-h',
        text: 'Служении и создании смысла',
        level: 11,
        indicators: ['purpose-seeking', 'transcendence', 'service'],
      },
    ],
    targetLevels: [1, 3, 4, 5, 6, 7, 9, 11],
    priority: 2,
  },

  {
    id: 'level-detail-influence-021',
    text: {
      self: 'Я пытаюсь переделать партнера:',
      partner: 'Мой партнер пытается меня переделать:',
      potential: 'В отношениях я хотел бы:',
      pair_discussion: 'В нас с партнером принцип:',
    },
    category: 'acceptance',
    options: [
      {
        id: 'lvl-inf-a',
        text: 'Постоянно, это главное моего времени',
        level: 2,
        indicators: ['control', 'critical', 'change-focus'],
      },
      {
        id: 'lvl-inf-b',
        text: 'Да, но скрыто, через давление',
        level: 5,
        indicators: ['covert-control', 'manipulation'],
      },
      {
        id: 'lvl-inf-c',
        text: 'Иногда, я хотел бы его лучше',
        level: 6,
        indicators: ['perfectionism', 'subtle-criticism'],
      },
      {
        id: 'lvl-inf-d',
        text: 'Нет, я принимаю его таким как есть',
        level: 8,
        indicators: ['acceptance', 'non-judgmental', 'unconditional-love'],
      },
      {
        id: 'lvl-inf-e',
        text: 'Нет, я вижу его потенциал и верю в него',
        level: 9,
        indicators: ['faith-in-other', 'empowerment', 'growth-support'],
      },
    ],
    targetLevels: [2, 5, 6, 8, 9],
    priority: 2,
  },

  {
    id: 'level-detail-standards-022',
    text: {
      self: 'В отношениях я придерживаюсь стандартов:',
      partner: 'Мой партнер придерживается стандартов:',
      potential: 'Я хотел бы в отношениях:',
      pair_discussion: 'Мы в отношениях придерживаемся:',
    },
    category: 'values',
    options: [
      {
        id: 'lvl-std-a',
        text: 'Нет, только выживание',
        level: 1,
        indicators: ['no-standards', 'survival-mode'],
      },
      {
        id: 'lvl-std-b',
        text: 'Низких, главное чтобы не уходил',
        level: 2,
        indicators: ['low-expectations', 'desperation', 'acceptance'],
      },
      {
        id: 'lvl-std-c',
        text: 'Практических - выполняет роль и обязанности',
        level: 4,
        indicators: ['role-based', 'practical', 'functional'],
      },
      {
        id: 'lvl-std-d',
        text: 'Очень высоких, партнер должен быть идеальным',
        level: 6,
        indicators: ['perfectionism', 'unrealistic-expectations', 'criticism'],
      },
      {
        id: 'lvl-std-e',
        text: 'Честности, уважения и открытости',
        level: 7,
        indicators: ['integrity', 'mutual-respect', 'authenticity'],
      },
      {
        id: 'lvl-std-f',
        text: 'Взаимного роста и развития',
        level: 9,
        indicators: ['growth-standards', 'mutual-development'],
      },
    ],
    targetLevels: [1, 2, 4, 6, 7, 9],
    priority: 2,
  },

  {
    id: 'level-detail-appreciation-023',
    text: {
      self: 'То хорошее, что делает партнер, я:',
      partner: 'То хорошее, что я делаю, партнер:',
      potential: 'Я хотел бы, чтобы мои усилия:',
      pair_discussion: 'То хорошее, что мы делаем друг для друга:',
    },
    category: 'acceptance',
    options: [
      {
        id: 'lvl-app-a',
        text: 'Не вижу, зациклен на проблемах',
        level: 1,
        indicators: ['trauma-focus', 'negativity-bias'],
      },
      {
        id: 'lvl-app-b',
        text: 'Вижу, но воспринимаю как обязанность',
        level: 4,
        indicators: ['entitlement', 'no-gratitude'],
      },
      {
        id: 'lvl-app-c',
        text: 'Благодарен, но иногда забываю сказать',
        level: 7,
        indicators: ['selective-appreciation', 'awareness-gaps'],
      },
      {
        id: 'lvl-app-d',
        text: 'Выражаю благодарность регулярно',
        level: 8,
        indicators: ['gratitude-practice', 'acknowledgment', 'presence'],
      },
      {
        id: 'lvl-app-e',
        text: 'Замечаю и восхищаюсь трансформацией',
        level: 10,
        indicators: ['deep-appreciation', 'witnessing-growth', 'admiration'],
      },
    ],
    targetLevels: [1, 4, 7, 8, 10],
    priority: 2,
  },

  {
    id: 'level-detail-alone-024',
    text: {
      self: 'Когда я один, я чувствую себя:',
      partner: 'Когда мой партнер один, он чувствует себя:',
      potential: 'Я хотел бы, чтобы в одиночестве:',
      pair_discussion: 'Когда один из нас один, это для нас:',
    },
    category: 'boundaries',
    options: [
      {
        id: 'lvl-al-a',
        text: 'Потерянным, испуганным, панику',
        level: 1,
        indicators: ['fear-of-abandonment', 'panic', 'no-self'],
      },
      {
        id: 'lvl-al-b',
        text: 'Неполноценным, неживой',
        level: 2,
        indicators: ['low-self-worth', 'emptiness', 'self-abandonment'],
      },
      {
        id: 'lvl-al-c',
        text: 'Некомфортно, скучно, жду его',
        level: 3,
        indicators: ['dependency', 'boredom-intolerance'],
      },
      {
        id: 'lvl-al-d',
        text: 'Нормально, занимаюсь делами, думаю о нем',
        level: 7,
        indicators: ['autonomy', 'independence', 'secure-attachment'],
      },
      {
        id: 'lvl-al-e',
        text: 'Хорошо, развиваюсь, питаюсь',
        level: 8,
        indicators: ['self-sufficiency', 'self-nourishment', 'healthy-autonomy'],
      },
      {
        id: 'lvl-al-f',
        text: 'Отлично, медитирую, пишу, служу себе и другим',
        level: 11,
        indicators: ['spiritual-connection', 'self-development', 'purpose'],
      },
    ],
    targetLevels: [1, 2, 3, 7, 8, 11],
    priority: 2,
  },

  // ============================================================================
  // БЛОК ВАЛИДАЦИИ (6 вопросов) - обнаружение противоречий и байпасов
  // ============================================================================

  {
    id: 'validation-speed-025',
    text: {
      self: 'Я рассказываю о сложных чувствах, потому что:',
      partner: 'Когда я рассказываю о себе, это происходит:',
      potential: 'Я хотел бы говорить о чувствах:',
      pair_discussion: 'Когда мы говорим о сложных чувствах:',
    },
    category: 'validation',
    options: [
      {
        id: 'val-s-a',
        text: 'Глубоко обдумав, честно, может занять время',
        level: 7,
        indicators: ['thoughtfulness', 'authenticity', 'processing-time'],
      },
      {
        id: 'val-s-b',
        text: 'Быстро, чтобы выглядеть хорошо, не совсем честно',
        level: 6,
        indicators: ['image-management', 'insincerity'],
      },
      {
        id: 'val-s-c',
        text: 'Спонтанно, в горячке, потом жалею',
        level: 5,
        indicators: ['impulsivity', 'emotional-reactivity'],
      },
      {
        id: 'val-s-d',
        text: 'Очень медленно, я не доверяю',
        level: 1,
        indicators: ['trauma-response', 'trust-issues'],
      },
    ],
    targetLevels: [1, 5, 6, 7],
    isValidation: true,
    priority: 1,
  },

  {
    id: 'validation-contradiction-026',
    text: {
      self: 'Я говорю, что люблю партнера, но:',
      partner: 'Мой партнер говорит, что любит меня, но:',
      potential: 'Я бы хотел, чтобы любовь проявлялась:',
      pair_discussion: 'Мы говорим, что любим, но:',
    },
    category: 'validation',
    options: [
      {
        id: 'val-c-a',
        text: 'Мои действия это не подтверждают, я жестокий',
        level: 1,
        indicators: ['contradiction', 'trauma', 'abusive-patterns'],
      },
      {
        id: 'val-c-b',
        text: 'Постоянно критикую и пытаюсь менять',
        level: 2,
        indicators: ['contradiction', 'control', 'conditional-love'],
      },
      {
        id: 'val-c-c',
        text: 'Часто боюсь потерять или обижаюсь',
        level: 5,
        indicators: ['insecure-attachment', 'fear-based-love'],
      },
      {
        id: 'val-c-d',
        text: 'Мои действия это в основном подтверждают',
        level: 8,
        indicators: ['coherence', 'integrity', 'authentic-love'],
      },
    ],
    targetLevels: [1, 2, 5, 8],
    isValidation: true,
    priority: 1,
  },

  {
    id: 'validation-spiritual-bypass-027',
    text: {
      self: 'Я считаю нашу любовь очень высокой, духовной:',
      partner: 'Мой партнер видит нашу любовь как очень духовную:',
      potential: 'Высокая любовь означает для меня:',
      pair_discussion: 'Мы верим, что наша любовь духовная и:',
    },
    category: 'validation',
    options: [
      {
        id: 'val-sb-a',
        text: 'Да, но при этом я часто критикую его поведение',
        level: 6,
        indicators: ['spiritual-bypass', 'mask-for-control', 'cognitive-dissonance'],
        validation: 'Говоря о высокой духовности, видите ли вы свою жесткость?',
      },
      {
        id: 'val-sb-b',
        text: 'Да, но практически мы живем раздельными жизнями',
        level: 5,
        indicators: ['spiritual-bypass', 'disconnection', 'idealization'],
        validation: 'Возможно, это избегание реальной близости?',
      },
      {
        id: 'val-sb-c',
        text: 'Да, и при этом я работаю над собой и слушаю',
        level: 10,
        indicators: ['authentic-spiritual-connection'],
      },
      {
        id: 'val-sb-d',
        text: 'Нет, мы думаем практическими категориями',
        level: 4,
        indicators: ['realistic', 'grounded'],
      },
    ],
    targetLevels: [4, 5, 6, 10],
    isValidation: true,
    priority: 1,
  },

  {
    id: 'validation-change-028',
    text: {
      self: 'За последний год в отношениях:',
      partner: 'За последний год мой партнер:',
      potential: 'Идеально я хотел бы:',
      pair_discussion: 'За последний год в наших отношениях:',
    },
    category: 'validation',
    options: [
      {
        id: 'val-ch-a',
        text: 'Ничего не изменилось, все как было всегда',
        level: 2,
        indicators: ['stagnation', 'karmic-loop', 'no-growth'],
      },
      {
        id: 'val-ch-b',
        text: 'Я стараюсь, партнер не меняется',
        level: 5,
        indicators: ['one-sided-effort', 'victim-mentality'],
      },
      {
        id: 'val-ch-c',
        text: 'Оба стараемся, но медленно',
        level: 7,
        indicators: ['mutual-effort', 'gradual-growth'],
      },
      {
        id: 'val-ch-d',
        text: 'Мы трансформировались вместе, это очень видно',
        level: 9,
        indicators: ['mutual-growth', 'transformation'],
      },
    ],
    targetLevels: [2, 5, 7, 9],
    isValidation: true,
    priority: 1,
  },

  {
    id: 'validation-honesty-029',
    text: {
      self: 'В этом опросе я:',
      partner: 'В описании наших отношений я:',
      potential: 'Я хотел бы быть в опросе:',
      pair_discussion: 'При заполнении этого опроса мы:',
    },
    category: 'validation',
    options: [
      {
        id: 'val-h-a',
        text: 'Полностью честен, даже если неудобно',
        level: 8,
        indicators: ['authenticity', 'integrity'],
      },
      {
        id: 'val-h-b',
        text: 'Стараюсь быть честен, но скрываю самое сложное',
        level: 5,
        indicators: ['partial-honesty', 'shame-based-hiding'],
      },
      {
        id: 'val-h-c',
        text: 'Выбираю ответы, чтобы выглядеть хорошо',
        level: 6,
        indicators: ['social-desirability-bias', 'image-management'],
      },
      {
        id: 'val-h-d',
        text: 'Выбираю ответы, которые партнер одобрит',
        level: 3,
        indicators: ['people-pleasing', 'external-locus-of-control'],
      },
    ],
    targetLevels: [3, 5, 6, 8],
    isValidation: true,
    priority: 1,
  },

  {
    id: 'validation-awareness-030',
    text: {
      self: 'Мой партнер думает обо мне следующее:',
      partner: 'Я думаю о своем партнере следующее:',
      potential: 'Идеально я хотел бы, чтобы партнер думал:',
      pair_discussion: 'Мы думаем друг о друге:',
    },
    category: 'validation',
    options: [
      {
        id: 'val-aw-a',
        text: 'Я полностью соответствую его идеалам',
        level: 6,
        indicators: ['idealization', 'potential-gap', 'will-disappoint'],
      },
      {
        id: 'val-aw-b',
        text: 'Я хороший, но есть что улучшить',
        level: 7,
        indicators: ['realistic-view', 'growth-mindset'],
      },
      {
        id: 'val-aw-c',
        text: 'Я несовершенен, но он принимает это',
        level: 8,
        indicators: ['acceptance', 'unconditional-love'],
      },
      {
        id: 'val-aw-d',
        text: 'Он видит мой потенциал и вдохновляет его развивать',
        level: 10,
        indicators: ['mutual-empowerment', 'faith-in-other'],
      },
    ],
    targetLevels: [6, 7, 8, 10],
    isValidation: true,
    priority: 2,
  },

  // ============================================================================
  // ДОПОЛНИТЕЛЬНЫЕ ВОПРОСЫ (4 вопроса) - уточнение граничных случаев
  // ============================================================================

  {
    id: 'boundary-maturity-031',
    text: {
      self: 'Я говорю "нет" партнеру:',
      partner: 'Мой партнер мне говорит "нет":',
      potential: 'Я хотел бы в отношениях иметь право:',
      pair_discussion: 'Мы оба можем сказать друг другу "нет":',
    },
    category: 'boundaries',
    options: [
      {
        id: 'bound-m-a',
        text: 'Редко, боюсь его реакции',
        level: 3,
        indicators: ['fear-based-boundaries', 'people-pleasing'],
      },
      {
        id: 'bound-m-b',
        text: 'Иногда, но потом начинается конфликт',
        level: 5,
        indicators: ['weak-boundaries', 'conflict-aversion'],
      },
      {
        id: 'bound-m-c',
        text: 'Да, и он это принимает спокойно',
        level: 7,
        indicators: ['firm-boundaries', 'mutual-respect'],
      },
      {
        id: 'bound-m-d',
        text: 'Да, и мы оба видим в этом здоровье',
        level: 9,
        indicators: ['healthy-autonomy', 'boundary-respect'],
      },
    ],
    targetLevels: [3, 5, 7, 9],
    priority: 2,
  },

  {
    id: 'autonomy-maturity-032',
    text: {
      self: 'Мою независимость в отношениях:',
      partner: 'Независимость партнера я:',
      potential: 'Я хотел бы нашу независимость:',
      pair_discussion: 'Нашу независимость мы:',
    },
    category: 'growth',
    options: [
      {
        id: 'auto-m-a',
        text: 'Подавляю, я должен быть первым',
        level: 5,
        indicators: ['possessiveness', 'control-needs'],
      },
      {
        id: 'auto-m-b',
        text: 'Терплю, но с ревностью и недоверием',
        level: 5,
        indicators: ['insecurity', 'jealousy'],
      },
      {
        id: 'auto-m-c',
        text: 'Уважаю, это мой выбор',
        level: 7,
        indicators: ['trust', 'respect'],
      },
      {
        id: 'auto-m-d',
        text: 'Поддерживаю и вдохновляю развивать',
        level: 9,
        indicators: ['secure-attachment', 'empowerment'],
      },
      {
        id: 'auto-m-e',
        text: 'Видим как основу нашего союза',
        level: 10,
        indicators: ['interdependence-model', 'mature-autonomy'],
      },
    ],
    targetLevels: [5, 7, 9, 10],
    priority: 2,
  },

  {
    id: 'understanding-depth-033',
    text: {
      self: 'Мой партнер знает обо мне:',
      partner: 'Я знаю о своем партнере:',
      potential: 'Я хотел бы, чтобы партнер знал:',
      pair_discussion: 'Мы знаем друг о друге:',
    },
    category: 'intimacy',
    options: [
      {
        id: 'und-d-a',
        text: 'Только поверхностное, мы не говорим о глубоком',
        level: 3,
        indicators: ['surface-connection', 'emotional-distance'],
      },
      {
        id: 'und-d-b',
        text: 'Немного, я боюсь показать себя полностью',
        level: 5,
        indicators: ['selective-vulnerability', 'fear-of-rejection'],
      },
      {
        id: 'und-d-c',
        text: 'Многое, мы говорим о чувствах и снах',
        level: 7,
        indicators: ['emotional-intimacy', 'vulnerability'],
      },
      {
        id: 'und-d-d',
        text: 'Глубоко, включая раны, мечты и трансформацию',
        level: 9,
        indicators: ['deep-intimacy', 'mutual-disclosure'],
      },
      {
        id: 'und-d-e',
        text: 'На уровне видения и служения, миссии',
        level: 11,
        indicators: ['shared-purpose', 'spiritual-intimacy'],
      },
    ],
    targetLevels: [3, 5, 7, 9, 11],
    priority: 2,
  },

  {
    id: 'hope-growth-034',
    text: {
      self: 'Верю ли я, что отношения станут лучше:',
      partner: 'Мой партнер верит, что отношения улучшатся:',
      potential: 'Я хотел бы верить в отношения:',
      pair_discussion: 'Мы верим, что наши отношения:',
    },
    category: 'growth',
    options: [
      {
        id: 'hope-g-a',
        text: 'Нет, это только будет хуже',
        level: 1,
        indicators: ['hopelessness', 'despair', 'trauma-conviction'],
      },
      {
        id: 'hope-g-b',
        text: 'Слабо верю, это как история родителей',
        level: 2,
        indicators: ['learned-hopelessness', 'karmic-conviction'],
      },
      {
        id: 'hope-g-c',
        text: 'Надеюсь, но не вижу как',
        level: 3,
        indicators: ['passive-hope', 'helplessness'],
      },
      {
        id: 'hope-g-d',
        text: 'Верю, работаем над этим вместе',
        level: 7,
        indicators: ['agency', 'mutual-effort'],
      },
      {
        id: 'hope-g-e',
        text: 'Абсолютно уверен, это видно по результатам',
        level: 9,
        indicators: ['self-efficacy', 'evidence-based-hope'],
      },
      {
        id: 'hope-g-f',
        text: 'Верю, что это часть большой миссии',
        level: 11,
        indicators: ['transcendent-hope', 'purpose-alignment'],
      },
    ],
    targetLevels: [1, 2, 3, 7, 9, 11],
    priority: 1,
  },
];

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Получить вопрос по ID
 */
export function getQuestionById(id: string): SmartQuestion | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

/**
 * Получить вопросы по категории
 */
export function getQuestionsByCategory(
  category: SmartQuestion['category']
): SmartQuestion[] {
  return QUESTIONS.filter((q) => q.category === category);
}

/**
 * Получить вопросы по целевым уровням
 */
export function getQuestionsByTargetLevel(level: UnionLevel): SmartQuestion[] {
  return QUESTIONS.filter((q) => q.targetLevels.includes(level));
}

/**
 * Получить вопросы валидации
 */
export function getValidationQuestions(): SmartQuestion[] {
  return QUESTIONS.filter((q) => q.isValidation);
}

/**
 * Получить критичные вопросы (priority 1)
 */
export function getCriticalQuestions(): SmartQuestion[] {
  return QUESTIONS.filter((q) => q.priority === 1);
}

/**
 * Получить вопросы для фазы зонирования
 * (быстрое определение приблизительной зоны 1-4, 5-8 или 9-12)
 */
export function getZoningQuestions(): SmartQuestion[] {
  return QUESTIONS.filter(
    (q) => ['zone-conflict-001', 'zone-safety-002', 'zone-growth-003', 'zone-intimacy-004', 'zone-choice-005', 'zone-difference-006'].includes(q.id)
  );
}

/**
 * Получить вопросы для фазы уточнения
 */
export function getRefinementQuestions(): SmartQuestion[] {
  return QUESTIONS.filter(
    (q) => q.id.startsWith('level-detail-') || q.id.startsWith('boundary-') || q.id.startsWith('autonomy-') || q.id.startsWith('understanding-') || q.id.startsWith('hope-')
  );
}
