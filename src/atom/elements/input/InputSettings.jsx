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
class InputSettings {
    data = {};
}

export default InputSettings;