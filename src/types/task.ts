export interface NewTask {
    taskName: string
    milestone: string
    description: string
    optimistic: number | null
    mostLikely: number | null
    pessimistic: number | null
}

export interface PERTTaskResult extends NewTask {
    expectedTime: number; // tₑ = (O + 4M + P) / 6
    standardDeviation: number; // σ  = (P - O) / 6
    variance: number; // σ²
}
