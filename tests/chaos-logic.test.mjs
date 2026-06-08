import { describe, it, expect } from 'vitest'
import { stepChaosFactor } from '../src/chaos-logic.mjs'

const factors = [
    { die: 'd20' },
    { die: 'd10' },
    { die: 'd6' },
    { die: 'd4' },
]

describe('stepChaosFactor', () => {
    describe('stepping within range', () => {
        it('returns the next factor when stepping up from the middle', () => {
            expect(stepChaosFactor(factors, 'd10', 1)).toBe('d6')
        })

        it('returns the previous factor when stepping down from the middle', () => {
            expect(stepChaosFactor(factors, 'd10', -1)).toBe('d20')
        })

        it('can step up from the first factor', () => {
            expect(stepChaosFactor(factors, 'd20', 1)).toBe('d10')
        })

        it('can step down to the first factor', () => {
            expect(stepChaosFactor(factors, 'd10', -1)).toBe('d20')
        })
    })

    describe('boundary behaviour', () => {
        it('returns null when stepping up from the last factor', () => {
            expect(stepChaosFactor(factors, 'd4', 1)).toBeNull()
        })

        it('returns null when stepping down from the first factor', () => {
            expect(stepChaosFactor(factors, 'd20', -1)).toBeNull()
        })
    })
})
