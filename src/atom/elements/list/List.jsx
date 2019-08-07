import React, { Component } from 'react';
import { renderJson } from '../../component';
import getProps from '../../shared/getProps';

export default class List extends Component {
    render() {
        const { props } = this;
        const { context, dataSource, items = [], rowKey } = props;
        const { handler, transitiveProps } = context;

        return (
            <>
                {
                    dataSource.map((record, j) => {
                        const children = items;
                        const nextProps = {
                            ...transitiveProps,
                            [this.props.itemAlias]: record,
                            [this.props.indexAlias]: j
                        };
                        const { visible, className } = getProps(handler, {}, context.props.itemProps || {}, nextProps);

                        return visible === false
                            ? null
                            : (
                                <div
                                    className={className}
                                    key={record[rowKey]}
                                >{
                                        children && children.length
                                            ? renderJson(children, handler, [...context.paths, 'list'], nextProps)
                                            : null
                                    }</div>
                            );
                    })
                }
            </>
        );
    }
}