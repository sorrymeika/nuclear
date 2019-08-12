import { util } from "snowball";
import { isString } from "snowball/utils";

import compileExpression from "./compileExpression";

function getValue(context, valueExp, properties?) {
    if (valueExp === 'true') return true;
    if (valueExp === 'false') return false;
    if (valueExp === 'null') return null;
    if (valueExp === 'undefined') return undefined;
    if (/^\d+(\.\d+)?$/.test(valueExp)) return Number(valueExp);

    if (!valueExp) return valueExp;

    const methods = context.__nuclear_expressions || (context.__nuclear_expressions = {});
    const data = properties ? Object.assign(Object.create(context), properties) : context;

    data.$ = util.$;
    data.util = util;

    let method = methods[valueExp];

    if (!method) {
        methods[valueExp] = method = new Function("$data", compileExpression(valueExp).code);
    }

    return method.call(context, data);
}

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