/**
 * The UI panel.
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Helpers } from './helpers.mjs'
import { Constants } from './constants.mjs'
import { OracleDialog } from './oracle.mjs'
import { determineSceneOutcome } from './scene-logic.mjs'
import { stepChaosFactor } from './chaos-logic.mjs'
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class UIPanel extends HandlebarsApplicationMixin(ApplicationV2) {
    static ID = 'jd-gtsv-uipanel'
    static DEFAULT_OPTIONS = {
        tag: 'div',
        classes: ['faded-ui', 'receive-pointer-events', 'themed'],
        id: UIPanel.ID,
        window: {
            frame: true,
            title: 'GTSV.title',
            icon: 'fa-solid fa-dice',
            resizable: true,
            height: 'auto',
            width: '250',
        },
        actions: {
            'chaos-step': UIPanel.chaosStepHandler,
            'test-scene': UIPanel.testSceneHandler,
            'ask-oracle': UIPanel.askOracleHandler,
            'quick-oracle': UIPanel.quickOracleHandler,
            'odds-step': UIPanel.oddsStepHandler,
        },
    }

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/uipanel.hbs`,
        },
    }

    static #hidden = false
    #oddsHookId = null
    refresh = foundry.utils.debounce(this.render, 100)

    /**
     * Factory method for the UIPanel
     *
     * @returns {UIPanel}
     */
    static create () {
        const position = game.settings.get(MODULE_ID, SETTINGS.FLOATING_UI_PANEL_POSITION)

        if (position) {
            // if position if out of bounds for current client view,
            // reset to a safe location in the top left
            if (
                position.top > window.visualViewport.height ||
                position.left > window.visualViewport.width
            ) {
                position.top = 100
                position.left = 150
            }
        }

        const uiPanel = new UIPanel({
            position: position,
            classes: UIPanel.DEFAULT_OPTIONS.classes,
        })

        uiPanel.ready()
        return uiPanel
    }

    static registerKeybindings () {
        // Show / hide the UI
        game.keybindings.register(MODULE_ID, 'show-hide-ui', {
            name: 'GTSV.showHideUI',
            // TODO: revert to unset once the bug in Foundry v13 that cannot edit unset keybinds is fixed.
            editable: [{ key: 'KeyE', modifiers: ['ALT', 'SHIFT'] }],
            precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
            restricted: false,
            onDown: async () => {
                UIPanel.toggleHidden()
                return true
            },
        })
    }

    ready () {}

    _onRender (context, options) {
        const select = this.element.querySelector('select[name="chaos-factor"]') // Get the chaos factor select element
        select.value = context.chaosFactors.selected // set the selected element based on the current chaos factor
        select.addEventListener('change', UIPanel.chaosFactorChangedHandler.bind(this)) // listen for changes

        if (!this.#oddsHookId) {
            this.#oddsHookId = Hooks.on('clientSettingChanged', (...args) =>
                this.#onClientSettingChanged(...args)
            )
        }
    }

    #onClientSettingChanged (...args) {
        const [key, value] = args
        if (key !== `${MODULE_ID}.${SETTINGS.LAST_ODDS}`) return
        const oddsIndex = Constants.ORACLE_ODDS.findIndex(o => o.id === value)
        if (oddsIndex === -1) return // guard against a stale/invalid setting value
        const odds = Constants.ORACLE_ODDS[oddsIndex]
        const button = this.element?.querySelector('[data-action="quick-oracle"]')
        if (button) {
            button.innerHTML = `<i class="fa-sharp fa-solid fa-crystal-ball"></i> ${game.i18n.localize(
                'GTSV.Oracle.QuickOracle'
            )}: ${game.i18n.localize(odds.key)}`
        }
        this.element?.querySelector('[data-action="odds-step"][data-direction="down"]')
            ?.toggleAttribute('disabled', oddsIndex === 0)
        this.element?.querySelector('[data-action="odds-step"][data-direction="up"]')
            ?.toggleAttribute('disabled', oddsIndex === Constants.ORACLE_ODDS.length - 1)
    }

    async close (options = {}) {
        // closeKey is set when the close is triggered by the ESC key,
        // which is the one case we want to ignore.
        if (options.closeKey) return this
        return super.close(options)
    }

    _onClose () {
        Hooks.off('clientSettingChanged', this.#oddsHookId)
        this.#oddsHookId = null
        UIPanel.#hidden = true
        game.settings.set(MODULE_ID, SETTINGS.FLOATING_UI_PANEL_POSITION, this.position)
    }

    setPosition (pos) {
        super.setPosition(pos)
        game.settings.set(MODULE_ID, SETTINGS.FLOATING_UI_PANEL_POSITION, this.position)
    }

    _prepareContext (options) {
        const oddsId = game.settings.get(MODULE_ID, SETTINGS.LAST_ODDS)
        const quickOracleOddsKey =
            Constants.ORACLE_ODDS.find(o => o.id === oddsId)?.key ?? 'GTSV.Oracle.Odds.Unsure'
        const oddsIndex = Constants.ORACLE_ODDS.findIndex(o => o.id === oddsId)

        const chaosIndex = Constants.CHAOS_FACTORS.findIndex(f => f.die === UIPanel.#chaosFactor)
        const context = {
            chaosFactors: {
                choices: Constants.CHAOS_FACTORS,
                selected: UIPanel.#chaosFactor,
                atMin: chaosIndex === 0,
                atMax: chaosIndex === Constants.CHAOS_FACTORS.length - 1,
            },
            quickOracleOddsKey,
            oddsAtMin: oddsIndex === 0,
            oddsAtMax: oddsIndex === Constants.ORACLE_ODDS.length - 1,
            // textColor: UIPanel.#uiTextColor,
            // btn: {
            //     color: UIPanel.#uiButtonColor,
            //     hoverColor: UIPanel.#uiButtonHoveredColor,
            //     clickColor: UIPanel.#uiButtonClickedColor,
            // },
        }

        return context
    }

    /** Action Handlers */

    static chaosFactorChangedHandler (event) {
        UIPanel.#chaosFactor = event.target.value
        const newIndex = Constants.CHAOS_FACTORS.findIndex(f => f.die === event.target.value)
        this.element.querySelector('[data-action="chaos-step"][data-direction="down"]').disabled =
            newIndex === 0
        this.element.querySelector('[data-action="chaos-step"][data-direction="up"]').disabled =
            newIndex === Constants.CHAOS_FACTORS.length - 1
    }

    static chaosStepHandler (event, target) {
        const direction = target.dataset.direction === 'up' ? 1 : -1
        const newDie = stepChaosFactor(Constants.CHAOS_FACTORS, UIPanel.#chaosFactor, direction)
        if (newDie !== null) {
            UIPanel.#chaosFactor = newDie
            this.element.querySelector('select[name="chaos-factor"]').value = newDie
            const newIndex = Constants.CHAOS_FACTORS.findIndex(f => f.die === newDie)
            this.element.querySelector('[data-action="chaos-step"][data-direction="down"]').disabled =
                newIndex === 0
            this.element.querySelector('[data-action="chaos-step"][data-direction="up"]').disabled =
                newIndex === Constants.CHAOS_FACTORS.length - 1
        }
    }

    static askOracleHandler () {
        OracleDialog.ask()
    }

    static async quickOracleHandler () {
        await OracleDialog.rollOracle(
            null,
            game.settings.get(MODULE_ID, SETTINGS.LAST_ODDS),
            UIPanel.#chaosFactor
        )
    }

    static oddsStepHandler (event, target) {
        const direction = target.dataset.direction === 'up' ? 1 : -1
        const currentId = game.settings.get(MODULE_ID, SETTINGS.LAST_ODDS)
        const currentIndex = Constants.ORACLE_ODDS.findIndex(o => o.id === currentId)
        const newIndex = Math.max(
            0,
            Math.min(Constants.ORACLE_ODDS.length - 1, currentIndex + direction)
        )
        if (newIndex !== currentIndex) {
            game.settings.set(MODULE_ID, SETTINGS.LAST_ODDS, Constants.ORACLE_ODDS[newIndex].id)
        }
    }

    static async testSceneHandler (event, target) {
        const roll = new Roll(UIPanel.#chaosFactor)
        await roll.evaluate()

        const { outcome, isNotable } = determineSceneOutcome(roll.total, Constants.SCENE_OUTCOMES)
        const outcomeClass = isNotable ? 'gtsv-notable-outcome' : ''

        const flavor = await foundry.applications.handlebars.renderTemplate(
            `modules/${MODULE_ID}/templates/scene-setup-chat.hbs`,
            { outcome, outcomeClass }
        )

        await roll.toMessage({
            flavor,
            rollMode: game.settings.get('core', 'rollMode'),
        })
    }

    async toggleHidden () {
        // If floating panel and shown, then just close
        if (this.options.window.frame && !UIPanel.#hidden) {
            this.close()
            UIPanel.#hidden = true
            return
        }

        UIPanel.#hidden = !UIPanel.#hidden

        /**
         * When the UI is hidden, stop processing pointer events,
         * and when switching back to shown, process events again.
         */
        if (UIPanel.#hidden) {
            this?.element?.classList.remove('receive-pointer-events')
        } else {
            if (!this?.element?.classList.contains('receive-pointer-events'))
                this?.element?.classList.add('receive-pointer-events')
        }

        // refresh the UI
        await this.render(true)
    }

    static async toggleHidden () {
        await game.modules.get(MODULE_ID).uiPanel.toggleHidden()
    }

    static get #chaosFactor () {
        return game.settings.get(MODULE_ID, SETTINGS.CURRENT_CHAOS_FACTOR)
    }

    static set #chaosFactor (value) {
        game.settings.set(MODULE_ID, SETTINGS.CURRENT_CHAOS_FACTOR, value)
        console.log('Chaos factor changed to', value)
    }
}
