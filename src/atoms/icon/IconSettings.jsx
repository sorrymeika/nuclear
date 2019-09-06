import { SettingsBase } from "../SettingsBase";

class IconSettings extends SettingsBase {
    renderJson() {
        return [{
            type: 'input',
            props: {
                field: 'data.text'
            }
        }];
    }
}

export default IconSettings;