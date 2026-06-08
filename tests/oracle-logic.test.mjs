import { describe, it, expect } from 'vitest'
import { determineOutcome } from '../src/oracle-logic.mjs'

describe('determineOutcome', () => {
    describe('isYes', () => {
        it('is true when oracleValue equals threshold', () => {
            expect(determineOutcome(4, 3, 4).isYes).toBe(true)
        })

        it('is true when oracleValue exceeds threshold', () => {
            expect(determineOutcome(6, 3, 4).isYes).toBe(true)
        })

        it('is false when oracleValue is below threshold', () => {
            expect(determineOutcome(3, 5, 4).isYes).toBe(false)
        })
    })

    describe('isRandomEvent', () => {
        it('is true when oracleValue matches chaosValue', () => {
            expect(determineOutcome(5, 5, 4).isRandomEvent).toBe(true)
        })

        it('is false when oracleValue differs from chaosValue', () => {
            expect(determineOutcome(4, 5, 4).isRandomEvent).toBe(false)
        })
    })

    describe('twist', () => {
        it('is "And" twist when chaosValue is 1', () => {
            expect(determineOutcome(3, 1, 4).twist).toBe('GTSV.Oracle.Twist.And')
        })

        it('is "But" twist when chaosValue is 2', () => {
            expect(determineOutcome(3, 2, 4).twist).toBe('GTSV.Oracle.Twist.But')
        })

        it('is null when chaosValue is greater than 2', () => {
            expect(determineOutcome(3, 3, 4).twist).toBeNull()
        })

        it('is null when chaosValue is at maximum die face', () => {
            expect(determineOutcome(3, 10, 4).twist).toBeNull()
        })
    })

    describe('combined outcomes', () => {
        it('can be yes with a random event and no twist', () => {
            const result = determineOutcome(5, 5, 4)
            expect(result.isYes).toBe(true)
            expect(result.isRandomEvent).toBe(true)
            expect(result.twist).toBeNull()
        })

        it('can be no with a twist and no random event', () => {
            const result = determineOutcome(3, 1, 4)
            expect(result.isYes).toBe(false)
            expect(result.isRandomEvent).toBe(false)
            expect(result.twist).toBe('GTSV.Oracle.Twist.And')
        })

        it('can be yes with a "But" twist and a random event', () => {
            const result = determineOutcome(2, 2, 2)
            expect(result.isYes).toBe(true)
            expect(result.isRandomEvent).toBe(true)
            expect(result.twist).toBe('GTSV.Oracle.Twist.But')
        })
    })
})
