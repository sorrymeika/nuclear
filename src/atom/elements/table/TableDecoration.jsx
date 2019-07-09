import React, { Component } from "react";
import { renderDecoration } from '../../shared/decorationUtils';
import { DecorationItem } from "../../methods/createDecorationItem";

class TableDecoration extends Component {
    render() {
        const { props } = this;
        const { context = [], items = [] } = this.props;
        const { id: tableId, paths, handler } = context;
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
                                                id: columnId,
                                                tableId,
                                                type: 'table',
                                                subType: 'column',
                                                props: column
                                            }}
                                            factory={() => {
                                                return column && column.children && column.children.length
                                                    ? renderDecoration(column.children, handler, [...paths, 'table', 'column', i])
                                                    : column
                                                        ? (column.title || '')
                                                        : '';
                                            }}
                                        ></DecorationItem>
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
                                                id: columnId,
                                                type: 'table',
                                                tableId,
                                                subType: 'item',
                                                props: items[i]
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

export default TableDecoration;