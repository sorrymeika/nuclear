import { Form, Tooltip, Icon } from "antd";
import React, { Component } from "react";
import Schema from 'async-validator';
import { Model, util } from "snowball";

export const FormContext = React.createContext();

export class NCForm extends Component {
    constructor(props) {
        super(props);

        this._validator = new Schema({});
        this._validateStatus = {};
        if ('data' in props) {
            // props中包含data则表单是受控组件
            this._controlled = true;
            this._changedFields = {};
            this._model = new Model(props.data || {});
            this.shouldComponentUpdate = (nextProps) => {
                if (nextProps.data !== this.props.data) {
                    this._model.set(true, nextProps.data || {});
                }
                return true;
            };
            this.componentDidUpdate = (prevProps) => {
                if (prevProps.data !== this.props.data) {
                    this._model.set(true, this.props.data || {});
                }
                if (Object.keys(this._changedFields).length) {
                    this.validateFields(this._changedFields, () => { });
                    this._changedFields = {};
                }
            };
        } else {
            // 非受控组件
            this._controlled = false;
            this._model = new Model(props.defaultData || {});
            this.shouldComponentUpdate = (nextProps) => {
                if (nextProps.defaultData !== this.props.defaultData) {
                    this._model.set(true, nextProps.defaultData || {});
                }
                return true;
            };
            this.componentDidMount = () => {
                this._model.on('change', () => {
                    this.forceUpdate();
                });
            };
            this.setFields = (data) => {
                this._model.set(data);
                return this;
            };
            this.resetFields = () => {
                this._validateStatus = {};
                this._model.set(true, this.props.defaultData || {});
                return this;
            };
        }
    }

    validateFields = (fields, options, callback) => {
        if (typeof fields === 'function') {
            callback = fields;
            fields = Object.keys(this._rules).reduce((res, key) => {
                res[key] = util.get(this._model.attributes, key);
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

        const handleValid = (errors, _fields) => {
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
            this.forceUpdate();
            callback && callback(errors, this._model.attributes);
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

    submit = () => {
        this.validateFields((errors, fields) => {
            if (errors) {
                this.props.onError && this.props.onError(errors);
            } else {
                this.props.onSubmit && this.props.onSubmit(fields);
            }
        });
        return this;
    }

    resetValidator() {
        this._validateStatus = {};
        this.forceUpdate();
    }

    _handleSubmit = (e) => {
        e.preventDefault();
        this.submit();
    }

    render() {
        const { defaultData, onFieldsChange, children, ...props } = this.props;
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
                    if (this._controlled) {
                        this._changedFields[field] = value;
                    }
                    onFieldsChange && onFieldsChange(util.set({}, field, value));
                },
                data: this._model.attributes
            }}>
                <Form
                    {...props}
                    onSubmit={this._handleSubmit}
                >
                    {typeof children === 'function' ? children({ data: this._model.attributes, form: this }) : children}
                </Form>
            </FormContext.Provider>
        );
    }
}

export const NCFormItem = (props) => {
    return (
        <FormContext.Consumer>
            {
                (form) => {
                    const { field, labelLineBreak, labelVisibility, help, tooltip, label, labelSpan = 7, rules = [], className, children, addonAfter, style, ...inputProps } = props;
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

                    tooltip && (formItemProps.label = (
                        <span>
                            {label}&nbsp;
                            <Tooltip title={tooltip}>
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    ));

                    help && (formItemProps.help = help);

                    const { addRules, validate, validateStatus, setValidateStatus } = form;

                    if (field) {
                        if (rules && rules.length) {
                            addRules(field, rules);
                        }
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

                            if (field) {
                                if (rules && rules.length) {
                                    setValidateStatus(field, {
                                        validateStatus: 'validating'
                                    });
                                    validate({
                                        [field]: value
                                    }, { keys: [field] });
                                }
                                form.setField(field, value);
                            }
                            inputProps.onChange && inputProps.onChange(value);
                        }
                    };

                    const item = (
                        <Form.Item {...formItemProps} {...(field ? validateStatus[field] : null)} className={"ps_r mb_l" + (className ? ' ' + className : '')} style={style}>
                            {
                                typeof children === 'function'
                                    ? children(newInputProps, form.data)
                                    : React.cloneElement(React.Children.only(children), newInputProps)
                            }
                            {addonAfter}
                            {
                                inputProps.max
                                    ? (
                                        <p className="dock_br pr_m cl_999 fs_s" style={{ bottom: 13, height: 14 }}>
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