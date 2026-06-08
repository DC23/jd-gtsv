/**
 * The Oracle dialog
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Constants } from './constants.mjs'
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
        return {
            odds: Constants.ORACLE_ODDS,
            chaosFactors: {
                choices: Constants.CHAOS_FACTORS,
                current: game.settings.get(MODULE_ID, SETTINGS.CURRENT_CHAOS_FACTOR),
            },
        }
    }

    static async #onSubmit (event, form, formData) {
        const { question, oddsId, chaosDie } = formData.object
        await OracleDialog.#rollOracle(question, oddsId, chaosDie)
    }

    static determineOutcome (oracleValue, chaosValue, threshold) {
        return {
            isYes: oracleValue >= threshold,
            isRandomEvent: oracleValue === chaosValue,
            twist: chaosValue === 1 ? 'GTSV.Oracle.Twist.And'
                 : chaosValue === 2 ? 'GTSV.Oracle.Twist.But'
                 : null,
        }
    }

    static async #rollOracle (question, oddsId, chaosDie) {
        const odds = Constants.ORACLE_ODDS.find(o => o.id === oddsId)

        const roll = new Roll(`${odds.oracleDice} + 1${chaosDie}`)
        await roll.evaluate()

        const oracleValue = roll.dice[0].total
        const chaosValue = roll.dice[1].total
        const { isYes, isRandomEvent, twist } = OracleDialog.determineOutcome(oracleValue, chaosValue, odds.threshold)

        const twistClass = twist || isRandomEvent ? 'gtsv-notable-outcome' : ''

        const flavor = await foundry.applications.handlebars.renderTemplate(
            `modules/${MODULE_ID}/templates/oracle-chat.hbs`,
            {
                question,
                answer: isYes ? 'GTSV.Oracle.Yes' : 'GTSV.Oracle.No',
                twist,
                isRandomEvent,
                twistClass,
            }
        )

        await roll.toMessage({ flavor, rollMode: game.settings.get('core', 'rollMode') })
    }
}
