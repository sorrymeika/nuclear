import { registerAtom } from "../../atom-core/factories";
import CheckBoxList from "./CheckBoxList";
import CheckBox from "./CheckBox";
import SelectSettings from "./CheckBoxListSettings";
import { createDecorationItem } from "../../atom-core/createDecorationItem";

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