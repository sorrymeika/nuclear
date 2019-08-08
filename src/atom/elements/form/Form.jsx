import React, { Component } from "react";
import { Form } from "antd";
import Schema from 'async-validator';

export const FormContext = React.createContext();

export default class extends Component {
    constructor() {
        super();

        this.validator = new Schema({});
        this.validateStatus = {};
        this.form = {
            validateFields: (fields, callback) => {
                const handleValid = (errors, _fields) => {
                    if (errors) {
                        errors = errors.filter(err => (err.field in fields));
                        errors.forEach(err => {
                            this.validateStatus[err.field] = {
                                validateStatus: 'error',
                                help: err.message
                            };
                        });
                        this.forceUpdate();
                    } else {
                        Object.keys(fields).forEach(key => {
                            this.validateStatus[key] = {
                                validateStatus: 'success'
                            };
                        });
                    }
                    callback && callback(errors, fields);
                };
                const res = this.validator.validate(fields, handleValid);
                if (res && res.then) {
                    res
                        .then(handleValid)
                        .catch(({ errors, fields }) => {
                            return handleValid(errors, fields);
                        });
                }
            }
        };
    }

    render() {
        const props = this.props;
        const { name } = props;
        if (name) {
            props.context.handler[name] = this.form;
        }
        this.rules = {};

        return (
            <FormContext.Provider value={{
                addRules: (fieldName, fieldRules) => {
                    this.rules[fieldName] = fieldRules;
                    this.validator.define(this.rules);
                },
                validate: this.form.validateFields,
                validateStatus: this.validateStatus,
                setValidateStatus: (fieldName, status) => {
                    this.validateStatus[fieldName] = status;
                }
            }}>
                <Form>
                    {props.children}
                </Form>
            </FormContext.Provider>
        );
    }
}