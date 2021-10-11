const Me = imports.misc.extensionUtils.getCurrentExtension();
const { taskbar } = Me.imports.panel.taskbar.taskbar;

var taskBar = {
	enable(panel, monitor) {
		panel.workspaces_bar = new taskbar(monitor);
		panel.addToStatusArea(
			"babar-workspaces-bar",
			panel.workspaces_bar,
			5,
			"left"
		);
	},
	disable(panel) {
		panel.workspaces_bar.destroy();
	},
};
