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
