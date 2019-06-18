import component from "../../component";
import { observable } from "mobx";

@component([{
    type: 'form',
    configuredProps: {
        name: 'settingsForm'
    },
    children: [{
        type: 'input',
        configuredProps: {
            field: 'data.name'
        }
    }]
}])
class FormSettings {
    @observable
    data = {};
}

export default FormSettings;