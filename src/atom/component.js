import React, { Component } from "react";
import { observer } from "snowball/app";
import { createAtom } from "./factories";
import { isFunction } from "snowball/utils";

export const JsonComponentContext = React.createContext();

function jsonToElement(json, handler, paths, transitiveProps) {
    const { type, key, children, props, ...extProps } = json;

    return createAtom(type, {
        key,
        props,
        handler,
        paths,
        transitiveProps,
        childrenJson: children,
        children: !children
            ? null
            : isFunction(children)
                ? (props) => {
                    const nextProps = { ...transitiveProps, ...props };
                    return jsonArrayToElements(children(nextProps), handler, [...paths, type], nextProps);
                }
                : jsonArrayToElements(children, handler, [...paths, type], transitiveProps),
        ...extProps
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

        return @observer class extends Component {
            constructor(props) {
                super(props);

                this.handler = new Handler(props);
                this.handler.asModel && this.handler.asModel().on('change', () => {
                    this.forceUpdate();
                });
            }

            componentDidMount() {
                this.handler.onInit && this.handler.onInit(this.props);
            }

            componentDidUpdate(prevProps) {
                this.handler.onUpdated && this.handler.onUpdated(prevProps);
            }

            componentWillUnmount() {
                this.handler.asModel && this.handler.asModel().destroy();
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

class JsonComponent extends Component {
    constructor(props) {
        super(props);

        const didMount = this.componentDidMount;
        this.componentDidMount = () => {
            this.asModel && this.asModel().on('change', () => {
                this.forceUpdate();
            });
            didMount && didMount.call(this);
        };

        const willUnmount = this.componentWillUnmount;
        this.componentWillUnmount = () => {
            this.asModel && this.asModel().destroy();
            willUnmount && willUnmount.call(this);
        };

        const render = this.render;
        this.render = () => {
            const componentJson = render.call(this);
            return (
                <JsonComponentContext.Provider
                    value={{
                        json: componentJson,
                        handler: this
                    }}
                >
                    {renderJson(componentJson, this, ['root'], this.props.transitiveProps)}
                </JsonComponentContext.Provider>
            );
        };
    }
};

export { JsonComponent };