import React, { Component } from "react";
import { SettingsBase } from "../SettingsBase";

class ListSettings extends SettingsBase {
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
        }];
    }
}

class ItemSettings extends SettingsBase {
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

class ListSettingsSwitcher extends Component {
    constructor(props) {
        super(props);

        const { currentAtom } = props;
        this.listProps = {
            ...(currentAtom.subType ? currentAtom.listProps : currentAtom.props)
        };
        this.formRef = React.createRef();
    }

    processData(data) {
        const { currentAtom } = this.props;
        if (currentAtom.subType === 'item') {
            const items = this.listProps.items || (this.listProps.items = []);
            items[currentAtom.subId] = data;
        } else {
            Object.assign(this.listProps, data);
        }
        return this.listProps;
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
            currentAtom.subType === 'item'
                ? ItemSettings
                : ListSettings,
            {
                ...this.props,
                ref: this.formRef
            }
        );
    }
}

export default ListSettingsSwitcher;