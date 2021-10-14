const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
var Windows = Me.imports.utils.windows;

var tab = {
	moveLeft() {
		let _items = Windows.getWindowList();

		let index = 0;

		let nr = 0;
		_items.forEach((window) => {
			if (window.appears_focused == true) {
				index = nr;
			}
			nr++;
		});

		let ws_index = (index - 1 + _items.length) % _items.length;

		if (_items.length) {
			let currentWindow = global.display.focus_window;
			const temp = _items[ws_index]._sort;
			_items[ws_index]._sort = currentWindow._sort;
			currentWindow._sort = temp;
			// TODO: it should update current monitor ws
			Main.panel._taskbar._update_ws();
		}
	},
	moveRight() {
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
			let currentWindow = global.display.focus_window;
			const temp = _items[ws_index]._sort;
			_items[ws_index]._sort = currentWindow._sort;
			currentWindow._sort = temp;
			Main.panel._taskbar._update_ws();
		}
	},
};
