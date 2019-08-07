import React, { Component } from "react";
import { observable } from "snowball";
import component from "../../component";

@component([{
    type: 'form',
    props: {
        name: 'form'
    },
    children: [{
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
    }]
}])
class TableSettings {
    @observable data = {};

    boolOptions = ['true', 'false'];

    constructor(props) {
        this.data = props.defaultData || {};
    }

    onInit() {
        this.asModel().observe('data', (data) => {
            this.props.onChange && this.props.onChange(data);
        });
        this.props.formRef.current = this.form;
    }

    onDestroy() {
        this.asModel().destroy();
    }
}

@component([{
    type: 'form',
    props: {
        name: 'form'
    },
    children: [{
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
    }]
}])
class TableColumnSettings {
    @observable data = {};

    constructor(props) {
        this.data = props.defaultData || {};
    }

    onInit() {
        this.asModel().observe('data', (data) => {
            this.props.onChange && this.props.onChange(data);
        });
        this.props.formRef.current = this.form;
    }

    onDestroy() {
        this.asModel().destroy();
    }
}

@component([{
    type: 'form',
    props: {
        name: 'form'
    },
    children: [{
        type: 'textarea',
        props: {
            label: 'text',
            field: 'data.text',
            autosize: 'true'
        }
    },]
}])
class TableCellSettings {
    @observable data = {};

    constructor(props) {
        this.data = props.defaultData || {};
    }

    onInit() {
        this.asModel().observe('data', (data) => {
            this.props.onChange && this.props.onChange(data);
        });
        this.props.formRef.current = this.form;
    }

    onDestroy() {
        this.asModel().destroy();
    }
}

class TableSettingsSwitcher extends Component {
    constructor(props) {
        super(props);
        const { currentAtom } = props;

        this.tableProps = {
            ...(currentAtom.subType ? currentAtom.tableProps : currentAtom.props)
        };
    }

    onChange = (data) => {
        const { currentAtom, onChange } = this.props;
        if (currentAtom.subType === 'column') {
            const columns = this.tableProps.columns || (this.tableProps.columns = []);
            columns[currentAtom.subId] = data;
        } else if (currentAtom.subType === 'cell') {
            const items = this.tableProps.items || (this.tableProps.items = []);
            items[currentAtom.subId] = data;
        } else {
            Object.assign(this.tableProps, data);
        }
        onChange(this.tableProps);
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
                onChange: this.onChange
            }
        );
    }
}

export default TableSettingsSwitcher;