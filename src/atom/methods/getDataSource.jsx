import { util } from "snowball";

export const getDataSource = (dataSourceName, handler, transitiveProps) => {
    if (!dataSourceName) return null;

    const names = dataSourceName.replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter((name) => name);
    const propName = names[0];
    const context = (transitiveProps && propName in transitiveProps) ? transitiveProps : handler;

    return util.get(context, names);
};