import { inputCommonJson } from "../input";
import { SettingsBase } from "../../atom-core/SettingsBase";

class InputNumberSettings extends SettingsBase {
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

export default InputNumberSettings;