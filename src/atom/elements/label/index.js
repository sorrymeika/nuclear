import { registerAtom } from "../../factories";
import Label from "./Label";
import LabelSettings from "./LabelSettings";

registerAtom({
    type: 'label',
    name: 'Label',
    group: 'Form',
    atomComponent: Label,
    decorationComponent: Label,
    settingsComponent: LabelSettings,
    propsConfig: {
        field: {
            type: 'string'
        }
    },
    specificConfig: {
        isFormItem: true
    }
});