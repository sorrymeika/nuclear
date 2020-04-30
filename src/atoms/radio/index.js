import { registerAtom } from "../../atom-core/factories";
import RadioList from "./RadioList";
import RadioListSettings from "./RadioListSettings";
import { createDecorationItem } from "../../atom-core/createDecorationItem";

registerAtom({
    type: 'radiolist',
    name: 'RadioList',
    group: 'Form',
    atomComponent: RadioList,
    decorationComponent: createDecorationItem(RadioList),
    settingsComponent: RadioListSettings
});