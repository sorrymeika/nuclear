import React from "react";
import { Form } from "antd";
import { observer } from "mobx-react";

import getProps from "./getProps";
import { JsonComponentContext } from "../component";
import { FormContext } from "../elements/form/Form";

const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};

function encodeRules(rules) {
    var result = '{[';

    result += rules.map((rule) => {
        var obj = '{';
        for (var key in rule) {
            obj += key + ':' + (key === 'message' && !/^\{.+\}$/.test(rule[key]) ? JSON.stringify(rule[key]) : rule[key]) + ',';
        }
        obj = obj.replace(/,$/, '');
        obj += '}';

        return obj;
    }).join(',');

    result += ']}';

    return result;
}

export default function createFormItem(Input) {
    return observer(({ propsConfig = {}, configuredProps, transitiveProps }) => (
        <JsonComponentContext.Consumer>
            {
                (handler) => {
                    const { field, ...confProps } = configuredProps;
                    if (Array.isArray(confProps.rules)) {
                        confProps.rules = encodeRules(confProps.rules);
                    }
                    const props = getProps(handler, propsConfig, confProps, transitiveProps);
                    const { labelLineBreak, labelVisibility, label, rules, visible, ...inputProps } = props;

                    if (!visible) return null;

                    return (
                        <FormContext.Consumer>
                            {
                                (form) => {
                                    const required = rules.findIndex((rule) => rule.required) !== -1;
                                    const isSingleLine = labelLineBreak !== true;
                                    const isLabelShow = labelVisibility !== false && label;
                                    const formItemProps = isSingleLine && isLabelShow ? { required, label, ...formItemLayout } : { required };
                                    const { getFieldDecorator } = form;
                                    const item = (
                                        <Form.Item {...formItemProps} className="ps_r mb_m ml_s">
                                            {
                                                field
                                                    ? getFieldDecorator(field, {
                                                        rules
                                                    })(<Input {...inputProps} />)
                                                    : <Input {...inputProps} />
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
                }
            }
        </JsonComponentContext.Consumer>
    ));
}


