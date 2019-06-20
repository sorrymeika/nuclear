
export default class StorageService {
    getCurrentWindowState() {
        const storage = localStorage.getItem('NUCLEAR_WINDOW_STORAGE');
        return storage
            ? JSON.parse(storage)
            : {};
    }

    saveCurrentWindowState() {
    }
}