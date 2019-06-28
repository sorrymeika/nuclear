import React from "react";
import { registerAtom } from "../../factories";
import Form from "./Form";
import FormSettings from "./FormSettings";

const formFactory = React.createFactory(Form);

registerAtom({
    type: 'form',
    name: 'Form',
    group: 'Form',
    atomFactory: formFactory,
    decorationFactory: formFactory,
    settingFactory: React.createFactory(FormSettings),
    specificConfig: {
        isFormItem: true
    }
});