var moveClock = {
    enable(panel) {
        // if (panel.statusArea["dateMenu"]) {
        let centerBox = panel._centerBox
        let rightBox = panel._rightBox
        let dateMenu = panel.statusArea["dateMenu"]
        let children = centerBox.get_children()

        // only move the clock if it's in the centre box
        if (children.indexOf(dateMenu.container) != -1) {
            centerBox.remove_actor(dateMenu.container)

            children = rightBox.get_children()
            rightBox.insert_child_at_index(dateMenu.container, children.length - 1)
        }
        // }
    },

    disable(panel) {
        // if (panel.statusArea["dateMenu"]) {
        // do nothing if the clock isn't centred in this mode
        // if (Main.sessionMode.panel.center.indexOf("dateMenu") == -1) {
        // 	return;
        // }
        let centerBox = panel._centerBox
        let rightBox = panel._rightBox
        let dateMenu = panel.statusArea["dateMenu"]
        // let children = rightBox.get_children();
        // only move the clock back if it's in the right box
        // if (children.indexOf(dateMenu.container) != -1) {
        rightBox.remove_actor(dateMenu.container)
        centerBox.add_actor(dateMenu.container)
        // }
        // }
    },
}
