/**
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'

/**
 * Constants
 *
 * @public
 */
export class Constants {
    static SCENE_OUTCOMES = [
        { maxRoll: 2, key: 'GTSV.Scene.Interrupt' },
        { maxRoll: 4, key: 'GTSV.Scene.Altered' },
        { maxRoll: Infinity, key: 'GTSV.Scene.AsExpected' },
    ]

    static ORACLE_ODDS = [
        { id: 'certain',       key: 'GTSV.Oracle.Odds.Certain',       threshold: 2, oracleDice: '2d6kh' },
        { id: 'very-likely',   key: 'GTSV.Oracle.Odds.VeryLikely',    threshold: 2, oracleDice: '1d6' },
        { id: 'likely',        key: 'GTSV.Oracle.Odds.Likely',        threshold: 3, oracleDice: '1d6' },
        { id: 'unsure',        key: 'GTSV.Oracle.Odds.Unsure',        threshold: 4, oracleDice: '1d6' },
        { id: 'unlikely',      key: 'GTSV.Oracle.Odds.Unlikely',      threshold: 5, oracleDice: '1d6' },
        { id: 'very-unlikely', key: 'GTSV.Oracle.Odds.VeryUnlikely',  threshold: 6, oracleDice: '1d6' },
        { id: 'impossible',    key: 'GTSV.Oracle.Odds.Impossible',    threshold: 6, oracleDice: '2d6kl' },
    ]

    static CHAOS_FACTORS = [
        { key: 'GTSV.Chaos.Boring', die: 'd20' },
        { key: 'GTSV.Chaos.UnderControl', die: 'd12' },
        { key: 'GTSV.Chaos.Average', die: 'd10' },
        { key: 'GTSV.Chaos.OutOfControl', die: 'd8' },
        { key: 'GTSV.Chaos.Madness', die: 'd6' },
        { key: 'GTSV.Chaos.AbjectChaos', die: 'd5' },
        { key: 'GTSV.Chaos.PlaythingOfTheGods', die: 'd4' },
    ]
}
