import React, { Component } from 'react';
import { AutoComplete } from "antd";
import createFormItem from "../../methods/createFormItem";
import { getDataSource } from '../../methods/getDataSource';

export default createFormItem(class _AutoComplete extends Component {
    render() {
        const {
            onChange,
            value,
            disabled,
            placeholder,
            dataSourceName,
            onSearch
        } = this.props;

        const dataSource = getDataSource(dataSourceName) || [];

        return (
            <AutoComplete
                value={value == undefined ? undefined : (value + '')}
                disabled={disabled === true}
                placeholder={placeholder}
                dataSource={dataSource}
                onSearch={onSearch}
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                onChange={onChange}
            />
        );
    }
});