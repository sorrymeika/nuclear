import { controller, injectable } from "snowball/app";
import ProjectService from "../domain/services/ProjectService";
import PageService from "../domain/services/PageService";

import Window from "./containers/Window";

import WindowService from "./services/WindowService";
import FileQuickSearchService from "./services/FileQuickSearchService";
import StorageService from "./services/StorageService";
import AtomService from "./services/AtomService";

@controller(Window)
class WindowController {
    @injectable fileQuickSearchService;
    @injectable atomService;
    @injectable windowService;

    constructor() {
        this.projectService = new ProjectService();
        this.pageService = new PageService();
        this.atomService = new AtomService();
        this.windowService = new WindowService(new StorageService(), this.projectService, this.pageService, this.atomService);
        this.fileQuickSearchService = new FileQuickSearchService(this.windowService);
    }

    onInit() {
        this.windowService.init();
    }

    @injectable get atomGroups() {
        return this.windowService.atomGroups;
    }

    onDestroy() {
        this.windowService.dispose();
    }
}

export default WindowController;