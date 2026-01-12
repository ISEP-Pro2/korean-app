// Training Mode Types for K-8M

export type SlotKey = 
  | 'FOOD' 
  | 'PLACE' 
  | 'ACTIVITY' 
  | 'WEATHER_STATE' 
  | 'TEMPERATURE' 
  | 'INTENSITY' 
  | 'FEELING' 
  | 'WORKPLACE'

export type Topic = 'DINNER' | 'WEATHER' | 'WORK' | 'WEEKEND'

export interface SlotValue {
  id: string
  ko: string
  fr: string
  weight?: number
}

export interface Pattern {
  id: string
  topic: Topic
  level: 1 | 2
  templateKo: string
  frMeaning: string
  slots: SlotKey[]
  partnerRepliesKo?: string[]
}

export interface GeneratedSentence {
  patternId: string
  korean: string
  english: string
  slotsUsed: string[]
}

export interface PatternMastery {
  id?: number
  patternId: string
  masteryState: 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED'
  lastReviewDate: string | null
  reviewCount: number
  difficultCount7Days: number
}

export interface TrainingLog {
  id?: number
  patternId: string
  date: string
  rating: 'easy' | 'medium' | 'hard'
  timestamp: number
}
