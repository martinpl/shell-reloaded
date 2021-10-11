const { Meta } = imports.gi;

var getWindowList = function () {
	this.workspace = null;

	this.workspaceManager = global.workspace_manager;
	this.workspace = workspaceManager.get_active_workspace();
	this.monitor = global.display.get_current_monitor();
	this.windows = workspace
		.list_windows()
		.filter((w) => w.get_monitor() === this.monitor);
	// log(windows);
	this.windows.sort((a, b) => {
		return a._sort - b._sort;
	});

	// this.windows.forEach((window) => {
	// 	log(`${monitor} | ${window.title} | ${window.get_id()}`);
	// });

	return this.windows;
};

var moveWindow = function (dir) {
	let currentWindow = global.display.focus_window;
	const currentMonitor = currentWindow.get_monitor();
	const monitorIndex = global.display.get_monitor_neighbor_index(
		currentMonitor,
		Meta.DisplayDirection[dir]
	);
	log("Monitro index" + monitorIndex);

	if (monitorIndex >= 0) {
		currentWindow.move_to_monitor(monitorIndex);
	}
};
