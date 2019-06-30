import React, { Component } from 'react';
import { Select } from "antd";
import createFormItem from "../../methods/createFormItem";

export default createFormItem(class _Select extends Component {
    render() {
        const {
            showSearch,
            onSearch,
            onChange,
            value,
            disabled,
            placeholder,
            dataSource = [],
            valueKey = 'value',
            textKey = 'text'
        } = this.props;

        return (
            <Select
                value={value == undefined ? undefined : (value + '')}
                showSearch={showSearch !== false}
                disabled={disabled === true}
                placeholder={placeholder}
                onSearch={onSearch}
                onSelect={onChange}
                defaultActiveFirstOption={false}
                dropdownMatchSelectWidth={false}
                optionFilterProp="children"
            >
                {
                    dataSource && dataSource.map(function (opt) {
                        return <Select.Option key={opt[valueKey]} value={opt[valueKey] + ''}>{opt[textKey]}</Select.Option>;
                    })
                }
            </Select>
        );
    }
});