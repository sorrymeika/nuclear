import { configuration } from "snowball/app";
import WindowService from "./services/WindowService";
import StorageService from "./services/StorageService";
import FileQuickSearchService from "./services/FileQuickSearchService";
import { CommonConfiguration } from "../../shared/configuration";

export const WindowConfiguration = configuration({
    dependencies: [CommonConfiguration],
    modules: {
        windowService: WindowService,
        storageService: StorageService,
        fileQuickSearchService: FileQuickSearchService,
    }
});