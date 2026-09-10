import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { NewTask, Analysis, PERTTaskResult, StoredState } from '@/types'
import { calculateExpectedTime } from '@/utils/calculateExpectedTime'
import { calculateStandardDeviation } from '@/utils/calculateStandardDeviation'
import { calculateVariance } from '@/utils/calculateVariance'
import { calculateTotalExpectedTime, calculateTotalVariance } from '@/utils/calculateTotals'
import { calculateZScore } from '@/utils/calculateZScore'
import { calculateProbability } from '@/utils/calculateProbability'
import { validateEstimateOrder } from '@/utils/validateEstimates'

export const useProjectStore = defineStore('project', () => {
  const taskList = ref<PERTTaskResult[]>([])
  const targetDuration = ref<number | null>(null)
  const targetDurationEdited = ref(false)
  const retainMilestone = ref(false)
  const deleteWarning = ref(true)
  const resetWarning = ref(true)

  const pertAnalysis = computed<Analysis>(() => {
    const totalExpectedTime = calculateTotalExpectedTime(taskList.value)
    const totalVariance = calculateTotalVariance(taskList.value)
    const zScore = taskList.value.length === 0 || targetDuration.value === null ? 0 : calculateZScore(targetDuration.value, totalExpectedTime, totalVariance)
    const probability = taskList.value.length === 0 ? 0 : calculateProbability(zScore) * 100
    return { totalExpectedTime, totalVariance, zScore, probability }
  })

  watch(
    () => pertAnalysis.value.totalExpectedTime,
    (totalExpected) => {
      if (!targetDurationEdited.value && totalExpected > 0) {
        targetDuration.value = +(totalExpected * 1.01).toFixed(2)
      }
    },
    { immediate: true }
  )

  const groupedTasks = computed(() => {
    const groups: { milestone: string; tasks: PERTTaskResult[] }[] = []
    const milestoneMap = new Map<string, PERTTaskResult[]>()

    taskList.value.forEach(task => {
      const milestone = task.milestone || 'Uncategorized'
      if (!milestoneMap.has(milestone)) {
        milestoneMap.set(milestone, [])
      }
      milestoneMap.get(milestone)!.push(task)
    })

    milestoneMap.forEach((tasks, milestone) => {
      groups.push({ milestone, tasks })
    })

    return groups
  })

  function loadFromProject(state: StoredState): void {
    taskList.value = state.tasks || []
    targetDuration.value = state.targetDuration ?? null
    targetDurationEdited.value = state.targetDurationEdited ?? false
    retainMilestone.value = state.retainMilestone ?? false
    deleteWarning.value = state.deleteWarning ?? true
    resetWarning.value = state.resetWarning ?? true
  }

  function exportState(): StoredState {
    return {
      tasks: taskList.value,
      targetDuration: targetDuration.value,
      targetDurationEdited: targetDurationEdited.value,
      retainMilestone: retainMilestone.value,
      deleteWarning: deleteWarning.value,
      resetWarning: resetWarning.value,
    }
  }

  function addTask(newTaskForm: NewTask): boolean {
    if (newTaskForm.optimistic === null || newTaskForm.mostLikely === null || newTaskForm.pessimistic === null) {
      return false
    }
    if (!validateEstimateOrder(newTaskForm.optimistic, newTaskForm.mostLikely, newTaskForm.pessimistic).valid) {
      return false
    }

    const expectedTime = calculateExpectedTime(newTaskForm)
    const standardDeviation = calculateStandardDeviation(newTaskForm)
    const variance = calculateVariance(standardDeviation)
    taskList.value.push({
      taskName: newTaskForm.taskName,
      milestone: newTaskForm.milestone,
      description: newTaskForm.description,
      optimistic: newTaskForm.optimistic,
      mostLikely: newTaskForm.mostLikely,
      pessimistic: newTaskForm.pessimistic,
      expectedTime,
      standardDeviation,
      variance,
    })
    return true
  }

  function removeTask(index: number): void {
    taskList.value.splice(index, 1)
  }

  function updateTask(index: number, field: 'optimistic' | 'mostLikely' | 'pessimistic', value: number | null): void {
    const task = taskList.value[index]
    if (task) {
      task[field] = value
      if (task.optimistic !== null && task.mostLikely !== null && task.pessimistic !== null) {
        task.expectedTime = calculateExpectedTime(task)
        task.standardDeviation = calculateStandardDeviation(task)
        task.variance = calculateVariance(task.standardDeviation)
      }
    }
  }

  function editTask(index: number, updates: Partial<Pick<PERTTaskResult, 'taskName' | 'milestone' | 'description' | 'optimistic' | 'mostLikely' | 'pessimistic'>>): void {
    const task = taskList.value[index]
    if (!task) return

    const optimistic = updates.optimistic ?? task.optimistic
    const mostLikely = updates.mostLikely ?? task.mostLikely
    const pessimistic = updates.pessimistic ?? task.pessimistic
    if (optimistic !== null && mostLikely !== null && pessimistic !== null && !validateEstimateOrder(optimistic, mostLikely, pessimistic).valid) {
      return
    }

    Object.assign(task, updates)
    if (task.optimistic !== null && task.mostLikely !== null && task.pessimistic !== null) {
      task.expectedTime = calculateExpectedTime(task)
      task.standardDeviation = calculateStandardDeviation(task)
      task.variance = calculateVariance(task.standardDeviation)
    }
  }

  function resetTaskForm(): void {
    retainMilestone.value = false
  }

  function resetAll(): void {
    taskList.value = []
    targetDuration.value = null
    targetDurationEdited.value = false
    retainMilestone.value = false
  }

  function setTargetDuration(value: number | null): void {
    targetDuration.value = value
    targetDurationEdited.value = true
  }

  return {
    taskList,
    targetDuration,
    targetDurationEdited,
    retainMilestone,
    deleteWarning,
    resetWarning,
    pertAnalysis,
    groupedTasks,
    loadFromProject,
    exportState,
    addTask,
    removeTask,
    updateTask,
    editTask,
    resetTaskForm,
    resetAll,
    setTargetDuration,
  }
})
