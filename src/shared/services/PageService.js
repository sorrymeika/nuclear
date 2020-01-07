import { params } from "snowball/utils";

class PageService {

    async getPagesByProject(projectName) {
        const resp = await fetch('/api/page.getPages?' + params({ projectName }));
        return await resp.json();
    }

    async getPage(projectName, pageName) {
        const resp = await fetch('/api/page.getPage?' + params({ projectName, pageName }));
        return await resp.json();
    }

    async savePage({ projectName, pageName, route, atoms, dialogs }) {
        const resp = await fetch(
            '/api/page.savePage?' + params({ projectName, pageName, route }),
            {
                method: 'POST',
                body: atoms && dialogs ? JSON.stringify(atoms.concat(dialogs), null, 4) : null
            }
        );
        return await resp.json();
    }

    async getCss(projectName, pageName) {
        const resp = await fetch('/api/page.getPageCss?' + params({ projectName, pageName }));
        return await resp.json();
    }

    async saveCss({ projectName, pageName, style }) {
        const resp = await fetch(
            '/api/page.savePageCss?' + params({ projectName, pageName }),
            {
                method: 'POST',
                body: style
            }
        );
        return await resp.json();
    }
}

export default PageService;