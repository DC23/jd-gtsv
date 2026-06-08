import { describe, it, expect } from 'vitest'
import { determineSceneOutcome } from '../src/scene-logic.mjs'

const outcomes = [
    { maxRoll: 2, key: 'Interrupt' },
    { maxRoll: 4, key: 'Altered' },
    { maxRoll: Infinity, key: 'AsExpected' },
]

describe('determineSceneOutcome', () => {
    describe('outcome key', () => {
        it('returns the first outcome for roll at its boundary', () => {
            expect(determineSceneOutcome(2, outcomes).outcome).toBe('Interrupt')
        })

        it('returns the first outcome for rolls below its boundary', () => {
            expect(determineSceneOutcome(1, outcomes).outcome).toBe('Interrupt')
        })

        it('returns the second outcome for rolls in its range', () => {
            expect(determineSceneOutcome(3, outcomes).outcome).toBe('Altered')
        })

        it('returns the second outcome at its boundary', () => {
            expect(determineSceneOutcome(4, outcomes).outcome).toBe('Altered')
        })

        it('returns the final outcome for rolls above all thresholds', () => {
            expect(determineSceneOutcome(5, outcomes).outcome).toBe('AsExpected')
        })

        it('returns the final outcome for high rolls', () => {
            expect(determineSceneOutcome(20, outcomes).outcome).toBe('AsExpected')
        })
    })

    describe('isNotable', () => {
        it('is true for outcomes before the last', () => {
            expect(determineSceneOutcome(1, outcomes).isNotable).toBe(true)
            expect(determineSceneOutcome(2, outcomes).isNotable).toBe(true)
            expect(determineSceneOutcome(3, outcomes).isNotable).toBe(true)
            expect(determineSceneOutcome(4, outcomes).isNotable).toBe(true)
        })

        it('is false for the final outcome', () => {
            expect(determineSceneOutcome(5, outcomes).isNotable).toBe(false)
            expect(determineSceneOutcome(20, outcomes).isNotable).toBe(false)
        })
    })
})
