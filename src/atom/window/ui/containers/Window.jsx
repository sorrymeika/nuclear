
import React, { Component } from "react";
import { Drag } from "../../../../components/drag";
import AtomBox from "../components/AtomBox";
import { Main } from "../components/Main";
import FileQuickSearch from "../components/FileQuickSearch";

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
    }

    render() {
        const { atomGroups } = this.props;
        return (
            <Drag
                className="nuclear-window dock flex ai_s"
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