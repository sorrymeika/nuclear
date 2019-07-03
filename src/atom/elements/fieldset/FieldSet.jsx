import React, { Component } from 'react';

export default class FieldSet extends Component {
    render() {
        const props = this.props;
        const { title, className, children } = props;

        return (
            <div
                className={"nc-fieldset " + className}
            >
                <div className="nc-fieldset-title">{title}</div>
                {children}
            </div>
        );
    }
}