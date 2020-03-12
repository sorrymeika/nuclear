import { autowired, ViewModel } from "snowball/app";

import { NCForm, NCFormViewModel } from "./NCForm";
import { NCTable, NCTableViewModel } from "./NCTable";
import { NCFormModal, NCFormModalViewModel } from "./NCFormModal";

export class Manager extends ViewModel {
    @autowired('NCFormViewModel', 'manager')
    searchForm: NCFormViewModel;

    @autowired('NCTableViewModel', 'manager')
    table: NCTableViewModel;

    @autowired('NCFormModalViewModel', 'manager')
    modal: NCFormModalViewModel;

    _eventEmitter = this.ctx.createEventEmitter();

    on = (...args) => {
        this._eventEmitter.on(...args);
        return this;
    }

    emit = (...args) => {
        this._eventEmitter.emit(...args);
        return this;
    }

    constructor() {
        super();

        this.searchForm.onSubmit((params) => {
            this.table.search(params, 1);
        });
    }
}

export const NCManagerSearchForm = NCForm.create({ name: 'manager' });
export const NCManagerTable = NCTable.create({ name: 'manager' });
export const NCManagerFormModal = NCFormModal.create({ name: 'manager' });
