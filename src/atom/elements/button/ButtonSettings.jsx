import { observable } from "snowball";
import component from "../../component";

@component([{
    type: 'form',
    props: {
        name: 'form'
    },
    children: [{
        type: 'input',
        props: {
            field: 'data.text'
        }
    }]
}])
class ButtonSettings {
    @observable data = {};

    constructor(props) {
        this.data = props.defaultData || {};
    }

    onInit() {
        this.asModel().observe('data', (data) => {
            this.props.onChange && this.props.onChange(data);
        });
        this.props.formRef.current = this.form;
    }
}

export default ButtonSettings;