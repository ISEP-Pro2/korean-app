// Foundation sentences - 30 essential sentences for daily conversation
// Korean + French meaning only - NO romanization

import { Sentence } from '@/lib/types'

export const foundationSentences: Omit<Sentence, 'masteryState' | 'lastReviewDate' | 'reviewCount' | 'difficultCount7Days'>[] = [
  { id: 1, ko: '오늘 괜찮아요.', fr: "Aujourd'hui ça va.", category: 'foundation', weekUnlock: 1 },
  { id: 2, ko: '오늘 좀 피곤해요.', fr: "Aujourd'hui je suis un peu fatigué.", category: 'foundation', weekUnlock: 1 },
  { id: 3, ko: '오늘 집에서 일해요.', fr: "Aujourd'hui je travaille à la maison.", category: 'foundation', weekUnlock: 1 },
  { id: 4, ko: '오늘 일 안 해요.', fr: "Aujourd'hui je ne travaille pas.", category: 'foundation', weekUnlock: 1 },
  { id: 5, ko: '조금 스트레스 받아요.', fr: 'Je suis un peu stressé.', category: 'foundation', weekUnlock: 1 },
  { id: 6, ko: '집에서 먹었어요.', fr: "J'ai mangé à la maison.", category: 'foundation', weekUnlock: 1 },
  { id: 7, ko: '밖에서 먹었어요.', fr: "J'ai mangé dehors.", category: 'foundation', weekUnlock: 1 },
  { id: 8, ko: '맛있었어요.', fr: "C'était bon.", category: 'foundation', weekUnlock: 1 },
  { id: 9, ko: '배고파요.', fr: "J'ai faim.", category: 'foundation', weekUnlock: 1 },
  { id: 10, ko: '별로 배 안 고파요.', fr: "Je n'ai pas très faim.", category: 'foundation', weekUnlock: 1 },
  { id: 11, ko: '오늘 날씨 좋아요.', fr: "Aujourd'hui il fait beau.", category: 'foundation', weekUnlock: 1 },
  { id: 12, ko: '오늘 비 와요.', fr: "Aujourd'hui il pleut.", category: 'foundation', weekUnlock: 1 },
  { id: 13, ko: '추워요.', fr: 'Il fait froid.', category: 'foundation', weekUnlock: 1 },
  { id: 14, ko: '더워요.', fr: 'Il fait chaud.', category: 'foundation', weekUnlock: 1 },
  { id: 15, ko: '오늘 하루 길었어요.', fr: 'La journée était longue.', category: 'foundation', weekUnlock: 2 },
  { id: 16, ko: '운동하러 가요.', fr: 'Je vais faire du sport.', category: 'foundation', weekUnlock: 2 },
  { id: 17, ko: '운동했어요.', fr: "J'ai fait du sport.", category: 'foundation', weekUnlock: 2 },
  { id: 18, ko: '좀 쉴 거예요.', fr: 'Je vais me reposer un peu.', category: 'foundation', weekUnlock: 2 },
  { id: 19, ko: '조금 나갈 거예요.', fr: 'Je vais sortir un peu.', category: 'foundation', weekUnlock: 2 },
  { id: 20, ko: '집에 있을 거예요.', fr: 'Je reste à la maison.', category: 'foundation', weekUnlock: 2 },
  { id: 21, ko: '여기 있어서 기뻐요.', fr: "Je suis content d'être ici.", category: 'foundation', weekUnlock: 2 },
  { id: 22, ko: '정말 감사합니다.', fr: 'Merci beaucoup.', category: 'foundation', weekUnlock: 2 },
  { id: 23, ko: '죄송해요, 잘 모르겠어요.', fr: 'Désolé, je ne comprends pas bien.', category: 'foundation', weekUnlock: 2 },
  { id: 24, ko: '천천히 다시 말해 주세요.', fr: 'Pouvez-vous répéter lentement ?', category: 'foundation', weekUnlock: 2 },
  { id: 25, ko: '괜찮아요.', fr: "Ce n'est pas grave.", category: 'foundation', weekUnlock: 2 },
  { id: 26, ko: '내일 일해요.', fr: 'Demain je travaille.', category: 'foundation', weekUnlock: 2 },
  { id: 27, ko: '내일 일 안 해요.', fr: 'Demain je ne travaille pas.', category: 'foundation', weekUnlock: 2 },
  { id: 28, ko: '이번 주말에 집에 있을 거예요.', fr: 'Ce week-end je reste à la maison.', category: 'foundation', weekUnlock: 2 },
  { id: 29, ko: '이번 주말에 나갈 거예요.', fr: 'Ce week-end je sors.', category: 'foundation', weekUnlock: 2 },
  { id: 30, ko: '아직 잘 모르겠어요.', fr: 'Je ne sais pas encore.', category: 'foundation', weekUnlock: 2 },
]

// Rescue lines - always accessible floating button
export const rescueLines = [
  { ko: '죄송해요, 한국어 아직 많이 못 해요.', fr: 'Désolé, je ne parle pas encore bien coréen.' },
  { ko: '천천히 말해 주세요.', fr: "Parlez lentement s'il vous plaît." },
  { ko: '다시 한 번 말해 주세요.', fr: 'Dites-le encore une fois.' },
  { ko: '잘 이해 못 했어요.', fr: "Je n'ai pas bien compris." },
  { ko: '제가 한번 해 볼게요.', fr: 'Je vais essayer.' },
  { ko: '오늘 정말 맛있었어요.', fr: "Aujourd'hui c'était vraiment bon." },
]
