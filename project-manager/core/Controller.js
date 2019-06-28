const controllers = {};

export const handleRequest = (controllerName, methodName, request, response) => {
    controllerName = controllerName.toLowerCase();
    const ControllerClass = controllers[controllerName];
    let instance = ControllerClass['[[Instance]]'];
    if (!instance) {
        instance = new ControllerClass();
        Object.defineProperty(ControllerClass, '[[Instance]]', {
            writable: false,
            configurable: false,
            enumerable: false,
            value: instance
        });
    }
    const methodsMap = instance['[[Methods]]'];
    const controllerMethodName = methodsMap[methodName.toLowerCase()];

    return instance[controllerMethodName](request, response);
};

const registerController = (controllerClass, controllerName) => {
    controllerName = controllerName.toLowerCase();
    if (controllers[controllerName])
        throw new Error('不可重复注册' + controllerName + '!');
};

export const Controller = (controllerName) => {
    if (typeof controllerName === 'function') {
        registerController(controllerName, controllerName.name.replace(/Controller$/i, ''));
    }
    return (controllerClass) => registerController(controllerClass, controllerName);
};

const registerRequest = (controllerProto, name, descriptor, route) => {
    let methods = controllerProto['[[Methods]]'];
    if (!methods) {
        methods = {};
        Object.defineProperty(controllerProto, '[[Methods]]', {
            writable: false,
            configurable: false,
            enumerable: false,
            value: methods
        });
    }
    methods[route.toLowerCase()] = name;
    return descriptor;
};

export const Request = (controllerProto, name, descriptor) => {
    if (typeof controllerProto === 'string') {
        const route = controllerProto;
        return (controllerProto, name, descriptor) => {
            return registerRequest(controllerProto, name, descriptor, route);
        };
    }
    return registerRequest(controllerProto, name, descriptor, name);
};