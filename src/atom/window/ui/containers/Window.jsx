
import "../sass/window.scss";
import React, { Component } from "react";
import { inject } from "snowball/app";
import { Drag } from "../../../../components/drag";
import { AtomBox } from "../components/AtomBox";
import { Main } from "../components/Main";
import FileQuickSearch from "../components/FileQuickSearch";
import WindowService from "../services/WindowService";
import { SettingsRegion } from "../components/SettingsRegion";

@inject('windowService')
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
        const { windowService } = this.props;
        if (e.sourceType === 'new') {
            if (e.status !== 'dragout') {
                windowService.addAtom(e.status, e.source.props.data);
            }
        } else {
        }
    }

    render() {
        const { atomGroups, windowService } = this.props;
        const { isSettingsVisible } = windowService;
        return (
            <Drag
                className="nuclear-window flex ai_s"
                onDrop={this.onDrop}
            >
                <FileQuickSearch></FileQuickSearch>
                <AtomBox atomGroups={atomGroups}></AtomBox>
                <Main></Main>
                {isSettingsVisible && <SettingsRegion></SettingsRegion>}
            </Drag>
        );
    }
}

export default Window;