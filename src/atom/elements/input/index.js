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
    specificConfig: {
        isFormItem: true
    }
});