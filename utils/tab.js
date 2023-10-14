import * as Main from "resource:///org/gnome/shell/ui/main.js"
import * as Windows from "./windows.js"

export const tab = {
    moveLeft() {
        let _items = Windows.getWindowList()

        let index = 0

        let nr = 0
        _items.forEach((window) => {
            if (window.appears_focused == true) {
                index = nr
            }
            nr++
        })

        let ws_index = (index - 1 + _items.length) % _items.length

        if (_items.length) {
            let currentWindow = global.display.focus_window
            const temp = _items[ws_index]._sort
            _items[ws_index]._sort = currentWindow._sort
            currentWindow._sort = temp

            Main.layoutManager.monitors[currentWindow.get_monitor()]._panel._taskbar._update_ws()
        }
    },
    moveRight() {
        let _items = Windows.getWindowList()

        let index = 0

        let nr = 0
        _items.forEach((window) => {
            if (window.appears_focused == true) {
                index = nr
            }
            nr++
        })

        let ws_index = (index + 1) % _items.length

        if (_items.length) {
            let currentWindow = global.display.focus_window
            const temp = _items[ws_index]._sort
            _items[ws_index]._sort = currentWindow._sort
            currentWindow._sort = temp
            Main.layoutManager.monitors[currentWindow.get_monitor()]._panel._taskbar._update_ws()
        }
    },
}
