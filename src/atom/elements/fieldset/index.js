import { registerAtom } from "../../factories";
import FieldSet from "./FieldSet";
import FieldSetSettings from "./FieldSetSettings";

registerAtom({
    type: 'fieldset',
    name: 'FieldSet',
    group: 'Layout',
    atomComponent: FieldSet,
    decorationComponent: FieldSet,
    settingsComponent: FieldSetSettings,
    propsConfig: {
        title: {
            type: 'string'
        }
    }
});