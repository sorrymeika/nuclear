
class ProjectService {
    async getProjects() {
        const resp = await fetch('/api/page.getProjects');
        return await resp.json();
    }
}

export default ProjectService;