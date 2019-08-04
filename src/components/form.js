import { Form } from "antd";

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
            const { data } = props;

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