import { SettingsBase } from "../../atom-core/SettingsBase";

class LabelSettings extends SettingsBase {
    renderJson() {
        return [{
            type: 'input',
            props: {
                field: 'data.text'
            }
        }];
    }
}

export default LabelSettings;