import React, { Component } from "react";

export const JsonComponentContext = React.createContext();

/**
 * 控制层修饰符
 * @param {*} componentJson 组件json
 */
export default function component(componentJson) {
    return function (Handler) {
        return class JsonComponent extends Component {
            constructor(props) {
                super(props);

                this.handler = new Handler(props);
            }

            render() {
                return (
                    <JsonComponentContext.Provider
                        value={{
                            json: componentJson,
                            handler: this.handler
                        }}
                    ></JsonComponentContext.Provider>
                );
            }
        };
    };
}