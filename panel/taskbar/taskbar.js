const { Clutter, GObject, Shell, St } = imports.gi;
const Main = imports.ui.main;
const WM = global.workspace_manager;
const PanelMenu = imports.ui.panelMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const { windowButton } = Me.imports.panel.taskbar.windowButton;

var taskbar = GObject.registerClass(
	class taskbar extends PanelMenu.Button {
		_init(monitor = 0) {
			this.monitor = monitor;
			super._init(0.0, null, true);
			this.style_class = "";

			// bar creation
			this.ws_bar = new St.BoxLayout({});
			this.add_child(this.ws_bar);

			// signals
			// this._ws_number_changed = WM.connect(
			// 	"notify::n-workspaces",
			// 	this._update_ws.bind(this)
			// );
			// this._active_ws_changed = WM.connect(
			// 	"active-workspace-changed",
			// 	this._update_ws.bind(this)
			// );
			this._restacked = global.display.connect(
				"restacked",
				this._update_ws.bind(this)
			);
			this._window_left_monitor = global.display.connect(
				"window-left-monitor",
				this._update_ws.bind(this)
			);
		}

		// remove signals, restore Activities button, destroy workspaces bar
		_destroy() {
			// if (this._ws_number_changed) {
			// 	WM.disconnect(this._ws_number_changed);
			// }

			// if (this._active_ws_changed) {
			// 	WM.disconnect(this._active_ws_changed);
			// }

			if (this._restacked) {
				global.display.disconnect(this._restacked);
			}

			if (this._window_left_monitor) {
				global.display.disconnect(this._window_left_monitor);
			}

			this.ws_bar.destroy();
			super.destroy();
		}

		// update the workspaces bar
		_update_ws() {
			// TODO: Update only if something changed
			// destroy old workspaces bar buttons and signals
			this.ws_bar.destroy_all_children();

			// get number of workspaces
			this.ws_count = WM.get_n_workspaces();

			// display all current workspaces and tasks buttons
			for (let ws_index = 0; ws_index < this.ws_count; ++ws_index) {
				// tasks
				this.ws_current = WM.get_workspace_by_index(ws_index);
				this.ws_current.windows = this.ws_current
					.list_windows()
					.sort(this._sort_windows);

				// filtruje wokrspace
				this.ws_current.windows = this.ws_current.windows.filter(function (w) {
					return (
						w.get_workspace().index() ==
						global.workspace_manager.get_active_workspace_index()
					);
				});

				// filtruje monitro, hardkowdowane
				this.ws_current.windows = this.ws_current.windows.filter((w) => {
					return w.get_monitor() == this.monitor;
				});

				// log(
				// 	`update ws okieneczka ${this.monitor}` +
				// 		JSON.stringify(this.ws_current.windows)
				// );

				for (
					let window_index = 0;
					window_index < this.ws_current.windows.length;
					++window_index
				) {
					let window = this.ws_current.windows[window_index];
					// log(`Tworzy taskitem: ${this.window.title} ${this.window.get_id()}`);
					if (!window.skip_taskbar) {
						this._create_window_button(ws_index, window);
					}
				}
			}
		}

		// create window button ; ws = workspace, w = window
		_create_window_button(ws_index, w) {
			// windows on all workspaces have to be displayed only once
			if (!w.is_on_all_workspaces() || ws_index == 0) {
				// create button
				// let w_box = new St.BoxLayout();
				let w_box = new windowButton(ws_index, w);
				this.ws_bar.add_child(w_box.container);
			}
		}

		// sort windows by creation date
		_sort_windows(w1, w2) {
			// move to better place
			if (w1._sort === undefined) {
				w1._sort = w1.get_id();
			}

			if (w2._sort === undefined) {
				w2._sort = w2.get_id();
			}
			//

			return w1._sort - w2._sort;
		}
	}
);
