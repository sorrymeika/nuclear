import { params } from "snowball/utils";

class PageService {
    async getPage(projectName, pageName) {
        const resp = await fetch('/api/page.getPage?' + params({ projectName, pageName }));
        return await resp.json();
    }

    async getPagesByProject(projectName) {
        const resp = await fetch('/api/page.getPage?' + params({ projectName }));
        return await resp.json();
    }
}

export default PageService;