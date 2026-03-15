import { describe, it, expect } from 'vitest'
import { calculateVariance } from '../calculateVariance'

describe('calculateVariance', () => {
  it('calculates variance correctly', () => {
    expect(calculateVariance(2)).toBe(4)
  })

  it('handles zero', () => {
    expect(calculateVariance(0)).toBe(0)
  })

  it('handles decimal values', () => {
    expect(calculateVariance(0.5)).toBe(0.25)
  })

  it('handles large numbers', () => {
    expect(calculateVariance(100)).toBe(10000)
  })

  it('handles very small numbers', () => {
    expect(calculateVariance(0.1)).toBeCloseTo(0.01, 5)
  })

  it('handles negative values correctly', () => {
    expect(calculateVariance(-2)).toBe(4)
  })
})
