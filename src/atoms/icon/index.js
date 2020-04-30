import { registerAtom } from "../../atom-core/factories";
import Icon from "./Icon";
import IconSettings from "./IconSettings";

registerAtom({
    type: 'icon',
    name: 'Icon',
    group: 'Form',
    atomComponent: Icon,
    decorationComponent: Icon,
    settingsComponent: IconSettings
});