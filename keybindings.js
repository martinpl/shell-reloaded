const { Meta, Shell } = imports.gi;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const { getSettings } = Me.imports.settings;
var Windows = Me.imports.windows;
var Keybindings;

const Gio$1 = imports.gi.Gio;
class RequiredSettingsModule {
	constructor() {
		const bindingSettings = getSettings("bindings");
		this.hotkeysToRemove = bindingSettings.list_keys().map((key) => {
			return bindingSettings.get_strv(key)[0];
		});
		this.keysToRestore = [];
		for (const schema of [
			"org.gnome.desktop.wm.keybindings",
			"org.gnome.shell.keybindings",
			"org.gnome.mutter.keybindings",
			"org.gnome.mutter.wayland.keybindings",
		]) {
			const setting = new Gio$1.Settings({
				schema_id: schema,
			});
			setting.list_keys().forEach((key) => {
				const shortcut = setting.get_strv(key);
				if (shortcut[0] && this.hotkeysToRemove.indexOf(shortcut[0]) > -1) {
					this.keysToRestore.push({
						setting,
						key,
						shortcut,
					});
					setting.set_strv(key, [""]);
				}
			});
		}
	}
	destroy() {
		this.keysToRestore.forEach((keyToRestore) => {
			keyToRestore.setting.set_strv(keyToRestore.key, keyToRestore.shortcut);
		});
		this.keysToRestore = [];
	}
}

Keybindings = new imports.lang.Class({
	Name: "Keybindings",

	_init() {
		// Main.wm.removeKeybinding("toggle-overview");
		// Main.wm.removeKeybinding("restore-shortcuts");
		new RequiredSettingsModule();

		Main.wm.addKeybinding(
			"toggle-shell-ui",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
				if (Main.panel.visible) {
					Main.panel.hide();
				} else {
					Main.panel.show();
				}
			}
		);

		Main.wm.addKeybinding(
			"previous-workspace",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
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
			}
		);

		Main.wm.addKeybinding(
			"next-workspace",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
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
			}
		);

		Main.wm.addKeybinding(
			"previous-window",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
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
			}
		);

		Main.wm.addKeybinding(
			"next-window",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
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
			}
		);

		Main.wm.addKeybinding(
			"kill-focused-window",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
				let currentWindow = global.display.focus_window;
				currentWindow.delete(global.get_current_time());
			}
		);

		Main.wm.addKeybinding(
			"move-window-top",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
				const ws_count = global.workspace_manager.get_n_workspaces();
				let currentWindow = global.display.focus_window;
				let windowsIndex = currentWindow.get_workspace().workspace_index;
				let ws_index = (windowsIndex - 1 + ws_count) % ws_count;
				currentWindow.change_workspace_by_index(ws_index, true);
			}
		);

		Main.wm.addKeybinding(
			"move-window-bottom",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
				const ws_count = global.workspace_manager.get_n_workspaces();
				let currentWindow = global.display.focus_window;
				let windowsIndex = currentWindow.get_workspace().workspace_index;
				let ws_index = (windowsIndex + 1) % ws_count;
				currentWindow.change_workspace_by_index(ws_index, true);
			}
		);

		Main.wm.addKeybinding(
			"move-window-monitor-left",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
				Windows.moveWindow("LEFT");
			}
		);

		Main.wm.addKeybinding(
			"move-window-monitor-right",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
				Windows.moveWindow("RIGHT");
			}
		);

		Main.wm.addKeybinding(
			"move-window-tab-left",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
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
					// it should update current monitor ws
					Main.panel.workspaces_bar._update_ws();
				}
			}
		);

		Main.wm.addKeybinding(
			"move-window-tab-right",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
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
					Main.panel.workspaces_bar._update_ws();
				}
			}
		);

		Main.wm.addKeybinding(
			"navigate-to-workspace-1",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
				global.workspace_manager
					.get_workspace_by_index(0)
					.activate(global.get_current_time());
			}
		);

		Main.wm.addKeybinding(
			"navigate-to-workspace-2",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
				global.workspace_manager
					.get_workspace_by_index(1)
					.activate(global.get_current_time());
			}
		);

		Main.wm.addKeybinding(
			"navigate-to-workspace-3",
			getSettings("bindings"),
			Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
			Shell.ActionMode.NORMAL,
			() => {
				global.workspace_manager
					.get_workspace_by_index(2)
					.activate(global.get_current_time());
			}
		);
	},
});
