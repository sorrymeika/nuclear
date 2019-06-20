class AtomService {
    async getAll() {
        const resp = await fetch('/gen/getAtoms');
        return await resp.json();
    }
}

export default AtomService;