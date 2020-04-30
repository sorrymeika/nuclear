import React from "react";
import { Form } from "antd";
import { util, isObservableObject, asObservable } from "snowball";
import { FormContext } from "./Form";

export default function wrapFormItem(Input, options = {}) {
    let fieldId = 0;

    return ({ context, ...props }) => {
        props = {
            ...options.defaultProps,
            ...props
        };

        return (
            <FormContext.Consumer>
                {
                    (form) => {
                        if (typeof options.extendProps === 'function') {
                            Object.assign(props, options.extendProps(props));
                        }

                        const { field, help, labelLineBreak, labelVisibility, label, labelSpan = 7, rules = [], ...inputProps } = props;
                        if (!form) {
                            return <Input {...inputProps} context={context} />;
                        }
                        if (options.showNumber && 'max' in inputProps) {
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

                        help && (formItemProps.help = help);

                        const { addRules, validateField, validateStatus, setValidateStatus } = form;
                        const forceField = (field || 'field' + (++fieldId));
                        if (rules && rules.length) {
                            addRules(forceField, rules);
                        }

                        if (field) {
                            inputProps.value = util.get(context.handler, field);
                        }

                        const item = (
                            <Form.Item {...formItemProps} {...validateStatus[forceField]} className="ps_r mb_m">
                                <Input
                                    {...inputProps}
                                    context={context}
                                    onChange={(e) => {
                                        let value;
                                        if (e && typeof e.preventDefault === 'function')
                                            value = e.target.value;
                                        else
                                            value = e;

                                        if (rules && rules.length) {
                                            setValidateStatus(forceField, {
                                                validateStatus: 'validating'
                                            });
                                            validateField(forceField, value);
                                        }

                                        if (field) {
                                            const { handler } = context;

                                            isObservableObject(handler)
                                                ? asObservable(handler).set(field, value)
                                                : util.set(handler, field, value);
                                        }
                                        inputProps.onChange && inputProps.onChange(value);
                                    }}
                                />
                                {
                                    options.showNumber && inputProps.max
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
}
