import React from "react";
import { observer, inject } from "mobx-react";
import FileQuickSearchService from "../services/FileQuickSearchService";
import QuickSearch from "./QuickSearch";

export default inject('fileQuickSearchService')(observer(({ fileQuickSearchService }: { fileQuickSearchService: FileQuickSearchService }) => {
    if (!fileQuickSearchService.visible) {
        return null;
    }

    return (
        <QuickSearch
            dataSource={fileQuickSearchService.dataSource}
            onBlur={(keywords) => fileQuickSearchService.hideQuickSearch()}
            onSelect={(path) => fileQuickSearchService.changeProjectOrPage(path)}
        ></QuickSearch>
    );
}));