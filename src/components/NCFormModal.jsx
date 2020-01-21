
import React from 'react';
import { Modal } from 'antd';
import { NCForm } from './NCForm';
import { inject, mapViewModelToProps, autowired } from 'snowball/app';
import { NCModalViewModel } from './NCModal';
import NCFormViewModel from './NCFormViewModel';

export function NCFormModal({
    title,
    visible,
    width,
    style,
    okText,
    onOk,
    cancelText,
    onCancel,

    formRef,
    formStyle,
    data,
    onFieldsChange,
    onReset,
    onSubmit,
    onError,

    children
}) {
    return (
        <Modal
            title={title}
            visible={visible}
            onOk={onOk}
            okText={okText}
            cancelText={cancelText}
            onCancel={onCancel}
            width={width}
            style={{
                top: 0,
                ...style
            }}
        >
            <NCForm
                onSubmit={onSubmit}
                onReset={onReset}
                onError={onError}
                onFieldsChange={onFieldsChange}
                data={data}
                style={formStyle}
                ref={formRef}
            >{children}</NCForm>
        </Modal>
    );
}

NCFormModal.create = ({ name }: { name: string }) => inject((context, props) => {
    const formModalViewModel = autowired("NCFormModalViewModel", { name });
    const modalMapper = mapViewModelToProps(formModalViewModel);
    const formMapper = mapViewModelToProps(formModalViewModel._formViewModel);

    return {
        ...formMapper,
        ...modalMapper,
        okText: modalMapper.okText || props.okText,
        cancelText: modalMapper.cancelText || props.cancelText,
        onOk() {
            formModalViewModel.submit();
        },
        onCancel() {
            formModalViewModel.close();
        },
        formRef: formMapper.ref,
        ref: props.ref
    };
})(NCFormModal);

export class NCFormModalViewModel extends NCModalViewModel {
    @autowired('NCFormViewModel', {
        level: 'instance'
    })
    _formViewModel: NCFormViewModel;

    onError = this._formViewModel.onError;
    onReset = this._formViewModel.onReset;

    constructor() {
        super();

        this._formViewModel.onSubmit((data) => {
            this.onOk(data);
        });

        this.onCancel(() => {
            this._formViewModel.resetValidator();
        });
    }

    open(data, type = 'open') {
        this._formViewModel.data = data;
        super.open(type);
    }

    submit() {
        this._formViewModel.submit();
    }
}