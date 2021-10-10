const { Clutter, St, Meta } = imports.gi;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Panel = imports.ui.panel;
const { Keybindings } = Me.imports.keybindings;
const { enchantments } = Me.imports.panel.enchantments;

class Extension {
	enable() {
		log("// Enable starts");
		new Keybindings();

		enchantments.enable(Main.panel);

		let dtpPrimaryIndex = 0;
		this.dtpPrimaryMonitor =
			Main.layoutManager.monitors[dtpPrimaryIndex] ||
			Main.layoutManager.primaryMonitor;
		// this.primaryPanel = this._createPanel(this.dtpPrimaryMonitor, true);
		this.allPanels = [this.primaryPanel];
		Main.layoutManager.monitors
			.filter((m) => m != this.dtpPrimaryMonitor)
			.forEach((m) => {
				this.allPanels.push(this._createPanel(m, true));
			});

		this._updateSingal = Meta.MonitorManager.get().connect(
			"monitors-changed",
			this._updateMonitors.bind(this)
		);
		log("// Enable end");
	}

	_updateMonitors() {
		this.disable(true);
		log("monitor update");
		log(this);
		this.enable(true);
	}

	_createPanel(monitor, isStandalone) {
		let MsMain;
		let panelBox;

		MsMain = new St.Widget({ name: "MsMain" });
		Main.MsMain = MsMain;
		Main.layoutManager.addChrome(MsMain, { affectsInputRegion: false });

		let Monitor = new Clutter.Actor({ name: "Monitor" });

		if (isStandalone) {
			panelBox = new St.BoxLayout({ name: "panelBox" });
		} else {
			// panelBox = Main.layoutManager.panelBox;
			// Main.layoutManager._untrackActor(panelBox);
			// panelBox.remove_child(Main.panel.actor);
			// Main.layoutManager.removeChrome(panelBox);
		}

		const PANEL_ITEM_IMPLEMENTATIONS = {
			activities: Panel.ActivitiesButton,
			appMenu: Panel.AppMenuButton, // TODO: Can be remove
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

		MsMain.add_child(Monitor);
		// Main.layoutManager.addChrome(clipContainer, { affectsInputRegion: false });
		Monitor.add_child(panelBox);
		Main.layoutManager.trackChrome(panelBox, {
			trackFullscreen: true,
			affectsStruts: true,
			affectsInputRegion: true,
		});
		Main.MsMain.Monitor = Monitor;
		Main.MsMain.Monitor.panelBox = panelBox;

		// Create panel
		// const PANEL_ITEM_IMPLEMENTATIONS_2 = {};
		// Panel.Panel.prototype._ensureIndicator = function (role) {
		// 	let indicator = this.statusArea[role];
		// 	if (!indicator) {
		// 		let constructor = PANEL_ITEM_IMPLEMENTATIONS_2[role];
		// 		if (!constructor) {
		// 			// This icon is not implemented (this is a bug)
		// 			return null;
		// 		}
		// 		indicator = new constructor(this);
		// 		this.statusArea[role] = indicator;
		// 	}
		// 	return indicator;
		// };

		let panel = new Panel.Panel();
		Main.layoutManager.panelBox.remove_actor(panel);
		Main.MsMain.Monitor.panelBox.add_actor(panel);
		panel.set_width(2560); // TODO: Hard code screen width

		enchantments.enable(panel, monitor.index);
		return panel;
	}

	disable() {
		log("// Disable starts");

		enchantments.disable(Main.panel);

		// log(JSON.stringify(this.allPanels));
		this.allPanels.forEach((panel) => {
			if (panel) {
				// log(panel);
				// panel.get_parent().destroy_all_children();
				enchantments.disable(panel);
				panel.destroy();
				panel = null;
			}
		});
		// Main.MsMain.destroy(); for some resone prevent turn on plugin after boot

		Meta.MonitorManager.get().disconnect(this._updateSingal);

		log("// Disable ends");
	}
}

function init() {
	return new Extension();
}
