import { SettingsBase } from "../SettingsBase";

class ButtonSettings extends SettingsBase {
    renderJson() {
        return [{
            type: 'input',
            props: {
                field: 'data.text'
            }
        }];
    }
}

export default ButtonSettings;