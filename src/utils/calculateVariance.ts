/**
 * Calculates the Variance of a task estimate.
 * Variance is the square of the Standard Deviation.
 */
export const calculateVariance = (standardDeviation: number): number => {
    return Math.pow(standardDeviation, 2); 
    // Or simply: standardDeviation * standardDeviation
};