import React, { Component } from "react";

export default class Div extends Component {
    render() {
        const { innerText, className, children } = this.props;

        return (
            <div
                className={className || ''}
            >
                {innerText == undefined ? undefined : innerText}
                {children}
            </div>
        );
    }
};