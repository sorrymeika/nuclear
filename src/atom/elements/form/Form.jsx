import React from "react";
import { Form } from "antd";
import getValue from "../../methods/getValue";
import { set } from "snowball/utils";

export const FormContext = React.createContext();

function findFields(childrenJson) {
    const fields = [];

    if (childrenJson) {
        const stack = childrenJson.reverse();
        let current = stack.pop();
        while (current) {
            const { type, specificConfig, children, props } = current;
            if (specificConfig) {
                if (specificConfig.isFormItem) {
                    fields.push(props);
                } else if (type === 'table' || type === 'list') {
                    continue;
                }
            }
            if (children && children.length) {
                stack.push(...children);
            }
            current = stack.pop();
        }
    }

    return fields;
}

export default Form.create({
    onFieldsChange(props, changedFields) {
        const { handler } = props;
        Object.keys(changedFields).forEach((name) => {
            set(handler, name, changedFields[name].value);
        });
    },
    mapPropsToFields(props) {
        const { childrenJson, handler, transitiveProps } = props;
        const fileds = findFields(childrenJson);

        return fileds.reduce((result, filed) => {
            result[filed.name] = Form.createFormField({
                value: getValue(handler, filed.value, transitiveProps)
            });
            return result;
        }, {});
    },
})(props => {
    const { props: configProps } = props;
    if (configProps.name) {
        props.handler[configProps.name] = props.form;
    }

    return (
        <FormContext.Provider value={props.form}>
            <Form>
                {props.children}
            </Form>
        </FormContext.Provider>
    );
});