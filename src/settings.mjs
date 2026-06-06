import { Constants } from './constants.mjs'

export const MODULE_ID = 'jd-gtsv'
export const SETTINGS = {
    UI_TEXT_COLOR: 'uiTextColor',
    UI_FOCUS_OPACITY: 'uiFocusOpacity',
    UI_UNFOCUSED_OPACITY: 'uiFadeOpacity',
    UI_FOCUSED_OPACITY: 'uiFocusedOpacity',
    UI_BUTTON_COLOR: 'uiButtonColour',
    UI_BUTTON_HOVERED_COLOR: 'uiButtonHoveredColour',
    UI_BUTTON_CLICKED_COLOR: 'uiButtonClickedColour',
    UI_BACKGROUND_COLOR: 'uiBackgroundColour',
    FLOATING_UI_PANEL: 'uiInFrame',
    FLOATING_UI_PANEL_POSITION: 'uiPanelPosition',
}

const GM_ONLY_SETTINGS = [
    // SETTINGS.UI_BUTTON_COLOR,
    // SETTINGS.UI_BUTTON_HOVERED_COLOR,
    // SETTINGS.UI_BUTTON_CLICKED_COLOR,
]

export function registerSettings () {
    // Register the menus
    // I have no settings menus at the moment
    // registerSettingsMenu()

    game.settings.register(MODULE_ID, SETTINGS.FLOATING_UI_PANEL, {
        name: 'GTSV.Settings.ShowUIInFloatingWindow.name',
        hint: 'GTSV.Settings.ShowUIInFloatingWindow.hint',
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        requiresReload: true,
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
        name: 'GTSV.Settings.UIFadeOpacity.name',
        hint: 'GTSV.Settings.UIFadeOpacity.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.NumberField({ min: 0.0, max: 1.0, step: 0.05 }),
        default: 0.7,
        requiresReload: false,
        onChange: () => {
            game.modules.get(MODULE_ID).uiPanel?.cosmeticSettingsChanged()
        },
    })

    game.settings.register(MODULE_ID, SETTINGS.UI_BACKGROUND_COLOR, {
        name: 'GTSV.Settings.UIBackgroundColor.name',
        hint: 'GTSV.Settings.UIBackgroundColor.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: '#000000',
        requiresReload: false,
        onChange: () => {
            game.modules.get(MODULE_ID).uiPanel?.cosmeticSettingsChanged()
        },
    })

    game.settings.register(MODULE_ID, SETTINGS.UI_TEXT_COLOR, {
        name: 'GTSV.Settings.UITextColor.name',
        hint: 'GTSV.Settings.UITextColor.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: '#ffffff',
        // default: '#1ab6ea',
        requiresReload: false,
        onChange: () => {
            game.modules.get(MODULE_ID).uiPanel?.cosmeticSettingsChanged()
        },
    })

    game.settings.register(MODULE_ID, SETTINGS.UI_BUTTON_COLOR, {
        name: 'GTSV.Settings.UIButtonColor.name',
        hint: 'GTSV.Settings.UIButtonColor.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: '#ffffff',
        requiresReload: false,
        onChange: () => {
            game.modules.get(MODULE_ID).uiPanel?.cosmeticSettingsChanged()
        },
    })

    game.settings.register(MODULE_ID, SETTINGS.UI_BUTTON_HOVERED_COLOR, {
        name: 'GTSV.Settings.UIButtonHoveredColor.name',
        hint: 'GTSV.Settings.UIButtonHoveredColor.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: '#138b37',
        requiresReload: false,
        onChange: () => {
            game.modules.get(MODULE_ID).uiPanel?.cosmeticSettingsChanged()
        },
    })

    game.settings.register(MODULE_ID, SETTINGS.UI_BUTTON_CLICKED_COLOR, {
        name: 'GTSV.Settings.UIButtonClickedColor.name',
        hint: 'GTSV.Settings.UIButtonClickedColor.hint',
        scope: 'client',
        config: true,
        type: new foundry.data.fields.ColorField(),
        default: '#25e45e',
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
