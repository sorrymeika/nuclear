import './sass/style.scss';

import { createApplication } from 'snowball/app';

import './atoms';

// import * as serviceWorker from './serviceWorker';
import router from './app/router';

createApplication({
    projects: {},
    routes: router
}, document.getElementById('root'), () => {
    console.log('app start!');
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

