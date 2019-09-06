import { inputCommonJson } from "../input";
import { SettingsBase } from "../SettingsBase";

class AutoCompleteSettings extends SettingsBase {
    renderJson() {
        return [
            ...inputCommonJson,
            {
                type: 'textarea',
                props: {
                    label: '数据源',
                    field: 'data.dataSource',
                    autosize: true
                }
            }, {
                type: 'div',
                props: {
                    visible: '{isInForm}',
                }
            }
        ];
    }
}

export default AutoCompleteSettings;