import { inputCommonJson } from "../input";
import { SettingsBase } from "../SettingsBase";

class SelectSettings extends SettingsBase {
    renderJson() {
        return [
            ...inputCommonJson,
            {
                type: 'div',
                props: {
                    visible: '{isInForm}',
                }
            }
        ];
    }
}

export default SelectSettings;