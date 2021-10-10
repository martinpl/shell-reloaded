const { Clutter } = imports.gi;
const Gi = imports._gi;
const Main = imports.ui.main;

var extendLeftBox = {
	enable(panel) {
		panel.__proto__[Gi.hook_up_vfunc_symbol]("allocate", this._vfunc_allocate);
	},

	disable(panel) {
		panel.__proto__[Gi.hook_up_vfunc_symbol](
			"allocate",
			Main.panel.__proto__.vfunc_allocate
		);
	},

	_vfunc_allocate(box) {
		this.set_allocation(box);

		let allocWidth = box.x2 - box.x1;
		let allocHeight = box.y2 - box.y1;

		let [, leftNaturalWidth] = this._leftBox.get_preferred_width(-1);
		let [, centerNaturalWidth] = this._centerBox.get_preferred_width(-1);
		let [, rightNaturalWidth] = this._rightBox.get_preferred_width(-1);

		let sideWidth = allocWidth - rightNaturalWidth - centerNaturalWidth;

		let childBox = new Clutter.ActorBox();

		childBox.y1 = 0;
		childBox.y2 = allocHeight;
		if (this.get_text_direction() == Clutter.TextDirection.RTL) {
			childBox.x1 =
				allocWidth - Math.min(Math.floor(sideWidth), leftNaturalWidth);
			childBox.x2 = allocWidth;
		} else {
			childBox.x1 = 0;
			childBox.x2 = Math.min(Math.floor(sideWidth), leftNaturalWidth);
		}
		this._leftBox.allocate(childBox);

		childBox.y1 = 0;
		childBox.y2 = allocHeight;
		if (this.get_text_direction() == Clutter.TextDirection.RTL) {
			childBox.x1 = rightNaturalWidth;
			childBox.x2 = childBox.x1 + centerNaturalWidth;
		} else {
			childBox.x1 = allocWidth - centerNaturalWidth - rightNaturalWidth;
			childBox.x2 = childBox.x1 + centerNaturalWidth;
		}
		this._centerBox.allocate(childBox);

		childBox.y1 = 0;
		childBox.y2 = allocHeight;
		if (this.get_text_direction() == Clutter.TextDirection.RTL) {
			childBox.x1 = 0;
			childBox.x2 = rightNaturalWidth;
		} else {
			childBox.x1 = allocWidth - rightNaturalWidth;
			childBox.x2 = allocWidth;
		}
		this._rightBox.allocate(childBox);

		let cornerWidth, cornerHeight;

		[, cornerWidth] = this._leftCorner.get_preferred_width(-1);
		[, cornerHeight] = this._leftCorner.get_preferred_height(-1);
		childBox.x1 = 0;
		childBox.x2 = cornerWidth;
		childBox.y1 = allocHeight;
		childBox.y2 = allocHeight + cornerHeight;
		this._leftCorner.allocate(childBox);

		[, cornerWidth] = this._rightCorner.get_preferred_width(-1);
		[, cornerHeight] = this._rightCorner.get_preferred_height(-1);
		childBox.x1 = allocWidth - cornerWidth;
		childBox.x2 = allocWidth;
		childBox.y1 = allocHeight;
		childBox.y2 = allocHeight + cornerHeight;
		this._rightCorner.allocate(childBox);
	},
};
