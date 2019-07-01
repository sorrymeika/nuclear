import React from "react";
import { Form } from "antd";
import getValue from "../../methods/getValue";
import { set } from "snowball/utils";

export const FormContext = React.createContext();

function findFields(childrenJson) {
    const fields = [];

    if (childrenJson) {
        const stack = [...childrenJson];
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

const setFields = (handler, changedFields, parentNames = []) => {
    Object.keys(changedFields).forEach((name) => {
        const subField = changedFields[name];
        const currentNames = parentNames.concat(name);

        if (subField.name === currentNames.join('.')) {
            typeof handler.asModel === 'function'
                ? handler.asModel().set(currentNames, subField.value)
                : set(handler, currentNames, subField.value);
        } else {
            setFields(handler, subField, currentNames);
        }
    });
};

export default Form.create({
    onFieldsChange(props, changedFields) {
        const { handler } = props.context;
        setFields(handler, changedFields);
    },
    mapPropsToFields(props) {
        const { childrenJson, handler, transitiveProps } = props.context;
        const fileds = findFields(childrenJson);

        return fileds.reduce((result, filed) => {
            result[filed.name] = Form.createFormField({
                value: getValue(handler, filed.value, transitiveProps)
            });
            return result;
        }, {});
    },
})(props => {
    const { name } = props;
    if (name) {
        props.context.handler[name] = props.form;
    }

    return (
        <FormContext.Provider value={props.form}>
            <Form>
                {props.children}
            </Form>
        </FormContext.Provider>
    );
});