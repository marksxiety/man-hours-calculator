/**
 * Calculates the Z-score to determine the probability of meeting a deadline.
 * Formula: (Target Time - Expected Time) / Project Standard Deviation
 */
export function calculateZScore(
    desiredTime: number,
    totalExpectedTime: number,
    totalVariance: number
): number {
    // Standard Deviation is the square root of Variance
    const projectStandardDeviation = Math.sqrt(totalVariance);

    if (projectStandardDeviation === 0) {
        return desiredTime >= totalExpectedTime ? Infinity : -Infinity;
    }

    const zScore = (desiredTime - totalExpectedTime) / projectStandardDeviation;
    return zScore
}