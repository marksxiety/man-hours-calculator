import { describe, it, expect } from 'vitest'
import { validateEstimateOrder, estimateIssueMessage } from '../validateEstimates'

describe('validateEstimateOrder', () => {
  it('should be valid when O ≤ M ≤ P', () => {
    const result = validateEstimateOrder(1, 2, 3)
    expect(result.valid).toBe(true)
    expect(result.issues).toEqual([])
  })

  it('should be valid when all estimates are equal', () => {
    expect(validateEstimateOrder(2, 2, 2).valid).toBe(true)
  })

  it('should flag OPTIMISTIC_GT_MOST_LIKELY when O > M', () => {
    const result = validateEstimateOrder(5, 3, 8)
    expect(result.valid).toBe(false)
    expect(result.issues).toEqual(['OPTIMISTIC_GT_MOST_LIKELY'])
  })

  it('should flag MOST_LIKELY_GT_PESSIMISTIC when M > P', () => {
    const result = validateEstimateOrder(1, 8, 5)
    expect(result.valid).toBe(false)
    expect(result.issues).toEqual(['MOST_LIKELY_GT_PESSIMISTIC'])
  })

  it('should flag both issues when fully out of order', () => {
    const result = validateEstimateOrder(9, 5, 2)
    expect(result.valid).toBe(false)
    expect(result.issues).toEqual([
      'OPTIMISTIC_GT_MOST_LIKELY',
      'MOST_LIKELY_GT_PESSIMISTIC',
    ])
  })

  it('should only compare pairs where both values are present', () => {
    expect(validateEstimateOrder(null, 5, 2).issues).toEqual(['MOST_LIKELY_GT_PESSIMISTIC'])
    expect(validateEstimateOrder(9, null, 2).issues).toEqual([])
    expect(validateEstimateOrder(9, 5, null).issues).toEqual(['OPTIMISTIC_GT_MOST_LIKELY'])
  })

  it('should return a descriptive message for each issue', () => {
    expect(estimateIssueMessage('OPTIMISTIC_GT_MOST_LIKELY')).toMatch(/Optimistic/)
    expect(estimateIssueMessage('MOST_LIKELY_GT_PESSIMISTIC')).toMatch(/Most Likely/)
  })
})
