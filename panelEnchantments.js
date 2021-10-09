const { Gio, St } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const { WorkspacesBar } = Me.imports.taskbar;
const Main = imports.ui.main;

function panelEnchantments(panel, monitor) {
	if (panel.statusArea["activities"]) {
		panel.statusArea["activities"].remove_actor(
			panel.statusArea["activities"]._label
		);

		panel.statusArea["activities"].activities_icon = new St.Icon({
			gicon: Gio.icon_new_for_string(`${Me.path}/gnome-symbolic.svg`),
			style_class: "system-status-icon",
			reactive: true,
			track_hover: true,
			visible: true,
			icon_size: 16,
		});

		panel.statusArea["activities"].add_child(
			panel.statusArea["activities"].activities_icon
		);
	}

	if (panel.statusArea.appMenu) {
		panel.statusArea.appMenu.hide();
	}

	//
	panel.workspaces_bar = new WorkspacesBar(monitor);
	panel.addToStatusArea(
		"babar-workspaces-bar",
		panel.workspaces_bar,
		5,
		"left"
	);

	if (panel.statusArea["dateMenu"]) {
		let centerBox = panel._centerBox;
		let rightBox = panel._rightBox;
		let dateMenu = panel.statusArea["dateMenu"];
		let children = centerBox.get_children();

		// only move the clock if it's in the centre box
		if (children.indexOf(dateMenu.container) != -1) {
			centerBox.remove_actor(dateMenu.container);

			children = rightBox.get_children();
			rightBox.insert_child_at_index(dateMenu.container, children.length - 1);
		}
	}
}

function disablePanelEnchantments(panel) {
	log("disable disablePanelEnchantments");

	if (panel.statusArea["activities"]) {
		panel.statusArea["activities"].add_actor(
			panel.statusArea["activities"]._label
		);
		panel.statusArea["activities"].activities_icon.destroy();
	}

	panel.workspaces_bar.destroy();

	if (panel.statusArea.appMenu) {
		panel.statusArea.appMenu.show();
	}

	if (panel.statusArea["dateMenu"]) {
		// do nothing if the clock isn't centred in this mode
		if (Main.sessionMode.panel.center.indexOf("dateMenu") == -1) {
			return;
		}
		let centerBox = panel._centerBox;
		let rightBox = panel._rightBox;
		let dateMenu = panel.statusArea["dateMenu"];
		let children = rightBox.get_children();
		// only move the clock back if it's in the right box
		if (children.indexOf(dateMenu.container) != -1) {
			rightBox.remove_actor(dateMenu.container);
			centerBox.add_actor(dateMenu.container);
		}
	}
}
