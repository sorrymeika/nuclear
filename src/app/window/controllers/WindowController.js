import { controller } from "snowball/app";
import ProjectService from "../../../domain/services/ProjectService";
import PageService from "../../../domain/services/PageService";
import AtomService from "../../../domain/services/AtomService";


import WindowService from "../services/WindowService";
import FileQuickSearchService from "../services/FileQuickSearchService";
import StorageService from "../services/StorageService";

import Window from "../containers/Window";

class DecorationHandler {

}

@controller(Window)
class WindowController {
    projectService;
    pageService;
    fileQuickSearchService;
    atomService;
    windowService: WindowService;
    decorationHandler;

    constructor() {
        this.projectService = new ProjectService();
        this.pageService = new PageService();
        this.atomService = new AtomService();
        this.windowService = new WindowService(new StorageService(), this.projectService, this.pageService, this.atomService);
        this.fileQuickSearchService = new FileQuickSearchService(this.windowService);
        this.decorationHandler = new DecorationHandler();
    }

    get atomGroups() {
        return this.windowService.atomGroups;
    }

    get currentTab() {
        return this.windowService.currentTab;
    }

    get currentPage() {
        return this.windowService.currentPage;
    }

    get currentAtom() {
        return this.windowService.currentAtom;
    }

    onInit() {
        this.windowService.init();
    }
}

export default WindowController;