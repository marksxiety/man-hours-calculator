import { describe, it, expect } from 'vitest'
import { calculateStandardDeviation } from '../calculateStandardDeviation'

describe('calculateStandardDeviation', () => {
  it('calculates standard deviation correctly', () => {
    const task = { taskName: 'Test', optimistic: 2, mostLikely: 5, pessimistic: 8 }
    expect(calculateStandardDeviation(task)).toBe(1)
  })

  it('handles zero range', () => {
    const task = { taskName: 'Test', optimistic: 5, mostLikely: 5, pessimistic: 5 }
    expect(calculateStandardDeviation(task)).toBe(0)
  })

  it('handles larger ranges', () => {
    const task = { taskName: 'Test', optimistic: 2, mostLikely: 5, pessimistic: 14 }
    expect(calculateStandardDeviation(task)).toBe(2)
  })

  it('handles fractional results', () => {
    const task = { taskName: 'Test', optimistic: 1, mostLikely: 5, pessimistic: 4 }
    expect(calculateStandardDeviation(task)).toBeCloseTo(0.5, 1)
  })

  it('handles decimal values', () => {
    const task = { taskName: 'Test', optimistic: 1.5, mostLikely: 5, pessimistic: 7.5 }
    expect(calculateStandardDeviation(task)).toBe(1)
  })

  it('handles very small ranges', () => {
    const task = { taskName: 'Test', optimistic: 4.9, mostLikely: 5, pessimistic: 5.1 }
    expect(calculateStandardDeviation(task)).toBeCloseTo(0.033, 2)
  })

  it('treats null optimistic as 0', () => {
    const task = { taskName: 'Test', optimistic: null, mostLikely: 5, pessimistic: 8 }
    expect(calculateStandardDeviation(task)).toBe(1.3333333333333333)
  })

  it('treats null pessimistic as 0', () => {
    const task = { taskName: 'Test', optimistic: 2, mostLikely: 5, pessimistic: null }
    expect(calculateStandardDeviation(task)).toBe(-0.3333333333333333)
  })

  it('treats both null as 0', () => {
    const task = { taskName: 'Test', optimistic: null, mostLikely: 5, pessimistic: null }
    expect(calculateStandardDeviation(task)).toBe(0)
  })
})
