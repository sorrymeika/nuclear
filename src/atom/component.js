import React, { Component } from "react";
import { observer } from "snowball/app";
import { createAtom } from "./factories";

export const JsonComponentContext = React.createContext();

function jsonToElement(json, handler, paths, transitiveProps) {
    const { type, key, children, props } = json;

    const childrenComponents = children
        ? jsonArrayToElements(children, handler, [...paths, type], transitiveProps)
        : null;

    return createAtom(type, {
        key,
        props,
        handler,
        transitiveProps,
        childrenJson: children,
        children: childrenComponents
    });
}

function jsonArrayToElements(jsonArray, handler, paths, transitiveProps) {
    const results = [];
    const length = jsonArray.length;
    let i = -1;

    while (++i < length) {
        results.push(jsonToElement({
            ...jsonArray[i],
            key: paths.join('-') + i,
            type: jsonArray[i].type.toLowerCase()
        }, handler, paths, transitiveProps));
    }

    return results;
}

export function renderJson(json, handler, paths, transitiveProps) {
    return Array.isArray(json)
        ? jsonArrayToElements(json, handler, paths, transitiveProps)
        : jsonToElement(json, handler, paths, transitiveProps);
}

/**
 * 控制层修饰符
 * @param {*} componentJson 组件json
 */
export default function component(componentJson) {
    return function (Handler) {
        const _jsonToComponent = Array.isArray(componentJson)
            ? jsonArrayToElements
            : jsonToElement;

        return @observer class JsonComponent extends Component {
            constructor(props) {
                super(props);

                this.handler = new Handler(props);
            }

            componentDidMount() {
                this.handler.onInit && this.handler.onInit(this.props);
            }

            componentDidUpdate(prevProps) {
                this.handler.onUpdated && this.handler.onUpdated(prevProps);
            }

            componentWillUnmount() {
                this.handler.onDestroy && this.handler.onDestroy();
            }

            render() {
                this.handler.props = this.props;

                return (
                    <JsonComponentContext.Provider
                        value={{
                            json: componentJson,
                            handler: this.handler
                        }}
                    >
                        {_jsonToComponent(componentJson, this.handler, ['root'], this.props.transitiveProps)}
                    </JsonComponentContext.Provider>
                );
            }
        };
    };
}