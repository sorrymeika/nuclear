import { controller, injectable } from "../../../app";
import ProjectService from "../domain/services/ProjectService";
import PageService from "../domain/services/PageService";

import Window from "./components/Window";

import WindowService from "./services/WindowService";
import FileQuickSearchService from "./services/FileQuickSearchService";
import StorageService from "./services/StorageService";
import AtomService from "./services/AtomService";

@controller(Window)
class WindowController {
    @injectable fileQuickSearchService;
    @injectable atomService;

    constructor() {
        this.projectService = new ProjectService();
        this.pageService = new PageService();
        this.atomService = new AtomService();
        this.windowService = new WindowService(new StorageService(), this.projectService, this.pageService, this.atomService);

        this.fileQuickSearchService = new FileQuickSearchService(this.windowService);
    }
}

export default WindowController;