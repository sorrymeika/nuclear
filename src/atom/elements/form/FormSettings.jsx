import component from "../../component";

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
    data = {};
}

export default FormSettings;