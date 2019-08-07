import { registerAtom } from "../../factories";
import List from "./List";
import ListSettings from "./ListSettings";
import ListDecoration from "./ListDecoration";

registerAtom({
    type: 'list',
    name: 'List',
    group: 'List',
    atomComponent: List,
    decorationComponent: ListDecoration,
    settingsComponent: ListSettings,
    getChildren: (json) => {
        return [].concat(json.items || []);
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
        rowKey: {
            type: 'string',
            useExpression: false
        },
        dataSource: {
            type: 'string',
            useExpression: false
        },
        onChange: {
            type: 'function'
        }
    }
});