import { registerAtom } from "../../atom-core/factories";
import Input from "./Input";
import InputSettings from "./InputSettings";
import InputDecoration from "./InputDecoration";

registerAtom({
    type: 'input',
    name: 'Input',
    group: 'Form',
    atomComponent: Input,
    decorationComponent: InputDecoration,
    settingsComponent: InputSettings,
    propsConfig: {
        field: {
            type: 'string'
        }
    },
    specificConfig: {
        isFormItem: true
    }
});

export { inputCommonJson } from "./InputSettings";