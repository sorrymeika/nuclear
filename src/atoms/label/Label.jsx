import React, { Component } from "react";
import wrapFormItem from "../wrapFormItem";

export default wrapFormItem(class Label extends Component {
    render() {
        const { value, className } = this.props;

        return (
            <span className={className || ''}>
                {value == undefined ? undefined : value}
            </span>
        );
    }
});