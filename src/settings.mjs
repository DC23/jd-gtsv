import { Constants } from './constants.mjs'

export const MODULE_ID = 'jd-gtsv'
export const SETTINGS = {
    FLOATING_UI_PANEL_POSITION: 'uiPanelPosition',
    CURRENT_CHAOS_FACTOR: 'currentChaosFactor',
}

const GM_ONLY_SETTINGS = []

export function registerSettings () {
    // Register the menus
    // I have no settings menus at the moment
    // registerSettingsMenu()

    game.settings.register(MODULE_ID, SETTINGS.CURRENT_CHAOS_FACTOR, {
        scope: 'client',
        config: false,
        type: String,
        default: Constants.CHAOS_FACTORS[2].die,
        requiresReload: false,
    })

    game.settings.register(MODULE_ID, SETTINGS.FLOATING_UI_PANEL_POSITION, {
        scope: 'client',
        config: false,
        type: foundry.applications.types.ApplicationPosition,
        default: { top: 100, left: 150 },
        requiresReload: false,
    })
}

Hooks.on('renderSettingsConfig', (app, [html], context) => {
    if (game.user.isGM) return

    GM_ONLY_SETTINGS.forEach(id => {
        html.querySelector(`.form-group[data-setting-id="${MODULE_ID}.${id}"]`)?.remove()
    })
})

export function registerKeybindings () {
    // Define keybindings but leave them unbound
}
