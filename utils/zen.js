const Main = imports.ui.main;

var zen = {
	toggle() {
		// TODO: Should work per monitor
		if (Main.panel.visible) {
			Main.panel.hide();
		} else {
			Main.panel.show();
		}
	},
};
