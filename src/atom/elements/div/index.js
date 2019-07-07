import { registerAtom } from "../../factories";
import Div from "./Div";
import DivSettings from "./DivSettings";

registerAtom({
    type: 'div',
    name: 'Div',
    group: 'Layout',
    atomComponent: Div,
    decorationComponent: Div,
    settingsComponent: DivSettings,
    propsConfig: {}
});