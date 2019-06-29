import { Controller, Request } from "../core/Controller";
import projects from '../json/projects.json';

const path = require('path');
const fs = require('fs');

@Controller
class PageController {
    @Request
    getProjects(request, response) {
        response.json(projects);
    }

    @Request
    async getPages(request, response) {
        const { projectName } = request.query;
        const pages = await this._getPagesByProjectName(projectName);

        response.json({
            projectName,
            pages
        });
    }

    @Request
    async getPage(request, response) {
        const { projectName, pageName } = request.query;
        const pages = await this._getPagesByProjectName(projectName);
        let page = pages.find((pg) => pg.name == pageName);

        response.json({
            projectName,
            page
        });
    }

    async _getPagesByProjectName(projectName) {
        const project = projects.find((proj) => proj.name === projectName);
        const projectPath = path.join(process.cwd(), project.path);

        const genDir = path.join(projectPath, 'src/gen');
        const genIndexPath = path.join(projectPath, 'src/gen/index.js');

        await this._checkGenDir(genDir);
        return await this._getPages(genIndexPath);
    }

    _checkGenDir(genDir) {
        return new Promise((resolve, reject) => {
            fs.exists(genDir, (exists) => {
                if (exists) {
                    resolve();
                } else {
                    fs.mkdir(genDir, resolve);
                }
            });
        });
    }

    _getPages(genIndexPath) {
        return new Promise((resolve, reject) => {
            fs.exists(genIndexPath, (exists) => {
                if (exists) {
                    fs.readFile(genIndexPath, 'utf8', (err, js) => {
                        const pages = [];
                        js.match(/export\s+default\s+\{(.+)/)[1]
                            .replace(/(?:"((?:[^"]|\\")+)"|'((?:[^']|\\')+)')\s*:\s*(\w+)/g, (match, routeA, routeB, page) => {
                                pages.push({
                                    route: routeA || routeB,
                                    name: page
                                });
                            });

                        js.replace(/import\s+(\w+?)(?:Controller)?\s+from\s+/g, (match, name) => {
                            if (!pages.find((item) => item.name == name)) {
                                pages.push({
                                    route: '',
                                    name
                                });
                            }
                        });
                        resolve(pages);
                    });
                } else {
                    resolve([]);
                }
            });
        });
    }
}

export { PageController };