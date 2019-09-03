import React, { Component } from "react";
import { observable } from "snowball";
import component from "../component";

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
        type: 'input',
        props: {
            label: 'className',
            field: 'itemProps.className',
        }
    }, {
        type: 'autocomplete',
        props: {
            label: 'visible',
            field: 'itemProps.visible',
            dataSource: '{boolOptions}'
        }
    }]
}])
class ListSettings {
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
        type: 'textarea',
        props: {
            label: 'text',
            field: 'data.text',
            autosize: 'true'
        }
    },]
}])
class ItemlSettings {
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

class ListSettingsSwitcher extends Component {
    constructor(props) {
        super(props);
        const { currentAtom } = props;

        this.tableProps = {
            ...(currentAtom.subType ? currentAtom.tableProps : currentAtom.props)
        };
    }

    onChange = (data) => {
        const { currentAtom, onChange } = this.props;
        if (currentAtom.subType === 'item') {
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
            currentAtom.subType === 'item'
                ? ItemlSettings
                : ListSettings,
            {
                ...this.props,
                onChange: this.onChange
            }
        );
    }
}

export default ListSettingsSwitcher;