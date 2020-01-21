import React from 'react';
import { Table } from 'antd';
import { inject, mapViewModelToProps } from 'snowball/app';

function NCTable({ children, ...props }) {
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

export default NCTable;