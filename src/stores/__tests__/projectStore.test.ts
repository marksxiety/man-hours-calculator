import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectStore } from '../projectStore'
import type { NewTask } from '@/types'

describe('Project Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should add a task successfully', () => {
    const store = useProjectStore()
    const newTask: NewTask = {
      taskName: 'Test Task',
      milestone: 'Test Milestone',
      description: 'Test Description',
      optimistic: 2,
      mostLikely: 5,
      pessimistic: 10,
    }

    const result = store.addTask(newTask)

    expect(result).toBe(true)
    expect(store.taskList).toHaveLength(1)
    expect(store.taskList[0].taskName).toBe('Test Task')
    expect(store.taskList[0].expectedTime).toBeGreaterThan(0)
  })

  it('should reject task with missing fields', () => {
    const store = useProjectStore()
    const newTask: NewTask = {
      taskName: 'Test Task',
      milestone: 'Test Milestone',
      description: 'Test Description',
      optimistic: 2,
      mostLikely: null,
      pessimistic: 10,
    }

    const result = store.addTask(newTask)

    expect(result).toBe(false)
    expect(store.taskList).toHaveLength(0)
  })

  it('should remove a task', () => {
    const store = useProjectStore()
    const newTask: NewTask = {
      taskName: 'Test Task',
      milestone: 'Test Milestone',
      description: 'Test Description',
      optimistic: 2,
      mostLikely: 5,
      pessimistic: 10,
    }

    store.addTask(newTask)
    expect(store.taskList).toHaveLength(1)

    store.removeTask(0)
    expect(store.taskList).toHaveLength(0)
  })

  it('should update task estimates', () => {
    const store = useProjectStore()
    const newTask: NewTask = {
      taskName: 'Test Task',
      milestone: 'Test Milestone',
      description: 'Test Description',
      optimistic: 2,
      mostLikely: 5,
      pessimistic: 10,
    }

    store.addTask(newTask)
    const oldExpectedTime = store.taskList[0].expectedTime

    store.updateTask(0, 'optimistic', 3)
    expect(store.taskList[0].optimistic).toBe(3)
    expect(store.taskList[0].expectedTime).not.toBe(oldExpectedTime)
  })

  it('should set target duration', () => {
    const store = useProjectStore()

    store.setTargetDuration(100)
    expect(store.targetDuration).toBe(100)

    store.setTargetDuration(null)
    expect(store.targetDuration).toBeNull()
  })

  it('should reset all data', () => {
    const store = useProjectStore()
    const newTask: NewTask = {
      taskName: 'Test Task',
      milestone: 'Test Milestone',
      description: 'Test Description',
      optimistic: 2,
      mostLikely: 5,
      pessimistic: 10,
    }

    store.addTask(newTask)
    store.setTargetDuration(100)
    store.retainMilestone = true

    expect(store.taskList).toHaveLength(1)
    expect(store.targetDuration).toBe(100)
    expect(store.retainMilestone).toBe(true)

    store.resetAll()

    expect(store.taskList).toHaveLength(0)
    expect(store.targetDuration).toBeNull()
    expect(store.retainMilestone).toBe(false)
  })

  it('should calculate PERT analysis correctly', () => {
    const store = useProjectStore()
    const newTask: NewTask = {
      taskName: 'Test Task',
      milestone: 'Test Milestone',
      description: 'Test Description',
      optimistic: 2,
      mostLikely: 5,
      pessimistic: 10,
    }

    store.addTask(newTask)
    store.setTargetDuration(20)

    const analysis = store.pertAnalysis

    expect(analysis.totalExpectedTime).toBeGreaterThan(0)
    expect(analysis.totalVariance).toBeGreaterThan(0)
    expect(analysis.probability).toBeGreaterThanOrEqual(0)
    expect(analysis.probability).toBeLessThanOrEqual(100)
  })

  it('should group tasks by milestone', () => {
    const store = useProjectStore()

    store.addTask({
      taskName: 'Task 1',
      milestone: 'Milestone A',
      description: '',
      optimistic: 2,
      mostLikely: 5,
      pessimistic: 10,
    })

    store.addTask({
      taskName: 'Task 2',
      milestone: 'Milestone A',
      description: '',
      optimistic: 1,
      mostLikely: 3,
      pessimistic: 5,
    })

    store.addTask({
      taskName: 'Task 3',
      milestone: 'Milestone B',
      description: '',
      optimistic: 2,
      mostLikely: 4,
      pessimistic: 8,
    })

    const grouped = store.groupedTasks

    expect(grouped).toHaveLength(2)
    expect(grouped[0].tasks).toHaveLength(2)
    expect(grouped[1].tasks).toHaveLength(1)
  })

  it('should export state correctly', () => {
    const store = useProjectStore()
    const newTask: NewTask = {
      taskName: 'Test Task',
      milestone: 'Test Milestone',
      description: 'Test Description',
      optimistic: 2,
      mostLikely: 5,
      pessimistic: 10,
    }

    store.addTask(newTask)
    store.setTargetDuration(100)

    const state = store.exportState()
    expect(state.tasks).toHaveLength(1)
    expect(state.targetDuration).toBe(100)
  })

  it('should load state from project', () => {
    const savedState = {
      tasks: [{
        taskName: 'Test Task',
        milestone: 'Test Milestone',
        description: 'Test Description',
        optimistic: 2,
        mostLikely: 5,
        pessimistic: 10,
        expectedTime: 5.33,
        standardDeviation: 1.33,
        variance: 1.77,
      }],
      targetDuration: 100,
      retainMilestone: true,
      deleteWarning: true,
      resetWarning: true,
    }

    const store = useProjectStore()
    store.loadFromProject(savedState)

    expect(store.taskList).toHaveLength(1)
    expect(store.taskList[0].taskName).toBe('Test Task')
    expect(store.targetDuration).toBe(100)
    expect(store.retainMilestone).toBe(true)
  })
})
