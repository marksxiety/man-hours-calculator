import type { PERTTaskResult } from './task'

export interface StoredState {
    tasks: PERTTaskResult[]
    targetDuration: number | null
    retainMilestone: boolean
    deleteWarning: boolean
}
