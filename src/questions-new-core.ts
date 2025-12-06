import { SmartQuestion } from './types';

// ============================================================================
// ЗОНА 3: ЗРЕЛЫЕ ОТНОШЕНИЯ (УРОВНИ 7-9)
// ============================================================================

/**
 * УРОВЕНЬ 8: ЛЮБОВЬ И ПРИНЯТИЕ
 * Ключевые маркеры: безусловное принятие, отсутствие желания переделать партнера,
 * любовь как активное действие, а не просто чувство.
 */
export const level8_acceptance: SmartQuestion = {
    id: 'level-8-acceptance',
    text: {
        self: 'Как я отношусь к недостаткам и особенностям моего партнера?',
        partner: 'Как мой партнер относится к моим недостаткам и особенностям?',
        potential: 'В идеальных отношениях, как бы я хотел относиться к особенностям партнера?',
        pair_discussion: 'Как мы обычно относимся к недостаткам друг друга?',
    },
    category: 'acceptance',
    options: [
        {
            id: 'l8-unconditional',
            text: {
                self: 'Я принимаю партнера полностью. Его особенности — это часть его личности, которую я люблю. Я не пытаюсь его переделать.',
                partner: 'Он/она принимает меня полностью. Я чувствую, что меня любят таким/такой, какой я есть, без попыток исправить.',
                potential: 'Я хочу принимать партнера полностью, не пытаясь его переделать под себя.',
                pair_discussion: 'Мы принимаем друг друга полностью. Мы не пытаемся переделать друг друга.',
            },
            level: 8,
            indicators: ['unconditional-acceptance', 'no-change-pressure', 'mature-love'],
        },
        {
            id: 'l9-freedom-acceptance',
            text: {
                self: 'Я не только принимаю партнера, но и даю ему полную свободу быть собой и развиваться своим путем.',
                partner: 'Он/она дает мне полную свободу быть собой, не пытаясь ни контролировать, ни переделывать.',
                potential: 'Я хочу дарить партнеру свободу быть собой, без контроля и ограничений.',
                pair_discussion: 'Мы даем друг другу свободу быть собой и развиваться.',
            },
            level: 9,
            indicators: ['freedom-in-acceptance', 'autonomy-support', 'mature-freedom'],
        },
        {
            id: 'l6-conditional-image',
            text: {
                self: 'Я люблю его/ее, но мне важно, чтобы он/она соответствовал(а) определенным стандартам (внешность, поведение на людях).',
                partner: 'Он/она любит меня, но часто критикует, если я не соответствую его/ее представлениям о "правильном" партнере.',
                potential: 'Мне важно, чтобы партнер соответствовал моим стандартам и ожиданиям.',
                pair_discussion: 'Мы часто критикуем друг друга, если кто-то не соответствует ожиданиям или "позорит" нас.',
            },
            level: 6,
            indicators: ['conditional-love', 'image-focus', 'change-pressure'],
        },
        {
            id: 'l5-emotional-swing',
            text: {
                self: 'Когда у нас страсть — я обожаю его/ее недостатки, но в ссоре я их ненавижу и хочу, чтобы он/она стал(а) другим(ой).',
                partner: 'Его/ее отношение зависит от настроения: то обожает, то ненавидит мои привычки.',
                potential: 'Я понимаю, что мои чувства будут зависеть от страсти: от обожания до раздражения.',
                pair_discussion: 'Наше принятие зависит от эмоционального фона: то мы идеализируем, то обесцениваем друг друга.',
            },
            level: 5,
            indicators: ['emotional-instability', 'splitting', 'idealization-devaluation'],
        },
        {
            id: 'l3-fear-loss',
            text: {
                self: 'Я терплю его/ее недостатки, потому что боюсь остаться один/одна или потерять стабильность.',
                partner: 'Он/она терпит меня, скорее всего, из страха одиночества или привычки.',
                potential: 'Я готов(а) терпеть многое, лишь бы не быть одному/одной.',
                pair_discussion: 'Мы терпим недостатки друг друга, потому что боимся разрушить семью или остаться одни.',
            },
            level: 3,
            indicators: ['tolerance-fear', 'survival-mode', 'fear-of-loss'],
        },
        {
            id: 'l10-growth-catalyst',
            text: {
                self: 'Я не просто принимаю его/ее, я вижу в его/ее особенностях потенциал для нашего общего роста и усиления.',
                partner: 'Он/она видит в моих особенностях силу и помогает мне их раскрыть для общего блага.',
                potential: 'Я хочу видеть в партнере союзника, чьи особенности усиливают нас.',
                pair_discussion: 'Мы видим в особенностях друг друга ресурс для развития нашей пары.',
            },
            level: 10,
            indicators: ['synergy', 'growth-mindset', 'resource-view'],
        },
    ],
    targetLevels: [3, 5, 6, 8, 9, 10],
    priority: 1,
};

// ============================================================================
// ЗОНА 1: ДЕСТРУКТИВНЫЕ ОТНОШЕНИЯ (УРОВНИ 1-3)
// ============================================================================

export const level1_traumaNormalization: SmartQuestion = {
    id: 'level-1-trauma-normalization',
    text: {
        self: 'Когда в наших отношениях возникает сложный момент, я часто думаю:',
        partner: 'Мой партнер в сложных моментах обычно:',
        potential: 'Я бы не хотел(а), чтобы в отношениях возникало чувство:',
        pair_discussion: 'В наших отношениях во время конфликтов часто:',
    },
    category: 'trauma',
    options: [
        {
            id: 'l1-norm-violence',
            text: {
                self: 'Это нормально — в отношениях всегда были оскорбления или угрозы, это "цена любви".',
                partner: 'Считает, что оскорбления или жесткое давление — это нормально.',
                potential: 'Что насилие или унижение — это нормальная часть любви.',
                pair_discussion: 'Мы считаем, что бурные ссоры с оскорблениями — это нормально.',
            },
            level: 1,
            indicators: ['trauma-normalization', 'violence-acceptance', 'distorted-beliefs'],
        },
        {
            id: 'l1-helpless',
            text: {
                self: 'Я ничего не могу с этим поделать, я бессилен/бессильна, так устроена моя жизнь.',
                partner: 'Ведет себя так, будто ничего не может изменить, полная беспомощность.',
                potential: 'Что я буду чувствовать полное бессилие что-то изменить.',
                pair_discussion: 'Мы оба чувствуем, что застряли и ничего не можем изменить.',
            },
            level: 1,
            indicators: ['learned-helplessness', 'powerlessness', 'despair'],
        },
        {
            id: 'l2-cycle-hope',
            text: {
                self: 'Кажется, это повторяется снова и снова (сценарий), но я надеюсь, что в этот раз все изменится.',
                partner: 'Обещает измениться, и я верю, хотя это повторяется по кругу.',
                potential: 'Что я снова попаду в тот же замкнутый круг, что и раньше.',
                pair_discussion: 'Мы ходим по кругу: ссора - обещания - примирение - снова ссора.',
            },
            level: 2,
            indicators: ['karmic-cycle', 'pattern-recognition', 'false-hope'],
        },
        {
            id: 'l7-healthy-conflict',
            text: {
                self: 'Мы говорим честно о проблемах, не переходя в оскорбления, сохраняя уважение.',
                partner: 'Он/она всегда сохраняет уважение, даже если мы спорим.',
                potential: 'Я хочу, чтобы мы решали проблемы через честный диалог без унижений.',
                pair_discussion: 'Мы обсуждаем проблемы уважительно, без перехода на личности.',
            },
            level: 7,
            indicators: ['healthy-communication', 'respect', 'emotional-safety'],
        },
    ],
    targetLevels: [1, 2, 7],
    priority: 1,
};

export const level2_karmicCycle: SmartQuestion = {
    id: 'level-2-karmic-cycle',
    text: {
        self: 'В наших отношениях я часто:',
        partner: 'Мой партнер часто:',
        potential: 'Я хотел(а) бы, чтобы в отношениях:',
        pair_discussion: 'В нашей динамике часто происходит:',
    },
    category: 'patterns',
    options: [
        {
            id: 'l2-cycle-repeat',
            text: {
                self: 'Повторяю один и тот же сценарий: ухожу, тоскую, возвращаюсь, снова конфликт.',
                partner: 'Повторяет один и тот же цикл: уходит, возвращается, обещает, срывается.',
                potential: 'Я боюсь повторить старый сценарий: уход - возвращение - боль.',
                pair_discussion: 'Мы застряли в цикле: ссоримся, расходимся, сходимся, и все по новой.',
            },
            level: 2,
            indicators: ['karmic-cycle', 'repetition-compulsion', 'pattern-loop'],
        },
        {
            id: 'l2-childhood-replay',
            text: {
                self: 'Чувствую, что играю роль из своего детства (жертва, спасатель или агрессор).',
                partner: 'Ведет себя как ребенок или как строгий родитель, проигрывая старые роли.',
                potential: 'Я не хочу снова играть роль жертвы или спасателя, как в прошлом.',
                pair_discussion: 'Мы разыгрываем роли (мама-сын, папа-дочка) вместо партнерства.',
            },
            level: 2,
            indicators: ['childhood-reenactment', 'role-replay', 'family-dynamics'],
        },
        {
            id: 'l2-hope-illusion',
            text: {
                self: 'Верю, что "в этот раз будет иначе", хотя все повторяется.',
                partner: 'Верит, что все изменится само собой, без реальной работы.',
                potential: 'Я надеюсь, что в новых отношениях все само собой будет иначе.',
                pair_discussion: 'Мы надеемся на чудо, но не меняем своего поведения.',
            },
            level: 2,
            indicators: ['false-hope', 'denial', 'illusion'],
        },
        {
            id: 'l7-awareness',
            text: {
                self: 'Вижу наши паттерны и активно работаю над тем, чтобы их изменить.',
                partner: 'Осознает наши проблемы и готов(а) работать над их решением.',
                potential: 'Я хочу осознанно строить отношения, замечая и меняя плохие привычки.',
                pair_discussion: 'Мы видим наши "грабли" и вместе учимся их обходить.',
            },
            level: 7,
            indicators: ['pattern-awareness', 'conscious-work', 'growth-mindset'],
        },
    ],
    targetLevels: [1, 2, 7],
    priority: 1,
};

export const level3_survivalFear: SmartQuestion = {
    id: 'level-3-survival-fear',
    text: {
        self: 'Если я буду честен(на), главная причина, почему я остаюсь:',
        partner: 'Мой партнер остается со мной, потому что:',
        potential: 'Я бы хотел(а) быть в отношениях, потому что:',
        pair_discussion: 'Честно говоря, мы остаемся вместе, потому что:',
    },
    category: 'values',
    options: [
        {
            id: 'l3-fear-alone',
            text: {
                self: 'Я боюсь остаться один/одна — жизнь кажется пустой или страшной без партнера.',
                partner: 'Он/она боится одиночества и не может быть один/одна.',
                potential: 'Я не хочу быть один/одна, мне нужен кто-то рядом.',
                pair_discussion: 'Мы боимся одиночества и держимся друг за друга как за спасательный круг.',
            },
            level: 3,
            indicators: ['abandonment-terror', 'survival-fear', 'enmeshment'],
        },
        {
            id: 'l3-financial-depend',
            text: {
                self: 'Я финансово или жилищно зависим(а) и не вижу выхода.',
                partner: 'Он/она зависит от меня финансово или жилищно.',
                potential: 'Мне нужна финансовая поддержка и опора в жизни.',
                pair_discussion: 'Нас держит вместе ипотека, дети или общий быт, а не чувства.',
            },
            level: 3,
            indicators: ['financial-dependence', 'economic-vulnerability', 'survival-anxiety'],
        },
        {
            id: 'l4-stable-enough',
            text: {
                self: 'Здесь стабильно и удобно. Нет большой любви, но есть комфорт.',
                partner: 'Ему/ей удобно со мной, я обеспечиваю комфорт и быт.',
                potential: 'Я ищу стабильности и предсказуемости, пусть и без страсти.',
                pair_discussion: 'Нам удобно вместе, у нас налаженный быт, и это главное.',
            },
            level: 4,
            indicators: ['practical-partnership', 'stability-focus', 'comfort-seeking'],
        },
        {
            id: 'l8-authentic',
            text: {
                self: 'Я здесь, потому что люблю и уважаю эту личность. Это мой свободный выбор.',
                partner: 'Он/она со мной по любви и свободному выбору, а не из нужды.',
                potential: 'Я хочу быть с человеком только по любви, а не из страха или нужды.',
                pair_discussion: 'Мы вместе, потому что выбираем друг друга каждый день.',
            },
            level: 8,
            indicators: ['conscious-choice', 'authentic-love', 'freedom-in-connection'],
        },
        {
            id: 'l9-sovereign',
            text: {
                self: 'Я полностью самодостаточен. Я не нуждаюсь в партнере, но сознательно выбираю быть с ним.',
                partner: 'Он/она полностью самодостаточен, выбирает меня осознанно, а не из нужды.',
                potential: 'Я хочу быть самодостаточным и выбирать партнера свободно.',
                pair_discussion: 'Мы две целостные личности, которые выбирают быть вместе.',
            },
            level: 9,
            indicators: ['sovereignty', 'self-sufficiency', 'volitional-love'],
        },
    ],
    targetLevels: [3, 4, 8, 9],
    priority: 1,
};

export const level4_domesticStability: SmartQuestion = {
    id: 'level-4-domestic-stability',
    text: {
        self: 'Что мне нравится в наших отношениях больше всего:',
        partner: 'Мой партнер ценит в отношениях больше всего:',
        potential: 'Я хотел(а) бы, чтобы главное в отношениях было:',
        pair_discussion: 'Мы ценим в отношениях больше всего:',
    },
    category: 'values',
    options: [
        {
            id: 'l4-comfort-stability',
            text: {
                self: 'Комфорт, порядок, предсказуемость. Все на своих местах.',
                partner: 'Порядок, вкусную еду, чистоту и финансовую стабильность.',
                potential: 'Стабильность, надежность и налаженный быт.',
                pair_discussion: 'Наш налаженный быт, порядок и предсказуемость завтрашнего дня.',
            },
            level: 4,
            indicators: ['comfort-seeking', 'domestic-focus', 'role-clarity'],
        },
        {
            id: 'l4-no-deep-talk',
            text: {
                self: 'Мы редко говорим о чувствах, но как "команда по хозяйству" мы эффективны.',
                partner: 'Не любит разговоры о чувствах, предпочитает дела и конкретику.',
                potential: 'Я не люблю лишних драм и разговоров, главное — дела.',
                pair_discussion: 'Мы мало говорим по душам, но отлично ведем хозяйство.',
            },
            level: 4,
            indicators: ['emotional-distance', 'functional-relationship'],
        },
        {
            id: 'l5-passion-drama',
            text: {
                self: 'Эмоции, страсть, искра! Без этого мне скучно.',
                partner: 'Ищет страсти, эмоций, драйва, иначе скучает.',
                potential: 'Я хочу страсти, огня и ярких эмоций.',
                pair_discussion: 'Нас объединяет страсть и сильные эмоции.',
            },
            level: 5,
            indicators: ['passion-priority', 'emotional-intensity', 'drama-seeking'],
        },
        {
            id: 'l7-both-aspects',
            text: {
                self: 'И удобство, И глубокая близость. Мы заботимся и о быте, и о душе.',
                partner: 'Ценит и наш уют, и наши глубокие разговоры.',
                potential: 'Я хочу гармонии: и налаженный быт, и глубокая душевная связь.',
                pair_discussion: 'У нас гармония между бытом и душевной близостью.',
            },
            level: 7,
            indicators: ['balance', 'integrated-connection', 'wholeness'],
        },
    ],
    targetLevels: [4, 5, 7],
    priority: 2,
};

export const level5_passionIntensity: SmartQuestion = {
    id: 'level-5-passion-intensity',
    text: {
        self: 'Моя любовь — это прежде всего:',
        partner: 'Любовь моего партнера проявляется через:',
        potential: 'В отношениях я хотел(а) бы испытывать:',
        pair_discussion: 'Между нами чаще всего:',
    },
    category: 'emotions',
    options: [
        {
            id: 'l5-passion-required',
            text: {
                self: 'Сильные эмоции, ревность, страсть. Если ровно — значит, любви нет.',
                partner: 'Бурные эмоции, ревность. Считает, что "бьет — значит любит" (метафорически).',
                potential: 'Я хочу безумной страсти, чтобы "сносило крышу".',
                pair_discussion: 'Искры летят! Страсть, ревность, бурные примирения.',
            },
            level: 5,
            indicators: ['passion-requirement', 'jealousy-validation', 'intensity-seeking'],
        },
        {
            id: 'l5-emotional-rollercoaster',
            text: {
                self: 'Эмоциональные качели: то люблю не могу, то ненавижу.',
                partner: 'То холоден, то горяч. Никогда не знаешь, чего ждать.',
                potential: 'Я понимаю, что склонен к качелям: от любви до ненависти.',
                pair_discussion: 'Мы живем как на вулкане: то идиллия, то война.',
            },
            level: 5,
            indicators: ['emotional-volatility', 'passion-conflict-cycle', 'instability'],
        },
        {
            id: 'l6-image-important',
            text: {
                self: 'Важно, чтобы мы красиво смотрелись вместе и вызывали восхищение.',
                partner: 'Заботится о том, как мы выглядим на людях, о нашем статусе.',
                potential: 'Я хочу красивых отношений, которым будут завидовать.',
                pair_discussion: 'Мы красивая пара, и нам важно поддерживать этот имидж.',
            },
            level: 6,
            indicators: ['image-focus', 'external-validation', 'social-comparison'],
        },
        {
            id: 'l8-stable-love',
            text: {
                self: 'Глубокая спокойная любовь. Мне не нужны драмы, чтобы чувствовать связь.',
                partner: 'Любит спокойно и глубоко, без истерик и качелей.',
                potential: 'Я хочу спокойной, глубокой и надежной любви.',
                pair_discussion: 'У нас глубокая, ровная любовь и полное доверие.',
            },
            level: 8,
            indicators: ['secure-love', 'emotional-stability', 'mature-attachment'],
        },
    ],
    targetLevels: [5, 6, 8],
    priority: 2,
};

export const level6_socialStatus: SmartQuestion = {
    id: 'level-6-social-status',
    text: {
        self: 'Когда я думаю о наших отношениях, для меня важнее всего:',
        partner: 'Для моего партнера в отношениях важнее всего:',
        potential: 'Я бы хотел(а), чтобы наши отношения были ценны:',
        pair_discussion: 'Для нас важнее всего, что наши отношения:',
    },
    category: 'values',
    options: [
        {
            id: 'l6-social-image',
            text: {
                self: 'Как мы выглядим для окружающих — статус, "правильная семья", одобрение близких.',
                partner: 'Что о нас подумают другие, наш статус и репутация.',
                potential: 'Тем, как они выглядят со стороны и какой статус мне дают.',
                pair_discussion: 'Выглядят идеально в глазах общества и родителей.',
            },
            level: 6,
            indicators: ['image-focus', 'external-validation', 'social-conformity'],
        },
        {
            id: 'l6-traditional-roles',
            text: {
                self: 'Соответствие традиционным ролям (мужчина/женщина), чтобы все было "как у людей".',
                partner: 'Чтобы я соответствовал(а) своей роли (хозяйки/добытчика).',
                potential: 'Чтобы каждый четко знал свое место и роль.',
                pair_discussion: 'Мы следуем традициям и правилам, так надежнее.',
            },
            level: 6,
            indicators: ['role-conformity', 'tradition-focus', 'social-expectation'],
        },
        {
            id: 'l6-mask-important',
            text: {
                self: 'На публике мы идеальная пара, но дома часто скрываем проблемы.',
                partner: 'На людях — идеален, дома — совсем другой человек.',
                potential: 'Я готов(а) скрывать проблемы, лишь бы внешне все было хорошо.',
                pair_discussion: 'Мы носим маски "счастливой семьи", скрывая суть.',
            },
            level: 6,
            indicators: ['public-private-split', 'facade', 'mask-consciousness'],
        },
        {
            id: 'l5-passion-excitement',
            text: {
                self: 'Эмоциональная интенсивность и возбуждение важнее статуса.',
                partner: 'Ищет эмоций и драйва, а не статуса.',
                potential: 'Я хочу драйва, а не скучной "правильной" жизни.',
                pair_discussion: 'Нам плевать на мнение других, главное — наши эмоции.',
            },
            level: 5,
            indicators: ['passion-priority', 'excitement-seeking', 'intensity-focus'],
        },
    ],
    targetLevels: [5, 6],
    priority: 2,
};

export const level7_psychologicalConnection: SmartQuestion = {
    id: 'level-7-psych-connection',
    text: {
        self: 'В отношениях я чувствую себя:',
        partner: 'Со мной партнер может быть:',
        potential: 'Я хотел(а) бы, чтобы мои отношения были:',
        pair_discussion: 'Между нами:',
    },
    category: 'intimacy',
    options: [
        {
            id: 'l7-emotionally-safe',
            text: {
                self: 'Эмоционально безопасно — я могу открыто говорить о чувствах, мне верят.',
                partner: 'Открытым и честным, он(а) не боится быть уязвимым со мной.',
                potential: 'Безопасным пространством, где можно быть уязвимым.',
                pair_discussion: 'Есть глубокое доверие и безопасность, мы не раним друг друга.',
            },
            level: 7,
            indicators: ['emotional-safety', 'vulnerability', 'trust'],
        },
        {
            id: 'l7-deeply-understood',
            text: {
                self: 'Глубоко понятым(ой) — партнер видит мой внутренний мир.',
                partner: 'Понятым(ой), я вижу его/ее суть и принимаю это.',
                potential: 'Местом, где меня понимают без слов.',
                pair_discussion: 'Мы понимаем друг друга с полуслова, глубокая связь.',
            },
            level: 7,
            indicators: ['deep-understanding', 'seen-ness', 'empathy'],
        },
        {
            id: 'l7-genuine-interest',
            text: {
                self: 'Мне интересен внутренний мир партнера, я хочу помочь ему расти.',
                partner: 'Интересуется моим ростом и развитием искренне.',
                potential: 'Я хочу партнера, которому будет интересен мой внутренний мир.',
                pair_discussion: 'Мы искренне интересуемся развитием друг друга.',
            },
            level: 7,
            indicators: ['genuine-interest', 'growth-support', 'personal-investment'],
        },
        {
            id: 'l6-mask-stays',
            text: {
                self: 'Мне нужно показывать только лучшую версию себя, оставаться в "роли".',
                partner: 'Держит дистанцию, не пускает в свой внутренний мир.',
                potential: 'Я боюсь открываться, лучше быть в защитной маске.',
                pair_discussion: 'Мы держим дистанцию и не лезем в душу друг другу.',
            },
            level: 6,
            indicators: ['mask-maintenance', 'selective-disclosure', 'role-focus'],
        },
    ],
    targetLevels: [6, 7],
    priority: 1,
};

export const level9_freedomMaturity: SmartQuestion = {
    id: 'level-9-freedom-maturity',
    text: {
        self: 'В наших отношениях я чувствую себя:',
        partner: 'Мой партнер чувствует себя со мной:',
        potential: 'Я бы хотел(а), чтобы в отношениях я был(а):',
        pair_discussion: 'Мы оба чувствуем себя:',
    },
    category: 'freedom',
    options: [
        {
            id: 'l9-fully-free',
            text: {
                self: 'Полностью свободным(ой) — я могу быть собой, заниматься своим делом.',
                partner: 'Свободным(ой), я не ограничиваю его/ее свободу.',
                potential: 'Свободным(ой) человеком, которого любят, а не ограничивают.',
                pair_discussion: 'Свободными людьми, которые выбирают быть вместе.',
            },
            level: 9,
            indicators: ['personal-freedom', 'autonomy', 'self-expression'],
        },
        {
            id: 'l9-no-fear-loss',
            text: {
                self: 'Не боюсь потерять партнера — я уверен(а) в том, что мы вместе по выбору.',
                partner: 'Уверенным(ой) в нас, без страха и ревности.',
                potential: 'Уверенным(ой) в себе, без страха одиночества.',
                pair_discussion: 'У нас нет страха потери, есть доверие и выбор.',
            },
            level: 9,
            indicators: ['secure-attachment', 'no-abandonment-fear', 'trust'],
        },
        {
            id: 'l9-conscious-choice',
            text: {
                self: 'Я выбираю быть с этим человеком каждый день, потому что люблю.',
                partner: 'Выбирает меня каждый день осознанно.',
                potential: 'Я хочу, чтобы мы выбирали друг друга каждый день заново.',
                pair_discussion: 'Мы вместе не по привычке, а по ежедневному выбору.',
            },
            level: 9,
            indicators: ['conscious-choice', 'freedom-in-commitment', 'volitional-presence'],
        },
        {
            id: 'l8-accepted',
            text: {
                self: 'Принимаемым(ой) и любимым(ой), но иногда мне хотелось бы больше свободы.',
                partner: 'Любимым(ой), но иногда я его/ее немного ограничиваю.',
                potential: 'Я хочу принятия, но боюсь потерять свободу.',
                pair_discussion: 'Мы принимаем друг друга, но учимся давать свободу.',
            },
            level: 8,
            indicators: ['acceptance', 'some-autonomy', 'growing-freedom'],
        },
        {
            id: 'l3-trapped-dependent',
            text: {
                self: 'Я зависим(а) и не могу быть собой из страха потерять партнера.',
                partner: 'Зависим(а) от меня, боится сделать шаг без одобрения.',
                potential: 'Я боюсь попасть в зависимость и потерять себя.',
                pair_discussion: 'Мы зависимы друг от друга, нам страшно поодиночке.',
            },
            level: 3,
            indicators: ['dependence', 'fear-based', 'trapped'],
        },
    ],
    targetLevels: [3, 8, 9],
    priority: 1,
};

// ============================================================================
// ЗОНА 4: ТРАНСЦЕНДЕНТНЫЕ ОТНОШЕНИЯ (УРОВНИ 10-12)
// ============================================================================

export const level10_synergy: SmartQuestion = {
    id: 'level-10-synergy',
    text: {
        self: 'Когда мы действуем вместе, я чувствую:',
        partner: 'В совместных делах мой партнер:',
        potential: 'Я хочу, чтобы совместная жизнь была:',
        pair_discussion: 'Вместе мы:',
    },
    category: 'growth',
    options: [
        {
            id: 'l10-synergy-effect',
            text: {
                self: 'Что мы усиливаем друг друга: 1+1=11. Вместе мы можем больше, чем по отдельности.',
                partner: 'Раскрывается рядом со мной, его таланты усиливаются.',
                potential: 'Источником взаимного усиления и роста.',
                pair_discussion: 'Создаем синергию: наши различия делают нас сильнее.',
            },
            level: 10,
            indicators: ['synergy', 'mutual-amplification', 'resource-expansion'],
        },
        {
            id: 'l10-flow-state',
            text: {
                self: 'Состояние потока. Мы понимаем друг друга без слов и действуем как единый организм.',
                partner: 'Находится со мной на одной волне, мы действуем синхронно.',
                potential: 'Потоком, где мы действуем как единое целое.',
                pair_discussion: 'Часто входим в состояние потока и сотворчества.',
            },
            level: 10,
            indicators: ['flow-state', 'synchronicity', 'intuitive-connection'],
        },
        {
            id: 'l9-parallel-lives',
            text: {
                self: 'Мы две сильные личности, каждый успешен в своем, но мы не всегда пересекаемся.',
                partner: 'Успешен в своем деле, я в своем. Мы поддерживаем, но не смешиваем.',
                potential: 'Союзом двух независимых успешных людей.',
                pair_discussion: 'Мы параллельно развиваемся, каждый в своей сфере.',
            },
            level: 9,
            indicators: ['parallel-growth', 'independence', 'mutual-respect'],
        },
        {
            id: 'l4-functional-team',
            text: {
                self: 'Мы хорошая команда для решения бытовых задач и воспитания детей.',
                partner: 'Хороший напарник в быту и делах.',
                potential: 'Эффективным партнерством для жизни и семьи.',
                pair_discussion: 'Мы эффективно решаем жизненные задачи.',
            },
            level: 4,
            indicators: ['functional-cooperation', 'pragmatism', 'role-efficiency'],
        },
    ],
    targetLevels: [4, 9, 10],
    priority: 1,
};

export const level11_creation: SmartQuestion = {
    id: 'level-11-creation',
    text: {
        self: 'Главный смысл нашего союза я вижу в:',
        partner: 'Для партнера смысл нашего союза в:',
        potential: 'Я хочу, чтобы смыслом отношений было:',
        pair_discussion: 'Мы вместе ради:',
    },
    category: 'creation',
    options: [
        {
            id: 'l11-create-new',
            text: {
                self: 'Создании чего-то нового (проекты, идеи, дети, искусство), что меняет мир.',
                partner: 'Том, чтобы мы вместе создавали что-то ценное для мира.',
                potential: 'Совместного творчества и создания нового.',
                pair_discussion: 'Того, чтобы оставить след и создать что-то прекрасное.',
            },
            level: 11,
            indicators: ['co-creation', 'generativity', 'legacy'],
        },
        {
            id: 'l11-mission',
            text: {
                self: 'Реализации нашей общей миссии. Мы вместе служим чему-то большему.',
                partner: 'Видит в нас соратников по общей миссии.',
                potential: 'Служения общей высокой цели.',
                pair_discussion: 'Нас объединяет общая миссия и ценности.',
            },
            level: 11,
            indicators: ['shared-mission', 'purpose-driven', 'transcendent-goal'],
        },
        {
            id: 'l7-happiness',
            text: {
                self: 'Том, чтобы быть счастливыми и наслаждаться обществом друг друга.',
                partner: 'Том, чтобы нам было хорошо вместе.',
                potential: 'Личного счастья и гармонии.',
                pair_discussion: 'Мы просто хотим быть счастливы вместе.',
            },
            level: 7,
            indicators: ['hedonism', 'happiness-focus', 'relational-satisfaction'],
        },
        {
            id: 'l3-survival',
            text: {
                self: 'Выживании. Вместе легче справляться с трудностями жизни.',
                partner: 'Том, чтобы выжить в этом сложном мире.',
                potential: 'Того, чтобы было на кого опереться в трудную минуту.',
                pair_discussion: 'Мы держимся вместе, чтобы выстоять.',
            },
            level: 3,
            indicators: ['survival-strategy', 'safety-seeking', 'defense-alliance'],
        },
    ],
    targetLevels: [3, 7, 11],
    priority: 1,
};

export const level12_service: SmartQuestion = {
    id: 'level-12-service',
    text: {
        self: 'Наша любовь ощущается мной как:',
        partner: 'Его/ее любовь ощущается как:',
        potential: 'Я хочу, чтобы любовь была:',
        pair_discussion: 'Наша любовь:',
    },
    category: 'transcendence',
    options: [
        {
            id: 'l12-divine-love',
            text: {
                self: 'Поток безусловной любви, который проходит через нас к миру.',
                partner: 'Свет, который согревает не только меня, но и всех вокруг.',
                potential: 'Источником света и любви для мира.',
                pair_discussion: 'Мы проводники любви, наша связь исцеляет пространство вокруг.',
            },
            level: 12,
            indicators: ['agape', 'universal-love', 'divine-connection'],
        },
        {
            id: 'l12-unity',
            text: {
                self: 'Полное единство, где нет "я" и "ты", а есть одно целое с Мирозданием.',
                partner: 'Ощущение единства душ, выходящее за пределы физического.',
                potential: 'Духовным единством и растворением в любви.',
                pair_discussion: 'Мы чувствуем единство со всем сущим через нашу любовь.',
            },
            level: 12,
            indicators: ['oneness', 'non-duality', 'spiritual-union'],
        },
        {
            id: 'l8-deep-acceptance',
            text: {
                self: 'Глубокое человеческое принятие и тепло.',
                partner: 'Теплое, земное, надежное чувство.',
                potential: 'Глубоким и теплым человеческим чувством.',
                pair_discussion: 'У нас очень теплая и человечная любовь.',
            },
            level: 8,
            indicators: ['human-love', 'warmth', 'deep-affection'],
        },
    ],
    targetLevels: [8, 12],
    priority: 1,
};

export const level10_flow: SmartQuestion = {
    id: 'level-10-flow',
    text: {
        self: 'В лучшие моменты наших отношений я ощущаю:',
        partner: 'В моменты близости партнер ощущает:',
        potential: 'Я хочу, чтобы отношения давали ощущение:',
        pair_discussion: 'В моменты пиковой близости мы ощущаем:',
    },
    category: 'transcendence',
    options: [
        {
            id: 'l10-flow-state',
            text: {
                self: 'Потока. Мы понимаем друг друга без слов, границы стираются, но я остаюсь собой.',
                partner: 'Потока и глубокой синхронизации со мной.',
                potential: 'Потока и интуитивного понимания.',
                pair_discussion: 'Мы входим в резонанс, где 1+1=11.',
            },
            level: 10,
            indicators: ['flow', 'resonance', 'synergy'],
        },
        {
            id: 'l5-passion-peak',
            text: {
                self: 'Острого пика эмоций, экстаза, за которым следует спад.',
                partner: 'Эмоционального пика и разрядки.',
                potential: 'Ярких вспышек страсти.',
                pair_discussion: 'У нас бывают яркие вспышки, но потом мы "остываем".',
            },
            level: 5,
            indicators: ['peak-experience', 'instability', 'intensity'],
        },
        {
            id: 'l12-dissolution',
            text: {
                self: 'Полного растворения в Любви. Меня нет, есть только Мы и Бог (Вселенная).',
                partner: 'Растворения в чем-то большем, чем мы.',
                potential: 'Духовного растворения и единства.',
                pair_discussion: 'Мы исчезаем как личности и становимся чистой любовью.',
            },
            level: 12,
            indicators: ['dissolution', 'transcendence', 'unity'],
        },
    ],
    targetLevels: [5, 10, 12],
    priority: 2,
};

export const level12_unity: SmartQuestion = {
    id: 'level-12-unity',
    text: {
        self: 'Моя конечная цель в любви:',
        partner: 'Его/ее высшая цель в любви:',
        potential: 'Моя высшая цель в отношениях:',
        pair_discussion: 'Наша высшая цель:',
    },
    category: 'transcendence',
    options: [
        {
            id: 'l12-service-world',
            text: {
                self: 'Стать источником света для мира. Наша любовь — это служение.',
                partner: 'Служение миру через нашу любовь.',
                potential: 'Служение миру и людям.',
                pair_discussion: 'Мы вместе, чтобы сделать этот мир светлее.',
            },
            level: 12,
            indicators: ['service', 'bodhisattva-vow', 'world-centric'],
        },
        {
            id: 'l9-self-actualization',
            text: {
                self: 'Взаимное развитие и реализация потенциала каждого.',
                partner: 'Помощь друг другу в самореализации.',
                potential: 'Максимальная самореализация рядом с партнером.',
                pair_discussion: 'Мы помогаем друг другу стать лучшими версиями себя.',
            },
            level: 9,
            indicators: ['self-actualization', 'growth', 'partnership'],
        },
        {
            id: 'l7-harmony',
            text: {
                self: 'Жить в гармонии, без ссор и конфликтов.',
                partner: 'Спокойная и гармоничная жизнь.',
                potential: 'Простое человеческое счастье.',
                pair_discussion: 'Мы хотим спокойной и счастливой жизни.',
            },
            level: 7,
            indicators: ['harmony', 'peace', 'balance'],
        },
    ],
    targetLevels: [7, 9, 12],
    priority: 2,
};

// ============================================================================
// ВОПРОСЫ ЗОНИРОВАНИЯ (ZONING PHASE)
// ============================================================================

export const zone_conflict: SmartQuestion = {
    id: 'zone-conflict-001',
    text: {
        self: 'Когда у нас возникает серьезный конфликт, обычно:',
        partner: 'В конфликте партнер обычно:',
        potential: 'В конфликте я бы реагировал(а):',
        pair_discussion: 'Наши конфликты обычно проходят так:',
    },
    category: 'conflict',
    options: [
        {
            id: 'z-destr-violence',
            text: {
                self: 'Есть крики, оскорбления, угрозы или полное игнорирование (бойкот).',
                partner: 'Переходит на личности, оскорбляет или угрожает уйти.',
                potential: 'Срывом в агрессию или уходом в себя.',
                pair_discussion: 'Мы часто переходим границы: крики, оскорбления, хлопанье дверьми.',
            },
            level: 2,
            indicators: ['violence', 'abuse', 'destructive-conflict'],
        },
        {
            id: 'z-emot-drama',
            text: {
                self: 'Много эмоций, слез, обвинений, потом бурное примирение.',
                partner: 'Драматизирует, давит на жалость или вину.',
                potential: 'Бурно, с эмоциями и последующим сладким примирением.',
                pair_discussion: 'Это эмоциональная буря, но мы быстро отходим.',
            },
            level: 5,
            indicators: ['drama', 'emotional-manipulation', 'intensity'],
        },
        {
            id: 'z-mat-dialogue',
            text: {
                self: 'Мы садимся и обсуждаем проблему, стараясь понять друг друга.',
                partner: 'Готов выслушать и искать решение, не нападая.',
                potential: 'Попыткой понять точку зрения партнера и найти компромисс.',
                pair_discussion: 'Мы обсуждаем факты и чувства, ищем решение win-win.',
            },
            level: 7,
            indicators: ['constructive-dialogue', 'respect', 'problem-solving'],
        },
        {
            id: 'z-mature-freedom',
            text: {
                self: 'Каждый может отстоять свою позицию без угрозы для отношений. Мы не боимся разногласий.',
                partner: 'Уважает мое право на отличающееся мнение, не воспринимает как угрозу.',
                potential: 'Спокойно, сохраняя уважение к своим и чужим границам.',
                pair_discussion: 'Разногласия не угрожают нашей связи, мы можем быть разными.',
            },
            level: 9,
            indicators: ['differentiation', 'autonomy-in-conflict', 'secure-disagreement'],
        },
        {
            id: 'z-trans-growth',
            text: {
                self: 'Мы видим в конфликте сигнал для роста и вместе ищем корень проблемы.',
                partner: 'Воспринимает конфликт как урок для нас обоих.',
                potential: 'Как возможность узнать что-то новое о себе и партнере.',
                pair_discussion: 'Конфликт делает нас ближе и мудрее, мы трансформируем его в опыт.',
            },
            level: 10,
            indicators: ['conflict-as-growth', 'wisdom', 'transformation'],
        },
    ],
    targetLevels: [2, 5, 7, 9, 10],
    priority: 1,
};

export const zone_safety: SmartQuestion = {
    id: 'zone-safety-002',
    text: {
        self: 'Мое базовое ощущение в этих отношениях:',
        partner: 'Рядом со мной партнер чувствует:',
        potential: 'Я хочу чувствовать в отношениях:',
        pair_discussion: 'Атмосфера в нашей паре:',
    },
    category: 'intimacy',
    options: [
        {
            id: 'z-destr-fear',
            text: {
                self: 'Тревога, страх сделать что-то не так, ожидание подвоха.',
                partner: 'Напряжение, страх моей реакции.',
                potential: 'Я боюсь, что мне сделают больно.',
                pair_discussion: 'Напряженная, мы ходим как по минному полю.',
            },
            level: 3,
            indicators: ['anxiety', 'fear', 'walking-on-eggshells'],
        },
        {
            id: 'z-emot-swing',
            text: {
                self: 'То эйфория и счастье, то холод и отчуждение. Нет стабильности.',
                partner: 'Неуверенность: любит - не любит.',
                potential: 'Я готов к перепадам настроения ради ярких чувств.',
                pair_discussion: 'Переменчивая: от страсти до холода.',
            },
            level: 5,
            indicators: ['instability', 'ambivalence', 'emotional-swing'],
        },
        {
            id: 'z-mat-trust',
            text: {
                self: 'Спокойствие, надежность, тепло. Я знаю, что меня не предадут.',
                partner: 'Спокойствие и уверенность в завтрашнем дне.',
                potential: 'Глубокое спокойствие и доверие.',
                pair_discussion: 'Теплая, доверительная, безопасная гавань.',
            },
            level: 8,
            indicators: ['safety', 'trust', 'secure-base'],
        },
        {
            id: 'z-mature-autonomy',
            text: {
                self: 'Внутренняя свобода и уверенность. Я не боюсь потерять партнера, потому что мы вместе по выбору.',
                partner: 'Свободен и уверен в себе, не цепляется за меня из страха.',
                potential: 'Свободу без страха потери, уверенность в осознанном выборе.',
                pair_discussion: 'Мы вместе не из страха одиночества, а из свободного выбора.',
            },
            level: 9,
            indicators: ['secure-autonomy', 'freedom-from-fear', 'conscious-choice'],
        },
        {
            id: 'z-trans-unity',
            text: {
                self: 'Глубокое духовное родство, ощущение "дома" на уровне души.',
                partner: 'Что мы — родные души, единое целое.',
                potential: 'Ощущение, что я вернулся Домой.',
                pair_discussion: 'Мы чувствуем сакральную связь и единство.',
            },
            level: 11,
            indicators: ['spiritual-safety', 'soul-connection', 'home'],
        },
    ],
    targetLevels: [3, 5, 8, 9, 11],
    priority: 1,
};

// ============================================================================
// ЭКСПОРТ ВСЕХ ВОПРОСОВ
// ============================================================================



export const zone_growth: SmartQuestion = {
    id: 'zone-growth-003',
    text: {
        self: 'Как наши отношения влияют на мое развитие?',
        partner: 'Как партнер влияет на мое развитие?',
        potential: 'Я хочу, чтобы отношения влияли на меня так:',
        pair_discussion: 'Как мы влияем на развитие друг друга?',
    },
    category: 'growth',
    options: [
        {
            id: 'z-destr-stagnation',
            text: {
                self: 'Я деградирую или стою на месте. Отношения отнимают все силы.',
                partner: 'Тянет меня вниз, запрещает развиваться или обесценивает успехи.',
                potential: 'Я боюсь, что отношения будут мешать мне развиваться.',
                pair_discussion: 'Мы мешаем друг другу, тянем вниз или стоим на месте.',
            },
            level: 2,
            indicators: ['stagnation', 'energy-drain', 'development-block'],
        },
        {
            id: 'z-emot-separate',
            text: {
                self: 'Мы развиваемся отдельно. У него свои интересы, у меня свои.',
                partner: 'Занят своими делами, мое развитие его мало волнует.',
                potential: 'Я хочу развиваться сам по себе, не завися от партнера.',
                pair_discussion: 'Каждый живет своей жизнью, мы мало пересекаемся в интересах.',
            },
            level: 4,
            indicators: ['parallel-lives', 'separation', 'lack-of-shared-growth'],
        },
        {
            id: 'z-mat-support',
            text: {
                self: 'Мы поддерживаем друг друга. Я радуюсь его успехам, он — моим.',
                partner: 'Мой главный болельщик, всегда поддержит и поможет.',
                potential: 'Я хочу взаимной поддержки и вдохновения.',
                pair_discussion: 'Мы — команда, мы помогаем друг другу расти.',
            },
            level: 8,
            indicators: ['mutual-support', 'encouragement', 'secure-base-for-exploration'],
        },
        {
            id: 'z-mature-parallel',
            text: {
                self: 'Каждый свободно развивается в своем направлении. Мы уважаем пути друг друга.',
                partner: 'Уважает мой путь развития, даже если он отличается от его.',
                potential: 'Свободу развиваться в своем направлении, сохраняя близость.',
                pair_discussion: 'Мы уважаем индивидуальные пути развития друг друга.',
            },
            level: 9,
            indicators: ['parallel-development', 'respect-for-path', 'individual-growth'],
        },
        {
            id: 'z-trans-synergy',
            text: {
                self: 'Вместе мы растем быстрее, чем поодиночке. Мы раскрываем скрытые таланты друг друга.',
                partner: 'Катализатор моего роста, рядом с ним я становлюсь лучшей версией себя.',
                potential: 'Я хочу синергии, где 1+1=11.',
                pair_discussion: 'Мы создаем поле, в котором невозможен застой, только эволюция.',
            },
            level: 10,
            indicators: ['synergy', 'catalyst', 'evolutionary-partnership'],
        },
    ],
    targetLevels: [2, 4, 8, 9, 10],
    priority: 1,
};

export const zone_intimacy: SmartQuestion = {
    id: 'zone-intimacy-004',
    text: {
        self: 'Насколько мы близки эмоционально и духовно?',
        partner: 'Насколько партнер близок мне?',
        potential: 'Какую близость я ищу?',
        pair_discussion: 'Какова глубина нашей близости?',
    },
    category: 'intimacy',
    options: [
        {
            id: 'z-destr-alienation',
            text: {
                self: 'Мы чужие люди. Живем как соседи или враги.',
                partner: 'Закрыт, холоден, я не знаю, что у него на душе.',
                potential: 'Я боюсь, что мы станем чужими.',
                pair_discussion: 'Между нами стена непонимания и холода.',
            },
            level: 3,
            indicators: ['alienation', 'emotional-wall', 'estrangement'],
        },
        {
            id: 'z-emot-passion',
            text: {
                self: 'Нас связывает страсть и влечение, но глубоких разговоров мало.',
                partner: 'Близок мне физически, но душевно мы разные.',
                potential: 'Я ищу прежде всего физической и эмоциональной искры.',
                pair_discussion: 'У нас отличный секс, но мало душевной близости.',
            },
            level: 5,
            indicators: ['sexual-intimacy', 'passion-focus', 'lack-of-depth'],
        },
        {
            id: 'z-mat-safe',
            text: {
                self: 'Мне безопасно рядом с ним/ней. Я могу открыться и быть уязвимым.',
                partner: 'Создает пространство, где я чувствую себя защищенным.',
                potential: 'Я ищу безопасного пространства для искренности.',
                pair_discussion: 'Мы создали безопасное пространство для открытости.',
            },
            level: 7,
            indicators: ['emotional-safety', 'vulnerability', 'secure-base'],
        },
        {
            id: 'z-mat-acceptance',
            text: {
                self: 'Мы принимаем друг друга полностью, со всеми недостатками.',
                partner: 'Принимает меня таким, какой я есть, без условий.',
                potential: 'Я хочу полного принятия без попыток меня переделать.',
                pair_discussion: 'Мы любим друг друга безусловно.',
            },
            level: 8,
            indicators: ['unconditional-acceptance', 'deep-intimacy', 'mature-love'],
        },
        {
            id: 'z-mat-friendship',
            text: {
                self: 'Мы лучшие друзья. Я могу рассказать ему/ей все и быть полностью собой.',
                partner: 'Мой лучший друг, знает обо мне все и принимает.',
                potential: 'Я ищу лучшего друга и партнера по жизни.',
                pair_discussion: 'У нас глубокая дружба, полное доверие и свобода.',
            },
            level: 9,
            indicators: ['friendship', 'deep-trust', 'intellectual-intimacy'],
        },
        {
            id: 'z-trans-soul',
            text: {
                self: 'Мы понимаем друг друга без слов. Это связь на уровне душ.',
                partner: 'Чувствует меня на расстоянии, у нас телепатическая связь.',
                potential: 'Я ищу мистической, запредельной близости.',
                pair_discussion: 'Мы едины, границы между нами растворяются.',
            },
            level: 12,
            indicators: ['soul-connection', 'telepathy', 'spiritual-intimacy'],
        },
    ],
    targetLevels: [3, 5, 7, 8, 9, 12],
    priority: 1,
};

export const zone_responsibility: SmartQuestion = {
    id: 'zone-responsibility-005',
    text: {
        self: 'Кто отвечает за счастье в наших отношениях?',
        partner: 'Как партнер относится к ответственности?',
        potential: 'Как я вижу ответственность в паре?',
        pair_discussion: 'Как мы делим ответственность?',
    },
    category: 'values',
    options: [
        {
            id: 'z-destr-blame',
            text: {
                self: 'Во всем виноват партнер (или я). Мы ищем виноватых.',
                partner: 'Винит меня во всех своих бедах.',
                potential: 'Я боюсь, что меня будут винить во всем.',
                pair_discussion: 'Мы постоянно выясняем, кто виноват.',
            },
            level: 1,
            indicators: ['blame', 'victim-stance', 'projection'],
        },
        {
            id: 'z-emot-expect',
            text: {
                self: 'Я жду, что партнер сделает меня счастливым(ой).',
                partner: 'Ждет, что я решу его проблемы и сделаю счастливым.',
                potential: 'Я хочу найти того, кто сделает меня счастливым.',
                pair_discussion: 'Мы ждем друг от друга исполнения желаний.',
            },
            level: 4,
            indicators: ['expectation', 'dependency', 'happiness-outsourcing'],
        },
        {
            id: 'z-emot-roles',
            text: {
                self: 'Каждый знает свою роль: кто за что отвечает. Это ясно и стабильно.',
                partner: 'Четко выполняет свою роль в отношениях.',
                potential: 'Я хочу ясности: кто за что отвечает.',
                pair_discussion: 'У нас четкое распределение ролей и обязанностей.',
            },
            level: 6,
            indicators: ['role-clarity', 'structure', 'traditional-division'],
        },
        {
            id: 'z-mat-dialogue',
            text: {
                self: 'Мы обсуждаем проблемы и вместе ищем решения.',
                partner: 'Готов обсуждать и искать компромисс.',
                potential: 'Я хочу диалога и совместного решения проблем.',
                pair_discussion: 'Мы решаем проблемы через открытый диалог.',
            },
            level: 7,
            indicators: ['collaborative-problem-solving', 'dialogue', 'partnership'],
        },
        {
            id: 'z-mat-own',
            text: {
                self: 'Я отвечаю за свои чувства, он — за свои. Мы два взрослых человека.',
                partner: 'Берет ответственность за свою жизнь на себя.',
                potential: 'Я ищу равного партнера, который отвечает за себя.',
                pair_discussion: 'Мы делим ответственность 50/50 и не виним друг друга.',
            },
            level: 8,
            indicators: ['personal-responsibility', 'adult-stance', 'boundaries'],
        },
        {
            id: 'z-mature-autonomy-resp',
            text: {
                self: 'Каждый полностью автономен в своих решениях. Мы уважаем выбор друг друга.',
                partner: 'Полностью автономен, не ждет моего одобрения для своих решений.',
                potential: 'Я хочу полной автономии в своих решениях с уважением к партнеру.',
                pair_discussion: 'Мы уважаем право каждого на свой выбор и свой путь.',
            },
            level: 9,
            indicators: ['full-autonomy', 'mutual-respect', 'sovereign-choice'],
        },
        {
            id: 'z-trans-cocreate',
            text: {
                self: 'Мы со-творцы нашей реальности. Мы вместе создаем наше поле.',
                partner: 'Осознает, что мы вместе творим нашу судьбу.',
                potential: 'Я хочу осознанного сотворчества судьбы.',
                pair_discussion: 'Мы осознанно творим нашу общую реальность.',
            },
            level: 11,
            indicators: ['co-creation', 'conscious-evolution', 'responsibility-for-field'],
        },
    ],
    targetLevels: [1, 4, 6, 7, 8, 9, 11],
    priority: 1,
};

export const zone_future: SmartQuestion = {
    id: 'zone-future-006',
    text: {
        self: 'Когда я думаю о нашем будущем:',
        partner: 'Партнер видит наше будущее:',
        potential: 'В будущем я хочу:',
        pair_discussion: 'Наше будущее:',
    },
    category: 'values',
    options: [
        {
            id: 'z-destr-no-future',
            text: {
                self: 'Я не вижу будущего или боюсь его. Живу одним днем.',
                partner: 'Не строит планов, живет моментом или прошлым.',
                potential: 'Я боюсь заглядывать далеко вперед.',
                pair_discussion: 'У нас нет общего видения, мы просто плывем по течению.',
            },
            level: 2,
            indicators: ['hopelessness', 'short-term-focus', 'fear-of-future'],
        },
        {
            id: 'z-emot-script',
            text: {
                self: 'Все должно быть "как у людей": свадьба, дети, дом.',
                partner: 'Хочет стандартного набора: семья, дети, ипотека.',
                potential: 'Я хочу нормальной, стабильной жизни.',
                pair_discussion: 'Мы следуем общепринятому сценарию жизни.',
            },
            level: 6,
            indicators: ['social-script', 'conformity', 'predictability'],
        },
        {
            id: 'z-mat-goals',
            text: {
                self: 'У нас есть общие цели и планы, которые мы обсуждаем и корректируем.',
                partner: 'Строит со мной планы, мы движемся в одном направлении.',
                potential: 'Я хочу строить совместные планы и достигать целей.',
                pair_discussion: 'Мы согласовываем наши цели и поддерживаем друг друга.',
            },
            level: 7,
            indicators: ['shared-goals', 'planning', 'conscious-direction'],
        },
        {
            id: 'z-mature-self-actualization',
            text: {
                self: 'Наше будущее — это реализация потенциала каждого. Мы оба растем как личности.',
                partner: 'Поддерживает мою самореализацию и развивается сам.',
                potential: 'Я хочу взаимной поддержки в реализации жизненных целей.',
                pair_discussion: 'Наша цель — помочь друг другу стать лучшими версиями себя.',
            },
            level: 9,
            indicators: ['self-actualization', 'mutual-growth', 'individual-realization'],
        },
        {
            id: 'z-trans-creation',
            text: {
                self: 'Мы создаем что-то вместе: проект, дело, идею, которая переживет нас.',
                partner: 'Видит в нас творческий союз, способный создавать новое.',
                potential: 'Я хочу совместного творчества и создания наследия.',
                pair_discussion: 'Мы вместе творим что-то ценное для мира.',
            },
            level: 11,
            indicators: ['co-creation', 'legacy', 'creative-partnership'],
        },
        {
            id: 'z-trans-mission',
            text: {
                self: 'У нас есть общая миссия, которая выходит за рамки нашей пары.',
                partner: 'Видит в нас силу, способную изменить мир.',
                potential: 'Я хочу служить миру вместе с партнером.',
                pair_discussion: 'Наше будущее — это служение и реализация высшего смысла.',
            },
            level: 12,
            indicators: ['mission', 'legacy', 'service'],
        },
    ],
    targetLevels: [2, 6, 7, 9, 11, 12],
    priority: 1,
};

// ============================================================================
// ВОПРОСЫ ВАЛИДАЦИИ (VALIDATION PHASE)
// ============================================================================

export const validation_honesty: SmartQuestion = {
    id: 'validation-honesty-001',
    text: {
        self: 'Если быть честным с самим собой о негативных чувствах в отношениях:',
        partner: 'Если быть честным о негативных чувствах партнера:',
        potential: 'Честно говоря, о негативных чувствах в отношениях я думаю:',
        pair_discussion: 'Если быть честными о негативных чувствах в нашей паре:',
    },
    category: 'validation',
    isValidation: true,
    options: [
        {
            id: 'val-h-fake',
            text: {
                self: 'Я никогда не злюсь на партнера и не испытываю негативных чувств.',
                partner: 'Он/она идеален(на) и никогда не вызывает негатива.',
                potential: 'Я никогда не буду злиться в отношениях.',
                pair_discussion: 'Мы никогда не ссоримся и не злимся друг на друга.',
            },
            level: 0, // Явная нечестность
            indicators: ['social-desirability', 'idealization', 'dishonesty'],
        },
        {
            id: 'val-h-struggle',
            text: {
                self: 'Негативные чувства пугают меня, я пытаюсь их подавить или скрыть.',
                partner: 'Его/ее негатив меня ранит, я стараюсь его избегать.',
                potential: 'Я боюсь конфликтов и буду стараться их избегать.',
                pair_discussion: 'Мы избегаем конфликтов и стараемся не показывать негатив.',
            },
            level: 6,
            indicators: ['emotional-avoidance', 'fear-of-conflict', 'suppression'],
        },
        {
            id: 'val-h-aware',
            text: {
                self: 'Иногда злюсь, но стараюсь понять причину и проработать чувства.',
                partner: 'Иногда раздражает, но я учусь понимать причины.',
                potential: 'Я понимаю, что негатив бывает, и готов с ним работать.',
                pair_discussion: 'Мы признаем негатив и учимся с ним справляться.',
            },
            level: 8,
            indicators: ['emotional-awareness', 'self-reflection', 'growth-mindset'],
        },
        {
            id: 'val-h-mature',
            text: {
                self: 'Злость — это сигнал о моих потребностях. Я не боюсь её испытывать.',
                partner: 'Его/ее негатив — это информация, а не угроза нашим отношениям.',
                potential: 'Негативные чувства — часть жизни, я умею с ними быть.',
                pair_discussion: 'Мы свободно выражаем негатив, не разрушая отношения.',
            },
            level: 9,
            indicators: ['emotional-freedom', 'secure-expression', 'maturity'],
        },
        {
            id: 'val-h-transcend',
            text: {
                self: 'Негатив — учитель. Он показывает, где я могу расти дальше.',
                partner: 'В его/ее негативе я вижу возможность для нашего общего роста.',
                potential: 'Любые эмоции — часть пути, включая сложные.',
                pair_discussion: 'Мы трансформируем негатив в топливо для эволюции.',
            },
            level: 10,
            indicators: ['growth-orientation', 'transformation', 'wisdom'],
        },
    ],
    targetLevels: [6, 8, 9, 10],
    priority: 3,
};

export const validation_bypass: SmartQuestion = {
    id: 'validation-bypass-002',
    text: {
        self: 'Как соотносятся духовное развитие и бытовые/материальные вопросы в отношениях?',
        partner: 'Как партнер соотносит духовность и быт?',
        potential: 'Как я вижу баланс духовного и материального в отношениях?',
        pair_discussion: 'Как мы соотносим духовное и бытовое?',
    },
    category: 'validation',
    isValidation: true,
    options: [
        {
            id: 'val-b-fake',
            text: {
                self: 'Мы выше земных проблем, быт и деньги нас не волнуют.',
                partner: 'Считает, что мы выше "низменных" проблем.',
                potential: 'Я не хочу заниматься бытом, только духовным ростом.',
                pair_discussion: 'Мы не обсуждаем приземленные вещи, мы выше этого.',
            },
            level: 0, // Духовный байпас — нечестность
            indicators: ['spiritual-bypass', 'denial', 'ungrounded'],
        },
        {
            id: 'val-b-material',
            text: {
                self: 'Быт и материальное — главное. Духовность — роскошь, когда есть время.',
                partner: 'Сосредоточен на материальном, духовность не приоритет.',
                potential: 'Сначала быт, потом всё остальное.',
                pair_discussion: 'Мы решаем конкретные задачи, философия — для досуга.',
            },
            level: 4,
            indicators: ['material-focus', 'pragmatism', 'survival-mode'],
        },
        {
            id: 'val-b-separate',
            text: {
                self: 'Духовное и бытовое — разные сферы. Я стараюсь их не смешивать.',
                partner: 'Разделяет духовность и повседневность на разные зоны.',
                potential: 'Духовное отдельно, бытовое отдельно.',
                pair_discussion: 'У нас есть время для духовного и время для быта.',
            },
            level: 7,
            indicators: ['compartmentalization', 'balance-seeking', 'separation'],
        },
        {
            id: 'val-b-balance',
            text: {
                self: 'Я стараюсь интегрировать духовные ценности в бытовые решения.',
                partner: 'Приносит осознанность в повседневные дела.',
                potential: 'Хочу, чтобы духовность пронизывала обычную жизнь.',
                pair_discussion: 'Мы стараемся быть осознанными в бытовых делах.',
            },
            level: 9,
            indicators: ['integration-attempt', 'mindfulness', 'values-alignment'],
        },
        {
            id: 'val-b-unity',
            text: {
                self: 'Нет разделения: каждое действие — духовная практика.',
                partner: 'Видит священное в обычном, быт — часть практики.',
                potential: 'Вся жизнь — духовный путь, включая мытьё посуды.',
                pair_discussion: 'Наша совместная жизнь — это духовная практика.',
            },
            level: 11,
            indicators: ['non-duality', 'sacred-ordinary', 'integration'],
        },
        {
            id: 'val-b-grounded',
            text: {
                self: 'Духовность делает нас более ответственными в бытовых вопросах.',
                partner: 'Чем глубже духовность, тем лучше справляется с земным.',
                potential: 'Истинная духовность заземляет и укрепляет.',
                pair_discussion: 'Наша духовная связь делает нас эффективнее в жизни.',
            },
            level: 12,
            indicators: ['grounded-spirituality', 'embodied-wisdom', 'mastery'],
        },
    ],
    targetLevels: [4, 7, 9, 11, 12],
    priority: 3,
};

export const validation_consistency: SmartQuestion = {
    id: 'validation-consistency-003',
    text: {
        self: 'Когда мы с партнером не согласны в важном вопросе:',
        partner: 'Когда мы не согласны, партнер:',
        potential: 'Если возникнет разногласие по важному вопросу, я:',
        pair_discussion: 'Когда мы не согласны по важному вопросу:',
    },
    category: 'validation',
    isValidation: true,
    options: [
        {
            id: 'val-c-control',
            text: {
                self: 'Я настаиваю на своем, пока партнер не согласится.',
                partner: 'Давит, пока я не уступлю.',
                potential: 'Я буду настаивать на своем мнении.',
                pair_discussion: 'Кто-то один продавливает свою позицию.',
            },
            level: 2,
            indicators: ['control', 'domination', 'power-struggle'],
        },
        {
            id: 'val-c-avoid',
            text: {
                self: 'Я уступаю, чтобы избежать конфликта.',
                partner: 'Уступает или замолкает, чтобы не ссориться.',
                potential: 'Я скорее уступлю, чем буду спорить.',
                pair_discussion: 'Кто-то уступает ради мира, но копит обиду.',
            },
            level: 4,
            indicators: ['avoidance', 'submission', 'peace-keeping'],
        },
        {
            id: 'val-c-compromise',
            text: {
                self: 'Мы ищем компромисс, где каждый немного уступает.',
                partner: 'Готов(а) искать компромисс.',
                potential: 'Я готов(а) идти на компромисс.',
                pair_discussion: 'Мы находим середину, устраивающую обоих.',
            },
            level: 7,
            indicators: ['compromise', 'negotiation', 'balance'],
        },
        {
            id: 'val-c-dialogue',
            text: {
                self: 'Мы обсуждаем, пока не поймем позицию друг друга, даже если не согласны.',
                partner: 'Готов(а) услышать мои аргументы и пересмотреть позицию.',
                potential: 'Я готов(а) менять мнение ради истины.',
                pair_discussion: 'Мы исследуем тему вместе, не привязываясь к своей правоте.',
            },
            level: 8,
            indicators: ['dialogue', 'openness', 'flexibility'],
        },
        {
            id: 'val-c-autonomy',
            text: {
                self: 'Каждый может остаться при своем мнении — это не угроза отношениям.',
                partner: 'Уважает мое право думать иначе.',
                potential: 'Я могу не соглашаться и при этом любить.',
                pair_discussion: 'Мы можем думать по-разному и всё равно быть близки.',
            },
            level: 9,
            indicators: ['differentiation', 'autonomy', 'secure-disagreement'],
        },
        {
            id: 'val-c-synthesis',
            text: {
                self: 'Из наших разных взглядов рождается что-то новое, лучшее.',
                partner: 'Видит в наших разногласиях потенциал для нового решения.',
                potential: 'Разногласия — это шанс для творческого решения.',
                pair_discussion: 'Наши споры приводят к открытиям и росту.',
            },
            level: 10,
            indicators: ['synthesis', 'creative-tension', 'growth-through-conflict'],
        },
    ],
    targetLevels: [2, 4, 7, 8, 9, 10],
    priority: 3,
};

export const NEW_QUESTIONS: SmartQuestion[] = [
    // Zoning
    zone_conflict,
    zone_safety,
    zone_growth,
    zone_intimacy,
    zone_responsibility,
    zone_future,
    // Refinement Core
    level1_traumaNormalization,
    level2_karmicCycle,
    level3_survivalFear,
    level4_domesticStability,
    level5_passionIntensity,
    level6_socialStatus,
    level7_psychologicalConnection,
    level8_acceptance,
    level9_freedomMaturity,
    level10_synergy,
    level10_flow,
    level11_creation,
    level12_service,
    level12_unity,
    // Validation
    validation_honesty,
    validation_bypass,
    validation_consistency,
];
