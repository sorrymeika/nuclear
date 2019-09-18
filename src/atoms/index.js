import './autocomplete';
import './button';
import './radio';
import './checkbox';
import './div';
import './form';
import './input';
import './number';
import './label';
import './textarea';
import './select';
import './fieldset';
import './table';
import './list';
import './icon';

import wrapFormItem from './wrapFormItem';
import { registerAtom } from './factories';
import { FormContext } from "./form/Form";

export { default as component, JsonComponent } from './component';

export const Atom = {
    registerAtom,
    wrapFormItem,
    FormContext
};
