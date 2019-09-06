import { SettingsBase } from "../SettingsBase";

class FormSettings extends SettingsBase {
    renderJson() {
        return [{
            type: 'input',
            props: {
                field: 'data.name'
            }
        }];
    }
}

export default FormSettings;