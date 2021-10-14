const Me = imports.misc.extensionUtils.getCurrentExtension();
var Windows = Me.imports.utils.windows;

var navigation = {
	previousWorkspace() {
		const ws_count = global.workspace_manager.get_n_workspaces();
		let ws_index = global.workspace_manager.get_active_workspace_index();

		if (ws_index - 1 >= 0) {
			ws_index = (ws_index - 1 + ws_count) % ws_count;

			let nextworspace =
				global.workspace_manager.get_workspace_by_index(ws_index);

			let monitor = global.display.get_current_monitor();
			let window_list = nextworspace
				.list_windows()
				.filter((w) => w.get_monitor() === monitor);
			window_list.sort(function (w1, w2) {
				return w1.user_time < w2.user_time;
			});

			if (window_list.length) {
				global.workspace_manager
					.get_workspace_by_index(ws_index)
					.activate_with_focus(window_list[0], global.get_current_time());
			} else {
				log("otworz app draw");
				nextworspace.activate(true);
			}
		}
	},

	nextWorkspace() {
		const ws_count = global.workspace_manager.get_n_workspaces();
		let ws_index = global.workspace_manager.get_active_workspace_index();

		if (ws_index + 1 < ws_count) {
			ws_index = (ws_index + 1) % ws_count;

			let nextworspace =
				global.workspace_manager.get_workspace_by_index(ws_index);

			let monitor = global.display.get_current_monitor();
			let window_list = nextworspace
				.list_windows()
				.filter((w) => w.get_monitor() === monitor);
			window_list.sort(function (w1, w2) {
				return w1.user_time < w2.user_time;
			});

			if (window_list.length) {
				global.workspace_manager
					.get_workspace_by_index(ws_index)
					.activate_with_focus(window_list[0], global.get_current_time());
			} else {
				nextworspace.activate(true);
				// Main.overview.toggle();
			}
		}
	},

	previousWindow() {
		let _items = Windows.getWindowList();

		let index = 0;
		let nr = 0;
		_items.forEach((window) => {
			if (window.appears_focused == true) {
				index = nr;
			}
			nr++;
		});

		let xd = (index - 1 + _items.length) % _items.length;

		if (_items.length) {
			_items[xd].activate(global.get_current_time());
		}
	},

	nextWindow() {
		let _items = Windows.getWindowList();

		let index = 0;

		let nr = 0;
		_items.forEach((window) => {
			if (window.appears_focused == true) {
				index = nr;
			}
			nr++;
		});

		let ws_index = (index + 1) % _items.length;

		if (_items.length) {
			_items[ws_index].activate(global.get_current_time());
		}
	},
};
