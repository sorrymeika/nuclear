import { registerAtom } from "../../factories";
import Form from "./Form";
import FormSettings from "./FormSettings";

registerAtom({
    type: 'form',
    name: 'Form',
    group: 'Form',
    atomComponent: Form,
    decorationComponent: Form,
    settingsComponent: FormSettings,
    specificConfig: {
        isFormItem: true
    }
});