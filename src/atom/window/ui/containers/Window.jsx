
import React, { Component } from "react";
import "../sass/window.scss";
import { Drag } from "../../../../components/drag";
import { AtomBox } from "../components/AtomBox";
import { Main } from "../components/Main";
import FileQuickSearch from "../components/FileQuickSearch";
import { inject } from "snowball/app";

@inject(({ windowService }) => ({
    atomGroups: windowService.atomGroups
}))
class Window extends Component {
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
    }

    render() {
        const { atomGroups } = this.props;
        return (
            <Drag
                className="nuclear-window flex ai_s"
                onDrop={this.onDrop}
            >
                <FileQuickSearch></FileQuickSearch>
                <AtomBox atomGroups={atomGroups}></AtomBox>
                <Main></Main>
            </Drag>
        );
    }
}

export default Window;