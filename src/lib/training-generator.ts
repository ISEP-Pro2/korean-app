// Training Sentence Generator
// Generates sentences by filling pattern slots with vocabulary

import { Pattern, SlotKey, SlotValue, GeneratedSentence, Topic } from './training-types'
import { slotDictionary } from '@/data/training.seed'

/**
 * Get the number of days since app start date
 */
export function getDaysSinceStart(appStartDate: string | null): number {
  if (!appStartDate) return 0
  
  const start = new Date(appStartDate)
  start.setHours(0, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diffTime = now.getTime() - start.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.max(0, diffDays)
}

/**
 * Determine maxSlots based on days since start
 * First 14 days: 1 slot max
 * After day 14: 2 slots max
 */
export function getMaxSlotsForDay(daysSinceStart: number): number {
  return daysSinceStart < 14 ? 1 : 2
}

/**
 * Fill a single pattern with random slot values
 */
export function fillPattern(
  pattern: Pattern,
  slots: Record<SlotKey, SlotValue[]>,
  maxSlots: number = 2
): GeneratedSentence {
  let korean = pattern.templateKo
  let english = pattern.frMeaning
  const slotsUsed: string[] = []
  
  // Determine which slots to vary vs keep fixed
  const slotsToVary = pattern.slots.slice(0, maxSlots)
  
  for (const slotKey of pattern.slots) {
    const slotOptions = slots[slotKey]
    if (!slotOptions || slotOptions.length === 0) continue
    
    // If this slot should vary, pick random; otherwise pick first (consistent)
    const shouldVary = slotsToVary.includes(slotKey)
    const selected = shouldVary
      ? slotOptions[Math.floor(Math.random() * slotOptions.length)]
      : slotOptions[0]
    
    korean = korean.replace(`{${slotKey}}`, selected.ko)
    english = english.replace(`{${slotKey}}`, selected.fr)
    slotsUsed.push(`${slotKey}:${selected.id}`)
  }
  
  return {
    patternId: pattern.id,
    korean,
    english,
    slotsUsed,
  }
}

/**
 * Generate a training set of sentences from patterns
 * 
 * @param patterns - Available patterns to use
 * @param count - Number of sentences to generate (default 5)
 * @param appStartDate - App start date to determine slot limits
 * @returns Array of generated sentences
 */
export function generateTrainingSet(
  patterns: Pattern[],
  count: number = 5,
  appStartDate: string | null = null
): GeneratedSentence[] {
  if (patterns.length === 0) {
    return []
  }
  
  const daysSinceStart = getDaysSinceStart(appStartDate)
  const maxSlots = getMaxSlotsForDay(daysSinceStart)
  
  // Filter patterns based on slot count for beginners
  let availablePatterns = [...patterns]
  if (maxSlots === 1) {
    // Prefer single-slot patterns for first 14 days
    const singleSlotPatterns = availablePatterns.filter(p => p.slots.length === 1)
    if (singleSlotPatterns.length > 0) {
      availablePatterns = singleSlotPatterns
    }
  }
  
  const generated: GeneratedSentence[] = []
  const usedCombinations = new Set<string>()
  const maxAttempts = count * 10
  let attempts = 0
  
  while (generated.length < count && attempts < maxAttempts) {
    attempts++
    
    // Pick a random pattern
    const pattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)]
    
    // Generate sentence
    const sentence = fillPattern(pattern, slotDictionary, maxSlots)
    
    // Check for duplicates
    const key = `${sentence.patternId}:${sentence.korean}`
    if (usedCombinations.has(key)) {
      continue
    }
    
    usedCombinations.add(key)
    generated.push(sentence)
  }
  
  return generated
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}
