/**
 * scene-test logic, fully unit-testable
 */

/**
 * @param {number} rollTotal
 * @param {Array<{maxRoll: number, key: string}>} sceneOutcomes - ordered from most to least notable
 * @returns {{ outcome: string, isNotable: boolean }}
 */
export function determineSceneOutcome (rollTotal, sceneOutcomes) {
    const match = sceneOutcomes.find(o => rollTotal <= o.maxRoll)
    return {
        outcome: match.key,
        isNotable: match !== sceneOutcomes.at(-1),
    }
}
