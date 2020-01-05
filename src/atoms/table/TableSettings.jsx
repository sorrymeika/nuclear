import React, { Component } from "react";
import { SettingsBase } from "../SettingsBase";

class TableSettings extends SettingsBase {
    boolOptions = ['true', 'false'];

    renderJson() {
        return [{
            type: 'input',
            props: {
                label: '数据源',
                field: 'dataSource',
                rules: [{ required: true }]
            }
        }, {
            type: 'input',
            props: {
                label: 'item别名',
                field: 'itemAlias',
                rules: [{ required: true }]
            }
        }, {
            type: 'input',
            props: {
                label: '索引别名',
                field: 'indexAlias',
                rules: [{ required: true }]
            }
        }, {
            type: 'input',
            props: {
                label: 'rowKey',
                field: 'rowKey',
                rules: [{ required: true }]
            }
        }, {
            type: 'number',
            props: {
                label: '列数',
                field: 'columnsNum',
                rules: [{ required: true }]
            }
        }, {
            type: 'autocomplete',
            props: {
                label: '是否分页',
                field: 'pageEnabled',
                dataSource: '{boolOptions}'
            }
        }, {
            type: 'input',
            props: {
                label: 'onChange',
                field: 'onChange',
            }
        }, {
            type: 'input',
            props: {
                label: 'className',
                field: 'className',
            }
        }, {
            type: 'autocomplete',
            props: {
                label: 'visible',
                field: 'visible',
                dataSource: '{boolOptions}'
            }
        }, {
            type: 'autocomplete',
            props: {
                label: 'showHead',
                field: 'showHead',
                dataSource: '{boolOptions}'
            }
        }];
    }
}


class TableColumnSettings extends SettingsBase {
    renderJson() {
        return [{
            type: 'input',
            props: {
                label: 'key',
                field: 'key',
                rules: [{ required: true }]
            }
        }, {
            type: 'input',
            props: {
                label: 'title',
                field: 'title',
            }
        }, {
            type: 'input',
            props: {
                label: 'width',
                field: 'width',
            }
        }, {
            type: 'input',
            props: {
                label: 'className',
                field: 'className',
            }
        }, {
            type: 'autocomplete',
            props: {
                label: 'sorter',
                field: 'sorter',
                dataSource: '{boolOptions}'
            }
        }, {
            type: 'input',
            props: {
                label: 'filters',
                field: 'filters',
            }
        }, {
            type: 'autocomplete',
            props: {
                label: 'visible',
                field: 'visible',
                dataSource: '{boolOptions}'
            }
        }, {
            type: 'autocomplete',
            props: {
                label: 'ifShowTooltip',
                field: 'ifShowTooltip',
                dataSource: '{boolOptions}'
            }
        }, {
            type: 'input',
            props: {
                label: 'tooltipContent',
                field: 'tooltipContent',
            }
        }];
    }
}

class TableCellSettings extends SettingsBase {
    renderJson() {
        return [{
            type: 'textarea',
            props: {
                label: 'text',
                field: 'data.text',
                autosize: 'true'
            }
        }];
    }
}

class TableSettingsSwitcher extends Component {
    constructor(props) {
        super(props);
        const { currentAtom } = props;

        this.tableProps = {
            ...(currentAtom.subType ? currentAtom.tableProps : currentAtom.props)
        };
        this.formRef = React.createRef();
    }

    processData(data) {
        const { currentAtom } = this.props;
        if (currentAtom.subType === 'column') {
            const columns = this.tableProps.columns || (this.tableProps.columns = []);
            columns[currentAtom.subId] = data;
        } else if (currentAtom.subType === 'cell') {
            const items = this.tableProps.items || (this.tableProps.items = []);
            items[currentAtom.subId] = data;
        } else {
            Object.assign(this.tableProps, data);
        }
        return this.tableProps;
    }

    validateFields = (cb) => {
        this.formRef.current.validateFields((err, data) => {
            if (err) {
                cb(err);
            } else {
                cb(null, this.processData(data));
            }
        });
    }

    render() {
        const { currentAtom } = this.props;
        return React.createElement(
            currentAtom.subType === 'column'
                ? TableColumnSettings
                : currentAtom.subType === 'cell'
                    ? TableCellSettings
                    : TableSettings,
            {
                ...this.props,
                ref: this.formRef
            }
        );
    }
}

export default TableSettingsSwitcher;