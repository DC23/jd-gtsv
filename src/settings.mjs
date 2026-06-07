import { Constants } from './constants.mjs'

export const MODULE_ID = 'jd-gtsv'
export const SETTINGS = {
    UI_UNFOCUSED_OPACITY: 'uiFadeOpacity',
    UI_FOCUSED_OPACITY: 'uiFocusedOpacity',
    FLOATING_UI_PANEL_POSITION: 'uiPanelPosition',
    CURRENT_CHAOS_FACTOR: 'currentChaosFactor',
}

const GM_ONLY_SETTINGS = [
]

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

    game.settings.register(MODULE_ID, SETTINGS.UI_FOCUSED_OPACITY, {
        name: 'GTSV.Settings.UIFocusOpacity.name',
        hint: 'GTSV.Settings.UIFocusOpacity.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.NumberField({ min: 0.1, max: 1.0, step: 0.05 }),
        default: 1.0,
        requiresReload: false,
        onChange: () => {
            game.modules.get(MODULE_ID).uiPanel?.cosmeticSettingsChanged()
        },
    })

    game.settings.register(MODULE_ID, SETTINGS.UI_UNFOCUSED_OPACITY, {
        name: 'GTSV.Settings.UIUnfocusedOpacity.name',
        hint: 'GTSV.Settings.UIUnfocusedOpacity.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.NumberField({ min: 0.0, max: 1.0, step: 0.05 }),
        default: 0.7,
        requiresReload: false,
        onChange: () => {
            game.modules.get(MODULE_ID).uiPanel?.cosmeticSettingsChanged()
        },
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
