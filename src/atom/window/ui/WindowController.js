import { controller, injectable } from "snowball/app";
import ProjectService from "../domain/services/ProjectService";
import PageService from "../domain/services/PageService";
import AtomService from "../domain/services/AtomService";

import Window from "./containers/Window";

import WindowService from "./services/WindowService";
import FileQuickSearchService from "./services/FileQuickSearchService";
import StorageService from "./services/StorageService";

class DecorationHandler {

}

@controller(Window)
class WindowController {
    @injectable projectService;
    @injectable pageService;
    @injectable fileQuickSearchService;
    @injectable atomService;
    @injectable windowService: WindowService;
    @injectable decorationHandler;

    constructor() {
        this.projectService = new ProjectService();
        this.pageService = new PageService();
        this.atomService = new AtomService();
        this.windowService = new WindowService(new StorageService(), this.projectService, this.pageService, this.atomService);
        this.fileQuickSearchService = new FileQuickSearchService(this.windowService);
        this.decorationHandler = new DecorationHandler();
    }

    @injectable get atomGroups() {
        return this.windowService.atomGroups;
    }

    @injectable get currentTab() {
        return this.windowService.currentTab;
    }

    @injectable get currentPage() {
        return this.windowService.currentPage;
    }

    @injectable get currentAtom() {
        return this.windowService.currentAtom;
    }

    onInit() {
        this.windowService.init();
    }

    onDestroy() {
        this.windowService.dispose();
    }
}

export default WindowController;