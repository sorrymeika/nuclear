import React, { Component } from "react";
import createFormItem from "../../methods/createFormItem";

export default createFormItem(class Label extends Component {
    render() {
        const { value, className } = this.props;

        return (
            <span className={className || ''}>
                {value == undefined ? undefined : value}
            </span>
        );
    }
});