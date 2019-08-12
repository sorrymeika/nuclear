import './sass/style.scss';

import * as serviceWorker from './serviceWorker';
import { createApplication } from 'snowball/app';
import './atom';
import WindowController from './atom/window/ui/WindowController';
import AppTest from './AppTest';

createApplication({
    projects: {},
    routes: {
        '/': WindowController,
        '/test': AppTest
    }
}, document.getElementById('root'), () => {
    console.log('app start!');
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

