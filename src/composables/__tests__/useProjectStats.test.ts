import { describe, it, expect } from 'vitest'
import type { Project } from '@/types'
import { useProjectStats } from '../useProjectStats'

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    name: 'Test Project',
    pinned: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: new Date(2026, 0, 2, 3, 4).toISOString(),
    state: {
      tasks: [],
      targetDuration: null,
      targetDurationEdited: false,
      retainMilestone: false,
      deleteWarning: true,
      resetWarning: true,
    },
    ...overrides,
  }
}

describe('useProjectStats', () => {
  it('should format the updated date', () => {
    const stats = useProjectStats(makeProject())
    expect(stats.formattedDate.value).toBe('01-02-26 03:04')
  })

  it('should return 0.00 hours when there are no tasks', () => {
    const stats = useProjectStats(makeProject())
    expect(stats.totalExpected.value).toBe('0.00')
  })

  it('should sum expected time across tasks', () => {
    const project = makeProject({
      state: {
        tasks: [
          { taskName: 'A', milestone: '', description: '', optimistic: 1, mostLikely: 2, pessimistic: 3, expectedTime: 2, standardDeviation: 0.33, variance: 0.11 },
          { taskName: 'B', milestone: '', description: '', optimistic: 2, mostLikely: 4, pessimistic: 6, expectedTime: 4, standardDeviation: 0.67, variance: 0.44 },
        ],
        targetDuration: null,
        targetDurationEdited: false,
        retainMilestone: false,
        deleteWarning: true,
        resetWarning: true,
      },
    })
    const stats = useProjectStats(project)
    expect(stats.totalExpected.value).toBe('6.00')
  })

  it('should return 0.0 on-time probability without a target duration', () => {
    const project = makeProject({
      state: {
        tasks: [
          { taskName: 'A', milestone: '', description: '', optimistic: 1, mostLikely: 2, pessimistic: 3, expectedTime: 2, standardDeviation: 0.33, variance: 0.11 },
        ],
        targetDuration: null,
        targetDurationEdited: false,
        retainMilestone: false,
        deleteWarning: true,
        resetWarning: true,
      },
    })
    const stats = useProjectStats(project)
    expect(stats.onTimeProbability.value).toBe('0.0')
  })

  it('should compute on-time probability with a target duration', () => {
    const project = makeProject({
      state: {
        tasks: [
          { taskName: 'A', milestone: '', description: '', optimistic: 1, mostLikely: 2, pessimistic: 3, expectedTime: 2, standardDeviation: 0.33, variance: 0.11 },
        ],
        targetDuration: 20,
        targetDurationEdited: false,
        retainMilestone: false,
        deleteWarning: true,
        resetWarning: true,
      },
    })
    const stats = useProjectStats(project)
    expect(Number(stats.onTimeProbability.value)).toBeGreaterThan(0)
    expect(Number(stats.onTimeProbability.value)).toBeLessThanOrEqual(100)
  })
})
