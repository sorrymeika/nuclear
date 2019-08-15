import React from "react";

export function NCMain(props) {
    return <section {...props} className={"nc-main w_1x" + (props.className ? ' ' + props.className : '')}>{props.children}</section>;
}

export function NCCard(props) {
    return <div {...props} className={"nc-card" + (props.className ? ' ' + props.className : '')}>{props.children}</div>;
}