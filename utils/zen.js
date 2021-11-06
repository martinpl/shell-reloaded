const Main = imports.ui.main;

var zen = {
	toggle() {
		const currentMonitor = global.display.get_current_monitor();
		const panel = Main.layoutManager.monitors[currentMonitor]._panel;

		if (panel.visible) {
			panel.hide();
		} else {
			panel.show();
		}
	},
};
