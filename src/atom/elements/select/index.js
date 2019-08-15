import { registerAtom } from "../../factories";
import Select from "./Select";
import SelectSettings from "./SelectSettings";
import { createDecorationItem } from "../../shared/createDecorationItem";

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