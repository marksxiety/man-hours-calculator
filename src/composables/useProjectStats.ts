import { computed, type ComputedRef } from 'vue'
import type { Project } from '@/types'
import { calculateTotalExpectedTime, calculateTotalVariance } from '@/utils/calculateTotals'
import { calculateZScore } from '@/utils/calculateZScore'
import { calculateProbability } from '@/utils/calculateProbability'

export type UseProjectStatsReturn = {
  formattedDate: ComputedRef<string>
  totalExpected: ComputedRef<string>
  onTimeProbability: ComputedRef<string>
}

export function useProjectStats(project: Project): UseProjectStatsReturn {
  const formattedDate = computed(() => {
    const date = new Date(project.updatedAt)
    const MM = String(date.getMonth() + 1).padStart(2, '0')
    const DD = String(date.getDate()).padStart(2, '0')
    const YY = String(date.getFullYear()).slice(2)
    const HH = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    return `${MM}-${DD}-${YY} ${HH}:${mm}`
  })

  const totalExpected = computed(() => {
    if (project.state.tasks.length === 0) return '0.00'
    return calculateTotalExpectedTime(project.state.tasks).toFixed(2)
  })

  const onTimeProbability = computed(() => {
    const { tasks, targetDuration } = project.state
    if (tasks.length === 0 || targetDuration === null) return '0.0'
    const totalExp = calculateTotalExpectedTime(tasks)
    const totalVar = calculateTotalVariance(tasks)
    const z = calculateZScore(targetDuration, totalExp, totalVar)
    return (calculateProbability(z) * 100).toFixed(1)
  })

  return {
    formattedDate,
    totalExpected,
    onTimeProbability,
  }
}
