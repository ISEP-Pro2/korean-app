import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getNewMasteryState } from '@/lib/scheduling'
import { db, initializeDatabase, logReview, getTodayDate } from '@/lib/db'
import { Sentence, MasteryState } from '@/lib/types'

describe('Scheduling Logic', () => {
  describe('getNewMasteryState', () => {
    it('should move state forward on easy rating', () => {
      expect(getNewMasteryState('NEW', 'easy')).toBe('WARM')
      expect(getNewMasteryState('WARM', 'easy')).toBe('HOT')
      expect(getNewMasteryState('HOT', 'easy')).toBe('SOLID')
      expect(getNewMasteryState('SOLID', 'easy')).toBe('SOLID') // max
    })

    it('should move state backward on hard rating', () => {
      expect(getNewMasteryState('SOLID', 'hard')).toBe('HOT')
      expect(getNewMasteryState('HOT', 'hard')).toBe('WARM')
      expect(getNewMasteryState('WARM', 'hard')).toBe('NEW')
      expect(getNewMasteryState('NEW', 'hard')).toBe('NEW') // min
    })

    it('should keep state on normal rating', () => {
      expect(getNewMasteryState('NEW', 'normal')).toBe('NEW')
      expect(getNewMasteryState('WARM', 'normal')).toBe('WARM')
      expect(getNewMasteryState('HOT', 'normal')).toBe('HOT')
      expect(getNewMasteryState('SOLID', 'normal')).toBe('SOLID')
    })
  })
})

describe('Pin for Tomorrow Rule', () => {
  beforeEach(async () => {
    // Reset database
    await db.delete()
    await db.open()
    
    // Add a test sentence
    await db.sentences.add({
      id: 1,
      ko: '테스트 문장',
      fr: 'Test sentence',
      category: 'foundation',
      weekUnlock: 1,
      masteryState: 'NEW',
      lastReviewDate: null,
      reviewCount: 0,
      difficultCount7Days: 0,
    })
  })

  afterEach(async () => {
    await db.delete()
  })

  it('should pin sentence after 2 hard ratings in 7 days', async () => {
    // First hard rating
    await logReview(1, 'hard')
    let sentence = await db.sentences.get(1)
    expect(sentence?.pinnedForTomorrow).toBeFalsy()

    // Second hard rating
    await logReview(1, 'hard')
    sentence = await db.sentences.get(1)
    expect(sentence?.pinnedForTomorrow).toBe(true)
  })

  it('should not pin sentence with only 1 hard rating', async () => {
    await logReview(1, 'hard')
    const sentence = await db.sentences.get(1)
    expect(sentence?.pinnedForTomorrow).toBeFalsy()
  })

  it('should not pin sentence with normal ratings', async () => {
    await logReview(1, 'normal')
    await logReview(1, 'normal')
    const sentence = await db.sentences.get(1)
    expect(sentence?.pinnedForTomorrow).toBeFalsy()
  })

  it('should correctly update mastery state on review', async () => {
    // Start at NEW
    let sentence = await db.sentences.get(1)
    expect(sentence?.masteryState).toBe('NEW')

    // Easy -> WARM
    await logReview(1, 'easy')
    sentence = await db.sentences.get(1)
    expect(sentence?.masteryState).toBe('WARM')

    // Easy -> HOT
    await logReview(1, 'easy')
    sentence = await db.sentences.get(1)
    expect(sentence?.masteryState).toBe('HOT')

    // Hard -> WARM
    await logReview(1, 'hard')
    sentence = await db.sentences.get(1)
    expect(sentence?.masteryState).toBe('WARM')
  })
})
