import { observable, asObservable } from "snowball";
import component from "../component";
import { inputCommonJson } from "../input";

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
class ImageUploadSettings {
    @observable isInForm = false;
    @observable data = {};

    constructor(props) {
        this.isInForm = props.isInForm;
        this.data = props.defaultData || {};
    }

    onInit() {
        asObservable(this).observe('data', (data) => {
            this.props.onChange && this.props.onChange(data);
        });
        this.props.formRef.current = this.form;
    }

    onDestroy() {
        asObservable(this).destroy();
    }
}

export default ImageUploadSettings;