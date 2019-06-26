import React from "react";
import { inject } from "snowball/app";
import FileQuickSearchService from "../services/FileQuickSearchService";
import QuickSearch from "./QuickSearch";

export default inject('fileQuickSearchService')(({ fileQuickSearchService }: { fileQuickSearchService: FileQuickSearchService }) => {
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
});