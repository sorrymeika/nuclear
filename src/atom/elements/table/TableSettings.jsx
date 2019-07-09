import component from "../../component";
import { observable } from "snowball";

@component([{
    type: 'form',
    props: {
        name: 'form'
    },
    children: [
        {
            type: 'div',
            props: {
                visible: '{isInForm}',
            }
        }
    ]
}])
class TableSettings {
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

export default TableSettings;