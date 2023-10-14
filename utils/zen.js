import * as Main from "resource:///org/gnome/shell/ui/main.js"

export const zen = {
    toggle() {
        const currentMonitor = global.display.get_current_monitor()
        const panel = Main.layoutManager.monitors[currentMonitor]._panel

        if (panel.visible) {
            panel.hide()
        } else {
            panel.show()
        }
    },
}
