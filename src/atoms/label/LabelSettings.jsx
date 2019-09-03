import component from "../component";

@component([{
    type: 'form',
    props: {
        name: 'settingsForm'
    },
    children: [{
        type: 'input',
        props: {
            field: 'data.name'
        }
    }]
}])
class InputSettings {
    data = {};
}

export default InputSettings;