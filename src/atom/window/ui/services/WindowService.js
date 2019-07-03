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
    projectName: string;
    route: string;
    @observable dialogs: any[];
    @observable atoms: any[];

    constructor({ name, route, projectName, dialogs, atoms }) {
        this.name = name;
        this.route = route;
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
        await this.pullPages(currentProject.name);

        if (windowState.currentPage) {
            const { projectName, name: pageName } = windowState.currentPage;
            await this.pullPage(projectName, pageName);
        }
        this.currentTab = new TabState(windowState.currentTab || { id: 'main' });

        this.disposers.push(
            autorun(() => this._syncIds())
        );
    }

    async pullPages(projectName) {
        const pages = await this.pageService.getPagesByProject(projectName);
        this.pageList = pages;
    }

    async pullPage(projectName, pageName) {
        const { basicInfo, atoms = [] } = await this.pageService.getPage(projectName, pageName);
        const page = {
            ...basicInfo,
            projectName,
            atoms: atoms.filter((item) => item.type !== 'dialog'),
            dialogs: atoms.filter((item) => item.type === 'dialog'),
        };
        this.currentPage = new PageState(page);

        this.storageService.saveCurrentWindowState({
            currentProject: {
                name: projectName
            },
            currentPage: {
                projectName,
                name: pageName
            }
        });
        await this.pullPages(projectName);
    }

    editPage = () => {
        const { currentPage } = this;
        if (currentPage) {
            this.currentAtom = {
                type: 'page',
                props: {
                    projectName: currentPage.projectName,
                    pageName: currentPage.name,
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

    async savePage({ projectName, pageName, route }) {
        await this.pageService.savePage({ projectName, pageName, route });
        await this.pullPage(projectName, pageName);
    }

    addAtom(additionType, data) {
        if (!this.currentPage) {
            message.error('先选择或创建页面!');
            return;
        }
        const { atoms } = this.currentPage;
        const newId = this._newAtomId();
        const newAtom = {
            id: newId,
            type: data.type
        };

        this.currentTab.atoms = atoms.withMutations((atomCollection) => {
            atomCollection.add(newAtom);
        });
        this.selectAtom(newAtom);
        console.log(this.currentTab.atoms);
    }

    selectAtom = (options) => {
        const { id, type, props } = options;
        this.currentAtom = {
            id,
            type,
            props
        };
        this.isSettingsVisible = true;
    }

    confirmSettings = (props) => {
        const { type } = this.currentAtom;
        if (type === 'page') {
            this.savePage(props);
        } else {
        }
        this.hideSettings();
    }

    hideSettings = () => {
        this.isSettingsVisible = false;
    }

    saveDecorations = async () => {
        if (!this.currentPage) {
            message.error('先选择或创建页面!');
            return;
        }

        const { projectName, name, atoms, dialogs } = this.currentPage;
        await this.pageService.savePage({ projectName, pageName: name, atoms, dialogs });
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