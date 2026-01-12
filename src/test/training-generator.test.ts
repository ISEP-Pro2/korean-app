import { describe, it, expect } from 'vitest'
import {
  generateTrainingSet,
  fillPattern,
  getDaysSinceStart,
  getMaxSlotsForDay,
} from '../lib/training-generator'
import { trainingPatterns, slotDictionary } from '../data/training.seed'

describe('Training Generator', () => {
  describe('getDaysSinceStart', () => {
    it('returns 0 for today', () => {
      const today = new Date().toISOString().split('T')[0]
      expect(getDaysSinceStart(today)).toBe(0)
    })

    it('returns positive number for past dates', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 10)
      const pastDateStr = pastDate.toISOString().split('T')[0]
      expect(getDaysSinceStart(pastDateStr)).toBe(10)
    })

    it('returns 0 for null date', () => {
      expect(getDaysSinceStart(null)).toBe(0)
    })
  })

  describe('getMaxSlotsForDay', () => {
    it('returns 1 for days 0-13', () => {
      expect(getMaxSlotsForDay(0)).toBe(1)
      expect(getMaxSlotsForDay(7)).toBe(1)
      expect(getMaxSlotsForDay(13)).toBe(1)
    })

    it('returns 2 for days 14+', () => {
      expect(getMaxSlotsForDay(14)).toBe(2)
      expect(getMaxSlotsForDay(30)).toBe(2)
      expect(getMaxSlotsForDay(100)).toBe(2)
    })
  })

  describe('fillPattern', () => {
    it('fills a single slot pattern', () => {
      const pattern = trainingPatterns.find(p => p.slots.length === 1)!
      
      const result = fillPattern(pattern, slotDictionary, 1)
      
      expect(result.patternId).toBe(pattern.id)
      expect(result.korean).not.toContain('{')
      expect(result.english).not.toContain('{')
      expect(result.slotsUsed).toHaveLength(1)
    })

    it('fills multiple slot patterns when maxSlots allows', () => {
      const pattern = trainingPatterns.find(p => p.slots.length >= 2)!
      
      const result = fillPattern(pattern, slotDictionary, 2)
      
      expect(result.korean).not.toContain('{')
      expect(result.english).not.toContain('{')
      expect(result.slotsUsed.length).toBeGreaterThanOrEqual(2)
    })

    it('fills all slots even when maxSlots is 1', () => {
      const pattern = trainingPatterns.find(p => p.slots.length >= 2)!
      
      const result = fillPattern(pattern, slotDictionary, 1)
      
      // All slots should be filled (just less variation)
      expect(result.korean).not.toContain('{')
      expect(result.slotsUsed.length).toBe(pattern.slots.length)
    })
  })

  describe('generateTrainingSet', () => {
    it('generates the requested number of sentences', () => {
      const today = new Date().toISOString().split('T')[0]
      const result = generateTrainingSet(trainingPatterns, 5, today)
      
      expect(result).toHaveLength(5)
    })

    it('generates sentences with korean and english text', () => {
      const today = new Date().toISOString().split('T')[0]
      const result = generateTrainingSet(trainingPatterns, 5, today)
      
      result.forEach(sentence => {
        expect(sentence.korean).toBeTruthy()
        expect(sentence.english).toBeTruthy()
        expect(sentence.patternId).toBeTruthy()
        expect(sentence.slotsUsed.length).toBeGreaterThan(0)
      })
    })

    it('respects slot limits for new users (day 0)', () => {
      const today = new Date().toISOString().split('T')[0]
      const result = generateTrainingSet(trainingPatterns, 5, today)
      
      // On day 0, should prefer single-slot patterns
      expect(result.length).toBe(5)
    })

    it('handles empty patterns array gracefully', () => {
      const today = new Date().toISOString().split('T')[0]
      const result = generateTrainingSet([], 5, today)
      
      expect(result).toHaveLength(0)
    })

    it('handles count larger than available unique patterns', () => {
      const today = new Date().toISOString().split('T')[0]
      const result = generateTrainingSet(trainingPatterns, 100, today)
      
      // Should return as many as possible without infinite loop
      expect(result.length).toBeGreaterThan(0)
      expect(result.length).toBeLessThanOrEqual(100)
    })
  })
})
