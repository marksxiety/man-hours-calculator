import type { Project } from '@/types'

export const STORAGE_KEY = 'man-hours-projects'
export const DEMO_STORAGE_KEY = 'man-hours-projects-demo'
export const STORAGE_VERSION = 1

interface ProjectEnvelope {
  version: number
  projects: Project[]
}

function isProjectArray(value: unknown): value is Project[] {
  return Array.isArray(value)
}

export function migrateProjects(raw: unknown): Project[] | null {
  if (isProjectArray(raw)) return raw

  if (raw !== null && typeof raw === 'object' && 'projects' in raw) {
    const envelope = raw as { projects?: unknown }
    if (isProjectArray(envelope.projects)) return envelope.projects
  }

  return null
}

export function getStorageKey(): string {
  return import.meta.env.MODE === 'demo' ? DEMO_STORAGE_KEY : STORAGE_KEY
}

export function readProjects(): Project[] | null {
  try {
    const stored = localStorage.getItem(getStorageKey())
    if (!stored) return null
    return migrateProjects(JSON.parse(stored))
  } catch {
    return null
  }
}

export function writeProjects(projects: Project[]): void {
  const envelope: ProjectEnvelope = { version: STORAGE_VERSION, projects }
  localStorage.setItem(getStorageKey(), JSON.stringify(envelope))
}