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
        classes: ['fade-element', 'receive-pointer-events', 'themed', 'sheet'],
        id: UIPanel.ID,
        window: {
            frame: false,
            title: 'GTSV.title',
            icon: 'fa-solid fa-clock',
            resizable: true, // only applies on the undocked UI
            height: 'auto',
            width: 'auto',
        },
        actions: {
            // 'chaos-factor-changed': UIPanel.chaosFactorChangedHandler,
        },
    }

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/uipanel.hbs`,
        },
    }

    static #hidden = false
    #avDockWhenSettingsOpen = null
    #time = null
    refresh = foundry.utils.debounce(this.render, 100)

    /**
     * Factory method for the UIPanel
     *
     * @returns {UIPanel}
     */
    static create () {
        const position = game.settings.get(MODULE_ID, SETTINGS.FLOATING_UI_PANEL_POSITION)

        if (position) {
            // for the floating panel, reset the auto width so it can resize manually
            if (UIPanel.floatingPanel) {
                if (position.width === 'auto') position.width = '220'
            } else {
                // when docked, restore auto width
                position.width = 'auto'
            }

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

        const classes = UIPanel.DEFAULT_OPTIONS.classes
        if (UIPanel.floatingPanel) {
            classes.push('floating')
        } else {
            classes.push('ui-panel-docked')
        }

        UIPanel.checkForAVPanel()
        const uiPanel = new UIPanel({
            window: { frame: UIPanel.floatingPanel },
            position: position,
            classes: classes,
        })

        uiPanel.ready()
        return uiPanel
    }

    ready () {
        Hooks.on('renderAVConfig', this.renderAVConfigHandler.bind(this))
        Hooks.on('closeAVConfig', this.closeAVConfigHandler.bind(this))
        // game.socket.on(`module.${MODULE_ID}`, time => {
        //     this.#time = time
        //     this.render()
        // })

        if (!UIPanel.floatingPanel) this.#insertAppElement('#players')
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

    #insertAppElement (target) {
        /**
         * This creates a DOM element in the ui-left interface div,
         * in between the canvas controls and the players panel.
         * Technique from Global Progress Clocks.
         * */
        const top = document.querySelector(target)
        if (top) {
            const template = document.createElement('template')
            template.setAttribute('id', UIPanel.ID)
            top.insertAdjacentElement('beforebegin', template)
        } else {
            console.error('JD GTSV | Could not initialise UI Panel')
        }
    }

    renderAVConfigHandler () {
        this.#avDockWhenSettingsOpen = game.webrtc.settings.client.dockPosition
    }

    closeAVConfigHandler () {
        /**
         * if the AV dock position has changed, we need to force a Foundry reload
         * since Foundry is currently inconsistent in when this occurs.
         *
         * Note that game.webrtc.settings.world.mode > 0 indicates that A/V chat is enabled.
         * I might be able to use that to automatically switch to a floating UI
         */

        const after = game.webrtc.settings.client.dockPosition
        if (this.#avDockWhenSettingsOpen != after) SettingsConfig.reloadConfirm({ world: true })
    }

    static checkForAVPanel () {
        if (UIPanel.avEnabled && !UIPanel.floatingPanel) {
            // This is a pathological layout situation: the AV dock disrupts the docked UI
            // I could only do the check for the left & right dock settings, but it's safer to use all.
            // Also, this bug was actually fixed in PR #254, but I needed a commit to get a PR for this bug fix
            // so the release notes workflow will pick this up. Weird.
            ui.notifications.warn(game.i18n.localize('GTSV.AVDockWarning'))
            game.settings.set(MODULE_ID, SETTINGS.FLOATING_UI_PANEL, true)
        }
    }

    _onFirstRender (context, options) {
        this.cosmeticSettingsChanged(false)
    }

    _onRender (context, options) {
        this.element
            .querySelector('select[name="chaos-factor"]')
            .addEventListener('change', UIPanel.chaosFactorChangedHandler.bind(this))
    }

    _onClose () {
        UIPanel.#hidden = true
        game.settings.set(MODULE_ID, SETTINGS.FLOATING_UI_PANEL_POSITION, this.position)
    }

    setPosition (pos) {
        super.setPosition(pos)
        game.settings.set(MODULE_ID, SETTINGS.FLOATING_UI_PANEL_POSITION, this.position)
    }

    /**
     * Called when cosmetic settings have been changed
     */
    cosmeticSettingsChanged (render = true) {
        // TODO: I'd rather use the default Foundry light and dark themes
        this?.element?.style.setProperty('--background-color', UIPanel.#uiBgColor)
        this?.element?.style.setProperty('--opacity-no-focus', UIPanel.#uiUnfocusedOpacity)
        this?.element?.style.setProperty('--opacity-focus', UIPanel.#uiFocusedOpacity)
        if (render) this.render()
    }

    _prepareContext (options) {
        const context = {
            chaosFactors: {
                choices: Constants.CHAOS_FACTORS,
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
        console.log('Chaos factor changed to', event.target.value)
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

        this.cosmeticSettingsChanged(false)

        // refresh the UI
        await this.render(true)
    }

    static async toggleHidden () {
        await game.modules.get(MODULE_ID).uiPanel.toggleHidden()
    }

    static get #uiBgColor () {
        return game.settings.get(MODULE_ID, SETTINGS.UI_BACKGROUND_COLOR)
    }

    static get #uiTextColor () {
        return game.settings.get(MODULE_ID, SETTINGS.UI_TEXT_COLOR)
    }

    static get #uiButtonColor () {
        return game.settings.get(MODULE_ID, SETTINGS.UI_BUTTON_COLOR)
    }

    static get #uiButtonHoveredColor () {
        return game.settings.get(MODULE_ID, SETTINGS.UI_BUTTON_HOVERED_COLOR)
    }

    static get #uiButtonClickedColor () {
        return game.settings.get(MODULE_ID, SETTINGS.UI_BUTTON_CLICKED_COLOR)
    }

    static get #uiFocusedOpacity () {
        if (UIPanel.#hidden) return 0
        return game.settings.get(MODULE_ID, SETTINGS.UI_FOCUSED_OPACITY)
    }

    static get #uiUnfocusedOpacity () {
        if (UIPanel.#hidden) return 0
        return game.settings.get(MODULE_ID, SETTINGS.UI_UNFOCUSED_OPACITY)
    }

    static get floatingPanel () {
        // For now, only support the floating panel
        return true
        // return game.settings.get(MODULE_ID, SETTINGS.FLOATING_UI_PANEL)
    }

    static get avEnabled () {
        return game.webrtc.settings.world.mode > 0
    }
}
