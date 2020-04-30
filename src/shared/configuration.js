import { configuration } from "snowball/app";
import AtomService from "../app/window/services/AtomService";
import ProjectService from "../app/window/services/ProjectService";
import PageService from "../app/window/services/PageService";

export const CommonConfiguration = configuration({
    modules: {
        atomService: AtomService,
        projectService: ProjectService,
        pageService: PageService,
    }
});