import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project, StoredState } from '@/types'

const STORAGE_KEY = 'man-hours-projects'

export const useProjectListStore = defineStore('projectList', () => {
  const projects = ref<Project[]>([])

  function loadProjects(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        projects.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load projects from localStorage:', error)
    }
  }

  function saveProjects(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.value))
    } catch (error) {
      console.error('Failed to save projects to localStorage:', error)
    }
  }

  function getProjectById(id: string): Project | undefined {
    return projects.value.find(p => p.id === id)
  }

  function getProjectCount(): number {
    return projects.value.length
  }

  function createProject(name: string, state?: StoredState): string {
    const id = crypto.randomUUID()
    return createProjectWithId(id, name, state)
  }

  function createProjectWithId(id: string, name: string, state?: StoredState): string {
    const now = new Date().toISOString()
    const project: Project = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      state: state ?? {
        tasks: [],
        targetDuration: null,
        retainMilestone: false,
        deleteWarning: true,
        resetWarning: true,
      },
      pinned: false,
    }
    projects.value.push(project)
    saveProjects()
    return id
  }

  function hasProject(id: string): boolean {
    return projects.value.some(p => p.id === id)
  }

  function updateProject(id: string, updates: Partial<Pick<Project, 'name' | 'state'>>): void {
    const project = projects.value.find(p => p.id === id)
    if (project) {
      if (updates.name !== undefined) project.name = updates.name
      if (updates.state !== undefined) project.state = updates.state
      project.updatedAt = new Date().toISOString()
      saveProjects()
    }
  }

  function togglePin(id: string): boolean {
    const project = projects.value.find(p => p.id === id)
    if (project) {
      if (!project.pinned) {
        const pinnedCount = projects.value.filter(p => p.pinned).length
        if (pinnedCount >= 6) return false
      }
      project.pinned = !project.pinned
      saveProjects()
      return true
    }
    return false
  }

  function reorderPinnedProjects(newOrder: Project[]): void {
    const pinnedIds = new Set(newOrder.map(p => p.id))
    const unpinned = projects.value.filter(p => !pinnedIds.has(p.id))
    projects.value = [...newOrder, ...unpinned]
    saveProjects()
  }

  function deleteProject(id: string): void {
    const index = projects.value.findIndex(p => p.id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
      saveProjects()
    }
  }

  return {
    projects,
    loadProjects,
    saveProjects,
    getProjectById,
    getProjectCount,
    createProject,
    updateProject,
    togglePin,
    reorderPinnedProjects,
    deleteProject,
    createProjectWithId,
    hasProject,
  }
})
