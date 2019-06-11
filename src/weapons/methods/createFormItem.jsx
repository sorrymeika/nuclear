import React from "react";
import { Form } from "antd";
import { observer } from "mobx-react";

import getProps from "../methods/getProps";
import { JsonComponentContext } from "../component";
import { FormContext } from "../form/Form";

const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};

export default function createFormItem(Input) {
    return observer(({ propsConfig, weaponProps, inheritedProps }) => (
        <JsonComponentContext.Consumer>
            {
                (handler) => {
                    const props = getProps(handler, propsConfig, weaponProps, inheritedProps);
                    const { field, labelLineBreak, labelVisibility, label, rules, visible, ...inputProps } = props;

                    if (!visible) return null;

                    return (
                        <FormContext.Consumer>
                            {
                                (form) => {
                                    if (form) {
                                        const required = rules.findIndex((rule) => rule.required) !== -1;
                                        const isSingleLine = labelLineBreak !== true;
                                        const isLabelShow = labelVisibility !== false && label;
                                        const formItemProps = isSingleLine && isLabelShow ? { required, label, ...formItemLayout } : { required };
                                        const { getFieldDecorator } = form;
                                        return (
                                            <Form.Item {...formItemProps} className="ps_r mb_m ml_s">
                                                {
                                                    getFieldDecorator(field, {
                                                        rules
                                                    })(<Input {...inputProps} />)
                                                }
                                            </Form.Item>
                                        );
                                    }

                                    return <Input {...inputProps} />;
                                }
                            }
                        </FormContext.Consumer>
                    );
                }
            }
        </JsonComponentContext.Consumer>
    ));
}


