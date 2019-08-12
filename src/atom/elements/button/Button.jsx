import React, { Component } from "react";
import { Button } from "antd";

export default class NuclearButton extends Component {
    render() {
        const { text, type, className, children, ...props } = this.props;

        return (
            <Button
                className={className || ''}
                type={type || 'primary'}
                {...props}
            >
                {text == undefined ? undefined : text}
                {children}
            </Button>
        );
    }
};