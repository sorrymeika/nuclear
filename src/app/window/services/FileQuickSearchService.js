import { observable } from "snowball";
import { IQuickSearchService } from "../types/IQuickSearchService";

class FileQuickSearchService implements IQuickSearchService {
    @observable
    dataSource = [];

    @observable
    visible = false;

    onSelect(path) {
    }

    onBlur() {
        this.visible = true;
    }
}

export default FileQuickSearchService;