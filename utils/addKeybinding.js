const { Meta, Shell } = imports.gi
const Main = imports.ui.main
const Me = imports.misc.extensionUtils.getCurrentExtension()
const { getSettings } = Me.imports.utils.settings

var addKeybinding = function (name, fn) {
    Main.wm.addKeybinding(
        name,
        getSettings("bindings"),
        Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
        Shell.ActionMode.NORMAL,
        fn
    )
}
