import { describe, it, expect, beforeEach } from 'vitest'
import type { Project } from '@/types'
import { readProjects, writeProjects, migrateProjects, STORAGE_KEY } from '../persistence'

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    name: 'Test Project',
    pinned: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    state: {
      tasks: [],
      targetDuration: null,
      targetDurationEdited: false,
      retainMilestone: false,
      deleteWarning: true,
      resetWarning: true,
    },
    ...overrides,
  }
}

describe('persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return null when nothing is stored', () => {
    expect(readProjects()).toBeNull()
  })

  it('should round-trip projects through a versioned envelope', () => {
    const projects = [makeProject()]
    writeProjects(projects)

    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(raw.version).toBe(1)
    expect(raw.projects).toEqual(projects)
    expect(readProjects()).toEqual(projects)
  })

  it('should migrate a legacy bare array', () => {
    const projects = [makeProject()]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    expect(readProjects()).toEqual(projects)
  })

  it('should return null on corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')
    expect(readProjects()).toBeNull()
  })

  it('should accept an envelope that contains a projects array', () => {
    const projects = [makeProject()]
    expect(migrateProjects({ version: 1, projects })).toEqual(projects)
  })

  it('should reject shapes that are not project arrays', () => {
    expect(migrateProjects({ version: 1, projects: 'nope' })).toBeNull()
    expect(migrateProjects(42)).toBeNull()
    expect(migrateProjects(null)).toBeNull()
  })
})
