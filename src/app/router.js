import WindowController from './window/controllers/WindowController';

export default {
    '/': WindowController,
    '/test': require('../AppTest').default,
};