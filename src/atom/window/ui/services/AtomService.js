import { _getAtoms } from "../../../registry";
import { groupBy } from "../../../../utils";

export default class AtomService {
    getAtomGroups() {
        const atoms = _getAtoms();
        return groupBy('group', atoms)
            .map((item) => ({
                groupName: item.key.group,
                items: item.group
            }));
    }
}