const { Clutter, Gio, St } = imports.gi;
const Gi = imports._gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const { WorkspacesBar } = Me.imports.taskbar;
const Main = imports.ui.main;

function vfunc_allocate(box, flags) {
	this.set_allocation(box, flags);

	let allocWidth = box.x2 - box.x1;
	let allocHeight = box.y2 - box.y1;

	let [leftMinWidth, leftNaturalWidth] = this._leftBox.get_preferred_width(-1);
	let [centerMinWidth, centerNaturalWidth] =
		this._centerBox.get_preferred_width(-1);
	let [rightMinWidth, rightNaturalWidth] =
		this._rightBox.get_preferred_width(-1);

	let sideWidth = allocWidth - rightNaturalWidth - centerNaturalWidth;

	let childBox = new Clutter.ActorBox();

	childBox.y1 = 0;
	childBox.y2 = allocHeight;
	if (this.actor.get_text_direction() == Clutter.TextDirection.RTL) {
		childBox.x1 =
			allocWidth - Math.min(Math.floor(sideWidth), leftNaturalWidth);
		childBox.x2 = allocWidth;
	} else {
		childBox.x1 = 0;
		childBox.x2 = Math.min(Math.floor(sideWidth), leftNaturalWidth);
	}
	this._leftBox.allocate(childBox, flags);

	childBox.y1 = 0;
	childBox.y2 = allocHeight;
	if (this.actor.get_text_direction() == Clutter.TextDirection.RTL) {
		childBox.x1 = rightNaturalWidth;
		childBox.x2 = childBox.x1 + centerNaturalWidth;
	} else {
		childBox.x1 = allocWidth - centerNaturalWidth - rightNaturalWidth;
		childBox.x2 = childBox.x1 + centerNaturalWidth;
	}
	this._centerBox.allocate(childBox, flags);

	childBox.y1 = 0;
	childBox.y2 = allocHeight;
	if (this.actor.get_text_direction() == Clutter.TextDirection.RTL) {
		childBox.x1 = 0;
		childBox.x2 = rightNaturalWidth;
	} else {
		childBox.x1 = allocWidth - rightNaturalWidth;
		childBox.x2 = allocWidth;
	}
	this._rightBox.allocate(childBox, flags);

	let [leftCornerMinWidth, leftCornerWidth] =
		this._leftCorner.actor.get_preferred_width(-1);
	let [leftcornerMinHeight, leftCornerHeight] =
		this._leftCorner.actor.get_preferred_width(-1);
	childBox.x1 = 0;
	childBox.x2 = leftCornerWidth;
	childBox.y1 = allocHeight;
	childBox.y2 = allocHeight + leftCornerHeight;
	this._leftCorner.actor.allocate(childBox, flags);

	let [rightCornerMinWidth, rightCornerWidth] =
		this._rightCorner.actor.get_preferred_width(-1);
	let [rightCornerMinHeight, rightCornerHeight] =
		this._rightCorner.actor.get_preferred_width(-1);
	childBox.x1 = allocWidth - rightCornerWidth;
	childBox.x2 = allocWidth;
	childBox.y1 = allocHeight;
	childBox.y2 = allocHeight + rightCornerHeight;
	this._rightCorner.actor.allocate(childBox, flags);
}

function panelEnchantments(panel, monitor) {
	if (panel.statusArea["activities"]) {
		panel.statusArea["activities"].remove_actor(
			panel.statusArea["activities"]._label
		);

		panel.statusArea["activities"].activities_icon = new St.Icon({
			gicon: Gio.icon_new_for_string(`${Me.path}/gnome-symbolic.svg`),
			style_class: "system-status-icon",
			reactive: true,
			track_hover: true,
			visible: true,
			icon_size: 16,
		});

		panel.statusArea["activities"].add_child(
			panel.statusArea["activities"].activities_icon
		);
	}

	if (panel.statusArea.appMenu) {
		panel.statusArea.appMenu.hide();
	}

	//
	panel.workspaces_bar = new WorkspacesBar(monitor);
	panel.addToStatusArea(
		"babar-workspaces-bar",
		panel.workspaces_bar,
		5,
		"left"
	);

	if (panel.statusArea["dateMenu"]) {
		let centerBox = panel._centerBox;
		let rightBox = panel._rightBox;
		let dateMenu = panel.statusArea["dateMenu"];
		let children = centerBox.get_children();

		// only move the clock if it's in the centre box
		if (children.indexOf(dateMenu.container) != -1) {
			centerBox.remove_actor(dateMenu.container);

			children = rightBox.get_children();
			rightBox.insert_child_at_index(dateMenu.container, children.length - 1);
		}
	}

	Main.panel.__proto__[Gi.hook_up_vfunc_symbol]("allocate", vfunc_allocate);
}

function disablePanelEnchantments(panel) {
	log("disable disablePanelEnchantments");

	if (panel.statusArea["activities"]) {
		panel.statusArea["activities"].add_actor(
			panel.statusArea["activities"]._label
		);
		panel.statusArea["activities"].activities_icon.destroy();
	}

	panel.workspaces_bar.destroy();

	if (panel.statusArea.appMenu) {
		panel.statusArea.appMenu.show();
	}

	if (panel.statusArea["dateMenu"]) {
		// do nothing if the clock isn't centred in this mode
		if (Main.sessionMode.panel.center.indexOf("dateMenu") == -1) {
			return;
		}
		let centerBox = panel._centerBox;
		let rightBox = panel._rightBox;
		let dateMenu = panel.statusArea["dateMenu"];
		let children = rightBox.get_children();
		// only move the clock back if it's in the right box
		if (children.indexOf(dateMenu.container) != -1) {
			rightBox.remove_actor(dateMenu.container);
			centerBox.add_actor(dateMenu.container);
		}
	}

	Main.panel.__proto__[Gi.hook_up_vfunc_symbol](
		"allocate",
		Main.panel.__proto__.vfunc_allocate
	);
}
