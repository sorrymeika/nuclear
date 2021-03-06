import React, { Component } from 'react';
import { AutoComplete } from "antd";
import wrapFormItem from "../form/wrapFormItem";

export default wrapFormItem(class _AutoComplete extends Component {
    render() {
        const {
            onChange,
            value,
            disabled,
            placeholder,
            dataSource = [],
            onSearch
        } = this.props;

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