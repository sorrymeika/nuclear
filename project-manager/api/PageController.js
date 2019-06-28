import { Controller } from "../core/Controller";

@Controller
class PageController {

    @Request
    getPage(request, response) {
        const { projectName } = request.query;
        response.json({
            projectName
        });
    }
}

export { PageController };