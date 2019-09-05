import React from 'react';
import { Checkbox } from "antd";
import wrapFormItem from "../wrapFormItem";

export default wrapFormItem(({ value, onChange, ...props }) => (
    <Checkbox
        {...props}
        checked={!!value}
        onChange={(e) => {
            onChange && onChange(e.target.checked);
        }}
    ></Checkbox>
));