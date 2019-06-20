
import React, { Component } from "react";
import { Drag } from "../../../../components/drag";

export default class Window extends Component {
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
        return (
            <Drag
                className="nuclear-window dock flex ai_s"
                onDrop={this.onDrop}
            >asf</Drag>
        );
    }
}
