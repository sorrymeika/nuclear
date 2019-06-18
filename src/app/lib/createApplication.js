

import PageManager from './PageManager';
import Router from './Router';
import Navigation from './Navigation';
import Application from './Application';

// 当前启动的应用的实例
let application;
let actionsBeforeAppStart = [];

export function internal_getApplication() {
    return application;
}

export function internal_beforeStartApplication(fn) {
    actionsBeforeAppStart.push(fn);
}

/**
 * 创建应用
 * @param {Array} projects
 * @param {Array} routes
 * @param {Element} root
 */
export function createApplication({
    projects,
    routes,
    stores,
    options,
    autoStart = true
}, root, callback?) {
    if (application) throw new Error('application has already created!');

    application = new Application(
        (application) => new Navigation(application),
        (application) => new PageManager(application, options),
        new Router(projects, routes),
        root,
        options
    );
    actionsBeforeAppStart.forEach((action) => {
        action(application);
    });
    actionsBeforeAppStart = null;

    if (autoStart) {
        application.start(callback);
    }

    return application;
}