import { SettingsBase } from "../../atom-core/SettingsBase";

class FormSettings extends SettingsBase {
    renderJson() {
        return [{
            type: 'input',
            props: {
                label: '表单名称',
                field: 'data.name'
            }
        }];
    }
}

export default FormSettings;