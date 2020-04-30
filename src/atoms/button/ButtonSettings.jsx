import { SettingsBase } from "../../atom-core/SettingsBase";

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