import React, { Component } from 'react';
import { PageSettings } from './PageSettings';
import { inject } from 'snowball/app';
import { createSettings } from '../../../factories';

const createPageSettings = (props) => {
    return <PageSettings {...props}></PageSettings>;
};

const renderSettings = (type, props) => {
    if (type == 'page') {
        return createPageSettings(props);
    } else {
        return createSettings(type, props);
    }
};

class SettingsRegion extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.data = props.data;
    }

    handleDataChange = (data) => {
        this.data = data;
        console.log(data);
    }

    handleOk = () => {
        this.formRef.current.validateFields((err) => {
            if (!err) {
                this.props.onOk(this.data);
            }
        });
    }

    render() {
        const { title, currentAtom } = this.props;
        // console.log(currentAtom);
        return (
            <div className="h_1x nc-window-settings">
                <h3>{title}配置</h3>
                <div className="nc-window-settings-con">
                    {
                        currentAtom
                            ? renderSettings(currentAtom.type, {
                                defaultData: currentAtom.props,
                                currentAtom,
                                onChange: this.handleDataChange,
                                isInForm: currentAtom.isInForm,
                                formRef: this.formRef
                            })
                            : null
                    }
                </div>
                <div className="nc-window-settings-ft flex">
                    <button
                        className="nc-window-settings-cancel flexitem"
                        onClick={this.props.onCancel}
                    >取消</button>
                    <button
                        className="nc-window-settings-ok flexitem"
                        onClick={this.handleOk}
                    >确定</button>
                </div>
            </div>
        );
    }
}

const SettingsRegionInjector = inject(({ windowService }) => ({
    currentAtom: windowService.currentAtom,
    onCancel: windowService.hideSettings,
    onOk: windowService.confirmSettings
}))(SettingsRegion);

export { SettingsRegionInjector as SettingsRegion };