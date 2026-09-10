import { ref, onMounted, type Ref } from 'vue'

export type ProjectsView = 'grid' | 'table'

const STORAGE_KEY = 'man-hours-projects-view'

const isProjectsView = (value: unknown): value is ProjectsView =>
  value === 'grid' || value === 'table'

export type UseProjectsViewReturn = {
  view: Ref<ProjectsView>
  setView: (value: ProjectsView) => void
}

export function useProjectsView(): UseProjectsViewReturn {
  const view = ref<ProjectsView>('grid')

  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isProjectsView(stored)) {
      view.value = stored
    }
  })

  function setView(value: ProjectsView): void {
    view.value = value
    localStorage.setItem(STORAGE_KEY, value)
  }

  return {
    view,
    setView,
  }
}
