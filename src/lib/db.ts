// Dexie database schema for K-8M

import Dexie, { Table } from 'dexie'
import { Sentence, Episode, DailyLog, ReviewLog, HeardWord, Settings, AudioBlob } from './types'
import { foundationSentences } from '@/data/sentences'
import { defaultSettings } from '@/data/program'

export class K8MDatabase extends Dexie {
  sentences!: Table<Sentence, number>
  episodes!: Table<Episode, number>
  dailyLogs!: Table<DailyLog, number>
  reviewLogs!: Table<ReviewLog, number>
  heardWords!: Table<HeardWord, number>
  settings!: Table<Settings, number>
  audioBlobs!: Table<AudioBlob, number>

  constructor() {
    super('k8m-db')
    
    this.version(1).stores({
      sentences: 'id, category, masteryState, weekUnlock, lastReviewDate, pinnedForTomorrow',
      episodes: '++id, title, sourceType, lockedUntilDate',
      dailyLogs: '++id, date, completed',
      reviewLogs: '++id, sentenceId, date, rating',
      heardWords: '++id, word, episodeId, date',
      settings: 'id',
      audioBlobs: '++id, key',
    })
  }
}

export const db = new K8MDatabase()

// Initialize database with seed data
export async function initializeDatabase(): Promise<void> {
  const sentenceCount = await db.sentences.count()
  
  if (sentenceCount === 0) {
    // Seed sentences
    const sentences: Sentence[] = foundationSentences.map(s => ({
      ...s,
      masteryState: 'NEW' as const,
      lastReviewDate: null,
      reviewCount: 0,
      difficultCount7Days: 0,
    }))
    await db.sentences.bulkAdd(sentences)
  }

  // Initialize settings if not exists
  const settings = await db.settings.get(1)
  if (!settings) {
    await db.settings.add({
      id: 1,
      ...defaultSettings,
      appStartDate: new Date().toISOString().split('T')[0],
    })
  }
}

// Helper to get today's date string
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

// Get or create today's log
export async function getTodayLog(): Promise<DailyLog> {
  const today = getTodayDate()
  let log = await db.dailyLogs.where('date').equals(today).first()
  
  if (!log) {
    const id = await db.dailyLogs.add({
      date: today,
      listeningMinutes: 0,
      speakingMinutes: 0,
      partnerMinutes: 0,
      sentencesCompleted: 0,
      spokeKorean: false,
      frictionRating: null,
      completed: false,
    })
    log = await db.dailyLogs.get(id)
  }
  
  return log!
}

// Update today's log
export async function updateTodayLog(updates: Partial<DailyLog>): Promise<void> {
  const log = await getTodayLog()
  await db.dailyLogs.update(log.id!, updates)
}

// Get settings
export async function getSettings(): Promise<Settings> {
  let settings = await db.settings.get(1)
  if (!settings) {
    await initializeDatabase()
    settings = await db.settings.get(1)
  }
  return settings!
}

// Update settings
export async function updateSettings(updates: Partial<Settings>): Promise<void> {
  await db.settings.update(1, updates)
}

// Get current episode (most recent unlocked or first)
export async function getCurrentEpisode(): Promise<Episode | undefined> {
  const today = getTodayDate()
  // Get the first episode that is not locked
  let episode = await db.episodes.where('lockedUntilDate').belowOrEqual(today).first()
  if (!episode) {
    // If all are locked or none exist, get the first one
    episode = await db.episodes.orderBy('id').first()
  }
  return episode
}

// Add review log and update sentence
export async function logReview(sentenceId: number, rating: 'easy' | 'normal' | 'hard'): Promise<void> {
  const today = getTodayDate()
  
  // Add review log
  await db.reviewLogs.add({
    sentenceId,
    date: today,
    rating,
  })
  
  // Get sentence and update mastery
  const sentence = await db.sentences.get(sentenceId)
  if (!sentence) return
  
  const states: ('NEW' | 'WARM' | 'HOT' | 'SOLID')[] = ['NEW', 'WARM', 'HOT', 'SOLID']
  const currentIndex = states.indexOf(sentence.masteryState)
  
  let newState = sentence.masteryState
  if (rating === 'hard') {
    newState = states[Math.max(0, currentIndex - 1)]
  } else if (rating === 'easy') {
    newState = states[Math.min(3, currentIndex + 1)]
  }
  
  // Check difficult count in last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]
  
  const recentDifficult = await db.reviewLogs
    .where('sentenceId').equals(sentenceId)
    .and(log => log.date >= sevenDaysAgoStr && log.rating === 'hard')
    .count()
  
  const pinnedForTomorrow = recentDifficult >= 2
  
  await db.sentences.update(sentenceId, {
    masteryState: newState,
    lastReviewDate: today,
    reviewCount: sentence.reviewCount + 1,
    difficultCount7Days: recentDifficult,
    pinnedForTomorrow,
  })
}

// Export all data for backup
export async function exportData(): Promise<object> {
  const sentences = await db.sentences.toArray()
  const episodes = await db.episodes.toArray()
  const dailyLogs = await db.dailyLogs.toArray()
  const reviewLogs = await db.reviewLogs.toArray()
  const heardWords = await db.heardWords.toArray()
  const settings = await db.settings.get(1)
  
  return {
    version: 1,
    exportDate: new Date().toISOString(),
    sentences,
    episodes: episodes.map(e => ({ ...e, blobKey: undefined })), // Don't export blob references
    dailyLogs,
    reviewLogs,
    heardWords,
    settings,
  }
}

// Import data from backup
export async function importData(data: {
  sentences?: Sentence[]
  episodes?: Episode[]
  dailyLogs?: DailyLog[]
  reviewLogs?: ReviewLog[]
  heardWords?: HeardWord[]
  settings?: Settings
}): Promise<void> {
  if (data.sentences) {
    await db.sentences.clear()
    await db.sentences.bulkAdd(data.sentences)
  }
  if (data.episodes) {
    await db.episodes.clear()
    await db.episodes.bulkAdd(data.episodes)
  }
  if (data.dailyLogs) {
    await db.dailyLogs.clear()
    await db.dailyLogs.bulkAdd(data.dailyLogs)
  }
  if (data.reviewLogs) {
    await db.reviewLogs.clear()
    await db.reviewLogs.bulkAdd(data.reviewLogs)
  }
  if (data.heardWords) {
    await db.heardWords.clear()
    await db.heardWords.bulkAdd(data.heardWords)
  }
  if (data.settings) {
    await db.settings.update(1, data.settings)
  }
}
