// Training Mode Seed Data - Patterns and Slot Values
// NO ROMANIZATION - Korean + French only

import { Pattern, SlotKey, SlotValue, Topic } from '@/lib/training-types'

// ========================
// SLOT DICTIONARIES
// ========================

export const slotDictionary: Record<SlotKey, SlotValue[]> = {
  FOOD: [
    { id: 'food-1', ko: '김치찌개', fr: 'ragoût de kimchi' },
    { id: 'food-2', ko: '비빔밥', fr: 'bibimbap' },
    { id: 'food-3', ko: '불고기', fr: 'bulgogi' },
    { id: 'food-4', ko: '라면', fr: 'ramyeon' },
    { id: 'food-5', ko: '파스타', fr: 'pâtes' },
    { id: 'food-6', ko: '샐러드', fr: 'salade' },
  ],
  PLACE: [
    { id: 'place-1', ko: '집', fr: 'maison' },
    { id: 'place-2', ko: '식당', fr: 'restaurant' },
    { id: 'place-3', ko: '카페', fr: 'café' },
    { id: 'place-4', ko: '공원', fr: 'parc' },
    { id: 'place-5', ko: '마트', fr: 'supermarché' },
    { id: 'place-6', ko: '영화관', fr: 'cinéma' },
  ],
  ACTIVITY: [
    { id: 'activity-1', ko: '산책', fr: 'promenade' },
    { id: 'activity-2', ko: '영화 보기', fr: 'regarder un film' },
    { id: 'activity-3', ko: '운동', fr: 'sport' },
    { id: 'activity-4', ko: '카페 가기', fr: 'aller au café' },
    { id: 'activity-5', ko: '쇼핑', fr: 'shopping' },
    { id: 'activity-6', ko: '요리', fr: 'cuisine' },
  ],
  WEATHER_STATE: [
    { id: 'weather-1', ko: '좋아', fr: 'beau' },
    { id: 'weather-2', ko: '별로예', fr: 'pas terrible' },
    { id: 'weather-3', ko: '흐려', fr: 'nuageux' },
    { id: 'weather-4', ko: '맑아', fr: 'ensoleillé' },
  ],
  TEMPERATURE: [
    { id: 'temp-1', ko: '추워요', fr: 'il fait froid' },
    { id: 'temp-2', ko: '더워요', fr: 'il fait chaud' },
    { id: 'temp-3', ko: '시원해요', fr: 'il fait frais' },
    { id: 'temp-4', ko: '따뜻해요', fr: 'il fait doux' },
  ],
  INTENSITY: [
    { id: 'intensity-1', ko: '조금', fr: 'un peu' },
    { id: 'intensity-2', ko: '많이', fr: 'beaucoup' },
    { id: 'intensity-3', ko: '별로', fr: 'pas vraiment' },
    { id: 'intensity-4', ko: '정말', fr: 'vraiment' },
  ],
  FEELING: [
    { id: 'feeling-1', ko: '괜찮아요', fr: 'ça va' },
    { id: 'feeling-2', ko: '피곤해요', fr: 'fatigué' },
    { id: 'feeling-3', ko: '기뻐요', fr: 'content' },
    { id: 'feeling-4', ko: '졸려요', fr: 'somnolent' },
    { id: 'feeling-5', ko: '힘들어요', fr: 'difficile' },
  ],
  WORKPLACE: [
    { id: 'workplace-1', ko: '회사', fr: 'bureau' },
    { id: 'workplace-2', ko: '집', fr: 'maison' },
    { id: 'workplace-3', ko: '카페', fr: 'café' },
    { id: 'workplace-4', ko: '도서관', fr: 'bibliothèque' },
  ],
}

// ========================
// PATTERNS (20+ total)
// ========================

export const trainingPatterns: Pattern[] = [
  // ---- DINNER (6 patterns) ----
  {
    id: 'dinner-1',
    topic: 'DINNER',
    level: 1,
    templateKo: '오늘 {FOOD} 먹을까요?',
    frMeaning: 'On mange {FOOD} aujourd\'hui ?',
    slots: ['FOOD'],
  },
  {
    id: 'dinner-2',
    topic: 'DINNER',
    level: 1,
    templateKo: '저는 {FOOD} 먹고 싶어요.',
    frMeaning: 'Je veux manger {FOOD}.',
    slots: ['FOOD'],
  },
  {
    id: 'dinner-3',
    topic: 'DINNER',
    level: 1,
    templateKo: '저는 {INTENSITY} 배고파요.',
    frMeaning: 'J\'ai {INTENSITY} faim.',
    slots: ['INTENSITY'],
  },
  {
    id: 'dinner-4',
    topic: 'DINNER',
    level: 1,
    templateKo: '{PLACE}에서 먹을까요?',
    frMeaning: 'On mange à {PLACE} ?',
    slots: ['PLACE'],
  },
  {
    id: 'dinner-5',
    topic: 'DINNER',
    level: 1,
    templateKo: '{FOOD} 맛있어요.',
    frMeaning: '{FOOD} est délicieux.',
    slots: ['FOOD'],
  },
  {
    id: 'dinner-6',
    topic: 'DINNER',
    level: 2,
    templateKo: '오늘 저녁 {FOOD} 어때요?',
    frMeaning: 'Que dis-tu de {FOOD} ce soir ?',
    slots: ['FOOD'],
    partnerRepliesKo: ['좋아요!', '글쎄요...', '다른 거 먹고 싶어요.'],
  },

  // ---- WEATHER (5 patterns) ----
  {
    id: 'weather-1',
    topic: 'WEATHER',
    level: 1,
    templateKo: '오늘 날씨 {WEATHER_STATE}요.',
    frMeaning: 'Aujourd\'hui le temps est {WEATHER_STATE}.',
    slots: ['WEATHER_STATE'],
  },
  {
    id: 'weather-2',
    topic: 'WEATHER',
    level: 1,
    templateKo: '밖에 {TEMPERATURE}.',
    frMeaning: 'Dehors {TEMPERATURE}.',
    slots: ['TEMPERATURE'],
  },
  {
    id: 'weather-3',
    topic: 'WEATHER',
    level: 1,
    templateKo: '오늘 {INTENSITY} 춥네요.',
    frMeaning: 'Aujourd\'hui il fait {INTENSITY} froid.',
    slots: ['INTENSITY'],
  },
  {
    id: 'weather-4',
    topic: 'WEATHER',
    level: 1,
    templateKo: '내일 날씨 {WEATHER_STATE}을 것 같아요.',
    frMeaning: 'Demain le temps sera probablement {WEATHER_STATE}.',
    slots: ['WEATHER_STATE'],
  },
  {
    id: 'weather-5',
    topic: 'WEATHER',
    level: 2,
    templateKo: '날씨가 {WEATHER_STATE}서 {ACTIVITY} 할까요?',
    frMeaning: 'Comme le temps est {WEATHER_STATE}, on fait {ACTIVITY} ?',
    slots: ['WEATHER_STATE', 'ACTIVITY'],
    partnerRepliesKo: ['좋아요!', '오늘은 좀...', '네, 가요!'],
  },

  // ---- WORK (5 patterns) ----
  {
    id: 'work-1',
    topic: 'WORK',
    level: 1,
    templateKo: '저는 {WORKPLACE}에서 일해요.',
    frMeaning: 'Je travaille à {WORKPLACE}.',
    slots: ['WORKPLACE'],
  },
  {
    id: 'work-2',
    topic: 'WORK',
    level: 1,
    templateKo: '요즘 {INTENSITY} 바빠요.',
    frMeaning: 'Ces jours-ci je suis {INTENSITY} occupé.',
    slots: ['INTENSITY'],
  },
  {
    id: 'work-3',
    topic: 'WORK',
    level: 1,
    templateKo: '오늘 일이 {INTENSITY} 힘들었어요.',
    frMeaning: 'Aujourd\'hui le travail était {INTENSITY} difficile.',
    slots: ['INTENSITY'],
  },
  {
    id: 'work-4',
    topic: 'WORK',
    level: 1,
    templateKo: '오늘 {FEELING}.',
    frMeaning: 'Aujourd\'hui je suis {FEELING}.',
    slots: ['FEELING'],
  },
  {
    id: 'work-5',
    topic: 'WORK',
    level: 2,
    templateKo: '오늘 {WORKPLACE}에서 일하고 {FEELING}.',
    frMeaning: 'Aujourd\'hui j\'ai travaillé à {WORKPLACE} et je suis {FEELING}.',
    slots: ['WORKPLACE', 'FEELING'],
    partnerRepliesKo: ['수고했어요!', '힘내세요!', '쉬세요.'],
  },

  // ---- WEEKEND (4 patterns) ----
  {
    id: 'weekend-1',
    topic: 'WEEKEND',
    level: 1,
    templateKo: '주말에 {ACTIVITY} 할 거예요.',
    frMeaning: 'Ce week-end je vais faire {ACTIVITY}.',
    slots: ['ACTIVITY'],
  },
  {
    id: 'weekend-2',
    topic: 'WEEKEND',
    level: 1,
    templateKo: '같이 {ACTIVITY} 할까요?',
    frMeaning: 'On fait {ACTIVITY} ensemble ?',
    slots: ['ACTIVITY'],
  },
  {
    id: 'weekend-3',
    topic: 'WEEKEND',
    level: 1,
    templateKo: '저는 {PLACE}에 가고 싶어요.',
    frMeaning: 'Je veux aller à {PLACE}.',
    slots: ['PLACE'],
  },
  {
    id: 'weekend-4',
    topic: 'WEEKEND',
    level: 2,
    templateKo: '주말에 {PLACE}에서 {ACTIVITY} 할래요?',
    frMeaning: 'Ce week-end tu veux faire {ACTIVITY} à {PLACE} ?',
    slots: ['PLACE', 'ACTIVITY'],
    partnerRepliesKo: ['좋아요!', '시간 있으면요.', '다음에요.'],
  },
]

// Helper to get all patterns for a topic
export function getPatternsByTopic(topic: Topic): Pattern[] {
  return trainingPatterns.filter(p => p.topic === topic)
}

// Helper to get level 1 patterns only (for first 14 days)
export function getLevel1Patterns(): Pattern[] {
  return trainingPatterns.filter(p => p.level === 1)
}
