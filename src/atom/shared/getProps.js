import getValue from "./getValue";
import { isString } from "snowball/utils";

export default function getProps(handler, propsConfig, props, otherProps) {
    return Object.keys(props)
        .reduce((res, name) => {
            const valueExp = props[name];

            if (!isString(valueExp)) res[name] = valueExp;
            else if (valueExp === 'true') res[name] = true;
            else if (valueExp === 'false') res[name] = false;
            else if (valueExp === 'null') res[name] = null;
            else if (valueExp === 'undefined') res[name] = undefined;
            else if (/^\d+(\.\d+)?$/.test(valueExp)) res[name] = Number(valueExp);
            else if (/\{[\s\S]+\}/img.test(valueExp)) {
                res[name] = getValue(handler, valueExp, otherProps);
            } else {
                res[name] = valueExp;
            }
            if (typeof res[name] === 'function') {
                res[name] = res[name].bind(handler);
            }
            return res;
        }, {});

}