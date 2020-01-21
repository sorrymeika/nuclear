import React from 'react';
import { Modal } from 'antd';
import { observable } from 'snowball';
import { inject, mapViewModelToProps, ViewModel } from 'snowball/app';

export function NCModal({ children, style, ...props }) {
    return (
        <Modal
            style={{
                top: 0,
                ...style
            }}
            {...props}
        >{children}</Modal>
    );
};

NCModal.create = ({ name }: { name: string }) =>
    inject(mapViewModelToProps('NCModalViewModel', { name }), (newProps, props) => ({
        ...props,
        ...newProps,
        onCancel() {
            newProps.close();
        },
        onOk() {
            newProps.onOk(newProps.type);
        },
        okText: newProps.okText || props.okText,
        cancelText: newProps.cancelText || props.cancelText,
    }))(NCModal);

export class NCModalViewModel extends ViewModel {
    @observable
    title = '';

    @observable
    type;

    @observable
    okText;

    @observable
    cancelText;

    get visible() {
        return !!this.type;
    }

    _onDidOpen = this.ctx.createEmitter();
    onDidOpen = this._onDidOpen.on;

    onOk = this.ctx.createAsyncEmitter();
    onCancel = this.ctx.createEmitter();

    open({
        title,
        type = 'open'
    } = {}) {
        this.title = title;
        this.type = type;
        this._onDidOpen.emit(type);
    }

    close() {
        this.type = null;
        this.onCancel.emit();
    }
}