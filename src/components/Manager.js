import { autowired, ViewModel } from "snowball/app";

import { INCFormViewModel, INCTableViewModel } from "../types";
import { NCForm } from "./NCForm";
import NCTable from "./NCTable";
import { NCFormModal, NCFormModalViewModel } from "./NCFormModal";

export class Manager extends ViewModel {
    @autowired('NCFormViewModel', 'manager')
    _searchForm: INCFormViewModel;

    @autowired('NCTableViewModel', 'manager')
    _table: INCTableViewModel;

    @autowired('NCManagerFormModal', 'manager')
    _modal: NCFormModalViewModel;

    constructor() {
        super();

        this._searchForm.onSubmit((params) => {
            this._table.search(params, 1);
        });
    }
}

export const NCManagerSearchForm = NCForm.create({ name: 'manager' });
export const NCManagerTable = NCTable.create({ name: 'manager' });
export const NCManagerFormModal = NCFormModal.create({ name: 'manager' });
