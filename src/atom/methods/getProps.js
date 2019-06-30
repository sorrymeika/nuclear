import getValue from "./getValue";
import { isString } from "snowball/utils";

const defaultConfig = { type: 'any', useExpression: true, isPropName: false };

export default function getProps(context, propsConfig, props, otherProps) {
    return Object.keys(props)
        .reduce((res, name) => {
            const config = propsConfig[name] || defaultConfig;
            const valueExp = props[name];

            if (!isString(valueExp)) {
                res[name] = valueExp;
            } else if (valueExp in context || config.isPropName) {
                res[name] = context[valueExp];
            } else if (otherProps && valueExp in otherProps) {
                res[name] = otherProps[valueExp];
            } else if (config.useExpression) {
                res[name] = getValue(context, valueExp, otherProps);
            } else {
                res[name] = valueExp;
            }
            return res;
        }, {});

}