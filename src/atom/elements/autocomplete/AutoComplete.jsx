import React from 'react';
import { AutoComplete } from "antd";
import createFormItem from "../../methods/createFormItem";

export default createFormItem(function render(props) {
    const {
        onChange,
        value,
        disabled,
        placeholder,
        dataSourceName,
        onSearch
    } = props;

    const dataSource = this.getDataSource(dataSourceName) || [];

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
});