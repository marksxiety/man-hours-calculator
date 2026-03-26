import { describe, it, expect } from 'vitest'
import { calculateTotalVariance, calculateTotalExpectedTime } from '../calculateTotals'
import type { PERTTaskResult } from '@/types'

const createTask = (overrides?: Partial<PERTTaskResult>): PERTTaskResult => ({
  taskName: 'Test',
  milestone: '',
  description: '',
  optimistic: null,
  mostLikely: null,
  pessimistic: null,
  expectedTime: 0,
  standardDeviation: 0,
  variance: 0,
  ...overrides
})

describe('calculateTotalVariance', () => {
  it('calculates total variance correctly', () => {
    const tasks: PERTTaskResult[] = [
      createTask({ taskName: 'Task 1', optimistic: 2, mostLikely: 5, pessimistic: 8, expectedTime: 5, standardDeviation: 1, variance: 1 }),
      createTask({ taskName: 'Task 2', optimistic: 1, mostLikely: 4, pessimistic: 7, expectedTime: 4, standardDeviation: 1, variance: 1 })
    ]
    expect(calculateTotalVariance(tasks)).toBe(2)
  })

  it('handles empty array', () => {
    const tasks: PERTTaskResult[] = []
    expect(calculateTotalVariance(tasks)).toBe(0)
  })

  it('handles single task', () => {
    const tasks: PERTTaskResult[] = [
      createTask({ taskName: 'Task 1', optimistic: 2, mostLikely: 5, pessimistic: 8, expectedTime: 5, standardDeviation: 1, variance: 1 })
    ]
    expect(calculateTotalVariance(tasks)).toBe(1)
  })

  it('handles tasks with zero variance', () => {
    const tasks: PERTTaskResult[] = [
      createTask({ taskName: 'Task 1', optimistic: 5, mostLikely: 5, pessimistic: 5, expectedTime: 5, standardDeviation: 0, variance: 0 }),
      createTask({ taskName: 'Task 2', optimistic: 5, mostLikely: 5, pessimistic: 5, expectedTime: 5, standardDeviation: 0, variance: 0 })
    ]
    expect(calculateTotalVariance(tasks)).toBe(0)
  })

  it('handles large variance values', () => {
    const tasks: PERTTaskResult[] = [
      createTask({ taskName: 'Task 1', optimistic: 2, mostLikely: 5, pessimistic: 14, expectedTime: 6, standardDeviation: 2, variance: 4 }),
      createTask({ taskName: 'Task 2', optimistic: 1, mostLikely: 4, pessimistic: 10, expectedTime: 4.5, standardDeviation: 1.5, variance: 2.25 })
    ]
    expect(calculateTotalVariance(tasks)).toBeCloseTo(6.25, 2)
  })

  it('rounds to 3 decimal places', () => {
    const tasks: PERTTaskResult[] = [
      createTask({ taskName: 'Task 1', optimistic: 1, mostLikely: 3, pessimistic: 5, expectedTime: 3, standardDeviation: 0.667, variance: 0.445 }),
      createTask({ taskName: 'Task 2', optimistic: 1, mostLikely: 3, pessimistic: 5, expectedTime: 3, standardDeviation: 0.667, variance: 0.445 })
    ]
    expect(calculateTotalVariance(tasks)).toBeCloseTo(0.89, 2)
  })
})

describe('calculateTotalExpectedTime', () => {
  it('calculates total expected time correctly', () => {
    const tasks: PERTTaskResult[] = [
      createTask({ taskName: 'Task 1', optimistic: 2, mostLikely: 5, pessimistic: 8, expectedTime: 5, standardDeviation: 1, variance: 1 }),
      createTask({ taskName: 'Task 2', optimistic: 1, mostLikely: 4, pessimistic: 7, expectedTime: 4, standardDeviation: 1, variance: 1 })
    ]
    expect(calculateTotalExpectedTime(tasks)).toBe(9)
  })

  it('handles empty array', () => {
    const tasks: PERTTaskResult[] = []
    expect(calculateTotalExpectedTime(tasks)).toBe(0)
  })

  it('handles single task', () => {
    const tasks: PERTTaskResult[] = [
      createTask({ taskName: 'Task 1', optimistic: 2, mostLikely: 5, pessimistic: 8, expectedTime: 5, standardDeviation: 1, variance: 1 })
    ]
    expect(calculateTotalExpectedTime(tasks)).toBe(5)
  })

  it('handles tasks with decimal expected times', () => {
    const tasks: PERTTaskResult[] = [
      createTask({ taskName: 'Task 1', optimistic: 2, mostLikely: 5, pessimistic: 14, expectedTime: 6, standardDeviation: 2, variance: 4 }),
      createTask({ taskName: 'Task 2', optimistic: 1, mostLikely: 4, pessimistic: 10, expectedTime: 4.5, standardDeviation: 1.5, variance: 2.25 })
    ]
    expect(calculateTotalExpectedTime(tasks)).toBeCloseTo(10.5, 1)
  })

  it('handles large number of tasks', () => {
    const tasks: PERTTaskResult[] = Array.from({ length: 10 }, (_, i) => (
      createTask({
        taskName: `Task ${i + 1}`,
        optimistic: 2,
        mostLikely: 5,
        pessimistic: 8,
        expectedTime: 5,
        standardDeviation: 1,
        variance: 1
      })
    ))
    expect(calculateTotalExpectedTime(tasks)).toBe(50)
  })

  it('rounds to 3 decimal places', () => {
    const tasks: PERTTaskResult[] = [
      createTask({ taskName: 'Task 1', optimistic: 1, mostLikely: 3, pessimistic: 5, expectedTime: 3, standardDeviation: 0.667, variance: 0.445 }),
      createTask({ taskName: 'Task 2', optimistic: 1, mostLikely: 3, pessimistic: 5, expectedTime: 3, standardDeviation: 0.667, variance: 0.445 })
    ]
    expect(calculateTotalExpectedTime(tasks)).toBeCloseTo(6, 1)
  })
})
