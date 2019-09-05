import { registerAtom } from "../factories";
import CheckBoxList from "./CheckBoxList";
import CheckBox from "./CheckBox";
import SelectSettings from "./CheckBoxListSettings";
import { createDecorationItem } from "../createDecorationItem";

registerAtom({
    type: 'checkboxlist',
    name: 'CheckBoxList',
    group: 'Form',
    atomComponent: CheckBoxList,
    decorationComponent: createDecorationItem(CheckBoxList),
    settingsComponent: SelectSettings
});

registerAtom({
    type: 'checkbox',
    name: 'CheckBox',
    group: 'Form',
    atomComponent: CheckBox
});