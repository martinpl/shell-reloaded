import Meta from "gi://Meta"
import Shell from "gi://Shell"
import * as Main from "resource:///org/gnome/shell/ui/main.js"
import { getSettings } from "./settings.js"

export const addKeybinding = function (name, fn, extension) {
    Main.wm.addKeybinding(name, getSettings("bindings", extension), Meta.KeyBindingFlags.IGNORE_AUTOREPEAT, Shell.ActionMode.NORMAL, fn)
}
