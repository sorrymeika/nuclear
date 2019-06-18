import './sass/common.scss';
import * as serviceWorker from './serviceWorker';
import { createApplication } from './app';
import Window from './atom/decorator/Window';

createApplication({
    projects: {},
    routes: {
        '/': Window
    }
}, document.getElementById('root'), () => {
    console.log('app start!');
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
