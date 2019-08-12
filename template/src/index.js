import { createApplication } from "snowball/app";
import "./sass/style.scss";
import router from "./app/router";

const projects = {
};

createApplication({
    projects,
    routes: router,
    autoStart: true,
    extend() {
        return {};
    },
    options: {
        disableTransition: true
    }
}, document.getElementById('root'), () => {
    console.log('application start!');
});
