import React, { Component } from "react";
import { renderDecoration } from '../../shared/decorationUtils';
import { createDecorationItem, DecorationItem } from "../../methods/createDecorationItem";

class TableDecoration extends Component {
    render() {
        const { context, ...props } = this.props;
        const { id: tableId, paths, handler } = context;
        const { items = [] } = props;
        const heads = Array(props.columnsNum || 3).fill('');
        const bodys = Array(props.columnsNum || 3).fill('');
        const columns = props.columns || [];

        return (
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        {
                            heads.map((head, i) => {
                                const columnId = 'table-' + tableId + '-column-' + i;
                                const column = columns[i];

                                return (
                                    <th key={columnId}>
                                        <DecorationItem
                                            dragProps={{
                                                dragable: false,
                                                appendable: true,
                                                insertable: false
                                            }}
                                            context={{
                                                id: tableId,
                                                type: 'table',
                                                subId: i,
                                                subType: 'column',
                                                props: column,
                                                tableProps: context.props
                                            }}
                                            factory={() => {
                                                return column && column.children && column.children.length
                                                    ? renderDecoration(column.children, handler, [...paths, 'table', 'column', i])
                                                    : column
                                                        ? (column.title || '')
                                                        : '';
                                            }}
                                        />
                                    </th>
                                );
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {
                            bodys.map((column, i) => {
                                const columnId = 'table-' + tableId + '-cell-' + i;
                                return (
                                    <td key={columnId}>
                                        <DecorationItem
                                            dragProps={{
                                                dragable: false,
                                                appendable: true,
                                                insertable: false
                                            }}
                                            context={{
                                                id: tableId,
                                                type: 'table',
                                                subId: i,
                                                subType: 'cell',
                                                props: items[i],
                                                context,
                                                tableProps: context.props
                                            }}
                                            factory={() => {
                                                return items[i] && renderDecoration(items[i].children, handler, [...paths, 'table', 'cell', i]);
                                            }}
                                        />
                                    </td>
                                );
                            })
                        }
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default createDecorationItem(TableDecoration, {
    appendable: false
});