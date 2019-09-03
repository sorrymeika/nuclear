import { observable } from "snowball";
import { IQuickSearchService } from "../types/IQuickSearchService";
import WindowService from "./WindowService";

class FileQuickSearchService implements IQuickSearchService {
    get dataSource() {
        return this.windowService.projectList.concat(this.windowService.pageList)
            .map((item) => (item.name));
    }

    @observable
    visible = false;

    constructor(windowService: WindowService) {
        this.windowService = windowService;
    }

    onSelect(path) {
    }

    onBlur() {
        this.visible = true;
    }
}

export default FileQuickSearchService;