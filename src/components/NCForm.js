import { Form } from "antd";
import React, { Component } from "react";
import Schema from 'async-validator';
import { Model, util } from "snowball";

export function createControlledForm(options) {
    return Form.create({
        onFieldsChange(props, changedFields) {
            props.onChange(Object.keys(changedFields)
                .reduce((data, key) => {
                    data[key] = changedFields[key].value;
                    return data;
                }, props.data));
        },
        mapPropsToFields(props) {
            const { data = {} } = props;

            return Object.keys(data)
                .reduce((fields, key) => {
                    fields[key] = Form.createFormField({
                        value: data[key],
                    });
                    return fields;
                }, {});
        },
        ...options
    });
}

export const FormContext = React.createContext();

export class NCForm extends Component {
    constructor() {
        super();

        this._validator = new Schema({});
        this._validateStatus = {};
        this._model = new Model({});
    }

    componentDidMount() {
        this._model.on('change', () => {
            this.forceUpdate();
        });
    }

    validateFields = (fields, callback) => {
        const validateAll = typeof fields === 'function';
        if (validateAll) {
            callback = fields;
            fields = this._model.attributes;
        }

        const handleValid = (errors, _fields) => {
            if (errors) {
                if (!validateAll) {
                    errors = errors.filter(err => (err.field in fields));
                }
                errors.forEach(err => {
                    this._validateStatus[err.field] = {
                        validateStatus: 'error',
                        help: err.message
                    };
                });
                this.forceUpdate();
            } else {
                Object.keys(fields).forEach(key => {
                    this._validateStatus[key] = {
                        validateStatus: 'success'
                    };
                });
            }
            callback && callback(errors, fields);
        };
        const res = this._validator.validate(fields, handleValid);
        if (res && res.then) {
            res
                .then(handleValid)
                .catch(({ errors, fields }) => {
                    return handleValid(errors, fields);
                });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.validateFields((errors, fields) => {
            if (errors) {
                this.props.onError && this.props.onError(errors);
            } else {
                this.props.onSubmit && this.props.onSubmit(fields);
            }
        });
    }

    render() {
        const props = this.props;
        this._rules = {};

        return (
            <FormContext.Provider value={{
                addRules: (fieldName, fieldRules) => {
                    this._rules[fieldName] = fieldRules;
                    this._validator.define(this._rules);
                },
                validate: this.validateFields,
                validateStatus: this._validateStatus,
                setValidateStatus: (fieldName, status) => {
                    this._validateStatus[fieldName] = status;
                },
                setField: (field, value) => {
                    this._model.set(field, value);
                },
                data: this._model.attributes
            }}>
                <Form
                    {...props}
                    onSubmit={this.handleSubmit}
                >
                    {props.children}
                </Form>
            </FormContext.Provider>
        );
    }
}

let fieldId = 0;

export const NCFormItem = ({ ...props }) => {
    return (
        <FormContext.Consumer>
            {
                (form) => {
                    const { field, labelLineBreak, labelVisibility, label, labelSpan = 7, rules = [], children, ...inputProps } = props;
                    if ('max' in inputProps) {
                        rules.push({ max: inputProps.max, min: 0, message: '最多能够输入' + inputProps.max + '个汉字或字符' });
                    }

                    const required = rules.findIndex((rule) => rule.required) !== -1;
                    const isSingleLine = labelLineBreak !== true;
                    const isLabelShow = labelVisibility !== false && label;
                    const formItemProps = isSingleLine && isLabelShow
                        ? {
                            required,
                            label,
                            labelCol: { span: labelSpan },
                            wrapperCol: { span: 24 - labelSpan },
                        } : { required };

                    const { addRules, validate, validateStatus, setValidateStatus } = form;
                    const forceField = field || 'field' + (++fieldId);
                    if (rules && rules.length) {
                        addRules(forceField, rules);
                    }

                    if (field) {
                        inputProps.value = util.get(form.data, field);
                    }

                    const newInputProps = {
                        ...inputProps,
                        onChange: (e) => {
                            let value;
                            if (e && typeof e.preventDefault === 'function')
                                value = e.target.value;
                            else
                                value = e;

                            if (rules && rules.length) {
                                setValidateStatus(forceField, {
                                    validateStatus: 'validating'
                                });
                                validate({
                                    [forceField]: value
                                });
                            }

                            if (field) {
                                form.setField(field, value);
                            }
                            inputProps.onChange && inputProps.onChange(value);
                        }
                    };

                    const item = (
                        <Form.Item {...formItemProps} {...validateStatus[forceField]} className="ps_r mb_m">
                            {
                                typeof children === 'function'
                                    ? children(newInputProps)
                                    : React.cloneElement(React.Children.only(children), newInputProps)
                            }
                            {
                                inputProps.max
                                    ? (
                                        <p className="dock_br pr_m cl_999 fs_s" style={{ bottom: 14, height: 14 }}>
                                            {(inputProps.value || '').length + '/' + inputProps.max}
                                        </p>
                                    )
                                    : null
                            }
                        </Form.Item>
                    );

                    return !isLabelShow || isSingleLine
                        ? item
                        : (
                            <div>
                                <div className="fs_m pb_s">{
                                    required
                                        ? <span style={{ color: '#c00' }}>*</span>
                                        : null
                                }{label}:</div>
                                {item}
                            </div>
                        );
                }
            }
        </FormContext.Consumer>
    );
};

export const NCFormRow = Form.Item;