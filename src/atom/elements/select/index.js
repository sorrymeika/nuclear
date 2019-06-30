import { registerAtom } from "../../factories";
import Select from "./Select";
import SelectSettings from "./SelectSettings";

registerAtom({
    type: 'select',
    name: 'Select',
    group: 'Form',
    atomComponent: Select,
    decorationComponent: Select,
    settingsComponent: SelectSettings,
    specificConfig: {
        isFormItem: true
    }
});