import { readProjects, writeProjects } from '@/utils/persistence'
import { DEMO_PROJECTS, DEMO_SEED_KEY, DEMO_SEED_VERSION } from './projects'

/**
 * Populates the demo storage key with sample projects.
 * Only runs in demo mode, and re-seeds only when the seed version changes,
 * so edits made while demoing survive a page refresh.
 */
export function seedDemoData(): void {
  if (import.meta.env.MODE !== 'demo') return

  try {
    const hasSeed = localStorage.getItem(DEMO_SEED_KEY) === DEMO_SEED_VERSION
    const hasProjects = readProjects() !== null

    if (hasSeed && hasProjects) return

    writeProjects(DEMO_PROJECTS)
    localStorage.setItem(DEMO_SEED_KEY, DEMO_SEED_VERSION)
  } catch {
    // Storage may be unavailable (private mode, quota); the app still runs empty.
  }
}
