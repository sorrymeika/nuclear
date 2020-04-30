import { SettingsBase } from "../../atom-core/SettingsBase";

export const inputCommonJson = [{
    type: 'textarea',
    props: {
        label: 'label',
        field: 'data.label',
        visible: '{isInForm}',
        autosize: true
    }
}, {
    type: 'textarea',
    props: {
        label: 'field',
        field: 'data.field',
        autosize: 'true',
        visible: '{isInForm}',
        rules: [{ required: true }]
    }
}, {
    type: 'textarea',
    props: {
        label: 'value',
        field: 'data.value',
        visible: '{!isInForm}',
        autosize: 'true'
    }
}, {
    type: 'textarea',
    props: {
        label: 'onChange',
        field: 'data.onChange',
        autosize: true
    }
}, {
    type: 'autocomplete',
    props: {
        label: 'visible',
        field: 'data.visible',
        dataSource: '{boolOptions}'
    }
}, {
    type: 'autocomplete',
    props: {
        label: 'disabled',
        field: 'data.disabled',
        dataSource: '{boolOptions}'
    }
}, {
    type: 'autocomplete',
    props: {
        label: 'label换行',
        visible: '{isInForm}',
        field: 'data.labelLineBreak',
        dataSource: '{boolOptions}'
    }
}];

class InputSettings extends SettingsBase {
    renderJson() {
        return [
            ...inputCommonJson,
            {
                type: 'div',
                props: {
                    visible: '{isInForm}',
                }
            }
        ];
    }
}

export default InputSettings;