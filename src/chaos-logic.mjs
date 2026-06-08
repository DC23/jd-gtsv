/**
 * chaos-factor logic, fully unit-testable.
 */

/**
 * @param {Array<{die: string}>} factors - ordered list of chaos factors
 * @param {string} currentDie
 * @param {number} direction - +1 to increase chaos, -1 to decrease
 * @returns {string|null} - the new die string, or null if already at the boundary
 */
export function stepChaosFactor (factors, currentDie, direction) {
    const index = factors.findIndex(f => f.die === currentDie)
    const next = index + direction
    if (next >= 0 && next < factors.length) {
        return factors[next].die
    }
    return null
}
