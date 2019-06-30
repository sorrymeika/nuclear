import { registerAtom } from "../../factories";
import AutoComplete from "./AutoComplete";
import AutoCompleteSettings from "./AutoCompleteSettings";

registerAtom({
    type: 'autocomplete',
    name: 'AutoComplete',
    group: 'Form',
    atomComponent: AutoComplete,
    decorationComponent: AutoComplete,
    settingsComponent: AutoCompleteSettings,
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