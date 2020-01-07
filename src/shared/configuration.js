import { configuration } from "snowball/app";
import AtomService from "./services/AtomService";
import ProjectService from "./services/ProjectService";
import PageService from "./services/PageService";

export const CommonConfiguration = configuration({
    modules: {
        atomService: AtomService,
        projectService: ProjectService,
        pageService: PageService,
    }
});