import type { StoredState } from './state'

export interface Project {
    id: string
    name: string
    pinned: boolean
    createdAt: string
    updatedAt: string
    state: StoredState
}
