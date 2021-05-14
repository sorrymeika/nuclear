import { observable } from "snowball";
import { controller, configuration, autowired } from "snowball/app";

import "../sass/window.scss";
import Window from "../containers/Window";

import PageService from "../../window/services/PageService";

const windowConfig = configuration({
    modules: {
        pageService: PageService
    }
});

@controller({
    component: Window,
    configuration: windowConfig
})
export default class WindowController {
    @observable
    components = [{
        name: '表单',
        items: [{
            type: 'TextBox',
            name: 'TextBox'
        }]
    }, {
        name: '布局',
        items: []
    }, {
        name: '列表',
        items: []
    }];

    @autowired
    _pageService: PageService;

    onInit() {
    }
}