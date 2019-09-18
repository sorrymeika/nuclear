import { registerAtom } from "../factories";
import RadioList from "./RadioList";
import RadioListSettings from "./RadioListSettings";
import { createDecorationItem } from "../createDecorationItem";

registerAtom({
    type: 'radiolist',
    name: 'RadioList',
    group: 'Form',
    atomComponent: RadioList,
    decorationComponent: createDecorationItem(RadioList),
    settingsComponent: RadioListSettings
});