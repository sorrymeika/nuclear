import React, { Factory, Component } from "react";
import getProps from "./methods/getProps";

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

export function registerAtom(atomRegistry: IAtomRegistry) {
    if (stores[atomRegistry.type]) {
        throw new Error(`${atomRegistry.type}已被注册！`);
    }
    stores[atomRegistry.type] = atomRegistry;
}

export function createAtom(type, { key, handler, transitiveProps, children, childrenJson, props }) {
    if (!stores[type]) {
        console.error(`请先注册${type}！`);
        return React.createElement(type, {
            key
        });
    }
    const { atomComponent, propsConfig = {} } = stores[type];
    const { visible = true, ...newProps } = getProps(handler, propsConfig, props, transitiveProps);

    if (!visible) {
        return null;
    }

    return React.createElement(atomComponent, {
        key,
        context: {
            handler,
            propsConfig,
            transitiveProps,
            childrenJson
        },
        ...newProps,
        children
    });
}

export function createDecoration(type, props) {
    return React.createElement(stores[type].decorationComponent, props);
}

export function createSettings(type, props) {
    return stores[type].settingsComponent(props);
}

export function _getSpecificConfig(type) {
    return stores[type].specificConfig;
}

export function _getAtoms() {
    return Object.keys(stores)
        .map((key) => {
            const atom = stores[key];
            return {
                type: atom.type,
                name: atom.name,
                group: atom.group
            };
        });
}