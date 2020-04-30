import { registerAtom } from "../../atom-core/factories";
import Button from "./Button";
import ButtonSettings from "./ButtonSettings";

registerAtom({
    type: 'button',
    name: 'Button',
    group: 'Form',
    atomComponent: Button,
    decorationComponent: Button,
    settingsComponent: ButtonSettings
});