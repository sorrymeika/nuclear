import compileExpression from "./compileExpression";
import { util } from "snowball";

export default function getValue(context, valueExp, properties?) {
    if (valueExp === 'true') return true;
    if (valueExp === 'false') return false;
    if (valueExp === 'null') return null;
    if (valueExp === 'undefined') return undefined;
    if (/^\d+(\.\d+)?$/.test(valueExp)) return Number(valueExp);

    if (!valueExp) return valueExp;

    const methods = context.__nuclear_expressions || (context.__nuclear_expressions = {});

    if (properties) {
        context = Object.assign(Object.create(context), properties);
    }

    context.$ = util.$;
    context.util = util;

    let method = methods[valueExp];

    if (!method) {
        methods[valueExp] = method = new Function("$data", compileExpression(valueExp).code);
    }

    return method(context);
}