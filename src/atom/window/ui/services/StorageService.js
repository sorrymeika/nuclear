
export default class StorageService {
    getCurrentWindowState() {
        const storage = localStorage.getItem('NUCLEAR_WINDOW_STORAGE');
        return storage
            ? JSON.parse(storage)
            : {};
    }

    saveCurrentWindowState(data) {
        const windowState = this.getCurrentWindowState();
        localStorage.setItem('NUCLEAR_WINDOW_STORAGE', JSON.stringify(Object.assign(windowState, data)));
    }
}