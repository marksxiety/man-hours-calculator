import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'
import type { Project } from '@/types'
import { calculateTotalExpectedTime } from '@/utils/calculateTotals'

export type ProjectSortKey = 'updated' | 'name' | 'hours' | 'tasks' | 'created'

const SORT_KEY_STORAGE = 'man-hours-projects-sort'

const isSortKey = (value: unknown): value is ProjectSortKey =>
  value === 'updated' || value === 'name' || value === 'hours' || value === 'tasks' || value === 'created'

export type UseProjectListFiltersReturn = {
  query: Ref<string>
  sortKey: Ref<ProjectSortKey>
  setQuery: (value: string) => void
  setSortKey: (value: ProjectSortKey) => void
  filteredAndSorted: ComputedRef<Project[]>
}

export function useProjectListFilters(projects: Ref<Project[]>): UseProjectListFiltersReturn {
  const query = ref('')
  const sortKey = ref<ProjectSortKey>('updated')

  onMounted(() => {
    const stored = localStorage.getItem(SORT_KEY_STORAGE)
    if (isSortKey(stored)) sortKey.value = stored
  })

  function setQuery(value: string): void {
    query.value = value
  }

  function setSortKey(value: ProjectSortKey): void {
    sortKey.value = value
    localStorage.setItem(SORT_KEY_STORAGE, value)
  }

  const filteredAndSorted = computed(() => {
    const q = query.value.trim().toLowerCase()
    const filtered = q
      ? projects.value.filter(p => p.name.toLowerCase().includes(q))
      : [...projects.value]

    return filtered.sort((a, b) => {
      switch (sortKey.value) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'hours':
          return calculateTotalExpectedTime(a.state.tasks) - calculateTotalExpectedTime(b.state.tasks)
        case 'tasks':
          return a.state.tasks.length - b.state.tasks.length
        case 'created':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })
  })

  return {
    query,
    sortKey,
    setQuery,
    setSortKey,
    filteredAndSorted,
  }
}