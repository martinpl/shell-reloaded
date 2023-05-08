const { GObject, Meta, Shell } = imports.gi
const Main = imports.ui.main
const Me = imports.misc.extensionUtils.getCurrentExtension()
const { getSettings } = Me.imports.utils.settings
const { addKeybinding } = Me.imports.utils.addKeybinding
const { navigation } = Me.imports.utils.navigation
const { worspace } = Me.imports.utils.worspace
const { zen } = Me.imports.utils.zen
const { tab } = Me.imports.utils.tab
const { window } = Me.imports.utils.window
var Windows = Me.imports.utils.windows
var Keybindings

const Gio$1 = imports.gi.Gio
class RequiredSettingsModule {
    constructor() {
        const bindingSettings = getSettings("bindings")
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
            const setting = new Gio$1.Settings({
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

var Keybindings = GObject.registerClass(
    class Keybindings extends GObject.Object {
        _init() {
            // Main.wm.removeKeybinding("toggle-overview");
            // Main.wm.removeKeybinding("restore-shortcuts");
            new RequiredSettingsModule()

            addKeybinding("toggle-shell-ui", zen.toggle.bind())
            addKeybinding("previous-workspace", navigation.previousWorkspace.bind())
            addKeybinding("next-workspace", navigation.nextWorkspace.bind())
            addKeybinding("previous-window", navigation.previousWindow.bind())
            addKeybinding("next-window", navigation.nextWindow.bind())
            addKeybinding("kill-focused-window", window.killFocused.bind())
            addKeybinding("move-window-top", window.moveTop.bind())
            addKeybinding("move-window-bottom", window.moveBottom.bind())
            addKeybinding("move-window-monitor-left", Windows.moveWindow.bind(null, "LEFT"))
            addKeybinding("move-window-monitor-right", Windows.moveWindow.bind(null, "RIGHT"))
            addKeybinding("move-window-tab-left", tab.moveLeft.bind())
            addKeybinding("move-window-tab-right", tab.moveRight.bind())
            addKeybinding("navigate-to-workspace-1", worspace.goTo.bind(null, 0))
            addKeybinding("navigate-to-workspace-2", worspace.goTo.bind(null, 1))
            addKeybinding("navigate-to-workspace-3", worspace.goTo.bind(null, 2))
        }
    }

    // TODO: Should reset on disable
)
