/**
 * Pure oracle logic — no Foundry dependencies, fully unit-testable.
 */

/**
 * @param {number} oracleValue - The oracle die result
 * @param {number} chaosValue  - The chaos die result
 * @param {number} threshold   - Minimum oracle value for a "yes" answer
 */
export function determineOutcome (oracleValue, chaosValue, threshold) {
    return {
        isYes: oracleValue >= threshold,
        isRandomEvent: oracleValue === chaosValue,
        twist: chaosValue === 1 ? 'GTSV.Oracle.Twist.And'
             : chaosValue === 2 ? 'GTSV.Oracle.Twist.But'
             : null,
    }
}
