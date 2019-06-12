import { Factory } from "react";

type PropConfig = {
    type: string,
    useExpression: boolean
}

interface IAtomRegistry {
    type: string;
    name: string;
    group: string;
    propsConfig: {
        [propName]: PropConfig
    };
    facadeFactory: Factory;
    decoratorFactory: Factory;
    settingsFactory: Factory;
}

const stores = {};

export function registerAtom(atomRegistry: IAtomRegistry) {
    if (stores[atomRegistry.type]) {
        throw new Error(`${atomRegistry.type}已被注册！`);
    }
    stores[atomRegistry.type] = atomRegistry;
}

export function createFacade(type, props) {
    const { facadeFactory, propsConfig } = stores[type];
    return facadeFactory({
        propsConfig,
        ...props
    });
}

export function createDecorator(type, props) {
    return stores[type].decoratorFactory(props);
}

export function createSettings(type, props) {
    return stores[type].settingFactory(props);
}