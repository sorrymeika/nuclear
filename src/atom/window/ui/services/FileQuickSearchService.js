import { observable } from "snowball";
import WindowService from "./WindowService";

class FileQuickSearchService {
    get dataSource() {
        return this.windowService.projectList.concat(this.windowService.pageList)
            .map((item) => (item.name));
    }

    @observable
    visible = false;

    constructor(windowService: WindowService) {
        this.windowService = windowService;
    }

    changeFile(path) {
    }

    hideQuickSearch() {
        this.visible = true;
    }
}

export default FileQuickSearchService;