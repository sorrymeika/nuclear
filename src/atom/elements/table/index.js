import { registerAtom } from "../../factories";
import Table from "./Table";
import TableSettings from "./TableSettings";
import TableDecoration from "./TableDecoration";

registerAtom({
    type: 'table',
    name: 'Table',
    group: 'List',
    atomComponent: Table,
    decorationComponent: TableDecoration,
    settingsComponent: TableSettings,
    getChildren: (json) => {
        return (json.items || []).reduce(
            (tableAllChildren, item) => {
                return tableAllChildren.concat(item.children || []);
            },
            (json.columns || []).reduce(
                (tableAllChildren, column) => {
                    return tableAllChildren.concat(column.children || []);
                }, []
            )
        );
    },
    propsConfig: {
        columns: {
            type: 'array'
        },
        items: {
            type: 'array'
        },
        itemAlias: {
            type: 'string',
            useExpression: false
        },
        indexAlias: {
            type: 'string',
            useExpression: false
        },
        pageEnabled: {
            type: 'boolean'
        },
        rowKey: {
            type: 'string',
            useExpression: false
        },
        columnsNum: {
            type: 'number',
            useExpression: false
        },
        dataSourceName: {
            type: 'string',
            useExpression: false
        },
        onChange: {
            type: 'function'
        },
        showHead: {
            type: 'boolean'
        }
    }
});