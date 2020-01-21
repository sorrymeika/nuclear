import { autowired, ViewModel } from "snowball/app";

import { INCFormViewModel, INCTableViewModel } from "../types";
import { NCForm } from "./NCForm";
import NCTable from "./NCTable";

export class Manager extends ViewModel {
    @autowired('NCFormViewModel', 'managerSearchForm')
    _searchForm: INCFormViewModel;

    @autowired('NCTableViewModel', 'managerTable')
    _table: INCTableViewModel;

    constructor() {
        super();

        this._searchForm.onSubmit((params) => {
            this._table.search(params, 1);
        });
    }
}

export const NCManagerSearchForm = NCForm.create({ name: 'managerSearchForm' });
export const NCManagerTable = NCTable.create({ name: 'managerTable' });
