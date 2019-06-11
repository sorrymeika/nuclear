import { qs } from "../../utils";
import { loadProject } from "./resource";
import { IRouter } from "../types";

class Route {
    constructor(name, componentFactory) {
        this.name = name;
        this.componentFactory = componentFactory;

        const paths = name.split('/').map((item) => {
            return !item
                ? ''
                : item.replace(/^(.*):([\w_]+)/, (match, regex, id, end) => {
                    (this.map || (this.map = [])).push(id);
                    return '(' + (regex || '[^\\/]+') + ')';
                });
        });
        this.regex = new RegExp("^" + paths.join('\\/') + "$");
    }

    match(path, search) {
        var match = path.match(this.regex);
        if (match) {
            const location = {
                match: this.regex,
                url: path + search,
                path: path,
                search: search,
                query: qs(search),
                params: {}
            };

            let i = 1;
            const len = match.length;
            if (this.map) {
                for (; i < len; i++) {
                    location.params[this.map[i - 1]] = match[i];
                }
            } else {
                for (; i < len; i++) {
                    location.params[i - 1] = match[i];
                }
            }

            return {
                route: this,
                location
            };
        }
        return null;
    }
}

class Project {
    state = 0;
    url;
    path;

    constructor(path, url) {
        this.path = new RegExp(path);
        this.url = url;
    }

    async loadResources() {
        var projectUrl = this.url;

        await loadProject(projectUrl);

        this.state = 1;
        this.promise = null;
    }

    async load(path) {
        if (this.path.test(path)) {
            if (this.state === 1) {
                return true;
            }
            return await (this.promise || (this.promise = this.loadResources()));
        }
        return false;
    }
}

export default class Router implements IRouter {
    routes = [];
    projects = [];

    constructor(projects, routes) {
        this.registerProjects(projects);
        this.registerrouters(routes);
    }

    registerRoutes(routes) {
        Object.keys(routes).forEach((name) => {
            this.routes.push(new Route(name, routes[name]));
        });
    }

    registerProjects(projects) {
        Object.keys(projects).forEach((path) => {
            this.projects.push(new Project(path, projects[path]));
        });
    }

    async loadProject(path) {
        for (var i = 0; i < this.projects.length; i++) {
            var project = this.projects[i];
            if (await project.load(path)) {
                return;
            }
        }
    }

    async match(url) {
        var routes = this.routes;
        var match;
        var searchMatch = /\?|!|&/.exec(url);
        var searchIndex = searchMatch ? searchMatch.index : -1;
        var path = (searchIndex === -1 ? url : url.substr(0, searchIndex)).replace(/^#/, '') || '/';
        var search = searchIndex === -1 ? '' : ('?' + url.substr(searchIndex + 1));

        await this.loadProject(path);

        for (var i = 0, len = routes.length; i < len; i++) {
            match = routes[i].match(path, search);
            if (match) {
                return match;
            }
        }
        return null;
    }
}