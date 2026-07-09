import type { PERTTaskResult } from './task'

export interface StoredState {
    tasks: PERTTaskResult[]
    targetDuration: number | null
    targetDurationEdited: boolean
    retainMilestone: boolean
    deleteWarning: boolean
    resetWarning: boolean
}
