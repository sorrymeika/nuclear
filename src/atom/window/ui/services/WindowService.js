import { observable, autorun } from "mobx";

import { isNumber } from "snowball/utils";
import { eachAtom } from "../../shared/atomUtils";

import ProjectService from "../../domain/services/ProjectService";
import PageService from "../../domain/services/PageService";
import StorageService from "./StorageService";
import AtomService from "./AtomService";

class PageState {
    name: string;
    path: string;
    @observable dialogs: any[];
    @observable atoms: any[];

    constructor({ name, path, dialogs, atoms }) {
        this.name = name;
        this.path = path;
        this.dialogs = dialogs || [];
        this.atoms = atoms || [];
    }
}

class TabState {
    @observable id: string | number;
    @observable atoms: any[];

    constructor({ id, atoms }) {
        this.id = id || 'main';
        this.atoms = atoms;
    }
}

class WindowService {
    @observable projectList;
    @observable pageList;
    @observable extentions = [];
    @observable currentProject;
    @observable currentPage: PageState;
    @observable currentTab: TabState;

    @observable isSettingsVisible = false;
    @observable isNewPageDialogVisible = false;
    @observable isUIDialogVisible = false;
    @observable isCSSDialogVisible = false;
    @observable isJSDialogVisible = false;

    @observable atomGroups = [];

    constructor(storageService: StorageService, projectService: ProjectService, pageService: PageService, atomService: AtomService) {
        this.storageService = storageService;
        this.pageService = pageService;
        this.projectService = projectService;
        this.atomService = atomService;
        this.disposers = [];
    }

    async init() {
        const windowState = this.storageService.getCurrentWindowState();
        const projects = await this.projectService.getProjects();
        this.projectList = projects;

        const currentProject = windowState.currentProject || projects[0];
        const pages = await this.pageService.getPagesByProject(currentProject.name);
        this.pageList = pages;

        if (windowState.currentPage) {
            this.currentPage = new PageState(windowState.currentPage);
        }
        this.currentTab = new TabState(windowState.currentTab || { id: 'main' });

        this.disposers.push(
            autorun(() => this.syncIds())
        );
    }

    dispose() {
        this.disposers.forEach((dispose) => dispose());
    }

    syncIds() {
        if (!this.currentPage) {
            return;
        }

        const { dialogs, atoms } = this.currentPage;
        let maxId = 0;
        let maxDialogId = 0;

        dialogs.forEach((dialog) => {
            const id = Number(dialog.id.match(/\d+/)[0]);
            maxDialogId = Math.max(maxDialogId, id);
        });

        eachAtom(atoms.concat(dialogs), (atom) => {
            const id = isNumber(atom.id) ? atom.id : Number(atom.id.match(/\d+/)[0]);
            maxId = Math.max(maxId, id);
        });

        this.atomId = maxId + 1;
        this.dialogId = maxDialogId + 1;
    }

    newAtomId() {
        return ++this.atomId;
    }

    newDialogId() {
        return ++this.dialogId;
    }
}

export default WindowService;