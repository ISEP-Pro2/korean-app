// 8-week program phases
export const programPhases = [
  { week: 1, focus: 'foundation', description: '기초 문장 1-14', features: ['sentences'] },
  { week: 2, focus: 'foundation', description: '기초 문장 15-30', features: ['sentences'] },
  { week: 3, focus: 'partner-intro', description: '파트너 스크립트: 식사/날씨', features: ['sentences', 'partner'] },
  { week: 4, focus: 'partner-practice', description: '파트너 스크립트 복습', features: ['sentences', 'partner'] },
  { week: 5, focus: 'work-weekend', description: '파트너 스크립트: 일/주말', features: ['sentences', 'partner'] },
  { week: 6, focus: 'work-weekend', description: '전체 스크립트 복습', features: ['sentences', 'partner'] },
  { week: 7, focus: 'mini-conversations', description: '미니 대화 연습', features: ['sentences', 'partner', 'conversations'] },
  { week: 8, focus: 'integration', description: '통합 복습', features: ['sentences', 'partner', 'conversations'] },
]

export const defaultSettings = {
  dailyTimeBudget: 20, // minutes
  episodeLockDays: 3,
  phase1Lock: true, // first 8 weeks, no custom creation
  speechRecognition: false, // beta feature
  notificationsEnabled: false,
  reminderTime: '20:00', // 8 PM default
  currentWeek: 1,
  appStartDate: null as string | null,
}
