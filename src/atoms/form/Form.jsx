import React, { Component } from "react";
import { Form } from "antd";
import Schema from 'async-validator';
import { util, asObservable } from "snowball";

export const FormContext = React.createContext();

export default class extends Component {
    static contextType = FormContext;

    constructor() {
        super();

        this._validator = new Schema({});
        this._validateStatus = {};
        this.childForms = [];
        this.form = {
            validateField: (field, value) => {
                const data = {
                    [field]: value
                };
                const handleValid = (errors, _fields) => {
                    if (errors) {
                        errors.forEach(err => {
                            this._validateStatus[err.field] = {
                                validateStatus: 'error',
                                help: err.message
                            };
                        });
                        this.forceUpdate();
                    } else {
                        this._validateStatus[field] = {
                            validateStatus: 'success'
                        };
                    }
                };
                const res = this._validator.validate(data, { keys: [field] }, handleValid);
                if (res && res.then) {
                    res
                        .then(handleValid)
                        .catch(({ errors, fields }) => {
                            return handleValid(errors, fields);
                        });
                }
            },
            validateFields: (fields, options, callback) => {
                const data = asObservable(this.props.context.handler).get();
                if (typeof fields === 'function') {
                    callback = fields;
                    fields = Object.keys(this._rules).reduce((res, key) => {
                        res[key] = util.get(data, key);
                        return res;
                    }, {});
                    options = {};
                } else {
                    fields = Object.keys(this._rules).reduce((res, key) => {
                        if (key in fields) {
                            res[key] = fields[key];
                        } else if (util.hasKey(fields, key)) {
                            res[key] = util.get(fields, key);
                        }
                        return res;
                    }, {});

                    if (typeof options === 'function') {
                        callback = options;
                        options = {
                            keys: Object.keys(fields)
                        };
                    }
                }

                const handleValid = async (errors, _fields) => {
                    if (errors) {
                        errors.forEach(err => {
                            this._validateStatus[err.field] = {
                                validateStatus: 'error',
                                help: err.message
                            };
                        });
                    } else {
                        Object.keys(fields).forEach(key => {
                            this._validateStatus[key] = {
                                validateStatus: 'success'
                            };
                        });
                    }
                    if (this.childForms.length) {
                        try {
                            await Promise.all(
                                this.childForms.map((childForm) => new Promise((resolve, reject) => {
                                    childForm.form.validateFields((err) => {
                                        err ? reject(err) : resolve();
                                    });
                                }))
                            );
                        } catch (error) {
                            if (!errors) {
                                errors = [];
                            }
                            errors.push(error);
                        }
                    }
                    this.forceUpdate();
                    callback && callback(errors, data);
                };
                const res = this._validator.validate(fields, { ...options }, handleValid);
                if (res && res.then) {
                    res
                        .then(handleValid)
                        .catch(({ errors, fields }) => {
                            return handleValid(errors, fields);
                        });
                }
                return this;
            }
        };
    }

    componentWillUnmount() {
        this.context && this.context.removeChildForm(this);
    }

    addChildForm = (form) => {
        if (this.childForms.indexOf(form) === -1) {
            this.childForms.push(form);
        }
    }

    removeChildForm = (form) => {
        const index = this.childForms.indexOf(form);
        if (index !== -1) {
            this.childForms.splice(index, 1);
        }
    }

    render() {
        const props = this.props;
        const { name } = props;
        if (name) {
            props.context.handler[name] = this.form;
        }
        this._rules = {};

        const childContext = {
            addRules: (fieldName, fieldRules) => {
                this._rules[fieldName] = fieldRules;
                this._validator.define(this._rules);
            },
            validateField: this.form.validateField,
            validateStatus: this._validateStatus,
            setValidateStatus: (fieldName, status) => {
                this._validateStatus[fieldName] = status;
            }
        };

        if (this.context) {
            this.context.addChildForm(this);
        } else {
            childContext.addChildForm = this.addChildForm;
            childContext.removeChildForm = this.removeChildForm;
        }

        return (
            <FormContext.Provider value={childContext}>
                {
                    this.context
                        ? props.children
                        : (
                            <Form>
                                {props.children}
                            </Form>
                        )
                }
            </FormContext.Provider>
        );
    }
}