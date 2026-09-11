import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { PERTTaskResult, StoredState } from '@/types'
import { useProjectListStore } from '../projectListStore'

function emptyState(): StoredState {
  return {
    tasks: [],
    targetDuration: null,
    targetDurationEdited: false,
    retainMilestone: false,
    deleteWarning: true,
    resetWarning: true,
  }
}

function task(): PERTTaskResult {
  return {
    taskName: 'Task',
    milestone: '',
    description: '',
    optimistic: 1,
    mostLikely: 2,
    pessimistic: 3,
    expectedTime: 2,
    standardDeviation: 0.33,
    variance: 0.11,
  }
}

describe('projectListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should suggest New Project [1] when empty', () => {
    const store = useProjectListStore()
    expect(store.suggestDefaultName()).toBe('New Project [1]')
  })

  it('should skip existing default names when suggesting', () => {
    const store = useProjectListStore()
    store.createProject('New Project [1]')
    store.createProject('New Project [2]')
    expect(store.suggestDefaultName()).toBe('New Project [3]')
  })

  it('should duplicate a project with a new id and (copy) name', () => {
    const store = useProjectListStore()
    const id = store.createProject('Original')
    const newId = store.duplicateProject(id)

    expect(newId).not.toBeNull()
    expect(newId).not.toBe(id)
    expect(store.projects).toHaveLength(2)

    const copy = store.getProjectById(newId!)
    expect(copy?.name).toBe('Original (copy)')
    expect(copy?.pinned).toBe(false)
  })

  it('should deep-clone state so the copy is independent', () => {
    const store = useProjectListStore()
    const id = store.createProject('Original')
    store.updateProject(id, { state: { ...emptyState(), tasks: [task()] } })

    const newId = store.duplicateProject(id)!
    const copy = store.getProjectById(newId)!
    copy.state.tasks.push(task())

    expect(store.getProjectById(id)!.state.tasks).toHaveLength(1)
    expect(copy.state.tasks).toHaveLength(2)
  })

  it('should return null when duplicating a missing project', () => {
    const store = useProjectListStore()
    expect(store.duplicateProject('missing')).toBeNull()
  })

  it('should persist projects across store instances', () => {
    const store = useProjectListStore()
    store.createProject('Persisted')

    setActivePinia(createPinia())
    const reloaded = useProjectListStore()
    reloaded.loadProjects()

    expect(reloaded.projects.map(p => p.name)).toContain('Persisted')
  })
})
