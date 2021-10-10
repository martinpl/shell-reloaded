const Me = imports.misc.extensionUtils.getCurrentExtension();
const { activitiesIcon } = Me.imports.panel.activitiesIcon;
const { hideAppMenu } = Me.imports.panel.hideAppMenu;
const { taskBar } = Me.imports.panel.taskBar;
const { extendLeftBox } = Me.imports.panel.extendLeftBox;
const { moveClock } = Me.imports.panel.moveClock;

var enchantments = {
	enable(panel, monitor) {
		activitiesIcon.enable(panel);
		hideAppMenu.enable(panel);
		taskBar.enable(panel, monitor);
		moveClock.enable(panel);
		extendLeftBox.enable(panel);
	},

	disable(panel) {
		activitiesIcon.disable(panel);
		taskBar.disable(panel);
		hideAppMenu.disable(panel);
		moveClock.disable(panel);
		extendLeftBox.disable(panel);
	},
};
