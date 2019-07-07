import component from "../../component";
import { observable } from "snowball";

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

@component([{
    type: 'form',
    props: {
        name: 'form'
    },
    children: [
        ...inputCommonJson,
        {
            type: 'div',
            props: {
                visible: '{isInForm}',
            }
        }
    ]
}])
class InputSettings {
    @observable isInForm = false;
    @observable data = {};

    constructor(props) {
        this.isInForm = props.isInForm;
        this.data = props.defaultData || {};
    }

    onInit() {
        this.asModel().observe('data', (data) => {
            this.props.onChange && this.props.onChange(data);
        });
        this.props.formRef.current = this.form;
    }

    onDestroy() {
        this.asModel().destroy();
    }
}

export default InputSettings;