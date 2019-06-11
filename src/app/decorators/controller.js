import { registerRoutes } from "../lib/registerRoutes";

/**
 * 控制层修饰符
 * @param {*} [route] 路由，非必填，尽量将路由收敛到 routes.js中
 * @param {*} componentClass 页面组件
 */
export default function controller(route, componentClass) {
    return function (controllerClass) {
        registerRoutes({
            [route]: controllerClass
        });
        return controllerClass;
    };
}