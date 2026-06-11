/**
 * The Oracle dialog
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Constants } from './constants.mjs'
import { determineOutcome } from './oracle-logic.mjs'
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class OracleDialog extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        tag: 'form',
        id: 'jd-gtsv-oracle-dialog',
        window: {
            frame: true,
            title: 'GTSV.Oracle.Title',
            modal: true,
        },
        form: {
            handler: OracleDialog.#onSubmit,
            closeOnSubmit: true,
        },
        position: { width: 400 },
    }

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/oracle-dialog.hbs`,
        },
    }

    static ask () {
        new OracleDialog().render(true)
    }

    _prepareContext (options) {
        const rememberOdds = game.settings.get(MODULE_ID, SETTINGS.REMEMBER_LAST_ODDS)
        const currentOdds = rememberOdds
            ? game.settings.get(MODULE_ID, SETTINGS.LAST_ODDS)
            : 'unsure'

        return {
            odds: {
                choices: Constants.ORACLE_ODDS,
                current: currentOdds,
            },
            chaosFactors: {
                choices: Constants.CHAOS_FACTORS,
                current: game.settings.get(MODULE_ID, SETTINGS.CURRENT_CHAOS_FACTOR),
            },
        }
    }

    static async #onSubmit (event, form, formData) {
        const { question, oddsId, chaosDie } = formData.object
        if (game.settings.get(MODULE_ID, SETTINGS.REMEMBER_LAST_ODDS)) {
            game.settings.set(MODULE_ID, SETTINGS.LAST_ODDS, oddsId)
        }
        await OracleDialog.rollOracle(question, oddsId, chaosDie)
    }

    static async rollOracle (question, oddsId, chaosDie, titleKey = 'GTSV.Oracle.AskOracle') {
        const odds = Constants.ORACLE_ODDS.find(o => o.id === oddsId)

        const roll = new Roll(`${odds.oracleDice} + 1${chaosDie}`)
        await roll.evaluate()

        const oracleValue = roll.dice[0].total
        const chaosValue = roll.dice[1].total
        const { isYes, isRandomEvent, twist } = determineOutcome(
            oracleValue,
            chaosValue,
            odds.threshold
        )

        const chaosFactor = Constants.CHAOS_FACTORS.find(c => c.die === chaosDie)

        const answerText = game.i18n.localize(isYes ? 'GTSV.Oracle.Yes' : 'GTSV.Oracle.No')
        const twistText = twist ? game.i18n.localize(twist) : null
        const result = twistText ? `${answerText}, ${twistText}` : answerText

        const flavor = await foundry.applications.handlebars.renderTemplate(
            `modules/${MODULE_ID}/templates/oracle-chat.hbs`,
            { title: titleKey, question, odds: odds.key, chaos: chaosFactor.key, result, isRandomEvent }
        )

        await roll.toMessage({ flavor, rollMode: game.settings.get('core', 'rollMode') })
    }
}
