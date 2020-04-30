import { inputCommonJson } from "../input";
import { SettingsBase } from "../../atom-core/SettingsBase";

class RadioListSettings extends SettingsBase {
    renderJson() {
        return [
            ...inputCommonJson,
            {
                type: 'textarea',
                props: {
                    label: '数据源',
                    field: 'data.dataSource',
                    autosize: true,
                    rules: [{ required: true }]
                }
            },
            {
                type: 'div',
                props: {
                    visible: '{isInForm}',
                }
            }
        ];
    }
}

export default RadioListSettings;