const { Clutter, St } = imports.gi;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Panel = imports.ui.panel;
const { Keybindings } = Me.imports.keybindings;
const { enchantments } = Me.imports.panel.enchantments;

class Extension {
	enable() {
		log("// Enable starts");
		new Keybindings();

		Main.MsMain = new St.Widget({ name: "MsMain" });

		this.allPanels = [];
		Main.layoutManager.monitors.forEach((m) => {
			this.allPanels.push(this._createPanel(m));
		});

		this._updateSingal = global.backend.get_monitor_manager().connect(
			"monitors-changed",
			this._updateMonitors.bind(this)
		);

		this._enchantmentPanels();
		log("// Enable end");
	}

	_updateMonitors() {
		this.disable(true);
		this.enable(true);
	}

	_createPanel(monitor) {
		if (monitor.index != 0) {
			let panelBox;

			Main.layoutManager.addChrome(Main.MsMain, { affectsInputRegion: false });

			let Monitor = new Clutter.Actor({ name: "Monitor" });

			panelBox = new St.BoxLayout({ name: "panelBox" });

			const PANEL_ITEM_IMPLEMENTATIONS = {
				activities: Panel.ActivitiesButton,
				dateMenu: imports.ui.dateMenu.DateMenuButton,
			};

			Panel.Panel.prototype._ensureIndicator = function (role) {
				let indicator = this.statusArea[role];
				if (!indicator) {
					let constructor = PANEL_ITEM_IMPLEMENTATIONS[role];
					if (!constructor) {
						// This icon is not implemented (this is a bug)
						return null;
					}
					indicator = new constructor(this);
					this.statusArea[role] = indicator;
				}
				return indicator;
			};

			Main.MsMain.add_child(Monitor);
			// Main.layoutManager.addChrome(clipContainer, { affectsInputRegion: false });
			Monitor.add_child(panelBox);
			Main.layoutManager.trackChrome(panelBox, {
				trackFullscreen: true,
				affectsStruts: true,
				affectsInputRegion: true,
			});
			Main.MsMain.Monitor = Monitor;
			Main.MsMain.Monitor.panelBox = panelBox;

			let panel = new Panel.Panel();
			Main.layoutManager.panelBox.remove_actor(panel);
			Main.MsMain.Monitor.panelBox.add_actor(panel);
			panel.set_width(monitor.width);
			panel._monitor = monitor;
			return panel;
		}

		if (monitor.index == 0) {
			Main.panel._monitor = monitor;
			return Main.panel;
		}
	}

	_enchantmentPanels() {
		this.allPanels.forEach((panel) => {
			enchantments.enable(panel);
			Main.layoutManager.monitors[panel._monitor.index]._panel = panel;
		});
	}

	disable() {
		log("// Disable starts");

		// log(JSON.stringify(this.allPanels));
		this.allPanels.forEach((panel) => {
			enchantments.disable(panel);

			if (panel._monitor.index != 0) {
				// log(panel);
				// panel.get_parent().destroy_all_children();

				panel.destroy();
				panel = null;
			}
		});
		// Main.MsMain.destroy(); for some resone prevent turn on plugin after boot

		global.backend.get_monitor_manager().disconnect(this._updateSingal);

		log("// Disable ends");
	}
}

function init() {
	return new Extension();
}
