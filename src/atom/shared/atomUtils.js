export function eachAtom(atoms, fn, parent = null, paths = []) {
    for (let i = 0; i < atoms.length; i++) {
        const atom = atoms[i];
        if (fn(atom, i, atoms, parent, paths) !== false) {
            if (atom.children) {
                if (eachAtom(atom.children, fn, atom, [...paths, atom.type]) === false) {
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

export function getPaths(atoms, atomId) {
    let resultPaths = [];
    eachAtom(atoms, (item, i, array, parent, paths) => {
        if (item.id == atomId) {
            resultPaths = paths;
            return false;
        }
    });
    return resultPaths;
}

export function computeIsInForm(paths) {
    const tableIndex = Math.max(paths.lastIndexOf('list'), paths.lastIndexOf('table'));
    const formIndex = paths.lastIndexOf('form');

    if (formIndex !== -1 && tableIndex < formIndex) {
        return true;
    }
    return false;
}