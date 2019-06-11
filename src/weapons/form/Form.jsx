import React from "react";
import { Form } from "antd";
import getValue from "../../methods/getValue";
import { set } from "../../utils";

export const FormContext = React.createContext();

function findFields() {
    return [];
}

export default Form.create({
    onFieldsChange(props, changedFields) {
        const { handler } = props;

        Object.keys(changedFields).forEach((name) => {
            set(handler, name, changedFields[name].value);
        });
    },
    mapPropsToFields(props) {
        const { childrenJson, handler, configuredProps, transitiveProps } = props;
        const fileds = findFields(childrenJson);

        if (configuredProps.name) {
        }

        return fileds.reduce((result, filed) => {
            result[filed.name] = Form.createFormField({
                value: getValue(handler, filed.value, transitiveProps)
            });
            return result;
        }, {});
    },
})(props => {
    return (
        <FormContext.Provider value={props.form}>
            <Form>
                {props.children}
            </Form>
        </FormContext.Provider>
    );
});