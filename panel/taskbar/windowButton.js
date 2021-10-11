const { Clutter, GObject, Shell, St } = imports.gi;
const Main = imports.ui.main;
const WM = global.workspace_manager;
const PanelMenu = imports.ui.panelMenu;

var windowButton = GObject.registerClass(
	class windowButton extends PanelMenu.Button {
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
