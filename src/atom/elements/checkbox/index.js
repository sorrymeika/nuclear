import { registerAtom } from "../../factories";
import CheckBoxList from "./CheckBoxList";
import SelectSettings from "./CheckBoxListSettings";
import { createDecorationItem } from "../../shared/createDecorationItem";

registerAtom({
    type: 'checkboxlist',
    name: 'CheckBoxList',
    group: 'Form',
    atomComponent: CheckBoxList,
    decorationComponent: createDecorationItem(CheckBoxList),
    settingsComponent: SelectSettings
});