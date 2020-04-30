
import "../sass/window.scss";
import React, { Component } from "react";

import { Drag } from "../../../components/drag";
import { createSettings } from '../../../atom-core/factories';

import { AtomBox } from "../components/AtomBox";
import { Main } from "../components/Main";
import { FileQuickSearch } from "../components/QuickSearch";
import { SettingsRegionInjc } from "../components/SettingsRegion";
import { PageSettingsInjc } from "../components/PageSettings";
import { ToolbarInjc } from "../components/Toolbar";

import WindowService from "../services/WindowService";

const createPageSettings = (props) => {
    return <PageSettingsInjc {...props} />;
};

const renderSettings = ({ type, ...props }) => {
    if (type == 'page') {
        return createPageSettings(props);
    } else {
        return createSettings(type, props);
    }
};

class Window extends Component<{ windowService: WindowService }> {
    constructor(props) {
        super(props);

        window.addEventListener('keydown', this.keyboard, false);
        document.addEventListener('copy', this.copyAtom);
        document.addEventListener('paste', this.pasteAtom);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyboard, false);
        document.removeEventListener('copy', this.copyAtom);
        document.removeEventListener('paste', this.pasteAtom);
    }

    onDrop = (e) => {
        console.log(e);
        const { windowService } = this.props;
        if (e.sourceType === 'new') {
            if (e.status !== 'dragout') {
                windowService.addAtom(e.status, e.source.props.data, e.target.props.data);
            }
        } else {
        }
    }

    render() {
        const { atomGroups, windowService } = this.props;
        const { isSettingsVisible } = windowService;
        return (
            <Drag
                className="nc-window flex ai_s"
                onDrop={this.onDrop}
            >
                <FileQuickSearch />
                <AtomBox atomGroups={atomGroups}></AtomBox>
                <Main
                    toolbar={<ToolbarInjc />}
                />
                {isSettingsVisible && <SettingsRegionInjc>{renderSettings}</SettingsRegionInjc>}
            </Drag>
        );
    }
}

export default Window;