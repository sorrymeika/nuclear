import { registerAtom } from "../../factories";
import Input from "./Input";
import InputSettings from "./InputSettings";

registerAtom({
    type: 'input',
    name: 'Input',
    group: 'Form',
    atomComponent: Input,
    decorationComponent: Input,
    settingsComponent: InputSettings,
    propsConfig: {
        field: {
            type: 'string',
            isHandlerProp: false
        }
    },
    specificConfig: {
        isFormItem: true
    }
});