// 🧠 УМНАЯ АДАПТИВНАЯ СИСТЕМА ТЕСТИРОВАНИЯ
// ИСПРАВЛЕННАЯ ВЕРСИЯ С ТОЧНЫМ СООТВЕТСТВИЕМ МОДЕЛИ ЛЕСТНИЦЫ СОЮЗА

export interface SmartQuestion {
  id: string;
  text: string;
  category: 'relationship_status' | 'zone_detection' | 'zone_clarification' | 'validation' | 'core_diagnostic';
  phase: 'relationship_status' | 'detection' | 'clarification' | 'validation' | 'core_diagnostic';
  aspectType: 'personal' | 'relationship' | 'combined';
  options: QuestionOption[];
  targetZones?: ('destructive' | 'emotional' | 'mature' | 'transcendent')[];
  relationshipContext?: 'in_relationship' | 'single' | 'single_ready' | 'self_focused' | 'complicated' | 'both';
}

export interface QuestionOption {
  id: string;
  text: string;
  level: number;
  zone: 'destructive' | 'emotional' | 'mature' | 'transcendent';
  indicators: string[];
}

// ФАЗА 0: ОПРЕДЕЛЕНИЕ СТАТУСА ОТНОШЕНИЙ
export const relationshipStatusQuestions: SmartQuestion[] = [
  {
    id: 'relationship_status_check',
    text: 'Укажите ваш текущий статус отношений:',
    category: 'relationship_status',
    phase: 'relationship_status',
    aspectType: 'relationship',
    relationshipContext: 'both',
    options: [
      {
        id: 'status_in_relationship',
        text: 'Я в отношениях (официальных или неофициальных)',
        level: 6,
        zone: 'emotional',
        indicators: ['in_relationship', 'current_partnership']
      },
      {
        id: 'status_single_ready',
        text: 'Я свободен/а и открыт/а для отношений',
        level: 6,
        zone: 'emotional',
        indicators: ['single', 'ready_for_relationship', 'open_to_love']
      },
      {
        id: 'status_single_focused',
        text: 'Я свободен/а и сосредоточен/а на себе',
        level: 6,
        zone: 'emotional',
        indicators: ['single', 'self_focused', 'personal_growth']
      },
      {
        id: 'status_complicated',
        text: 'У меня сложная ситуация (развод, расставание, неопределенность)',
        level: 6,
        zone: 'emotional',
        indicators: ['complicated_status', 'transition_period', 'relationship_uncertainty']
      }
    ]
  }
];

// ФАЗА 1: ЗОНАЛЬНАЯ ДИАГНОСТИКА - определение основной зоны зрелости
export const zoneDetectionQuestions: SmartQuestion[] = [
  // ИСПРАВЛЕННЫЕ ЗОНАЛЬНЫЕ ВОПРОСЫ - СЕРИЯ А (уровни 1-4-7-10)
  {
    id: 'zone_1a_atmosphere',
    text: 'Что точнее всего описывает глубинную динамику ваших отношений?',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'relationship',
    relationshipContext: 'in_relationship',
    options: [
      {
        id: 'z1a_trauma',
        text: 'Постоянное чувство небезопасности - любой конфликт может всё разрушить',
        level: 1,
        zone: 'destructive',
        indicators: ['trauma_response', 'safety_threat', 'destruction_fear', 'emotional_physical_danger']
      },
      {
        id: 'z1a_practical',
        text: 'Обсуждаем бытовые дела, финансы, планы - главное обеспечить стабильность',
        level: 4,
        zone: 'emotional',
        indicators: ['practical_focus', 'stability_oriented', 'material_security', 'domestic_comfort']
      },
      {
        id: 'z1a_authentic',
        text: 'Глубоко понимаем друг друга - можем говорить о чувствах и быть уязвимыми',
        level: 7,
        zone: 'mature',
        indicators: ['psychological_connection', 'emotional_safety', 'vulnerability_acceptance', 'deep_understanding']
      },
      {
        id: 'z1a_synergy',
        text: 'Вместе мы в разы сильнее - появляется энергия и возможности, которых не было поодиночке',
        level: 10,
        zone: 'transcendent',
        indicators: ['energy_multiplication', 'resource_amplification', 'synergistic_power', 'collective_enhancement']
      }
    ]
  },

  // АЛЬТЕРНАТИВНЫЙ ВОПРОС ДЛЯ СВОБОДНЫХ ЛЮДЕЙ
  {
    id: 'zone_1a_relationship_approach',
    text: 'Как вы подходите к созданию близких отношений?',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'relationship',
    relationshipContext: 'single',
    options: [
      {
        id: 'z1a_desperate',
        text: 'Ищу того, кто защитит от одиночества и боли - лучше любые отношения чем никаких',
        level: 1,
        zone: 'destructive',
        indicators: ['pain_avoidance', 'desperation', 'safety_seeking', 'abandonment_terror']
      },
      {
        id: 'z1a_practical_single',
        text: 'Хочу найти надежного партнера для совместного быта, финансовой стабильности',
        level: 4,
        zone: 'emotional',
        indicators: ['resource_partnership', 'stability_seeking', 'practical_union', 'material_security']
      },
      {
        id: 'z1a_authentic_single',
        text: 'Ищу глубокую психологическую связь - того, с кем можно быть настоящим',
        level: 7,
        zone: 'mature',
        indicators: ['psychological_intimacy', 'authentic_connection', 'emotional_depth', 'true_self_expression']
      },
      {
        id: 'z1a_conscious_single',
        text: 'Готов/а к отношениям как источнику взаимного усиления и роста',
        level: 10,
        zone: 'transcendent',
        indicators: ['mutual_amplification', 'growth_partnership', 'synergistic_development', 'conscious_co_creation']
      }
    ]
  },

  // УНИВЕРСАЛЬНЫЙ ВОПРОС О РЕАКЦИИ НА КОНФЛИКТЫ - для всех типов пользователей
  {
    id: 'zone_2a_conflict_reaction',
    text: 'Что происходит с вами в момент серьезного конфликта с близким человеком?',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'z2a_trauma',
        text: 'Паника, ужас - как будто угрожают моему выживанию, знакомое чувство из детства',
        level: 1,
        zone: 'destructive',
        indicators: ['childhood_trauma_activation', 'survival_threat', 'terror_familiar', 'safety_danger']
      },
      {
        id: 'z2a_control',
        text: 'Напряжение, но заставляю себя думать рационально - "главное сохранить стабильность"',
        level: 4,
        zone: 'emotional',
        indicators: ['stability_preservation', 'rational_control', 'practical_thinking', 'security_focus']
      },
      {
        id: 'z2a_mindful',
        text: 'Чувствую эмоции, но остаюсь в контакте с собой - стараюсь понять что происходит',
        level: 7,
        zone: 'mature',
        indicators: ['emotional_awareness', 'self_observation', 'psychological_insight', 'mindful_presence']
      },
      {
        id: 'z2a_expanded',
        text: 'Ощущаю как расширяется сознание - вижу нас как систему роста через трудности',
        level: 10,
        zone: 'transcendent',
        indicators: ['consciousness_expansion', 'systemic_view', 'growth_opportunity', 'transcendent_perspective']
      }
    ]
  },

  // УНИВЕРСАЛЬНЫЙ ВОПРОС О ПАТТЕРНАХ В ОТНОШЕНИЯХ - для всех типов пользователей
  {
    id: 'zone_2b_pattern_recognition',
    text: 'Когда возникают проблемы в близких отношениях, что вы чувствуете?',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'z2b_karmic_loop',
        text: 'Знакомую тяжесть - "опять то же самое", как заезженная пластинка',
        level: 2,
        zone: 'destructive',
        indicators: ['karmic_repetition', 'pattern_fatigue', 'cyclical_suffering', 'unconscious_replay']
      },
      {
        id: 'z2b_passionate',
        text: 'Бурю эмоций - ревность, страсть, драму, но это кажется "настоящей любовью"',
        level: 5,
        zone: 'emotional',
        indicators: ['emotional_intensity', 'passion_drama', 'romantic_chaos', 'feelings_validation']
      },
      {
        id: 'z2b_accepting',
        text: 'Принятие - вижу в партнере целостную личность со всеми особенностями',
        level: 8,
        zone: 'mature',
        indicators: ['unconditional_acceptance', 'wholeness_vision', 'mature_love', 'complete_embrace']
      },
      {
        id: 'z2b_creative',
        text: 'Вдохновение - каждая сложность становится материалом для нашего творчества',
        level: 11,
        zone: 'transcendent',
        indicators: ['creative_transformation', 'co_creation', 'innovative_solutions', 'artistic_partnership']
      }
    ]
  },

  // НОВЫЙ ВОПРОС О ВЫЖИВАНИИ - СЕРИЯ В (уровни 3-6-9-12)
  {
    id: 'zone_2c_motivation_depth',
    text: 'На самом глубинном уровне вы находитесь в отношениях потому что:',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'relationship',
    relationshipContext: 'in_relationship',
    options: [
      {
        id: 'z2c_survival',
        text: 'Боитесь остаться одни - без партнера жизнь кажется невыносимой',
        level: 3,
        zone: 'destructive',
        indicators: ['survival_dependence', 'abandonment_terror', 'life_threat_perception', 'existential_fear']
      },
      {
        id: 'z2c_status',
        text: 'Важно как вы выглядите в глазах общества - статус семейного человека',
        level: 6,
        zone: 'emotional',
        indicators: ['social_status', 'external_approval', 'role_fulfillment', 'societal_expectations']
      },
      {
        id: 'z2c_freedom',
        text: 'Отношения дают вам внутреннюю свободу быть собой без масок',
        level: 9,
        zone: 'mature',
        indicators: ['authentic_freedom', 'self_expression', 'emotional_liberation', 'true_self_acceptance']
      },
      {
        id: 'z2c_service',
        text: 'Чувствуете что через ваш союз в мир приходит что-то божественное',
        level: 12,
        zone: 'transcendent',
        indicators: ['divine_channel', 'spiritual_service', 'sacred_union', 'transcendent_purpose']
      }
    ]
  },

  // АЛЬТЕРНАТИВНЫЕ ВОПРОСЫ ДЛЯ СВОБОДНЫХ - СЕРИИ Б И В
  {
    id: 'zone_1b_relationship_experience',
    text: 'Какой опыт в близких отношениях сформировал ваш нынешний подход?',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'relationship',
    relationshipContext: 'single',
    options: [
      {
        id: 'z1b_repetitive_single',
        text: 'Постоянно повторяются одни и те же болезненные сценарии и разочарования',
        level: 2,
        zone: 'destructive',
        indicators: ['pattern_repetition', 'karmic_loop', 'unconscious_choice', 'cyclical_pain']
      },
      {
        id: 'z1b_dramatic_single',
        text: 'Яркие эмоциональные отношения с качелями от страсти до конфликтов',
        level: 5,
        zone: 'emotional',
        indicators: ['emotional_intensity', 'passion_conflict_cycle', 'dramatic_love', 'feeling_validation']
      },
      {
        id: 'z1b_growth_single',
        text: 'Отношения помогали принять себя и стать более зрелым человеком',
        level: 8,
        zone: 'mature',
        indicators: ['personal_growth', 'self_acceptance', 'maturity_development', 'love_healing']
      },
      {
        id: 'z1b_creative_single',
        text: 'Отношения были источником творчества, новых идей и совместных проектов',
        level: 11,
        zone: 'transcendent',
        indicators: ['creative_partnership', 'co_creation', 'innovative_collaboration', 'artistic_union']
      }
    ]
  },

  // СПЕЦИАЛЬНЫЙ ВОПРОС ДЛЯ "СОСРЕДОТОЧЕН НА СЕБЕ"
  {
    id: 'zone_self_focused_attitude',
    text: 'Сейчас вы сосредоточены на себе. Как вы относитесь к возможности близких отношений?',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'relationship',
    relationshipContext: 'self_focused',
    options: [
      {
        id: 'zsf_avoidance',
        text: 'Избегаю - отношения приносят слишком много боли и проблем',
        level: 2,
        zone: 'destructive',
        indicators: ['relationship_avoidance', 'pain_fear', 'defensive_isolation', 'trust_issues']
      },
      {
        id: 'zsf_postponed',
        text: 'Отложил/а на потом - сначала карьера, финансы, стабильность',
        level: 4,
        zone: 'emotional',
        indicators: ['practical_priorities', 'resource_building', 'delayed_gratification', 'security_first']
      },
      {
        id: 'zsf_growing',
        text: 'Работаю над собой чтобы стать лучшим партнером в будущем',
        level: 8,
        zone: 'mature',
        indicators: ['self_development', 'conscious_preparation', 'emotional_maturity', 'growth_focus']
      },
      {
        id: 'zsf_flow',
        text: 'Доверяю жизни - когда буду готов/а, появится правильный человек',
        level: 11,
        zone: 'transcendent',
        indicators: ['life_trust', 'divine_timing', 'spiritual_readiness', 'flow_state']
      }
    ]
  },

  // ФИЛОСОФИЯ ОТНОШЕНИЙ - только для активно ищущих
  {
    id: 'zone_1c_relationship_philosophy',
    text: 'Какая философия отношений вам ближе всего?',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'relationship',
    relationshipContext: 'single_ready',
    options: [
      {
        id: 'z1c_safety_single',
        text: 'Главное - эмоциональная и физическая безопасность, избежание боли',
        level: 3,
        zone: 'destructive',
        indicators: ['safety_priority', 'pain_avoidance', 'protection_seeking', 'trauma_prevention']
      },
      {
        id: 'z1c_traditional_single',
        text: 'Семейные ценности, социальное признание, соответствие ожиданиям общества',
        level: 6,
        zone: 'emotional',
        indicators: ['traditional_values', 'social_conformity', 'role_fulfillment', 'external_validation']
      },
      {
        id: 'z1c_authentic_single',
        text: 'Личная свобода, взаимное уважение, возможность быть собой',
        level: 9,
        zone: 'mature',
        indicators: ['individual_freedom', 'mutual_respect', 'authentic_expression', 'personal_sovereignty']
      },
      {
        id: 'z1c_sacred_single',
        text: 'Отношения как священный союз для служения чему-то большему',
        level: 12,
        zone: 'transcendent',
        indicators: ['sacred_union', 'divine_purpose', 'spiritual_service', 'transcendent_mission']
      }
    ]
  },

  // ДОРАБОТАННЫЙ ВОПРОС О ТРЕНДЕ ОТНОШЕНИЙ
  {
    id: 'zone_3_relationship_trend',
    text: 'Если честно оценить, как изменились ваши отношения за последний год?',
    category: 'zone_detection',
    phase: 'detection', 
    aspectType: 'relationship',
    relationshipContext: 'in_relationship',
    options: [
      {
        id: 'z3_descending',
        text: 'Стали более болезненными - увеличились конфликты или эмоциональная дистанция',
        level: 2,
        zone: 'destructive',
        indicators: ['relationship_deterioration', 'conflict_escalation', 'emotional_withdrawal', 'pattern_worsening']
      },
      {
        id: 'z3_stagnant',
        text: 'Остались стабильными без особого развития - привычный уровень комфорта',
        level: 5,
        zone: 'emotional',
        indicators: ['relationship_plateau', 'comfort_maintenance', 'growth_absence', 'stability_focus']
      },
      {
        id: 'z3_mature_growth',
        text: 'Стали глубже понимать и принимать друг друга - больше эмоциональной близости',
        level: 8,
        zone: 'mature',
        indicators: ['deepening_intimacy', 'acceptance_growth', 'understanding_increase', 'emotional_maturity']
      },
      {
        id: 'z3_transcendent_growth',
        text: 'Вышли на уровень совместного творчества или служения - создаём что-то важное вместе',
        level: 11,
        zone: 'transcendent',
        indicators: ['co_creative_emergence', 'shared_mission', 'transcendent_purpose', 'collective_service']
      }
    ]
  },

  // АЛЬТЕРНАТИВНЫЙ ВОПРОС ДЛЯ СВОБОДНЫХ И ГОТОВЫХ
  {
    id: 'zone_3_relationship_readiness',
    text: 'Как изменилась ваша готовность к серьезным отношениям за последний год?',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'relationship',
    relationshipContext: 'single',
    options: [
      {
        id: 'z3_fear_increase',
        text: 'Стал/а больше бояться близости - опыт прошлых отношений оставил раны',
        level: 2,
        zone: 'destructive',
        indicators: ['intimacy_fear', 'relationship_trauma', 'defensive_walls', 'trust_loss']
      },
      {
        id: 'z3_stability_focus',
        text: 'Сосредоточился/лась на карьере и быте - отношения отошли на второй план',
        level: 5,
        zone: 'emotional',
        indicators: ['practical_priorities', 'relationship_postponement', 'stability_building', 'resource_focus']
      },
      {
        id: 'z3_self_growth',
        text: 'Активно работаю над собой чтобы стать более зрелым и осознанным партнером',
        level: 8,
        zone: 'mature',
        indicators: ['self_development', 'conscious_preparation', 'emotional_maturity', 'readiness_building']
      },
      {
        id: 'z3_conscious_waiting',
        text: 'Готов/а к отношениям как пути совместного служения и творчества',
        level: 11,
        zone: 'transcendent',
        indicators: ['conscious_partnership', 'service_orientation', 'co_creative_readiness', 'transcendent_vision']
      }
    ]
  },

  // СПЕЦИАЛЬНЫЙ ВОПРОС ДЛЯ СЛОЖНЫХ СИТУАЦИЙ
      {
    id: 'zone_transition_state',
    text: 'В переходном периоде отношений (развод, расставание, неопределенность) вы больше всего:',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'personal',
    relationshipContext: 'complicated',
    options: [
      {
        id: 'zts_suffering',
        text: 'Страдаете и не знаете что делать - чувствуете себя потерянным/ой',
        level: 2,
        zone: 'destructive',
        indicators: ['transition_suffering', 'lost_state', 'emotional_chaos', 'helplessness']
      },
      {
        id: 'zts_analyzing',
        text: 'Анализируете что пошло не так и как избежать ошибок в будущем',
        level: 5,
        zone: 'emotional',
        indicators: ['rational_analysis', 'lesson_seeking', 'problem_identification', 'future_planning']
      },
      {
        id: 'zts_growing',
        text: 'Ищете уроки для личностного роста и эмоционального развития',
        level: 8,
        zone: 'mature',
        indicators: ['growth_opportunity', 'self_development', 'emotional_learning', 'wisdom_seeking']
      },
      {
        id: 'zts_accepting',
        text: 'Принимаете как естественную часть жизненного пути и трансформации',
        level: 11,
        zone: 'transcendent',
        indicators: ['life_acceptance', 'spiritual_growth', 'transformation_trust', 'divine_plan']
      }
    ]
  }
];

// ФАЗА 2: ОСНОВНАЯ ДИАГНОСТИКА - соответствие модели Лестницы Союза
export const coreDiagnosticQuestions: SmartQuestion[] = [
  // ЭМОЦИОНАЛЬНЫЕ РЕАКЦИИ В КОНФЛИКТАХ - полный спектр уровней
  {
    id: 'childhood_trauma_patterns',
    text: 'В конфликтах с близкими вы чувствуете:',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'ctp_terror_familiar',
        text: 'Знакомый ужас из детства - как при конфликтах родителей, угроза безопасности',
        level: 1,
        zone: 'destructive',
        indicators: ['childhood_trauma_echo', 'safety_threat', 'familiar_terror', 'survival_danger']
      },
      {
        id: 'ctp_karmic_fatigue',
        text: 'Усталость от повторения - "опять то же самое", заезженная пластинка',
        level: 2,
        zone: 'destructive',
        indicators: ['karmic_exhaustion', 'pattern_repetition', 'cyclical_suffering', 'helpless_replay']
      },
      {
        id: 'ctp_abandonment_panic',
        text: 'Панику остаться одному/ой - без партнера жизнь кажется невозможной',
        level: 3,
        zone: 'destructive',
        indicators: ['abandonment_terror', 'survival_dependence', 'existential_threat', 'life_impossibility']
      },
      {
        id: 'ctp_practical_focus',
        text: 'Напряжение, но стараюсь решить практические вопросы - "как выйти из ситуации"',
        level: 4,
        zone: 'emotional',
        indicators: ['practical_coping', 'solution_seeking', 'rational_approach', 'problem_solving']
      },
      {
        id: 'ctp_emotional_drama',
        text: 'Эмоциональную бурю - хочется кричать, плакать или уйти в себя',
        level: 5,
        zone: 'emotional',
        indicators: ['emotional_overwhelm', 'dramatic_response', 'feeling_flood', 'expression_need']
      },
      {
        id: 'ctp_social_concern',
        text: 'Беспокойство о том, что подумают другие об этом конфликте',
        level: 6,
        zone: 'emotional',
        indicators: ['social_anxiety', 'external_judgment', 'reputation_concern', 'image_protection']
      },
      {
        id: 'ctp_emotional_awareness',
        text: 'Возможность понять свои реакции и работать с ними осознанно',
        level: 7,
        zone: 'mature',
        indicators: ['emotional_intelligence', 'self_awareness', 'conscious_processing', 'growth_opportunity']
      },
      {
        id: 'ctp_compassion',
        text: 'Сострадание к себе и партнеру - понимаю что мы оба делаем лучшее что можем',
        level: 8,
        zone: 'mature',
        indicators: ['mutual_compassion', 'understanding', 'empathy', 'human_acceptance']
      },
      {
        id: 'ctp_transcendent_wisdom',
        text: 'Глубокое понимание что конфликт - это священная возможность для роста нашего союза',
        level: 12,
        zone: 'transcendent',
        indicators: ['sacred_conflict_wisdom', 'transcendent_understanding', 'divine_growth_opportunity', 'spiritual_transformation']
      }
    ]
  },

  // БЫТОВЫЕ РЕСУРСЫ И СТАБИЛЬНОСТЬ - УРОВЕНЬ 4
  {
    id: 'practical_relationship_foundation',
    text: 'Что является основой ваших отношений (или отношений которые вы ищете)?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'relationship',
    relationshipContext: 'both',
    options: [
      {
        id: 'prf_power_control',
        text: 'Доминирование и контроль - важно кто главный и кто кому подчиняется',
        level: 1,
        zone: 'destructive',
        indicators: ['power_dynamics', 'control_obsession', 'dominance_submission', 'abusive_patterns']
      },
      {
        id: 'prf_survival_safety',
        text: 'Безопасность и защита от жизненных трудностей',
        level: 3,
        zone: 'destructive',
        indicators: ['safety_priority', 'protection_seeking', 'survival_motivation', 'fear_based_union']
      },
      {
        id: 'prf_domestic_stability',
        text: 'Бытовое удобство, финансовая стабильность, совместное хозяйство',
        level: 4,
        zone: 'emotional',
        indicators: ['domestic_comfort', 'financial_security', 'practical_partnership', 'material_stability']
      },
      {
        id: 'prf_emotional_connection',
        text: 'Глубокое взаимопонимание и эмоциональная близость',
        level: 7,
        zone: 'mature',
        indicators: ['psychological_intimacy', 'emotional_depth', 'mutual_understanding', 'inner_connection']
      },
      {
        id: 'prf_co_creation',
        text: 'Совместное творчество и создание чего-то важного для мира',
        level: 11,
        zone: 'transcendent',
        indicators: ['creative_partnership', 'world_contribution', 'shared_mission', 'transcendent_purpose']
      }
    ]
  },

  // СОЦИАЛЬНЫЙ СТАТУС И РОЛИ - УРОВЕНЬ 6
  {
    id: 'social_role_importance',
    text: 'Насколько важно для вас соответствовать социальным ожиданиям в отношениях?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'relationship',
    relationshipContext: 'both',
    options: [
      {
        id: 'sri_passion_priority',
        text: 'Эмоции и страсть важнее общественного мнения',
        level: 5,
        zone: 'emotional',
        indicators: ['passion_over_conformity', 'emotional_intensity', 'feeling_priority', 'social_disregard']
      },
      {
        id: 'sri_social_image',
        text: 'Очень важно - как мы выглядим в глазах семьи, друзей, общества',
        level: 6,
        zone: 'emotional',
        indicators: ['social_status', 'external_validation', 'role_performance', 'image_maintenance']
      },
      {
        id: 'sri_authentic_freedom',
        text: 'Важнее быть собой чем соответствовать чужим ожиданиям',
        level: 9,
        zone: 'mature',
        indicators: ['authentic_expression', 'individual_freedom', 'social_independence', 'true_self_priority']
      },
      {
        id: 'sri_transcendent_service',
        text: 'Живем так чтобы наш союз служил высшим ценностям',
        level: 12,
        zone: 'transcendent',
        indicators: ['spiritual_service', 'higher_purpose', 'transcendent_values', 'sacred_mission']
      }
    ]
  },

  // ЭМОЦИОНАЛЬНАЯ СТРАСТЬ ИЛИ ЗРЕЛАЯ ЛЮБОВЬ - УРОВНИ 5 И 8
  {
    id: 'love_vs_passion_understanding',
    text: 'Что для вас означает настоящая любовь?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'lvpu_possession_obsession',
        text: 'Полное обладание - "ты мой/моя", ревность и контроль как доказательство любви',
        level: 1,
        zone: 'destructive',
        indicators: ['possessive_love', 'jealousy_validation', 'control_as_love', 'obsessive_attachment']
      },
      {
        id: 'lvpu_dramatic_intensity',
        text: 'Сильные эмоции, страсть, ревность - "без этого не любовь"',
        level: 5,
        zone: 'emotional',
        indicators: ['passion_priority', 'emotional_drama', 'intensity_requirement', 'romantic_chaos']
      },
      {
        id: 'lvpu_unconditional_acceptance',
        text: 'Безусловное принятие человека таким, какой он есть',
        level: 8,
        zone: 'mature',
        indicators: ['unconditional_love', 'complete_acceptance', 'mature_love', 'wholeness_embrace']
      },
      {
        id: 'lvpu_authentic_freedom',
        text: 'Свобода быть собой и позволять партнеру быть собой',
        level: 9,
        zone: 'mature',
        indicators: ['authentic_freedom', 'mutual_liberation', 'individual_sovereignty', 'true_self_love']
      },
      {
        id: 'lvpu_sacred_union',
        text: 'Канал для божественной любви и служения миру',
        level: 12,
        zone: 'transcendent',
        indicators: ['divine_love', 'sacred_channel', 'spiritual_service', 'transcendent_union']
      }
    ]
  },

  // СИНЕРГИЯ И ТВОРЧЕСТВО - УРОВНИ 10-11
  {
    id: 'relationship_creativity_impact',
    text: 'Как ваши отношения влияют на вашу творческую энергию и достижения?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'combined',
    relationshipContext: 'both',
    options: [
      {
        id: 'rci_energy_drain',
        text: 'Отношения забирают энергию, остается меньше сил на другие дела',
        level: 3,
        zone: 'destructive',
        indicators: ['energy_depletion', 'resource_drain', 'life_limitation', 'creativity_suppression']
      },
      {
        id: 'rci_neutral_impact',
        text: 'Отношения и творчество - это отдельные сферы, не связанные между собой',
        level: 6,
        zone: 'emotional',
        indicators: ['compartmentalization', 'separate_spheres', 'disconnected_life', 'isolated_areas']
      },
      {
        id: 'rci_mutual_amplification',
        text: 'Вместе мы достигаем большего - усиливаем таланты и возможности друг друга',
        level: 10,
        zone: 'transcendent',
        indicators: ['energy_multiplication', 'talent_amplification', 'synergistic_power', 'collective_achievement']
      },
      {
        id: 'rci_co_creation',
        text: 'Создаем что-то новое и ценное для мира - искусство, проекты, идеи',
        level: 11,
        zone: 'transcendent',
        indicators: ['co_creative_output', 'world_contribution', 'innovative_creation', 'shared_artistic_vision']
      }
    ]
  },

  // КОММУНИКАЦИЯ В КОНФЛИКТЕ
  {
    id: 'conflict_communication',
    text: 'При обсуждении сложных тем мы:',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'relationship',
    relationshipContext: 'in_relationship',
    options: [
      {
        id: 'cc_blame_cycle',
        text: 'Быстро переходим на взаимные обвинения',
        level: 3,
        zone: 'destructive',
        indicators: ['blame_cycle', 'defensive_communication', 'attack_pattern']
      },
      {
        id: 'cc_listening_effort',
        text: 'Стараемся выслушать, хотя не всегда получается',
        level: 7,
        zone: 'mature',
        indicators: ['listening_effort', 'communication_attempt', 'good_intention']
      },
      {
        id: 'cc_safe_space',
        text: 'Создаём безопасное пространство для честности',
        level: 10,
        zone: 'transcendent',
        indicators: ['safe_dialogue', 'conscious_communication', 'vulnerability_space']
      }
    ]
  },

  // АЛЬТЕРНАТИВНЫЙ ВОПРОС О КОММУНИКАЦИИ ДЛЯ СВОБОДНЫХ
  {
    id: 'conflict_communication_single',
    text: 'Как вы обычно реагируете на разногласия с близкими людьми?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'relationship',
    relationshipContext: 'single',
    options: [
      {
        id: 'cc_avoid_single',
        text: 'Избегаю конфликтов любой ценой, предпочитаю отстраниться',
        level: 3,
        zone: 'destructive',
        indicators: ['conflict_avoidance', 'withdrawal_pattern', 'confrontation_fear']
      },
      {
        id: 'cc_defend_single',
        text: 'Защищаю свою позицию, стараюсь доказать свою правоту',
        level: 5,
        zone: 'emotional',
        indicators: ['defensive_communication', 'position_protection', 'ego_involvement']
      },
      {
        id: 'cc_listen_single',
        text: 'Стараюсь выслушать и понять точку зрения другого человека',
        level: 7,
        zone: 'mature',
        indicators: ['empathic_listening', 'perspective_taking', 'open_communication']
      },
      {
        id: 'cc_bridge_single',
        text: 'Ищу общее понимание и возможности для роста через разногласия',
        level: 10,
        zone: 'transcendent',
        indicators: ['bridging_differences', 'growth_through_conflict', 'unity_seeking']
      }
    ]
  },

  // МОТИВАЦИЯ ОТНОШЕНИЙ
  {
    id: 'relationship_motivation',
    text: 'Мы вместе в первую очередь потому что:',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'relationship',
    relationshipContext: 'in_relationship',
    options: [
      {
        id: 'rm_fear_based',
        text: 'Боимся одиночества и жизненных трудностей',
        level: 3,
        zone: 'destructive',
        indicators: ['fear_based_union', 'survival_motivation', 'codependency']
      },
      {
        id: 'rm_convenience',
        text: 'Удобно и стабильно, хорошо решаем бытовые вопросы',
        level: 4,
        zone: 'emotional',
        indicators: ['convenience_based', 'stability_focus', 'practical_union']
      },
      {
        id: 'rm_love_based',
        text: 'Любим и глубоко понимаем друг друга',
        level: 8,
        zone: 'mature',
        indicators: ['love_based', 'deep_understanding', 'emotional_connection']
      },
      {
        id: 'rm_co_creation',
        text: 'Вместе создаём что-то важное для мира',
        level: 11,
        zone: 'transcendent',
        indicators: ['co_creation', 'shared_mission', 'service_together']
      }
    ]
  },

  // АЛЬТЕРНАТИВНЫЙ ВОПРОС О МОТИВАЦИИ ДЛЯ СВОБОДНЫХ
  {
    id: 'relationship_motivation_single',
    text: 'Что больше всего мотивирует вас искать серьезные отношения?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'relationship',
    relationshipContext: 'single',
    options: [
      {
        id: 'rm_loneliness_single',
        text: 'Устал/а от одиночества, хочу чтобы кто-то был рядом',
        level: 3,
        zone: 'destructive',
        indicators: ['loneliness_fear', 'dependency_seeking', 'emotional_void']
      },
      {
        id: 'rm_stability_single',
        text: 'Нужна стабильность, поддержка в быту и жизненных вопросах',
        level: 4,
        zone: 'emotional',
        indicators: ['security_seeking', 'practical_needs', 'stability_motivation']
      },
      {
        id: 'rm_growth_single',
        text: 'Хочу расти и развиваться вместе с близким человеком',
        level: 8,
        zone: 'mature',
        indicators: ['mutual_growth', 'development_motivation', 'partnership_evolution']
      },
      {
        id: 'rm_service_single',
        text: 'Готов/а к отношениям как пути служения и создания чего-то важного',
        level: 11,
        zone: 'transcendent',
        indicators: ['service_motivation', 'co_creation_desire', 'transcendent_purpose']
      }
    ]
  },

  // АДАПТИВНЫЙ ВОПРОС ДЛЯ ВЫЯВЛЕНИЯ "ДУХОВНОГО УЧИТЕЛЯ С ТРАВМОЙ ПРИВЯЗАННОСТИ"
  {
    id: 'spiritual_vs_attachment_gap',
    text: 'Несмотря на ваши духовные практики и понимание жизни, в интимной близости:',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'combined',
    relationshipContext: 'both',
    options: [
      {
        id: 'svag_trauma_activation',
        text: 'Включаются старые страхи, словно вся мудрость исчезает',
        level: 2,
        zone: 'destructive',
        indicators: ['spiritual_bypass', 'attachment_trauma', 'regression_in_intimacy', 'childhood_trauma_activation']
      },
      {
        id: 'svag_struggle_integration',
        text: 'Сложно применить духовное понимание к эмоциональным реакциям',
        level: 5,
        zone: 'emotional',
        indicators: ['integration_struggle', 'spiritual_emotional_gap', 'practice_vs_reality']
      },
      {
        id: 'svag_integrated_wisdom',
        text: 'Духовная практика помогает быть присутствующим с любыми эмоциями',
        level: 10,
        zone: 'transcendent',
        indicators: ['integrated_spirituality', 'conscious_intimacy', 'transcendent_consciousness']
      }
    ]
  },

  // АДАПТИВНЫЙ ВОПРОС ДЛЯ ВЫЯВЛЕНИЯ "ИНТЕЛЛЕКТУАЛЬНО ЗРЕЛЫЙ В ТОКСИЧНЫХ ОТНОШЕНИЯХ"
  {
    id: 'intellect_vs_emotional_gap', 
    text: 'Ваше понимание психологии и отношений применимо ли к вашей личной жизни?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'combined',
    relationshipContext: 'both',
    options: [
      {
        id: 'iveg_theory_only',
        text: 'Прекрасно понимаю теорию, но эмоционально реагирую как подросток',
        level: 3,
        zone: 'destructive',
        indicators: ['intellectual_emotional_split', 'theory_practice_gap', 'emotional_immaturity']
      },
      {
        id: 'iveg_aware_but_stuck',
        text: 'Вижу нездоровые паттерны, но не могу из них выйти',
        level: 4,
        zone: 'emotional',
        indicators: ['awareness_without_power', 'stuck_in_patterns', 'analysis_paralysis']
      },
      {
        id: 'iveg_integrated_wisdom',
        text: 'Знания помогают создавать здоровую динамику в отношениях',
        level: 9,
        zone: 'mature',
        indicators: ['integrated_knowledge', 'practical_wisdom', 'emotional_intelligence']
      }
    ]
  },
  {
    id: 'boundaries_core',
    text: 'Как вы обычно реагируете, когда ваши личные границы нарушаются партнёром?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'bc_no_boundaries',
        text: 'Сразу уступаю, чувствую бессилие и стараюсь не конфликтовать',
        level: 2,
        zone: 'destructive',
        indicators: ['boundary_collapse', 'people_pleasing', 'powerlessness']
      },
      {
        id: 'bc_defensive_wall',
        text: 'Реагирую резко и ставлю «стену», могу обрывать контакт',
        level: 4,
        zone: 'emotional',
        indicators: ['rigid_boundaries', 'defensive_withdrawal', 'self_protection']
      },
      {
        id: 'bc_assertive',
        text: 'Спокойно обозначаю свои потребности и ищу компромисс',
        level: 7,
        zone: 'mature',
        indicators: ['assertive_communication', 'healthy_boundaries', 'respectful_dialogue']
      },
      {
        id: 'bc_fluid_consent',
        text: 'Используем границы творчески, создавая пространство свободы и близости',
        level: 11,
        zone: 'transcendent',
        indicators: ['co_creative_boundaries', 'mutual_sovereignty', 'dynamic_consent']
      }
    ]
  },
  {
    id: 'attachment_core',
    text: 'Что лучше всего описывает ваше чувство безопасности в близости?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'ac_anxious',
        text: 'Боюсь быть покинутым/ой, постоянно ищу подтверждение любви',
        level: 3,
        zone: 'destructive',
        indicators: ['anxious_attachment', 'abandonment_fear', 'clinginess']
      },
      {
        id: 'ac_avoidant',
        text: 'Дистанцируюсь, когда становится слишком близко, ценю независимость',
        level: 5,
        zone: 'emotional',
        indicators: ['avoidant_attachment', 'independence_focus', 'emotional_distance']
      },
      {
        id: 'ac_secure',
        text: 'Чувствую себя в безопасности и могу опираться на партнёра и себя',
        level: 8,
        zone: 'mature',
        indicators: ['secure_attachment', 'emotional_security', 'balanced_dependency']
      },
      {
        id: 'ac_earned_secure',
        text: 'Использую близость как пространство совместного роста и исцеления',
        level: 11,
        zone: 'transcendent',
        indicators: ['earned_security', 'conscious_attachment', 'growth_oriented_closeness']
      }
    ]
  },
  {
    id: 'trauma_pattern_check',
    text: 'Когда возникают триггерные ситуации, что происходит чаще всего?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'tpc_terror_freeze',
        text: 'Замираю, охватывает паника и безысходность',
        level: 1,
        zone: 'destructive',
        indicators: ['freeze_response', 'panic', 'childhood_trauma_activation']
      },
      {
        id: 'tpc_fight_flight',
        text: 'Начинаю обвинять или убегаю из ситуации',
        level: 3,
        zone: 'destructive',
        indicators: ['fight_flight', 'aggressive_defense', 'withdrawal']
      },
      {
        id: 'tpc_awareness_coping',
        text: 'Замечаю триггер и применяю техники саморегуляции',
        level: 7,
        zone: 'mature',
        indicators: ['trauma_awareness', 'self_regulation', 'grounding']
      },
      {
        id: 'tpc_transformative_presence',
        text: 'Использую триггер как возможность для глубокого совместного исцеления',
        level: 11,
        zone: 'transcendent',
        indicators: ['transformative_healing', 'co_regulation', 'post_traumatic_growth']
      }
    ]
  },
  {
    id: 'jealousy_validation',
    text: 'Как вы относитесь к чувствам ревности в отношениях?',
    category: 'core_diagnostic',
    phase: 'core_diagnostic',
    aspectType: 'relationship',
    relationshipContext: 'in_relationship',
    options: [
      {
        id: 'jv_possessive',
        text: 'Ревность для меня — доказательство любви, склонен/на контролировать',
        level: 2,
        zone: 'destructive',
        indicators: ['possessive_jealousy', 'control_behaviour', 'fear_based_union']
      },
      {
        id: 'jv_suppressed',
        text: 'Чувствую ревность, но скрываю её, стыдно признаться',
        level: 4,
        zone: 'emotional',
        indicators: ['suppressed_jealousy', 'emotional_avoidance', 'social_image']
      },
      {
        id: 'jv_communicated',
        text: 'Открыто говорю о ревности и работаю над доверием',
        level: 7,
        zone: 'mature',
        indicators: ['jealousy_dialogue', 'trust_building', 'emotional_vulnerability']
      },
      {
        id: 'jv_transmuted',
        text: 'Преобразую ревность в вдохновение и благодарность партнеру',
        level: 10,
        zone: 'transcendent',
        indicators: ['jealousy_transmutation', 'secure_connection', 'inspired_trust']
      }
    ]
  }
];

// ФАЗА 3: АДАПТИВНОЕ УТОЧНЕНИЕ УРОВНЯ - ПРАВИЛЬНАЯ ЛОГИКА!
export const zoneClarificationQuestions: SmartQuestion[] = [
  
  // УТОЧНЕНИЕ ДЕСТРУКТИВНОЙ ЗОНЫ (1-3)
  {
    id: 'clarify_destructive_zone',
    text: 'Что лучше всего описывает характер ваших трудностей в близких отношениях?',
    category: 'zone_clarification',
    phase: 'clarification',
    aspectType: 'relationship',
    relationshipContext: 'both',
    targetZones: ['destructive'],
    options: [
      {
        id: 'dest_trauma_terror',
        text: 'Близость активирует глубокий ужас и панику - словно жизни угрожает реальная опасность',
        level: 1,
        zone: 'destructive',
        indicators: ['childhood_trauma_activation', 'terror_familiar', 'panic_response', 'survival_mode']
      },
      {
        id: 'dest_karmic_loop',
        text: 'Снова и снова повторяются одни и те же болезненные сценарии - как заезженная пластинка',
        level: 2,
        zone: 'destructive',
        indicators: ['pattern_repetition', 'karmic_cycle', 'unconscious_compulsion', 'familiar_suffering']
      },
      {
        id: 'dest_survival_need',
        text: 'Отношения - это вопрос выживания; без партнера не справлюсь с жизнью',
        level: 3,
        zone: 'destructive', 
        indicators: ['existential_dependency', 'abandonment_terror', 'survival_codependency', 'life_death_stakes']
      },
      {
        id: 'dest_working_through',
        text: 'Понимаю что есть болезненные паттерны и активно работаю над их исцелением',
        level: 4, // Граница перехода в эмоциональную зону
        zone: 'emotional',
        indicators: ['trauma_awareness', 'healing_process', 'therapeutic_work', 'pattern_recognition']
      }
    ]
  },

  // УТОЧНЕНИЕ ЭМОЦИОНАЛЬНОЙ ЗОНЫ (4-6)
  {
    id: 'clarify_emotional_zone',
    text: 'Что наиболее точно отражает ваши приоритеты в близких отношениях?',
    category: 'zone_clarification',
    phase: 'clarification',
    aspectType: 'relationship',
    relationshipContext: 'both',
    targetZones: ['emotional'],
    options: [
      {
        id: 'emot_practical_stability',
        text: 'Стабильность, надежность и решение практических задач совместными усилиями',
        level: 4,
        zone: 'emotional',
        indicators: ['practical_partnership', 'security_focus', 'domestic_stability', 'material_foundation']
      },
      {
        id: 'emot_passion_intensity',
        text: 'Страсть, эмоциональная интенсивность - хочу чувствовать себя по-настоящему живым',
        level: 5,
        zone: 'emotional',
        indicators: ['passion_seeking', 'emotional_drama', 'intensity_craving', 'feeling_validation']
      },
      {
        id: 'emot_social_harmony',
        text: 'Гармоничная социальная роль, соответствие ожиданиям близких и общества',
        level: 6,
        zone: 'emotional',
        indicators: ['social_conformity', 'external_validation', 'role_performance', 'image_maintenance']
      },
      {
        id: 'emot_growing_beyond',
        text: 'Начинаю перерастать потребность во внешнем одобрении, ищу подлинность',
        level: 7, // Граница перехода в зрелую зону
        zone: 'mature',
        indicators: ['authenticity_seeking', 'inner_validation', 'psychological_growth', 'self_acceptance']
      }
    ]
  },

  // УТОЧНЕНИЕ ЗРЕЛОЙ ЗОНЫ (7-9)
  {
    id: 'clarify_mature_zone',
    text: 'Как вы характеризуете качество близости в ваших отношениях?',
    category: 'zone_clarification',
    phase: 'clarification',
    aspectType: 'relationship',
    relationshipContext: 'both',
    targetZones: ['mature'],
    options: [
      {
        id: 'mature_psychological_work',
        text: 'Способны открыто говорить о чувствах, работать с эмоциональными реакциями',
        level: 7,
        zone: 'mature',
        indicators: ['emotional_intelligence', 'conscious_communication', 'psychological_intimacy', 'feeling_literacy']
      },
      {
        id: 'mature_unconditional_love',
        text: 'Принимаю партнера целиком - со всеми достоинствами и недостатками',
        level: 8,
        zone: 'mature',
        indicators: ['unconditional_acceptance', 'wholeness_embrace', 'mature_love', 'shadow_integration']
      },
      {
        id: 'mature_authentic_freedom',
        text: 'Остаюсь собой в отношениях, поддерживаю свободу быть подлинным',
        level: 9,
        zone: 'mature',
        indicators: ['authentic_self', 'differentiated_intimacy', 'individual_sovereignty', 'freedom_in_love']
      },
      {
        id: 'mature_transcending',
        text: 'Наши отношения становятся чем-то большим чем сумма двух личностей',
        level: 10, // Граница перехода в трансцендентную зону
        zone: 'transcendent',
        indicators: ['transcendent_emergence', 'unity_consciousness', 'collective_evolution', 'beyond_individuality']
      }
    ]
  },

  // УТОЧНЕНИЕ ТРАНСЦЕНДЕНТНОЙ ЗОНЫ (10-12)
  {
    id: 'clarify_transcendent_zone',
    text: 'Как ваши отношения влияют на окружающий мир и служат чему-то большему?',
    category: 'zone_clarification',
    phase: 'clarification',
    aspectType: 'combined',
    relationshipContext: 'both',
    targetZones: ['transcendent'],
    options: [
      {
        id: 'trans_synergy_power',
        text: 'Вместе мы создаем синергию - достигаем того, что невозможно поодиночке',
        level: 10,
        zone: 'transcendent',
        indicators: ['synergistic_emergence', 'collective_power', 'mutual_amplification', 'transcendent_unity']
      },
      {
        id: 'trans_creative_mission',
        text: 'Отношения вдохновляют на совместное творчество и реализацию общей миссии',
        level: 11,
        zone: 'transcendent',
        indicators: ['co_creative_expression', 'shared_mission', 'world_contribution', 'cultural_impact']
      },
      {
        id: 'trans_sacred_service',
        text: 'Через наш союз в мир приходит исцеление, любовь и духовная трансформация',
        level: 12,
        zone: 'transcendent',
        indicators: ['sacred_service', 'divine_transmission', 'healing_presence', 'spiritual_channel']
      },
      {
        id: 'trans_still_growing',
        text: 'Чувствую потенциал для еще большего служения и трансформации',
        level: 12, // Открытый потенциал
        zone: 'transcendent',
        indicators: ['unlimited_potential', 'continuous_evolution', 'infinite_service', 'ever_expanding_love']
      }
    ]
  }
];

// ФАЗА 4: ВАЛИДАЦИЯ - проверка честности и согласованности ответов (ОПТИМИЗИРОВАННАЯ)
export const validationQuestions: SmartQuestion[] = [
  // ОСНОВНАЯ ПРОВЕРКА ЧЕСТНОСТИ
  {
    id: 'emotional_regulation_reality',
    text: 'Как часто вы теряете эмоциональное равновесие в близких отношениях?',
    category: 'validation',
    phase: 'validation',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'err_never',
        text: 'Практически никогда, я всегда спокоен/а и уравновешен/а',
        level: 6, // Может быть социально желательным ответом
        zone: 'emotional',
        indicators: ['emotional_suppression', 'perfectionist_image', 'denial_of_humanity']
      },
      {
        id: 'err_rarely',
        text: 'Редко, только в очень стрессовых ситуациях',
        level: 8,
        zone: 'mature',
        indicators: ['emotional_stability', 'good_regulation', 'stress_resilience']
      },
      {
        id: 'err_sometimes',
        text: 'Иногда, когда затрагиваются болезненные темы',
        level: 7,
        zone: 'mature',
        indicators: ['trigger_awareness', 'occasional_dysregulation', 'human_reactions']
      },
      {
        id: 'err_often',
        text: 'Довольно часто, эмоции захлестывают меня',
        level: 3,
        zone: 'destructive',
        indicators: ['emotional_dysregulation', 'frequent_overwhelm', 'poor_self_control']
      },
      {
        id: 'err_constantly',
        text: 'Постоянно на эмоциональных качелях',
        level: 1,
        zone: 'destructive',
        indicators: ['chronic_dysregulation', 'emotional_instability', 'borderline_features']
      }
    ]
  },

  // РАБОТА С ТЕНЬЮ
  {
    id: 'shadow_work_awareness',
    text: 'Что из теневых сторон вашей личности проявляется в близких отношениях?',
    category: 'validation',
    phase: 'validation',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'swa_none',
        text: 'У меня практически нет теневых сторон в отношениях',
        level: 4, // Отрицание тени - признак незрелости
        zone: 'emotional',
        indicators: ['shadow_denial', 'perfectionist_self_image', 'projection_tendency']
      },
      {
        id: 'swa_control',
        text: 'Контроль, манипуляции, стремление доминировать',
        level: 3,
        zone: 'destructive',
        indicators: ['control_shadow', 'manipulation_tendency', 'domination_drive']
      },
      {
        id: 'swa_neediness',
        text: 'Чрезмерная потребность во внимании и одобрении',
        level: 3,
        zone: 'destructive',
        indicators: ['neediness_shadow', 'approval_seeking', 'attention_hunger']
      },
      {
        id: 'swa_aware',
        text: 'Вижу свои паттерны и работаю с ними осознанно',
        level: 8,
        zone: 'mature',
        indicators: ['shadow_awareness', 'conscious_work', 'pattern_recognition']
      },
      {
        id: 'swa_integrated',
        text: 'Принимаю теневые аспекты как часть целостности, интегрирую их',
        level: 10,
        zone: 'transcendent',
        indicators: ['shadow_integration', 'wholeness_acceptance', 'polarity_transcendence']
      }
    ]
  },

  // ЧЕСТНОСТЬ О НЕСЧАСТЬЕ
  {
    id: 'honesty_check_detailed',
    text: 'Если быть максимально честным/ой с собой - насколько часто в близких отношениях вы чувствуете себя несчастным/ой?',
    category: 'validation',
    phase: 'validation',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'hcd_never',
        text: 'Практически никогда, я счастлив/а в отношениях',
        level: 8,
        zone: 'mature',
        indicators: ['relationship_satisfaction', 'authentic_happiness']
      },
      {
        id: 'hcd_rarely',
        text: 'Редко, только в периоды стресса',
        level: 7,
        zone: 'mature',
        indicators: ['general_satisfaction', 'stress_awareness']
      },
      {
        id: 'hcd_sometimes',
        text: 'Иногда, есть моменты неудовлетворенности',
        level: 5,
        zone: 'emotional',
        indicators: ['mixed_satisfaction', 'occasional_unhappiness']
      },
      {
        id: 'hcd_often',
        text: 'Довольно часто, чувствую фрустрацию',
        level: 3,
        zone: 'destructive',
        indicators: ['frequent_unhappiness', 'relationship_frustration']
      },
      {
        id: 'hcd_mostly',
        text: 'Большую часть времени, но стараюсь не показывать',
        level: 2,
        zone: 'destructive',
        indicators: ['chronic_unhappiness', 'emotional_suppression']
      }
    ]
  },

  // ВЛИЯНИЕ ЛИЧНОГО РОСТА НА ОТНОШЕНИЯ
  {
    id: 'personal_relationship_influence',
    text: 'Как ваш личный рост влияет на близкие отношения?',
    category: 'validation',
    phase: 'validation',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      {
        id: 'pri_negative',
        text: 'Чем больше я развиваюсь, тем больше проблем в отношениях',
        level: 3,
        zone: 'destructive',
        indicators: ['growth_conflict', 'relationship_strain', 'incompatibility_emergence']
      },
      {
        id: 'pri_neutral',
        text: 'Мой рост никак не связан с отношениями, это отдельные сферы',
        level: 5,
        zone: 'emotional',
        indicators: ['compartmentalization', 'disconnected_growth', 'separate_spheres']
      },
  {
        id: 'pri_positive',
        text: 'Мой рост делает меня лучше в отношениях и улучшает их качество',
        level: 8,
        zone: 'mature',
        indicators: ['integrated_growth', 'relationship_enhancement', 'mutual_benefit']
      },
      {
        id: 'pri_synergistic',
        text: 'Мой рост и отношения взаимно усиливают друг друга в едином процессе',
        level: 10,
        zone: 'transcendent',
        indicators: ['synergistic_development', 'mutual_amplification', 'unified_evolution']
      }
    ]
  }
,
  // ДОПОЛНИТЕЛЬНЫЕ ВОПРОСЫ ДЛЯ ПОКРЫТИЯ УРОВНЕЙ 3, 6, 9, 12
  {
    id: 'zone_add_emotional_pain',
    text: 'Как вы обычно переживаете эмоциональную боль?',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'personal',
    relationshipContext: 'both',
    options: [
      { id: 'zap_trauma', text: 'Полный упадок сил и ощущение безнадежности', level: 3, zone: 'destructive', indicators: ['emotional_collapse', 'hopelessness'] },
      { id: 'zap_coping', text: 'Сдерживаю эмоции и отвлекаюсь на работу/дела', level: 6, zone: 'emotional', indicators: ['avoidance_coping', 'emotional_suppression'] },
      { id: 'zap_processing', text: 'Осознанно проживаю чувства и ищу поддержку', level: 9, zone: 'mature', indicators: ['emotional_processing', 'support_seeking'] },
      { id: 'zap_transformation', text: 'Использую боль как ресурс для внутреннего роста', level: 12, zone: 'transcendent', indicators: ['pain_transformation', 'post_traumatic_growth'] }
    ]
  },
  {
    id: 'zone_add_conflict_strategy',
    text: 'Ваша типичная стратегия в значимых конфликтах?',
    category: 'zone_detection',
    phase: 'detection',
    aspectType: 'relationship',
    relationshipContext: 'both',
    options: [
      { id: 'zacs_attack', text: 'Атака или агрессивная защита своих границ', level: 3, zone: 'destructive', indicators: ['aggressive_defense', 'conflict_escalation'] },
      { id: 'zacs_compromise', text: 'Ищу компромисс, иногда уступаю ради мира', level: 6, zone: 'emotional', indicators: ['compromise', 'relationship_preservation'] },
      { id: 'zacs_dialogue', text: 'Открытый диалог о потребностях и чувствах', level: 9, zone: 'mature', indicators: ['open_dialogue', 'empathy'] },
      { id: 'zacs_co_create', text: 'Использую конфликт для совместного роста и улучшения связи', level: 12, zone: 'transcendent', indicators: ['co_creation', 'synergy_building'] }
    ]
  }
];

// ОБНОВЛЕНИЕ: Все вопросы смарт-системы  
export const allSmartQuestions: SmartQuestion[] = [
  ...relationshipStatusQuestions,
  ...zoneDetectionQuestions,
  ...coreDiagnosticQuestions,  // НОВАЯ ФАЗА
  ...zoneClarificationQuestions,
  ...validationQuestions
];
