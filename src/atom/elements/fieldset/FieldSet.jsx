import React, { Component } from 'react';

export default class FieldSet extends Component {
    render() {
        const props = this.props;
        const { title, className, children } = props;

        return (
            <div
                className={"nuclear-fieldset " + className}
            >
                <div className="nuclear-fieldset-title">{title}</div>
                {children}
            </div>
        );
    }
}