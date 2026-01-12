// Partner scripts for practicing with a Korean native speaker
// 4 scripts with 8 cards each

import { PartnerScript, PartnerCard } from '@/lib/types'

const dinnerCards: PartnerCard[] = [
  { id: 1, youSayKo: '오늘 뭐 먹을까요?', partnerReplyKo: '뭐 먹고 싶어요?', youRepeatKo: '뭐 먹고 싶어요?', frMeaning: "Qu'est-ce qu'on mange aujourd'hui ?" },
  { id: 2, youSayKo: '저는 한식 먹고 싶어요.', partnerReplyKo: '좋아요, 뭐 먹을까요?', youRepeatKo: '뭐 먹을까요?', frMeaning: 'Je veux manger coréen.' },
  { id: 3, youSayKo: '배 많이 고파요.', partnerReplyKo: '그럼 빨리 먹어요.', youRepeatKo: '빨리 먹어요.', frMeaning: "J'ai très faim." },
  { id: 4, youSayKo: '맛있어요!', partnerReplyKo: '진짜요? 다행이에요.', youRepeatKo: '다행이에요.', frMeaning: "C'est bon !" },
  { id: 5, youSayKo: '더 먹을 거예요?', partnerReplyKo: '아니요, 배불러요.', youRepeatKo: '배불러요.', frMeaning: 'Tu vas en reprendre ?' },
  { id: 6, youSayKo: '저도 배불러요.', partnerReplyKo: '잘 먹었어요.', youRepeatKo: '잘 먹었어요.', frMeaning: "Moi aussi j'ai assez mangé." },
  { id: 7, youSayKo: '정말 맛있었어요.', partnerReplyKo: '다음에 또 먹어요.', youRepeatKo: '또 먹어요.', frMeaning: "C'était vraiment bon." },
  { id: 8, youSayKo: '설거지 할게요.', partnerReplyKo: '고마워요!', youRepeatKo: '고마워요!', frMeaning: 'Je vais faire la vaisselle.' },
]

const weatherCards: PartnerCard[] = [
  { id: 1, youSayKo: '오늘 날씨 어때요?', partnerReplyKo: '오늘 좋아요.', youRepeatKo: '오늘 좋아요.', frMeaning: 'Il fait beau aujourd\'hui ?' },
  { id: 2, youSayKo: '밖에 춥죠?', partnerReplyKo: '네, 좀 추워요.', youRepeatKo: '좀 추워요.', frMeaning: 'Il fait froid dehors, non ?' },
  { id: 3, youSayKo: '비 올 것 같아요.', partnerReplyKo: '우산 가져가세요.', youRepeatKo: '우산 가져가세요.', frMeaning: 'On dirait qu\'il va pleuvoir.' },
  { id: 4, youSayKo: '오늘 하루 어땠어요?', partnerReplyKo: '괜찮았어요.', youRepeatKo: '괜찮았어요.', frMeaning: 'Comment était ta journée ?' },
  { id: 5, youSayKo: '피곤해 보여요.', partnerReplyKo: '네, 좀 피곤해요.', youRepeatKo: '좀 피곤해요.', frMeaning: 'Tu as l\'air fatigué.' },
  { id: 6, youSayKo: '일찍 자요.', partnerReplyKo: '그래야겠어요.', youRepeatKo: '그래야겠어요.', frMeaning: 'Couche-toi tôt.' },
  { id: 7, youSayKo: '오늘 힘들었어요?', partnerReplyKo: '좀 힘들었어요.', youRepeatKo: '좀 힘들었어요.', frMeaning: "C'était dur aujourd'hui ?" },
  { id: 8, youSayKo: '내일 날씨 좋을까요?', partnerReplyKo: '좋을 것 같아요.', youRepeatKo: '좋을 것 같아요.', frMeaning: 'Il fera beau demain ?' },
]

const workCards: PartnerCard[] = [
  { id: 1, youSayKo: '무슨 일 해요?', partnerReplyKo: '회사에서 일해요.', youRepeatKo: '회사에서 일해요.', frMeaning: 'Qu\'est-ce que vous faites comme travail ?' },
  { id: 2, youSayKo: '오늘 일 많았어요?', partnerReplyKo: '네, 좀 바빴어요.', youRepeatKo: '좀 바빴어요.', frMeaning: 'Tu avais beaucoup de travail aujourd\'hui ?' },
  { id: 3, youSayKo: '집에서 일해요.', partnerReplyKo: '편하겠어요.', youRepeatKo: '편하겠어요.', frMeaning: 'Je travaille à la maison.' },
  { id: 4, youSayKo: '내일 회의 있어요.', partnerReplyKo: '힘내세요!', youRepeatKo: '힘내세요!', frMeaning: "J'ai une réunion demain." },
  { id: 5, youSayKo: '이번 주 바빠요.', partnerReplyKo: '많이 바빠요?', youRepeatKo: '많이 바빠요?', frMeaning: 'Je suis occupé cette semaine.' },
  { id: 6, youSayKo: '프로젝트 끝났어요.', partnerReplyKo: '축하해요!', youRepeatKo: '축하해요!', frMeaning: "J'ai terminé mon projet." },
  { id: 7, youSayKo: '오늘 일찍 끝났어요.', partnerReplyKo: '좋겠다!', youRepeatKo: '좋겠다!', frMeaning: "J'ai fini tôt aujourd'hui." },
  { id: 8, youSayKo: '퇴근했어요.', partnerReplyKo: '수고했어요.', youRepeatKo: '수고했어요.', frMeaning: "J'ai fini le travail." },
]

const weekendCards: PartnerCard[] = [
  { id: 1, youSayKo: '주말에 뭐 할 거예요?', partnerReplyKo: '아직 몰라요.', youRepeatKo: '아직 몰라요.', frMeaning: 'Qu\'est-ce que tu fais ce week-end ?' },
  { id: 2, youSayKo: '집에서 쉴 거예요.', partnerReplyKo: '좋겠어요.', youRepeatKo: '좋겠어요.', frMeaning: 'Je vais me reposer à la maison.' },
  { id: 3, youSayKo: '같이 나갈까요?', partnerReplyKo: '좋아요, 어디 갈까요?', youRepeatKo: '어디 갈까요?', frMeaning: 'On sort ensemble ?' },
  { id: 4, youSayKo: '영화 볼까요?', partnerReplyKo: '무슨 영화요?', youRepeatKo: '무슨 영화요?', frMeaning: 'On regarde un film ?' },
  { id: 5, youSayKo: '맛집 가고 싶어요.', partnerReplyKo: '어떤 음식이요?', youRepeatKo: '어떤 음식이요?', frMeaning: 'Je veux aller dans un bon restaurant.' },
  { id: 6, youSayKo: '산책할까요?', partnerReplyKo: '좋아요, 가요!', youRepeatKo: '가요!', frMeaning: 'On se promène ?' },
  { id: 7, youSayKo: '주말 잘 보냈어요?', partnerReplyKo: '네, 좋았어요.', youRepeatKo: '좋았어요.', frMeaning: 'Tu as passé un bon week-end ?' },
  { id: 8, youSayKo: '다음 주말에 또 만나요.', partnerReplyKo: '네, 기대돼요!', youRepeatKo: '기대돼요!', frMeaning: 'On se revoit le week-end prochain.' },
]

export const partnerScripts: PartnerScript[] = [
  { id: 1, title: '식사(저녁) 잡담', weekUnlock: 3, cards: dinnerCards },
  { id: 2, title: '날씨/하루', weekUnlock: 3, cards: weatherCards },
  { id: 3, title: '일(무슨 일 해요?)', weekUnlock: 5, cards: workCards },
  { id: 4, title: '주말 계획', weekUnlock: 5, cards: weekendCards },
]
