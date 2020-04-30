import React, { Component } from 'react';
import { Select, Checkbox } from "antd";
import wrapFormItem from "../form/wrapFormItem";

export default wrapFormItem(class CheckBoxList extends Component {
    render() {
        const {
            onChange,
            value,
            disabled,
            placeholder,
            dataSource = [],
            valueKey = 'value',
            textKey = 'text'
        } = this.props;

        if (!dataSource || !dataSource.length || dataSource.length >= 50) {
            return (
                <Select
                    value={value == undefined ? undefined : (value + '')}
                    showSearch
                    mode="multiple"
                    disabled={disabled === true}
                    placeholder={placeholder}
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

        return (
            <Checkbox.Group
                disabled={disabled}
                value={value ? Array.isArray(value) ? value : [value] : undefined}
                onChange={onChange}
                options={dataSource ? dataSource.map(function (item) {
                    return {
                        label: item[textKey],
                        value: item[valueKey],
                        disabled: false
                    };
                }) : []}
            />
        );
    }
});