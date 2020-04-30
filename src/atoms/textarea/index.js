import { registerAtom } from "../../atom-core/factories";
import TextArea from "./TextArea";
import TextAreaSettings from "./TextAreaSettings";

registerAtom({
    type: 'textarea',
    name: 'TextArea',
    group: 'Form',
    atomComponent: TextArea,
    decorationComponent: TextArea,
    settingsComponent: TextAreaSettings
});