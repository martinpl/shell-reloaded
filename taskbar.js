const { Clutter, GObject, Shell, St } = imports.gi;
const Main = imports.ui.main;
const WM = global.workspace_manager;
const PanelMenu = imports.ui.panelMenu;

var WindowButton = GObject.registerClass(
	class WindowButton extends PanelMenu.Button {
		_init(ws_index, w) {
			super._init(0.0, null, true);
			this.name = "appMenu";

			this._container = new St.BoxLayout({
				style_class: "panel-status-menu-box",
			});
			this.add_child(this._container);

			this.window = w;

			// create w button and its icon
			this.app = Shell.WindowTracker.get_default().get_window_app(w);
			this.icon = this.app.create_icon_texture(18);
			this._container.add_child(this.icon);

			this.label = new St.Label({
				y_align: Clutter.ActorAlign.CENTER,
				text: w.title ? w.title : this.app.get_name(),
				style: "margin-left: 8px;",
				natural_width: 190,
				natural_width_set: 1,
			});
			this._container.add_child(this.label);
			this.titleUpdate = this.window.connect("notify::title", () => {
				this.label.text = this.window.title;
			});

			this.connect("style-changed", () => {
				if (w.has_focus()) {
					this.set_hover(true);
				}
			});

			// signals
			this.connect("button-release-event", (widget, event) =>
				this._on_button_press(widget, event, this.w_box, ws_index, w)
			);

			// set icon style and opacity following window state
			if (w.is_hidden()) {
				this.icon.set_opacity(150);
			} else {
				this.icon.set_opacity(255);
				if (w.has_focus()) {
					this.set_hover(true);
				}
			}
		}

		// on window w button press
		_on_button_press(widget, event, w_box, ws_index, w) {
			// left-click: toggle window
			if (event.get_button() == 1) {
				if (w.has_focus() && !Main.overview.visible) {
					if (w.can_minimize()) {
						w.minimize();
					}
				} else {
					w.activate(global.get_current_time());
				}
				if (Main.overview.visible) {
					Main.overview.hide();
				}
				if (!w.is_on_all_workspaces()) {
					WM.get_workspace_by_index(ws_index).activate(
						global.get_current_time()
					);
				}
			}

			// middle-click: close window
			if (event.get_button() == 2 && w.can_close()) {
				w.delete(global.get_current_time());
			}
		}

		_onDestroy() {
			this.window.disconnect(this.titleUpdate);
			super.destroy();
		}
	}
);

var WorkspacesBar = GObject.registerClass(
	class WorkspacesBar extends PanelMenu.Button {
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
				let w_box = new WindowButton(ws_index, w);
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
