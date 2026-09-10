import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import type { PERTTaskResult, Project, StoredState } from '@/types'
import { useProjectListFilters } from '../useProjectListFilters'

const SORT_KEY_STORAGE = 'man-hours-projects-sort'

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

function task(expectedTime: number): PERTTaskResult {
  return {
    taskName: 'Task',
    milestone: '',
    description: '',
    optimistic: expectedTime,
    mostLikely: expectedTime,
    pessimistic: expectedTime,
    expectedTime,
    standardDeviation: 0,
    variance: 0,
  }
}

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    name: 'Alpha',
    pinned: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    state: emptyState(),
    ...overrides,
  }
}

function mountFilters(projects: Project[]) {
  const projectsRef = ref(projects)
  const Host = defineComponent({
    setup() {
      return useProjectListFilters(projectsRef)
    },
    template: '<div />',
  })
  return mount(Host)
}

describe('useProjectListFilters', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should filter projects by name case-insensitively', () => {
    const wrapper = mountFilters([
      makeProject({ id: 'a', name: 'Alpha' }),
      makeProject({ id: 'b', name: 'Beta' }),
    ])
    wrapper.vm.setQuery('alp')
    expect(wrapper.vm.filteredAndSorted.map(p => p.id)).toEqual(['a'])
  })

  it('should return all projects when the query is empty', () => {
    const wrapper = mountFilters([
      makeProject({ id: 'a', name: 'Alpha' }),
      makeProject({ id: 'b', name: 'Beta' }),
    ])
    expect(wrapper.vm.filteredAndSorted).toHaveLength(2)
  })

  it('should sort by name ascending', () => {
    const wrapper = mountFilters([
      makeProject({ id: 'a', name: 'Zeta' }),
      makeProject({ id: 'b', name: 'Alpha' }),
    ])
    wrapper.vm.setSortKey('name')
    expect(wrapper.vm.filteredAndSorted.map(p => p.id)).toEqual(['b', 'a'])
  })

  it('should sort by task count ascending', () => {
    const wrapper = mountFilters([
      makeProject({ id: 'a', state: { ...emptyState(), tasks: [task(2), task(2), task(2)] } }),
      makeProject({ id: 'b', state: { ...emptyState(), tasks: [task(2)] } }),
    ])
    wrapper.vm.setSortKey('tasks')
    expect(wrapper.vm.filteredAndSorted.map(p => p.id)).toEqual(['b', 'a'])
  })

  it('should sort by total expected hours ascending', () => {
    const wrapper = mountFilters([
      makeProject({ id: 'a', state: { ...emptyState(), tasks: [task(10)] } }),
      makeProject({ id: 'b', state: { ...emptyState(), tasks: [task(1)] } }),
    ])
    wrapper.vm.setSortKey('hours')
    expect(wrapper.vm.filteredAndSorted.map(p => p.id)).toEqual(['b', 'a'])
  })

  it('should sort by created date ascending', () => {
    const wrapper = mountFilters([
      makeProject({ id: 'a', createdAt: '2026-03-01T00:00:00.000Z' }),
      makeProject({ id: 'b', createdAt: '2026-01-01T00:00:00.000Z' }),
    ])
    wrapper.vm.setSortKey('created')
    expect(wrapper.vm.filteredAndSorted.map(p => p.id)).toEqual(['b', 'a'])
  })

  it('should default to most recently updated first', () => {
    const wrapper = mountFilters([
      makeProject({ id: 'a', updatedAt: '2026-01-01T00:00:00.000Z' }),
      makeProject({ id: 'b', updatedAt: '2026-03-01T00:00:00.000Z' }),
    ])
    expect(wrapper.vm.filteredAndSorted.map(p => p.id)).toEqual(['b', 'a'])
  })

  it('should persist the sort key and restore it on mount', () => {
    const first = mountFilters([makeProject()])
    first.vm.setSortKey('name')
    expect(localStorage.getItem(SORT_KEY_STORAGE)).toBe('name')

    const second = mountFilters([makeProject()])
    expect(second.vm.sortKey).toBe('name')
  })

  it('should fall back to updated on an invalid stored sort key', () => {
    localStorage.setItem(SORT_KEY_STORAGE, 'banana')
    const wrapper = mountFilters([makeProject()])
    expect(wrapper.vm.sortKey).toBe('updated')
  })
})
