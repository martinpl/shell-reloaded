const Me = imports.misc.extensionUtils.getCurrentExtension();
const { WorkspacesBar } = Me.imports.taskbar;

var taskBar = {
	enable(panel, monitor) {
		panel.workspaces_bar = new WorkspacesBar(monitor);
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
