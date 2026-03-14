export function calculateProbability(zScore: number): number {
    if (zScore === Infinity) return 1;
    if (zScore === -Infinity) return 0;
    if (isNaN(zScore)) return 0.5;

    // We use the absolute value for the polynomial approximation
    const absZ = Math.abs(zScore);

    const continuityCorrection = 1 / (1 + 0.2316419 * absZ);
    const polynomialApproximation =
        continuityCorrection *
        (0.31938153 +
            continuityCorrection *
            (-0.356563782 +
                continuityCorrection *
                (1.781477937 +
                    continuityCorrection *
                    (-1.821255978 +
                        continuityCorrection * 1.330274429))));

    const bellCurveHeight =
        Math.exp(-0.5 * absZ * absZ) / Math.sqrt(2 * Math.PI);
    
    // This calculates the cumulative area for a positive Z
    const areaToTheLeft = 1 - bellCurveHeight * polynomialApproximation;

    // If the original zScore was negative, we need the "tail" (1 - area)
    // If positive, we return the areaToTheLeft
    return zScore >= 0 ? areaToTheLeft : 1 - areaToTheLeft;
}