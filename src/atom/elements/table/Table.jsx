import React, { Component } from 'react';
import { Table, Tooltip, Icon } from "antd";
import { renderJson } from '../../component';
import getProps from '../../shared/getProps';
import { util } from 'snowball';

export default class NuclearTable extends Component {
    render() {
        const { props } = this;
        const { context, dataSource, items = [], rowKey, pageEnabled, onChange, showHead = true } = props;
        const columns = props.columns || [];
        const tableColumns = [];
        const { handler, transitiveProps, paths } = context;

        columns.forEach((column, i) => {
            const children = items.filter((columnItem) => columnItem.subId == i);
            const itemConfig = (props.itemsConfig && props.itemsConfig[i]) || {};

            const titleElement = Boolean(column.ifShowTooltip) ? (
                <Tooltip title={column.tooltipContent}>
                    {column.title}&nbsp;
                    <Icon type="question-circle" />
                </Tooltip>
            ) : column.title;

            const columnProps = getProps(handler, {}, util.pick(column, ['className', 'sorter', 'filters']), transitiveProps);

            tableColumns.push({
                key: column.key,
                dataIndex: column.key,
                title: column.children && column.children.length
                    ? (
                        <div className={columnProps.className}>{
                            renderJson(column.children, handler, [...paths, 'table'])
                        }</div>
                    )
                    : titleElement,
                width: column.width,
                sorter: columnProps.sorter,
                filters: columnProps.filters,
                render: (text, record, j) => {
                    const nextProps = {
                        ...transitiveProps,
                        [this.props.itemAlias]: record,
                        [this.props.indexAlias]: j
                    };
                    const { visible, className } = getProps(handler, {}, itemConfig, nextProps);

                    return visible === false
                        ? null
                        : (
                            <div className={className}>{
                                children && children.length
                                    ? renderJson(children, handler, [...this.props.weaponPaths, 'table'], nextProps)
                                    : text
                            }</div>
                        );
                }
            });
        });

        const pagination = pageEnabled
            ? {
                current: dataSource.current,
                pageSize: dataSource.pageSize,
                total: dataSource.total,
                onChange: dataSource.onPageChange
            }
            : false;

        return (
            <Table
                className={"mt_m " + (props.className || '')}
                columns={tableColumns}
                rowKey={rowKey}
                dataSource={dataSource.data}
                pagination={pagination}
                loading={dataSource.loading}
                onChange={onChange}
                showHeader={showHead}
            />
        );
    }
}