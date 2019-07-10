import React, { Component } from "react";

export default class Div extends Component {
    render() {
        const { innerText, className } = this.props;

        console.log(this.props);
        return (
            <div
                className={className || ''}
            >
                {innerText == undefined ? undefined : innerText}
            </div>
        );
    }
};