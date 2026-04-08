import Clutter from "gi://Clutter"
import St from "gi://St"
import * as Main from "resource:///org/gnome/shell/ui/main.js"
import * as Panel from "resource:///org/gnome/shell/ui/panel.js"
import { Keybindings } from "./keybindings.js"
import { enchantments } from "./panel/enchantments.js"
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js"
import { DateMenuButton } from "resource:///org/gnome/shell/ui/dateMenu.js"

export default class ShellReloaded extends Extension {
    enable() {
        log("// Enable starts")
        new Keybindings(this)

        if (!global.MsMain) {
            global.MsMain = new St.Widget({ name: "MsMain" })
        }

        this.allPanels = []
        Main.layoutManager.monitors.forEach((m) => {
            this.allPanels.push(this._createPanel(m))
        })

        this._updateSingal = global.backend.get_monitor_manager().connect("monitors-changed", this._updateMonitors.bind(this))

        this._enchantmentPanels()
        log("// Enable end")
    }

    _updateMonitors() {
        this.disable(true)
        this.enable(true)
    }

    _createPanel(monitor) {
        if (monitor.index != Main.layoutManager.primaryIndex) {
            if (!global.MsMain.get_parent()) {
                Main.layoutManager.addChrome(global.MsMain, { affectsInputRegion: false })
            }

            let Monitor = new Clutter.Actor({ name: "Monitor" })
            Monitor.set_position(monitor.x, monitor.y)

            let panelBox = new St.BoxLayout({ name: "panelBox" })

            const PANEL_ITEM_IMPLEMENTATIONS = {
                activities: Panel.ActivitiesButton,
                dateMenu: DateMenuButton,
            }

            Panel.Panel.prototype._ensureIndicator = function (role) {
                let indicator = this.statusArea[role]
                if (!indicator) {
                    let constructor = PANEL_ITEM_IMPLEMENTATIONS[role]
                    if (!constructor) {
                        // This icon is not implemented (this is a bug)
                        return null
                    }
                    indicator = new constructor(this)
                    this.statusArea[role] = indicator
                }
                return indicator
            }

            global.MsMain.add_child(Monitor)
            // Main.layoutManager.addChrome(clipContainer, { affectsInputRegion: false });
            Monitor.add_child(panelBox)
            Main.layoutManager.trackChrome(panelBox, {
                trackFullscreen: true,
                affectsStruts: true,
                affectsInputRegion: true,
            })

            let panel = new Panel.Panel()
            Main.layoutManager.panelBox.remove_child(panel)
            panelBox.add_child(panel)
            panel.set_width(monitor.width)
            panel._monitor = monitor
            return panel
        }

        if (monitor.index == Main.layoutManager.primaryIndex) {
            Main.panel._monitor = monitor
            return Main.panel
        }
    }

    _enchantmentPanels() {
        this.allPanels.forEach((panel) => {
            enchantments.enable(panel)
            Main.layoutManager.monitors[panel._monitor.index]._panel = panel
        })
    }

    disable() {
        log("// Disable starts")

        // log(JSON.stringify(this.allPanels));
        this.allPanels.forEach((panel) => {
            enchantments.disable(panel)

            if (panel._monitor.index != Main.layoutManager.primaryIndex) {
                panel.destroy()
            }
        })
        this.allPanels = []
        global.MsMain.destroy_all_children()

        global.backend.get_monitor_manager().disconnect(this._updateSingal)

        log("// Disable ends")
    }
}
