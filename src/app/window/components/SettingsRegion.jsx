import React, { Component } from 'react';
import { inject } from 'snowball/app';

class SettingsRegion extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
    }

    handleOk = () => {
        this.formRef.current.validateFields((err, data) => {
            if (!err) {
                this.props.onOk(data);
            }
        });
    }

    render() {
        const { title, currentAtom, children } = this.props;
        // console.log(currentAtom);
        return (
            <div className="h_1x nc-window-settings">
                <h3>{title}配置</h3>
                <div className="nc-window-settings-con">
                    {
                        currentAtom
                            ? children({
                                type: currentAtom.type,
                                defaultData: currentAtom.props,
                                currentAtom,
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

const SettingsRegionInjc = inject(({ windowService }) => ({
    currentAtom: windowService.currentAtom,
    onCancel: windowService.hideSettings,
    onOk: windowService.confirmSettings
}))(SettingsRegion);

export { SettingsRegion, SettingsRegionInjc };