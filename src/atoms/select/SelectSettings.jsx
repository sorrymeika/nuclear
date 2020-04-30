import { inputCommonJson } from "../input";
import { SettingsBase } from "../../atom-core/SettingsBase";

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