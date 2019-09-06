import { SettingsBase } from "../SettingsBase";

class DivSettings extends SettingsBase {
    renderJson() {
        return [{
            type: 'input',
            props: {
                field: 'data.name'
            }
        }];
    }
}

export default DivSettings;