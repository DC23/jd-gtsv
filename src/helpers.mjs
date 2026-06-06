/**
 * Helper functions I seem to use everywhere.
 *
 * Many started out as class methods, but rather than
 * add class dependencies just to call these functions,
 * I'm moving them here.
 */

import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Constants } from './constants.mjs'

export class Helpers {
    // not the greatest approach, but
    static objectsShallowEqual (obj1, obj2) {
        const entries1 = Object.entries(obj1)
        const entries2 = Object.entries(obj2)

        if (entries1.length !== entries2.length) {
            return false
        }

        for (let [key, value] of entries1) {
            if (obj2[key] !== value) {
                return false
            }
        }

        return true
    }
}
