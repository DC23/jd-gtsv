/**
 * GTSV module registration
 *
 */
import { registerKeybindings, registerSettings, MODULE_ID, SETTINGS } from './settings.mjs'
import { Constants } from './constants.mjs'
import { UIPanel } from './uipanel.mjs'

Hooks.once('init', () => {
    console.group('JD GTSV | init')

    registerKeybindings()
    UIPanel.registerKeybindings()

    console.groupEnd()
})

Hooks.once('i18nInit', () => {
    registerSettings()
})

Hooks.once('ready', async () => {
    console.group('JD GTSV | ready')

    const uiPanel = UIPanel.create()
    uiPanel.render(true)
    game.modules.get(MODULE_ID).uiPanel = uiPanel

    // Init other singletons here

    console.groupEnd()
})
