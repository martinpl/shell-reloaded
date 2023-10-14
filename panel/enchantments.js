import { taskBar } from "./taskBar.js"
import { extendLeftBox } from "./extendLeftBox.js"
import { moveClock } from "./moveClock.js"

export const enchantments = {
    enable(panel) {
        taskBar.enable(panel)
        extendLeftBox.enable(panel)
        moveClock.enable(panel)
    },

    disable(panel) {
        taskBar.disable(panel)
        extendLeftBox.disable(panel)
        moveClock.disable(panel)
    },
}
