import { _getAtomsForDecoration } from "../../../factories";
import { groupBy } from "snowball/utils";

export default class AtomService {
    getAll() {
        return _getAtomsForDecoration();
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