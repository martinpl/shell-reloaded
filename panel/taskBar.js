const Me = imports.misc.extensionUtils.getCurrentExtension();
const { taskbar } = Me.imports.panel.taskbar.taskbar;

var taskBar = {
	enable(panel) {
		panel._taskbar = new taskbar(panel._monitor?.index);
		panel.addToStatusArea("taskbar", panel._taskbar, 5, "left");
	},
	disable(panel) {
		panel._taskbar.destroy();
	},
};
