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

    @autowired('NCFormModalViewModel', 'manager')
    _modal: NCFormModalViewModel;

    _emitter = this.ctx.createEmitter();

    on = this._emitter.on;
    emit = this._emitter.emit;

    constructor() {
        super();

        this._searchForm.onSubmit((params) => {
            this._table.search(params, 1);
        });

        this._table.on(this.handleTableEvent);
    }

    /**
     * 处理Table事件，需要子类重写该方法
     *
     * @protected
     * @abstract
     */
    handleTableEvent() {
        throw new Error('must override `handleTableEvent` method!');
    }
}

export const NCManagerSearchForm = NCForm.create({ name: 'manager' });
export const NCManagerTable = NCTable.create({ name: 'manager' });
export const NCManagerFormModal = NCFormModal.create({ name: 'manager' });
