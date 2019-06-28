import React, { Component } from "react";
import { observer } from "snowball/app";
import { createAtom } from "./factories";

export const JsonComponentContext = React.createContext();

function jsonToComponent(json, handler, paths, transitiveProps) {
    const { type, key, children, props } = json;

    const childrenComponents = children
        ? jsonArrayToComponents(children, handler, [...paths, type], transitiveProps)
        : null;

    return createAtom(type, {
        key,
        props,
        handler,
        transitiveProps,
        children: childrenComponents
    });
}

function jsonArrayToComponents(jsonArray, handler, paths, transitiveProps) {
    const results = [];
    const length = jsonArray.length;
    let i = -1;

    while (++i < length) {
        results.push(jsonToComponent({
            ...jsonArray[i],
            key: paths.join('-') + i,
            type: jsonArray[i].type.toLowerCase()
        }, handler, paths, transitiveProps));
    }

    return results;
}

export function renderComponent(json, handler, paths, transitiveProps) {
    return Array.isArray(json)
        ? jsonArrayToComponents(json, handler, paths, transitiveProps)
        : jsonToComponent(json, handler, paths, transitiveProps);
}

/**
 * 控制层修饰符
 * @param {*} componentJson 组件json
 */
export default function component(componentJson) {
    return function (Handler) {
        const _jsonToComponent = Array.isArray(componentJson)
            ? jsonArrayToComponents
            : jsonToComponent;

        return @observer class JsonComponent extends Component {
            constructor(props) {
                super(props);

                this.handler = new Handler(props);
            }

            componentDidMount() {
                this.handler.initialize && this.handler.initialize(this.props);
            }

            componentDidUpdate(prevProps) {
                this.handler.updated && this.handler.updated(prevProps);
            }

            componentWillUnmount() {
                this.handler.destroy && this.handler.destroy();
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