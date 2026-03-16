import { describe, it, expect } from 'vitest'
import { calculateExpectedTime } from '../calculateExpectedTime'

describe('calculateExpectedTime', () => {
  it('calculates PERT expected time correctly', () => {
    const task = { taskName: 'Test', optimistic: 2, mostLikely: 5, pessimistic: 14 }
    expect(calculateExpectedTime(task)).toBe(6)
  })

  it('handles zero values', () => {
    const task = { taskName: 'Test', optimistic: 0, mostLikely: 0, pessimistic: 0 }
    expect(calculateExpectedTime(task)).toBe(0)
  })

  it('handles equal estimates', () => {
    const task = { taskName: 'Test', optimistic: 5, mostLikely: 5, pessimistic: 5 }
    expect(calculateExpectedTime(task)).toBe(5)
  })

  it('weights most likely estimate appropriately', () => {
    const task = { taskName: 'Test', optimistic: 1, mostLikely: 10, pessimistic: 1 }
    const result = calculateExpectedTime(task)
    expect(result).toBeGreaterThan(5)
    expect(result).toBeLessThan(10)
  })

  it('handles large numbers', () => {
    const task = { taskName: 'Test', optimistic: 100, mostLikely: 500, pessimistic: 1000 }
    expect(calculateExpectedTime(task)).toBeCloseTo(516.67, 1)
  })

  it('handles decimal values', () => {
    const task = { taskName: 'Test', optimistic: 1.5, mostLikely: 3.5, pessimistic: 7.5 }
    expect(calculateExpectedTime(task)).toBeCloseTo(3.83, 1)
  })

  it('treats null optimistic as 0', () => {
    const task = { taskName: 'Test', optimistic: null, mostLikely: 5, pessimistic: 14 }
    expect(calculateExpectedTime(task)).toBe(5.666666666666667)
  })

  it('treats null mostLikely as 0', () => {
    const task = { taskName: 'Test', optimistic: 2, mostLikely: null, pessimistic: 14 }
    expect(calculateExpectedTime(task)).toBe(16 / 6)
  })

  it('treats null pessimistic as 0', () => {
    const task = { taskName: 'Test', optimistic: 2, mostLikely: 5, pessimistic: null }
    expect(calculateExpectedTime(task)).toBe(22 / 6)
  })

  it('treats all null values as 0', () => {
    const task = { taskName: 'Test', optimistic: null, mostLikely: null, pessimistic: null }
    expect(calculateExpectedTime(task)).toBe(0)
  })
})
