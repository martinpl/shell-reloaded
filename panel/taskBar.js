import { taskbar } from "./taskbar/taskbar.js"

export const taskBar = {
    enable(panel) {
        panel._taskbar = new taskbar(panel._monitor?.index)
        panel.addToStatusArea("taskbar", panel._taskbar, 9, "left")
    },
    disable(panel) {
        panel._taskbar.destroy()
    },
}
