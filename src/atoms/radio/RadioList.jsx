import React, { Component } from 'react';
import { Radio } from "antd";
import wrapFormItem from "../form/wrapFormItem";

export default wrapFormItem(class RadioList extends Component {
    render() {
        const {
            onChange,
            value,
            dataSource = [],
            valueKey = 'value',
            textKey = 'text'
        } = this.props;

        const disabled = this.props.disabled === true;

        return (
            <Radio.Group
                disabled={disabled}
                value={value}
                onChange={onChange}
                options={dataSource ? dataSource.map(function (item) {
                    return {
                        label: item[textKey],
                        value: item[valueKey],
                        disabled
                    };
                }) : []}
            />
        );
    }
});