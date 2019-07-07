import component from "../../component";

export const inputCommonJson = [{
    type: 'textarea',
    props: {
        label: 'label',
        field: 'label',
        visible: '{isInForm}',
        autosize: true
    }
}, {
    type: 'textarea',
    props: {
        label: 'field',
        field: 'field',
        autosize: 'true',
        visible: '{isInForm}',
        rules: [{ required: true }]
    }
}, {
    type: 'textarea',
    props: {
        label: 'value',
        field: 'value',
        visible: '{!isInForm}',
        autosize: 'true'
    }
}, {
    type: 'textarea',
    props: {
        label: 'onChange',
        field: 'onChange',
        autosize: true
    }
}, {
    type: 'autocomplete',
    props: {
        label: 'visible',
        field: 'visible',
        dataSourceName: 'boolOptions'
    }
}, {
    type: 'autocomplete',
    props: {
        label: 'disabled',
        field: 'disabled',
        dataSourceName: 'boolOptions'
    }
}, {
    type: 'autocomplete',
    props: {
        label: 'label换行',
        visible: '{isInForm}',
        field: 'labelLineBreak',
        dataSource: 'boolOptions'
    }
}];

@component([{
    type: 'form',
    props: {
        name: 'form'
    },
    children: [
        ...inputCommonJson,
        {
            type: 'input',
            props: {
                field: 'data.name',
                label: ''
            }
        }
    ]
}])
class InputSettings {
    data = {};
}

export default InputSettings;