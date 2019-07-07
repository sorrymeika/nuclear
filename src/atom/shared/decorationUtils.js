
import { createDecoration } from "../factories";

export function jsonToDecoration(json, handler, paths, transitiveProps) {
    const { type, id, key, children, props } = json;

    const childrenComponents = children
        ? jsonArrayToDecorations(children, handler, [...paths, type], transitiveProps)
        : null;

    return createDecoration(type, {
        id,
        key,
        props,
        paths,
        handler,
        transitiveProps,
        childrenJson: children,
        children: childrenComponents
    });
}

export function jsonArrayToDecorations(jsonArray, handler, paths, transitiveProps) {
    const results = [];
    const length = jsonArray.length;
    let i = -1;

    while (++i < length) {
        results.push(jsonToDecoration({
            ...jsonArray[i],
            key: paths.join('-') + i,
            type: jsonArray[i].type.toLowerCase()
        }, handler, paths, transitiveProps));
    }

    return results;
}

export function renderDecoration(json, handler, paths, transitiveProps) {
    return Array.isArray(json)
        ? jsonArrayToDecorations(json, handler, paths, transitiveProps)
        : jsonToDecoration(json, handler, paths, transitiveProps);
}