import { _getAtoms } from "../../../factories";
import { groupBy } from "snowball/utils";

export default class AtomService {
    getAll() {
        return _getAtoms();
    }

    getGroups() {
        const atoms = this.getAll();
        return groupBy('group', atoms)
            .map((item) => ({
                groupName: item.key.group,
                items: item.group
            }));
    }
}