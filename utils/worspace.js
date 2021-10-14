var worspace = {
	goTo(index) {
		// TODO: Add check if exists
		global.workspace_manager
			.get_workspace_by_index(index)
			.activate(global.get_current_time());
	},
};
