import { inputCommonJson } from "../input";
import { SettingsBase } from "../../atom-core/SettingsBase";

class TextAreaSettings extends SettingsBase {
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

export default TextAreaSettings;