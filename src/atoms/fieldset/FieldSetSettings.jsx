import { SettingsBase } from "../SettingsBase";

class FieldSetSettings extends SettingsBase {
    renderJson() {
        return [{
            type: 'input',
            props: {
                field: 'data.name'
            }
        }];
    }
}

export default FieldSetSettings;