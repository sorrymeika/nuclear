import { configuration } from "snowball/app";

import AtomService from "./services/AtomService";
import ProjectService from "./services/ProjectService";
import PageService from "./services/PageService";

import WindowService from "./services/WindowService";
import StorageService from "./services/StorageService";
import FileQuickSearchService from "./services/FileQuickSearchService";

export const WindowConfiguration = configuration({
    modules: {
        atomService: AtomService,
        projectService: ProjectService,
        pageService: PageService,
        windowService: WindowService,
        storageService: StorageService,
        fileQuickSearchService: FileQuickSearchService,
    }
});
