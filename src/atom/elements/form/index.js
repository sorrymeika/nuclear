import { registerAtom } from "../../factories";
import Form from "./Form";
import FormSettings from "./FormSettings";
import FormDecoration from "./FormDecoration";

registerAtom({
    type: 'form',
    name: 'Form',
    group: 'Form',
    atomComponent: Form,
    decorationComponent: FormDecoration,
    settingsComponent: FormSettings,
    propsConfig: {
        name: {
            type: 'string',
            useExpression: false
        }
    },
    specificConfig: {
        isFormItem: true
    }
});