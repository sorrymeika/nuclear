import React, { Factory, Component } from "react";
import getProps from "../shared/getProps";
import { computeIsInForm } from "../shared/atomUtils";

type PropConfig = {
    type: string,
    useExpression: boolean
}

interface IAtomRegistry {
    type: string;
    name: string;
    group: string;
    propsConfig?: {
        [propName]: PropConfig
    };
    atomComponent: Factory | Component;
    decorationComponent: Factory | Component;
    settingsComponent: Factory | Component;
    specificConfig: any;
}

const stores = {};

export function registerAtom(type: IAtomRegistry) {
    if (typeof type === 'string') {
        type = {
            type,
            atomComponent: arguments[1]
        };
    }
    const atomType = type.type.toLowerCase();
    if (stores[atomType]) {
        throw new Error(`${atomType}已被注册！`);
    }
    stores[atomType] = type;
}

export function createAtom(type, { key, handler, paths, transitiveProps, children, childrenJson, props, ...extProps }) {
    if (!stores[type]) {
        console.error(`请先注册${type}！`);
        return React.createElement(type, {
            key
        });
    }
    const { atomComponent, propsConfig = {} } = stores[type];
    const { visible = true, ...newProps } = props ? getProps(handler, propsConfig, props, transitiveProps) : {};

    if (!visible) {
        return null;
    }

    return React.createElement(atomComponent, {
        key,
        context: {
            handlerName: handler.constructor.name,
            type,
            props,
            handler,
            paths,
            isInForm: computeIsInForm(paths),
            propsConfig,
            transitiveProps,
            childrenJson,
            ...extProps
        },
        ...newProps,
        children
    });
}

export function createDecoration(type, { id, key, handler, paths, transitiveProps, children, childrenJson, props, ...extProps }) {
    if (!stores[type]) {
        console.error(`请先注册${type}！`);
        return React.createElement(type, {
            key
        });
    }
    const { decorationComponent, propsConfig = {} } = stores[type];

    const { visible = true, ...newProps } = props
        ? getProps(handler, propsConfig, props, transitiveProps)
        : {};

    return React.createElement(decorationComponent, {
        key,
        context: {
            id,
            type,
            props,
            visible,
            handler,
            paths,
            isInForm: computeIsInForm(paths),
            propsConfig,
            transitiveProps,
            childrenJson,
            ...extProps
        },
        ...newProps,
        children
    });
}

export function createSettings(type, props) {
    return React.createElement(stores[type].settingsComponent, props);
}

export function _getChildren(json) {
    const getChildren = stores[json.type].getChildren || ((json) => json.children);
    return getChildren(json);
}

export function _getAtomsForDecoration() {
    return Object.keys(stores)
        .reduce((res, key) => {
            const atom = stores[key];
            if (atom.settingsComponent) {
                res.push({
                    type: atom.type,
                    name: atom.name,
                    group: atom.group
                });
            }
            return res;
        }, []);
}
