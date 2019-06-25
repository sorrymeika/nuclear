import React, { Component } from "react";
import { observer } from "mobx-react";

export function RenderMobxTestChild({ test }) {
    return <div>bbb1:{test.a}</div>;
}

export default @observer class MobxTestChild extends Component {
    render() {
        console.log(this.props.test);
        return <div>bbb:{this.props.test.a}</div>;
    }
}