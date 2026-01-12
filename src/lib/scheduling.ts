// Scheduling logic for sentence selection
// Simplified SRS - not full SM-2

import { db, getTodayDate } from './db'
import { Sentence, MasteryState } from './types'

/**
 * Get today's 5 sentences based on scheduling rules:
 * - 3 from NEW/WARM (prioritized for learning)
 * - 2 from HOT/SOLID (maintenance)
 * - Pinned sentences always included
 */
export async function getTodaySentences(currentWeek: number): Promise<Sentence[]> {
  const today = getTodayDate()
  
  // Get all available sentences (unlocked for current week)
  const allSentences = await db.sentences
    .where('weekUnlock')
    .belowOrEqual(currentWeek)
    .toArray()
  
  // First, get pinned sentences (must be included)
  const pinnedSentences = allSentences.filter(s => s.pinnedForTomorrow)
  
  // Separate by mastery state
  const newWarm = allSentences.filter(
    s => (s.masteryState === 'NEW' || s.masteryState === 'WARM') && !s.pinnedForTomorrow
  )
  const hotSolid = allSentences.filter(
    s => (s.masteryState === 'HOT' || s.masteryState === 'SOLID') && !s.pinnedForTomorrow
  )
  
  const result: Sentence[] = [...pinnedSentences]
  
  // Sort by last review date (oldest first) and review count
  const sortByPriority = (a: Sentence, b: Sentence) => {
    // Never reviewed first
    if (!a.lastReviewDate && b.lastReviewDate) return -1
    if (a.lastReviewDate && !b.lastReviewDate) return 1
    if (!a.lastReviewDate && !b.lastReviewDate) return a.id - b.id
    
    // Then by last review date (oldest first)
    if (a.lastReviewDate! < b.lastReviewDate!) return -1
    if (a.lastReviewDate! > b.lastReviewDate!) return 1
    
    // Then by review count (fewer reviews first)
    return a.reviewCount - b.reviewCount
  }
  
  newWarm.sort(sortByPriority)
  hotSolid.sort(sortByPriority)
  
  // Fill up to 5 sentences
  // Target: 3 from NEW/WARM, 2 from HOT/SOLID
  const targetNewWarm = Math.max(0, 3 - pinnedSentences.filter(
    s => s.masteryState === 'NEW' || s.masteryState === 'WARM'
  ).length)
  
  const targetHotSolid = Math.max(0, 2 - pinnedSentences.filter(
    s => s.masteryState === 'HOT' || s.masteryState === 'SOLID'
  ).length)
  
  // Add NEW/WARM sentences
  for (let i = 0; i < targetNewWarm && i < newWarm.length && result.length < 5; i++) {
    result.push(newWarm[i])
  }
  
  // Add HOT/SOLID sentences
  for (let i = 0; i < targetHotSolid && i < hotSolid.length && result.length < 5; i++) {
    result.push(hotSolid[i])
  }
  
  // If still not 5, fill with whatever is left
  const remaining = [...newWarm, ...hotSolid].filter(s => !result.includes(s))
  for (const s of remaining) {
    if (result.length >= 5) break
    result.push(s)
  }
  
  // Shuffle result for variety (but keep pinned first for visibility)
  const pinned = result.filter(s => s.pinnedForTomorrow)
  const notPinned = result.filter(s => !s.pinnedForTomorrow)
  shuffleArray(notPinned)
  
  return [...pinned, ...notPinned].slice(0, 5)
}

/**
 * Update sentence mastery based on rating
 */
export function getNewMasteryState(
  currentState: MasteryState,
  rating: 'easy' | 'normal' | 'hard'
): MasteryState {
  const states: MasteryState[] = ['NEW', 'WARM', 'HOT', 'SOLID']
  const currentIndex = states.indexOf(currentState)
  
  if (rating === 'hard') {
    return states[Math.max(0, currentIndex - 1)]
  } else if (rating === 'easy') {
    return states[Math.min(3, currentIndex + 1)]
  }
  
  return currentState
}

/**
 * Check if sentence should be pinned for tomorrow
 * Rule: rated hard 2+ times in last 7 days
 */
export async function shouldPinForTomorrow(sentenceId: number): Promise<boolean> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]
  
  const hardRatings = await db.reviewLogs
    .where('sentenceId')
    .equals(sentenceId)
    .and(log => log.date >= sevenDaysAgoStr && log.rating === 'hard')
    .count()
  
  return hardRatings >= 2
}

/**
 * Clear pinned status for a sentence (after it's been reviewed today)
 */
export async function clearPinnedStatus(sentenceId: number): Promise<void> {
  await db.sentences.update(sentenceId, { pinnedForTomorrow: false })
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}
