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
    propsConfig: {
        name: {
            type: 'string',
            isHandlerProp: false,
            useExpression: false
        }
    },
    specificConfig: {
        isFormItem: true
    }
});