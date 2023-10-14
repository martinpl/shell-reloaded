import Meta from "gi://Meta"

export const getWindowList = function () {
    let workspace = global.workspace_manager.get_active_workspace()
    const monitor = global.display.get_current_monitor()
    let windows = workspace.list_windows().filter((w) => w.get_monitor() === monitor)
    // log(windows);
    windows.sort((a, b) => {
        return a._sort - b._sort
    })

    // this.windows.forEach((window) => {
    // 	log(`${monitor} | ${window.title} | ${window.get_id()}`);
    // });

    return windows
}

export const moveWindow = function (dir) {
    let currentWindow = global.display.focus_window
    const currentMonitor = currentWindow.get_monitor()
    const monitorIndex = global.display.get_monitor_neighbor_index(currentMonitor, Meta.DisplayDirection[dir])
    log("Monitro index" + monitorIndex)

    if (monitorIndex >= 0) {
        currentWindow.move_to_monitor(monitorIndex)
    }
}
