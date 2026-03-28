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
      },
    }
    projects.value.push(project)
    saveProjects()
    return id
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
    deleteProject,
  }
})
