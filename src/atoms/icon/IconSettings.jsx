import { SettingsBase } from "../../atom-core/SettingsBase";

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