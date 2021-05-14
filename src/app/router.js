// import WindowController from './window/controllers/WindowController';
import TestController from './test/controllers/TestController';
import WindowController from './test/controllers/WindowController';

export default {
    '/': WindowController,
    '/test': TestController,
};