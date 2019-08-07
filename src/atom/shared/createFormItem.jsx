import React from "react";
import { Form } from "antd";
import { FormContext } from "../elements/form/Form";
import { util } from "snowball";

export default function createFormItem(Input) {
    let fieldId = 0;

    return ({ context, ...props }) => {
        return (
            <FormContext.Consumer>
                {
                    (form) => {
                        const { field, labelLineBreak, labelVisibility, label, labelSpan = 7, rules = [], ...inputProps } = props;
                        if (!form) {
                            return <Input {...inputProps} context={context} />;
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
                            inputProps.value = util.get(context.handler, field);
                        }

                        const item = (
                            <Form.Item {...formItemProps} {...validateStatus[forceField]} className="ps_r mb_m ml_s">
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
                                            validate({
                                                [forceField]: value
                                            });
                                        }

                                        if (field) {
                                            const { handler } = context;
                                            typeof handler.asModel === 'function'
                                                ? handler.asModel().set(field, value)
                                                : util.set(handler, field, value);
                                        }
                                        inputProps.onChange && inputProps.onChange(value);
                                    }}
                                />
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
