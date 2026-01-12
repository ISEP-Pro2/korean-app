// Core types for K-8M app

export type MasteryState = 'NEW' | 'WARM' | 'HOT' | 'SOLID'
export type Rating = 'easy' | 'normal' | 'hard' // 쉬움 / 보통 / 어려움
export type SessionPhase = 'idle' | 'listening' | 'speaking' | 'partner' | 'completed'
export type SpeakingStep = 'listen' | 'repeat' | 'recall' | 'rate'

export interface Sentence {
  id: number
  ko: string
  fr: string
  category: 'foundation' | 'partner' | 'custom'
  weekUnlock: number
  masteryState: MasteryState
  lastReviewDate: string | null
  reviewCount: number
  difficultCount7Days: number
  pinnedForTomorrow?: boolean
}

export interface Episode {
  id?: number
  title: string
  sourceType: 'url' | 'file'
  url?: string
  blobKey?: string
  duration?: number
  lockedUntilDate: string
  notes: string
  addedDate: string
  loopCount: number
}

export interface PartnerCard {
  id: number
  youSayKo: string
  partnerReplyKo: string
  youRepeatKo: string
  frMeaning: string
}

export interface PartnerScript {
  id: number
  title: string
  weekUnlock: number
  cards: PartnerCard[]
}

export interface DailyLog {
  id?: number
  date: string // YYYY-MM-DD
  listeningMinutes: number
  speakingMinutes: number
  partnerMinutes: number
  sentencesCompleted: number
  spokeKorean: boolean
  frictionRating: number | null // 1-5
  completed: boolean
}

export interface ReviewLog {
  id?: number
  sentenceId: number
  date: string
  rating: Rating
}

export interface HeardWord {
  id?: number
  word: string
  episodeId: number
  date: string
}

export interface Settings {
  id: 1 // singleton
  dailyTimeBudget: number
  episodeLockDays: number
  phase1Lock: boolean
  speechRecognition: boolean
  notificationsEnabled: boolean
  reminderTime: string
  currentWeek: number
  appStartDate: string | null
}

export interface AudioBlob {
  id?: number
  key: string
  blob: Blob
  filename: string
  mimeType: string
}

// Session state for Today flow
export interface SessionState {
  phase: SessionPhase
  listeningStartTime: number | null
  speakingStartTime: number | null
  partnerStartTime: number | null
  currentSentenceIndex: number
  currentSentenceStep: SpeakingStep
  todaySentences: Sentence[]
  isPlaying: boolean
  loopCount: number
  shadowingEnabled: boolean
}
