import React from "react";
import { registerAtom } from "../registry";
import Input from "./Input";
import InputSettings from "./InputSettings";

const inputFactory = React.createFactory(Input);

registerAtom({
    type: 'input',
    name: 'Input',
    group: 'Form',
    facadeFactory: inputFactory,
    decoratorFactory: inputFactory,
    settingFactory: React.createFactory(InputSettings),
    specificConfig: {
        isFormItem: true
    }
});