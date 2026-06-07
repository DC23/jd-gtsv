/**
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'

/**
 * Constants 
 * 
 * @public
 */
export class Constants {
    static CHAOS_FACTORS = [
        { key: "GTSV.Chaos.Boring", value: "d20"},
        { key: "GTSV.Chaos.UnderControl", value: "d12"},
        { key: "GTSV.Chaos.Average", value: "d10"},
        { key: "GTSV.Chaos.OutOfControl", value: "d8"},
        { key: "GTSV.Chaos.Madness", value: "d6"},
        { key: "GTSV.Chaos.AbjectChaos", value: "d5"},
        { key: "GTSV.Chaos.PlaythingOfTheGods", value: "d4"},
    ]
}
