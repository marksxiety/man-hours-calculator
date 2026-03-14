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

export interface PERTTaskResult extends NewTask {
    expectedTime: number; // tₑ = (O + 4M + P) / 6
    standardDeviation: number; // σ  = (P - O) / 6
    variance: number; // σ²
}