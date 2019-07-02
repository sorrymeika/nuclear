import React from "react";
import { Form } from "antd";

import { FormContext } from "../elements/form/Form";

const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};

export default function createFormItem(Input) {
    return ({ context, ...props }) => {

        return (
            <FormContext.Consumer>
                {
                    (form) => {
                        const { field, labelLineBreak, labelVisibility, label, rules = [], ...inputProps } = props;
                        if (!form) {
                            return <Input {...inputProps} context={context} />;
                        }
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
                                        })(<Input {...inputProps} context={context} />)
                                        : <Input {...inputProps} context={context} />
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


