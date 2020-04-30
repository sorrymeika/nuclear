import { registerAtom } from "../../atom-core/factories";
import Select from "./Select";
import SelectSettings from "./SelectSettings";
import { createDecorationItem } from "../../atom-core/createDecorationItem";

registerAtom({
    type: 'select',
    name: 'Select',
    group: 'Form',
    atomComponent: Select,
    decorationComponent: createDecorationItem(Select),
    settingsComponent: SelectSettings,
    propsConfig: {
        field: {
            type: 'string'
        }
    },
    specificConfig: {
        isFormItem: true
    }
});