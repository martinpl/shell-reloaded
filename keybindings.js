import GObject from "gi://GObject"
// import * as Main from "resource:///org/gnome/shell/ui/main.js"
import { getSettings } from "./utils/settings.js"
import { addKeybinding } from "./utils/addKeybinding.js"
import { navigation } from "./utils/navigation.js"
import { worspace } from "./utils/worspace.js"
import { zen } from "./utils/zen.js"
import { tab } from "./utils/tab.js"
import { window } from "./utils/window.js"
import * as Windows from "./utils/windows.js"

import Gio from "gi://Gio"
class RequiredSettingsModule {
    constructor(extension) {
        const bindingSettings = getSettings("bindings", extension)
        this.hotkeysToRemove = bindingSettings.list_keys().map((key) => {
            return bindingSettings.get_strv(key)[0]
        })
        this.keysToRestore = []
        for (const schema of [
            "org.gnome.desktop.wm.keybindings",
            "org.gnome.shell.keybindings",
            "org.gnome.mutter.keybindings",
            "org.gnome.mutter.wayland.keybindings",
        ]) {
            const setting = new Gio.Settings({
                schema_id: schema,
            })
            setting.list_keys().forEach((key) => {
                const shortcut = setting.get_strv(key)
                if (shortcut[0] && this.hotkeysToRemove.indexOf(shortcut[0]) > -1) {
                    this.keysToRestore.push({
                        setting,
                        key,
                        shortcut,
                    })
                    setting.set_strv(key, [""])
                }
            })
        }
    }
    destroy() {
        this.keysToRestore.forEach((keyToRestore) => {
            keyToRestore.setting.set_strv(keyToRestore.key, keyToRestore.shortcut)
        })
        this.keysToRestore = []
    }
}

export const Keybindings = GObject.registerClass(
    class Keybindings extends GObject.Object {
        constructor(extension) {
            super()
            // Main.wm.removeKeybinding("toggle-overview");
            // Main.wm.removeKeybinding("restore-shortcuts");
            new RequiredSettingsModule(extension)

            addKeybinding("toggle-shell-ui", zen.toggle.bind(), extension)
            addKeybinding("previous-workspace", navigation.previousWorkspace.bind(), extension)
            addKeybinding("next-workspace", navigation.nextWorkspace.bind(), extension)
            addKeybinding("previous-window", navigation.previousWindow.bind(), extension)
            addKeybinding("next-window", navigation.nextWindow.bind(), extension)
            addKeybinding("kill-focused-window", window.killFocused.bind(), extension)
            addKeybinding("move-window-top", window.moveTop.bind(), extension)
            addKeybinding("move-window-bottom", window.moveBottom.bind(), extension)
            addKeybinding("move-window-monitor-left", Windows.moveWindow.bind(null, "LEFT"), extension)
            addKeybinding("move-window-monitor-right", Windows.moveWindow.bind(null, "RIGHT"), extension)
            addKeybinding("move-window-tab-left", tab.moveLeft.bind(), extension)
            addKeybinding("move-window-tab-right", tab.moveRight.bind(), extension)
            addKeybinding("navigate-to-workspace-1", worspace.goTo.bind(null, 0), extension)
            addKeybinding("navigate-to-workspace-2", worspace.goTo.bind(null, 1), extension)
            addKeybinding("navigate-to-workspace-3", worspace.goTo.bind(null, 2), extension)
        }
    }

    // TODO: Should reset on disable
)
