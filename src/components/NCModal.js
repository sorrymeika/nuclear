import React from 'react';
import { Modal } from 'antd';
import { observable } from 'snowball';
import { inject, mapViewModelToProps, ViewModel } from 'snowball/app';

export const NCModal = React.createFactory(Modal);

NCModal.create = ({ name }: { name: string }) => {
    return inject(mapViewModelToProps('NCModalViewModel', { name }))(NCModal);
};

export class NCModalViewModel extends ViewModel {
    @observable
    title = '';

    @observable
    type;

    get visible() {
        return !!this.type;
    }

    _onDidOpen = this.ctx.createEmitter();
    onDidOpen = this._onDidOpen.on;

    onOk = this.ctx.createAsyncEmitter();
    onCancel = this.ctx.createEmitter();

    open(type = 'open') {
        this.type = type;
        this._onDidOpen.emit(type);
    }

    close() {
        this.type = null;
    }
}