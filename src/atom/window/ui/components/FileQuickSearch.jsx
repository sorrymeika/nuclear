import withService from "../hoc/withService";
import { QuickSearchWithServ } from "./QuickSearch";

const FileQuickSearch = withService('fileQuickSearchService', QuickSearchWithServ);

export default FileQuickSearch;