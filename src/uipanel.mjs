/**
 * The UI panel.
 */
import { MODULE_ID, SETTINGS } from './settings.mjs'
import { Helpers } from './helpers.mjs'
import { Constants } from './constants.mjs'
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
        },
    }

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/uipanel.hbs`,
        },
    }

    static #hidden = false
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
    }

    _onClose () {
        UIPanel.#hidden = true
        game.settings.set(MODULE_ID, SETTINGS.FLOATING_UI_PANEL_POSITION, this.position)
    }

    setPosition (pos) {
        super.setPosition(pos)
        game.settings.set(MODULE_ID, SETTINGS.FLOATING_UI_PANEL_POSITION, this.position)
    }

    _prepareContext (options) {
        const context = {
            chaosFactors: {
                choices: Constants.CHAOS_FACTORS,
                selected: UIPanel.#chaosFactor,
            },
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
    }

    static chaosStepHandler (event, target) {
        const direction = target.dataset.direction === 'up' ? 1 : -1
        const index = Constants.CHAOS_FACTORS.findIndex(f => f.die === UIPanel.#chaosFactor)
        const next = index + direction
        if (next >= 0 && next < Constants.CHAOS_FACTORS.length) {
            UIPanel.#chaosFactor = Constants.CHAOS_FACTORS[next].die
            this.element.querySelector('select[name="chaos-factor"]').value = UIPanel.#chaosFactor
        }
    }

    static async testSceneHandler (event, target) {
        const roll = new Roll(UIPanel.#chaosFactor)
        await roll.evaluate()

        const outcome = Constants.SCENE_OUTCOMES.find(o => roll.total <= o.maxRoll).key

        const flavor = await foundry.applications.handlebars.renderTemplate(
            `modules/${MODULE_ID}/templates/scene-setup-chat.hbs`,
            {
                outcome,
            }
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
