
class ProjectService {
    async getProjects() {
        const resp = await fetch('/gen/getProjects');
        return await resp.json();
    }
}

export default ProjectService;