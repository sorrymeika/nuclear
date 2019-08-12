import React, { Component } from "react";
import { Icon } from "antd";

export default class NuclearIcon extends Component {
    render() {
        const { type, className, ...props } = this.props;

        return (
            <Icon
                className={className || ''}
                type={type}
                {...props}
            />
        );
    }
};