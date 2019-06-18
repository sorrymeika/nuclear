import { registerRoutes } from "../lib/registerRoutes";
import { isString } from "../../utils";
import Page from "../lib/Page";
import { INJECTABLE_PROPS } from "./injectable";

/**
 * 控制层修饰符
 * @param {*} [route] 路由，非必填，尽量将路由收敛到 routes.js中
 * @param {*} componentClass 页面组件
 */
export default function controller(route, componentClass) {
    if (!isString(route)) {
        componentClass = route;
        route = null;
    }
    return function (Controller) {
        const pageFactory = (location, application) => {
            return new Page(componentClass, location, application, (props, page) => {
                const controller = new Controller(props);

                return (setState) => {
                    const injectableProps = controller[INJECTABLE_PROPS];
                    const store = {};

                    controller.onInit && controller.onInit();
                    controller.onDestroy && page.on('destroy', controller.onDestroy.bind(controller));

                    injectableProps && Object.keys(injectableProps)
                        .forEach((injectorName) => {
                            const propertyName = injectableProps[injectorName];
                            const property = controller[propertyName];

                            store[injectorName] = typeof property === 'function' && property.prototype
                                ? property.bind(controller)
                                : property;

                            let proto = controller;
                            let descriptor;

                            while (1) {
                                descriptor = Object.getOwnPropertyDescriptor(proto, propertyName);
                                if (descriptor) {
                                    break;
                                }

                                const parent = Object.getPrototypeOf(proto);
                                if (parent === proto || parent === Object.prototype) {
                                    break;
                                } else {
                                    proto = parent;
                                }
                            }

                            if (descriptor.writable) {
                                Object.defineProperty(controller, propertyName, {
                                    enumerable: descriptor.enumerable,
                                    configurable: descriptor.configurable,
                                    get() {
                                        return store[injectorName];
                                    },
                                    set(val) {
                                        store[injectorName] = val;
                                        setState(store);
                                    }
                                });
                            } else if (descriptor.set) {
                                Object.defineProperty(controller, propertyName, {
                                    enumerable: descriptor.enumerable,
                                    configurable: descriptor.configurable,
                                    get: descriptor.get,
                                    set(val) {
                                        descriptor.set.call(this);
                                        store[injectorName] = descriptor.get.call(this);
                                        setState(store);
                                    }
                                });
                            }
                        });

                    setState(store);
                };
            });
        };
        pageFactory.__is_page_factory__ = true;

        if (route) {
            registerRoutes({
                [route]: pageFactory
            });
        }

        return pageFactory;
    };
}