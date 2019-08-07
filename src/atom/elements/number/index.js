import { registerAtom } from "../../factories";
import InputNumber from "./InputNumber";
import InputNumberSettings from "./InputNumberSettings";

registerAtom({
    type: 'number',
    name: 'Number',
    group: 'Form',
    atomComponent: InputNumber,
    decorationComponent: InputNumber,
    settingsComponent: InputNumberSettings,
    propsConfig: {
        field: {
            type: 'string'
        }
    },
    specificConfig: {
        isFormItem: true
    }
});