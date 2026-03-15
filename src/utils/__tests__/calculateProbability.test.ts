import { describe, it, expect } from 'vitest'
import { calculateProbability } from '../calculateProbability'

describe('calculateProbability', () => {
  it('handles Infinity as 100% probability', () => {
    expect(calculateProbability(Infinity)).toBe(1)
  })

  it('handles -Infinity as 0% probability', () => {
    expect(calculateProbability(-Infinity)).toBe(0)
  })

  it('handles NaN as 50% probability', () => {
    expect(calculateProbability(NaN)).toBe(0.5)
  })

  it('calculates probability for z-score of 0 as 50%', () => {
    expect(calculateProbability(0)).toBeCloseTo(0.5, 2)
  })

  it('calculates probability for positive z-score of 1', () => {
    expect(calculateProbability(1)).toBeCloseTo(0.841, 2)
  })

  it('calculates probability for positive z-score of 2', () => {
    expect(calculateProbability(2)).toBeCloseTo(0.977, 2)
  })

  it('calculates probability for positive z-score of 3', () => {
    expect(calculateProbability(3)).toBeCloseTo(0.999, 2)
  })

  it('calculates probability for negative z-score of -1', () => {
    expect(calculateProbability(-1)).toBeCloseTo(0.159, 2)
  })

  it('calculates probability for negative z-score of -2', () => {
    expect(calculateProbability(-2)).toBeCloseTo(0.023, 2)
  })

  it('calculates probability for negative z-score of -3', () => {
    expect(calculateProbability(-3)).toBeCloseTo(0.001, 2)
  })

  it('handles decimal z-scores', () => {
    expect(calculateProbability(0.5)).toBeCloseTo(0.691, 2)
  })

  it('returns probability between 0 and 1 for valid z-scores', () => {
    const result = calculateProbability(1.5)
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(1)
  })
})
