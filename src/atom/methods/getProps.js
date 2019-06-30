import getValue from "./getValue";
import { isString } from "snowball/utils";

const defaultConfig = { type: 'any', useExpression: true, isHandlerProp: 'auto' };

export default function getProps(context, propsConfig, props, otherProps) {
    return Object.keys(props)
        .reduce((res, name) => {
            const config = propsConfig[name] || defaultConfig;
            const valueExp = props[name];

            if (!isString(valueExp)) res[name] = valueExp;
            else if (valueExp === 'true') res[name] = true;
            else if (valueExp === 'false') res[name] = false;
            else if (valueExp === 'null') res[name] = null;
            else if (valueExp === 'undefined') res[name] = undefined;
            else if (/^\d+(\.\d+)?$/.test(valueExp)) res[name] = Number(valueExp);
            else if (config.isHandlerProp === true || (config.isHandlerProp !== false && valueExp in context)) {
                res[name] = context[valueExp];
            } else if (config.useExpression) {
                res[name] = getValue(context, valueExp, otherProps);
            } else {
                res[name] = valueExp;
            }
            return res;
        }, {});

}