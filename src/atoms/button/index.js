import { registerAtom } from "../factories";
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