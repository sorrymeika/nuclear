export function eachAtom(atoms, fn, parent = null) {
    for (let i = 0; i < atoms.length; i++) {
        const atom = atoms[i];
        if (fn(atom, i, atoms, parent) !== false) {
            if (atom.children) {
                if (eachAtom(atom.children, fn, atom) === false) {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
    return true;
}

export function findAtom(atoms, atomId) {
    let atom = null;
    eachAtom(atoms, (item, i, array) => {
        if (item.id == atomId) {
            atom = item;
            return false;
        }
    });
    return atom;
}
