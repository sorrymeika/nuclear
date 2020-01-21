import { controller, autowired } from "snowball/app";
import ProjectService from "../../../shared/services/ProjectService";
import PageService from "../../../shared/services/PageService";
import WindowService from "../services/WindowService";

import Window from "../containers/Window";
import { WindowConfiguration } from "../configuration";

class DecorationHandler {
}

@controller({
    component: Window,
    configuration: WindowConfiguration
})
class WindowController {
    @autowired
    projectService: ProjectService;

    @autowired
    pageService: PageService;

    @autowired
    windowService: WindowService;

    constructor() {
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