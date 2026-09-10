export type EstimateIssue =
  | 'OPTIMISTIC_GT_MOST_LIKELY'
  | 'MOST_LIKELY_GT_PESSIMISTIC'

export interface EstimateValidation {
  valid: boolean
  issues: EstimateIssue[]
}

export function validateEstimateOrder(
  optimistic: number | null,
  mostLikely: number | null,
  pessimistic: number | null,
): EstimateValidation {
  const issues: EstimateIssue[] = []

  if (optimistic !== null && mostLikely !== null && optimistic > mostLikely) {
    issues.push('OPTIMISTIC_GT_MOST_LIKELY')
  }
  if (mostLikely !== null && pessimistic !== null && mostLikely > pessimistic) {
    issues.push('MOST_LIKELY_GT_PESSIMISTIC')
  }

  return { valid: issues.length === 0, issues }
}

export function estimateIssueMessage(issue: EstimateIssue): string {
  switch (issue) {
    case 'OPTIMISTIC_GT_MOST_LIKELY':
      return 'Optimistic (O) must be less than or equal to Most Likely (M).'
    case 'MOST_LIKELY_GT_PESSIMISTIC':
      return 'Most Likely (M) must be less than or equal to Pessimistic (P).'
  }
}