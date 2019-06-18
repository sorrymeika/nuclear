import { Factory } from "react";

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
    atomFactory: Factory;
    decorationFactory: Factory;
    settingsFactory: Factory;
    specificConfig: any;
}

const stores = {};

export function registerAtom(atomRegistry: IAtomRegistry) {
    if (stores[atomRegistry.type]) {
        throw new Error(`${atomRegistry.type}已被注册！`);
    }
    stores[atomRegistry.type] = atomRegistry;
}

export function createAtom(type, props) {
    const { atomFactory, propsConfig = {} } = stores[type];
    return atomFactory({
        propsConfig,
        ...props
    });
}

export function createDecoration(type, props) {
    return stores[type].decorationFactory(props);
}

export function createSettings(type, props) {
    return stores[type].settingFactory(props);
}