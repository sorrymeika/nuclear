import React from "react";
import { registerAtom } from "../registry";
import Form from "./Form";
import FormSettings from "./FormSettings";

const formFactory = React.createFactory(Form);

registerAtom({
    type: 'input',
    name: 'Input',
    group: 'Form',
    atomFactory: formFactory,
    decorationFactory: formFactory,
    settingFactory: React.createFactory(FormSettings),
    specificConfig: {
        isFormItem: true
    }
});