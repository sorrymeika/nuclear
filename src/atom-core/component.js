import React, { Component } from "react";
import { isFunction } from "snowball/utils";
import { observer } from "snowball/app";
import { createAtom } from "./factories";
import { isObservableObject, asObservable } from "snowball";

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
                if (isObservableObject(this.handler)) {
                    asObservable(this.handler)
                        .on('change', () => {
                            this.forceUpdate();
                        });
                }
            }

            componentDidMount() {
                this.handler.onInit && this.handler.onInit(this.props);
            }

            componentDidUpdate(prevProps) {
                this.handler.onUpdated && this.handler.onUpdated(prevProps);
            }

            componentWillUnmount() {
                if (isObservableObject(this.handler)) {
                    asObservable(this.handler).destroy();
                }
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
            isObservableObject(this) && asObservable(this).on('change', () => {
                this.forceUpdate();
            });
            didMount && didMount.call(this);
        };

        const willUnmount = this.componentWillUnmount;
        this.componentWillUnmount = () => {
            isObservableObject(this) && asObservable(this).destroy();
            willUnmount && willUnmount.call(this);
        };

        if (this.render) {
            throw new Error('JsonComponent 必须使用 `renderJson` 替换 `render` 方法!');
        }

        Object.defineProperty(this, 'render', {
            writable: false,
            value: () => {
                const componentJson = this.renderJson();
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
            }
        });
    }
};

export { JsonComponent };