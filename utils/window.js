var window = {
    killFocused() {
        let currentWindow = global.display.focus_window
        currentWindow.delete(global.get_current_time())
    },
    moveTop() {
        const ws_count = global.workspace_manager.get_n_workspaces()
        let currentWindow = global.display.focus_window
        let windowsIndex = currentWindow.get_workspace().workspace_index
        let ws_index = (windowsIndex - 1 + ws_count) % ws_count
        currentWindow.change_workspace_by_index(ws_index, true)
    },
    moveBottom() {
        const ws_count = global.workspace_manager.get_n_workspaces()
        let currentWindow = global.display.focus_window
        let windowsIndex = currentWindow.get_workspace().workspace_index
        let ws_index = (windowsIndex + 1) % ws_count
        currentWindow.change_workspace_by_index(ws_index, true)
    },
}
