import React, { Component } from "react";
import MobxTestChild, { RenderMobxTestChild } from "./MobxTestChild";
import { observer } from "mobx-react";
import { observable } from "mobx";

export default @observer class MobxTest extends Component {
    @observable test = {
        a: 1
    }

    render() {
        console.log('test', this.test);
        debugger;
        return (
            <div
                onClick={() => {
                    this.test.a = 2;
                }}
            >
                aaa
                <RenderMobxTestChild test={this.test}></RenderMobxTestChild>
                <MobxTestChild test={this.test}></MobxTestChild>
            </div>
        );
    }
}