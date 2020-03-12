import React from 'react';
import { Table } from 'antd';
import { observable } from "snowball";
import { inject, mapViewModelToProps, Service } from 'snowball/app';

export function NCTable({ children, ...props }) {
    const columns = children(props);
    return (
        <Table
            {...props}
            columns={columns}
        />
    );
}

NCTable.create = ({ name }: { name: string }) => {
    return inject(mapViewModelToProps('NCTableViewModel', { name }))(NCTable);
};

type IRequester = {
    load(params: any): Promise<{ total: number, data: any[] }>
};

export class NCTableViewModel extends Service {
    @observable
    dataSource = [];

    @observable
    loading = false;

    @observable
    pageIndex = 1;

    @observable
    pageSize = 15;

    @observable
    total = 0;

    _requester: IRequester;

    _eventEmitter = this.ctx.createEventEmitter();

    on = (...args) => {
        this._eventEmitter.on(...args);
        return this;
    }

    emit = (...args) => {
        this._eventEmitter.emit(...args);
        return this;
    }

    onEditItem = this.ctx.createEmitter();
    onDeleteItem = this.ctx.createEmitter();

    get pagination() {
        return {
            current: this.pageIndex,
            pageSize: this.pageSize,
            onChange: ({ current }) => this.setPageIndex(current)
        };
    }

    setRequester(requester: IRequester) {
        this._requester = requester;
    }

    search(params, pageIndex) {
        this.params = {
            ...params,
        };
        this.pageIndex = pageIndex;
        return this.load();
    }

    setPageIndex(pageIndex) {
        this.pageIndex = pageIndex;
        this.load();
    }

    async load() {
        if (this.loading) {
            return;
        }
        this.loading = true;

        try {
            const res = await this._requester.load({
                ...this.params,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            });
            this.dataSource = res.data;
            this.total = res.total;
            return res;
        } finally {
            this.loading = false;
        }
    }
}