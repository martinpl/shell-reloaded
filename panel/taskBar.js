const Me = imports.misc.extensionUtils.getCurrentExtension();
const { taskbar } = Me.imports.panel.taskbar.taskbar;

var taskBar = {
	enable(panel, monitor) {
		panel._taskbar = new taskbar(monitor);
		panel.addToStatusArea("taskbar", panel.workspaces_bar, 5, "left");
	},
	disable(panel) {
		panel._taskbar.destroy();
	},
};
