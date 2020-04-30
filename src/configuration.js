import { configuration } from "snowball/app";
import { NCFormViewModel, NCModalViewModel, NCTableViewModel, NCFormModalViewModel } from "./components";

export const NuclearConfiguration = configuration({
    modules: {
        NCFormViewModel: NCFormViewModel,
        NCModalViewModel: NCModalViewModel,
        NCTableViewModel: NCTableViewModel,
        NCFormModalViewModel: NCFormModalViewModel,
    }
});