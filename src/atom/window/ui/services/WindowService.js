import { message } from "antd";
import { observable, autorun } from "snowball";

import { isNumber } from "snowball/utils";
import { eachAtom } from "../../shared/atomUtils";

import ProjectService from "../../domain/services/ProjectService";
import PageService from "../../domain/services/PageService";
import AtomService from "../../domain/services/AtomService";
import StorageService from "./StorageService";

class PageState {
    name: string;
    path: string;
    projectName: string;
    route: string;
    @observable dialogs: any[];
    @observable atoms: any[];

    constructor({ name, route, projectName, path, dialogs, atoms }) {
        this.name = name;
        this.route = route;
        this.path = path;
        this.projectName = projectName;
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
    @observable atomGroups = [];
    @observable extentions = [];

    @observable currentProject;
    @observable currentPage: PageState;
    @observable currentTab: TabState;
    @observable currentAtom;

    @observable isSettingsVisible = false;
    @observable isNewPageDialogVisible = false;
    @observable isUIDialogVisible = false;
    @observable isCSSDialogVisible = false;
    @observable isJSDialogVisible = false;

    constructor(storageService: StorageService, projectService: ProjectService, pageService: PageService, atomService: AtomService) {
        this.storageService = storageService;
        this.pageService = pageService;
        this.projectService = projectService;
        this.atomService = atomService;
        this.disposers = [];
    }

    async init() {
        const atomGroups = this.atomService.getGroups();
        this.atomGroups = atomGroups;

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
            autorun(() => this._syncIds())
        );
    }

    editPage = () => {
        const { currentPage } = this;
        if (currentPage) {
            this.currentAtom = {
                type: 'page',
                props: {
                    projectName: currentPage.projectName,
                    name: currentPage.name,
                    route: currentPage.route
                }
            };
        } else {
            this.currentAtom = {
                type: 'page',
                props: {}
            };
        }
        this.isSettingsVisible = true;
    };

    addAtom(type, target) {
        if (!this.currentPage) {
            message.error('先选择或创建页面!');
            return;
        }
        const { atoms } = this.currentPage;
        const newId = this._newAtomId();

        atoms.withMutations((atomCollection) => {
            atomCollection.add({
                id: newId
            });
        });
    }

    dispose() {
        this.disposers.forEach((dispose) => dispose());
    }

    _syncIds() {
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

    _newAtomId() {
        return ++this.atomId;
    }

    _newDialogId() {
        return ++this.dialogId;
    }
}

export default WindowService;