import { Factory } from "react";

type PropConfig = {
    type: string,
    useExpression: boolean
}

interface IAtomRegistry {
    name: string;
    propsConfig: {
        [propName]: PropConfig
    };
    facadeFactory: Factory;
    decoratorFactory: Factory;
    settingsFactory: Factory;
}

const stores = {};

export function registerAtom(atomRegistry: IAtomRegistry) {
    if (stores[atomRegistry.name]) {
        throw new Error(`${atomRegistry.name}已被注册！`);
    }
    stores[atomRegistry.name] = atomRegistry;
}

export function createFacade(name, props) {
    const { facadeFactory, propsConfig } = stores[name];
    return facadeFactory({
        propsConfig,
        ...props
    });
}

export function createDecorator(name, props) {
    return stores[name].decoratorFactory(props);
}

export function createSettings(name, props) {
    return stores[name].settingFactory(props);
}