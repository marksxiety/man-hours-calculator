export interface NewTask {
    taskName: string
    optimistic: number
    mostLikely: number
    pessimistic: number
}

export interface Analysis {
    totalExpectedTime: number
    totalVariance: number
    zScore: number
    probability: number
}
