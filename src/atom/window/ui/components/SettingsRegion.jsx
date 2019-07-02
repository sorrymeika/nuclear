import React, { Component } from 'react';
import { PageSettings } from './settings/PageSettings';
import { inject } from 'snowball/app';

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
        const { title } = this.props;
        return (
            <div className="h_1x nuclear-window-settings">
                <h3>{title}配置</h3>
                <div className="of_s nuclear-window-settings-con">
                    <PageSettings
                        defaultData={this.props.data}
                        onChange={this.handleDataChange}
                        formRef={this.formRef}
                    ></PageSettings>
                </div>
                <div className="nuclear-window-settings-ft flex">
                    <button
                        className="nuclear-window-settings-cancel flexitem"
                        onClick={this.props.onCancel}
                    >取消</button>
                    <button
                        className="nuclear-window-settings-ok flexitem"
                        onClick={this.handleOk}
                    >确定</button>
                </div>
            </div>
        );
    }
}

const SettingsRegionInjector = inject(({ windowService }) => ({
    data: windowService.currentAtom && windowService.currentAtom.props,
    onCancel: windowService.hideSettings,
    onOk: windowService.confirmSettings
}))(SettingsRegion);

export { SettingsRegionInjector as SettingsRegion };