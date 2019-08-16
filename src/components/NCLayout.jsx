import React from "react";

export function NCMain(props) {
    return <section {...props} className={"nc-main w_1x" + (props.className ? ' ' + props.className : '')}>{props.children}</section>;
}

export function NCTitle(props) {
    return (
        <div className={"nc-title nc-title-level" + (props.level || 1) + (props.className ? ' ' + props.className : '')}>{props.children}</div>
    );
}

export function NCSplit(props) {
    return (
        <div className="nc-split flex"><div className="pl_m pr_m">{props.children}</div></div>
    );
}

export function NCCard(props) {
    return <div {...props} className={"nc-card" + (props.className ? ' ' + props.className : '')}>{props.children}</div>;
}

export function NCFooter(props) {
    return <div {...props} className={"nc-footer flex" + (props.className ? ' ' + props.className : '')}>{props.children}</div>;
}