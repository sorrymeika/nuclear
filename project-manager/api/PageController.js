import { Controller, Request } from "../core/Controller";
import projects from '../json/projects.json';
import { getBody } from '../util';

const path = require('path');
const fs = require('fs');


function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.exists(filePath, (exists) => {
            if (exists) {
                fs.readFile(filePath, 'utf8', (err, text) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(text);
                    }
                });
            } else {
                resolve('');
            }
        });
    });
}

function writeFile(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, 'utf8', (err, text) => {
            if (err) {
                reject(err);
            } else {
                resolve(text);
            }
        });
    });
}

@Controller
class PageController {
    @Request
    getProjects(request, response) {
        response.json(projects);
    }

    @Request
    async getPages(request, response) {
        const { projectName } = request.query;
        const res = await this._getPagesByProjectName(projectName);
        response.json(res);
    }

    @Request
    async getPage(request, response) {
        const { projectName, pageName } = request.query;
        const { pages, projectPath } = await this._getPagesByProjectName(projectName);
        let basicInfo = pages.find((pg) => pg.name == pageName);
        let atoms;

        if (!basicInfo) {
            await this._checkPage(projectPath, pageName);
        } else {
            await new Promise((resolve, reject) => {
                const { pageJsonPath } = this._getPagePaths(projectPath, pageName);
                fs.exists(pageJsonPath, (exists) => {
                    if (exists) {
                        fs.readFile(pageJsonPath, 'utf8', (err, text) => {
                            const json = JSON.parse(text.replace(/^export\s+default\s+/, ''));
                            resolve(json);
                        });
                    } else {
                        resolve([]);
                    }
                });
            });
        }

        response.json({
            projectName,
            pageName,
            basicInfo,
            atoms
        });
    }

    @Request
    async savePage(request, response) {
        const { projectName, pageName, route } = request.query;
        const { pages, projectPath } = await this._getPagesByProjectName(projectName);
        let page = pages.find((pg) => pg.name == pageName);
        const { pageJsonPath, projectIndexPath } = this._getPagePaths(projectPath, pageName);
        const body = await getBody(request);

        if (!page) {
            await this._checkPage(projectPath, pageName);
        }

        if (!page) {
            pages.push({
                route,
                name: pageName
            });
        } else {
            page.route = route || '';
        }

        let importText = '';
        let exportText = '';
        let text = [];
        pages.forEach((item) => {
            importText += 'import ' + item.name + ' from "./' + item.name + '";\n';
            if (item.route) {
                text.push(JSON.stringify(item.route) + ': ' + item.name);
            } else {
                exportText += 'export {' + item.name + '};\n';
            }
        });

        await writeFile(projectIndexPath, importText + exportText + 'export default {'
            + text.join(',\n')
            + '};\n');

        if (body) {
            await writeFile(pageJsonPath, "export default " + body);
        }

        response.json({
            projectName,
            page
        });
    }

    @Request
    async getPageCss(request, response) {
        const { projectName, pageName } = request.query;
        const projectPath = this._getProjectPath(projectName);

        const { pageStylePath } = this._getPagePaths(projectPath, pageName);
        const style = await readFile(pageStylePath);

        response.json({
            projectName,
            pageName,
            style
        });
    }

    @Request
    async savePageCss(request, response) {
        const { projectName, pageName } = request.query;
        const projectPath = this._getProjectPath(projectName);

        const style = await getBody(request);

        const { pageStylePath } = this._getPagePaths(projectPath, pageName);
        await writeFile(pageStylePath, style);

        response.json({
            projectName,
            pageName,
        });
    }

    async _getPagesByProjectName(projectName) {
        const projectPath = this._getProjectPath(projectName);

        const genDir = path.join(projectPath, 'src/gen');
        const genIndexPath = path.join(projectPath, 'src/gen/index.js');

        await this._checkGenDir(genDir);
        const pages = await this._getPages(genIndexPath);

        return {
            projectName,
            projectPath,
            pages
        };
    }

    _getProjectPath(projectName) {
        const project = projects.find((proj) => proj.name === projectName);
        const projectPath = path.join(process.cwd(), project.path);
        return projectPath;
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

                        js.replace(/import\s+(\w+?)\s+from\s+/g, (match, name) => {
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

    _checkPage(projectPath, pageName) {
        const { pageDir, pageControllerPath, pageStylePath, pageIndexPath } = this._getPagePaths(projectPath, pageName);

        return new Promise((resolve, reject) => {
            fs.exists(pageDir, (exists) => {
                if (exists) {
                    resolve();
                } else {
                    fs.mkdir(pageDir, () => {
                        Promise.all([
                            writeFile(pageStylePath, ``),
                            writeFile(pageControllerPath,
                                `import { component } from 'nuclear';`
                                + `\nimport './${pageName}Style.css';`
                                + `\nimport ${pageName}Json from './${pageName}Json';`
                                + `\n@component(${pageName}Json)`
                                + `\nclass ${pageName}Controller {`
                                + `\n    constructor(props) {`
                                + `\n    }`
                                + `\n`
                                + `\n    onInit() {`
                                + `\n    }\n`
                                + `}\n\nexport default ${pageName}Controller;`),
                            writeFile(pageIndexPath, `export { ${pageName}Controller as default } from './${pageName}Controller';`)
                        ])
                            .then(resolve);
                    });
                }
            });
        });
    }

    _getPagePaths(projectPath, pageName) {
        const pageDir = path.join(projectPath, 'src/gen/' + pageName);
        const pageJsonPath = path.join(pageDir, pageName + 'JSON.js');
        const pageControllerPath = path.join(pageDir, pageName + 'Controller.js');
        const pageStylePath = path.join(pageDir, pageName + 'Style.css');
        const pageIndexPath = path.join(pageDir, 'index.js');
        const projectIndexPath = path.join(projectPath, 'src/gen/index.js');

        return { pageDir, pageJsonPath, pageControllerPath, pageStylePath, pageIndexPath, projectIndexPath };
    }
}

export { PageController };