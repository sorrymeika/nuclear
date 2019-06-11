import { Factory } from "react";

type PropConfig = {
    type: string,
    useExpression: boolean
}

interface IWeaponRegistry {
    name: string;
    propsConfig: {
        [propName]: PropConfig
    };
    facadeFactory: Factory;
    decoratorFactory: Factory;
    settingsFactory: Factory;
}

const stores = {};

export function registerWeapon(weaponRegistry: IWeaponRegistry) {
    if (stores[weaponRegistry.name]) {
        throw new Error(`${weaponRegistry.name}已被注册！`);
    }
    stores[weaponRegistry.name] = weaponRegistry;
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