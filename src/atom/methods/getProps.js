import getValue from "./getValue";
import { isString } from "snowball/utils";

const defaultConfig = { type: 'any', useExpression: true };

export default function getProps(context, propsConfig, props, otherProps) {

    return Object.keys(props)
        .reduce((res, name) => {
            const config = propsConfig[name] || defaultConfig;
            const valueExp = props[name];

            if (!isString(valueExp)) {
                return valueExp;
            } else if (config.useExpression) {
                res[name] = getValue(context, valueExp, otherProps);
            } else {
                res[name] = context[valueExp];
            }
            return res;
        }, {});

}