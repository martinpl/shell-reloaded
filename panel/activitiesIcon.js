const { Gio, St } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

var activitiesIcon = {
	enable(panel) {
		// if (panel.statusArea["activities"]) {
		panel.statusArea["activities"].remove_actor(
			panel.statusArea["activities"]._label
		);

		panel.statusArea["activities"].activities_icon = new St.Icon({
			gicon: Gio.icon_new_for_string(`${Me.path}/assets/gnome-symbolic.svg`),
			style_class: "system-status-icon",
			reactive: true,
			track_hover: true,
			visible: true,
			icon_size: 16,
		});

		panel.statusArea["activities"].add_child(
			panel.statusArea["activities"].activities_icon
		);
		// }
	},

	disable(panel) {
		// if (panel.statusArea["activities"]) {
		panel.statusArea["activities"].add_actor(
			panel.statusArea["activities"]._label
		);
		panel.statusArea["activities"].activities_icon.destroy();
		// }
	},
};
