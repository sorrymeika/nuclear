import React, { Component } from 'react';
import { PageSettings } from './settings/PageSettings';

class SettingsRegion extends Component {
    render() {
        const { title } = this.props;
        return (
            <div className="h_1x nuclear-window-settings">
                <h3>{title}配置</h3>
                <div className="of_s nuclear-window-settings-con">
                    <PageSettings></PageSettings>
                </div>
                <div className="nuclear-window-settings-ft flex">
                    <button
                        className="nuclear-window-settings-cancel flexitem"
                        onClick={this.props.onCancel}
                    >取消</button>
                    <button
                        className="nuclear-window-settings-ok flexitem"
                        onClick={this.onOk}
                    >确定</button>
                </div>
            </div>
        );
    }
}

export { SettingsRegion };