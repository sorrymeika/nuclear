import React from "react";

export function NCMain(props) {
    return <section {...props} className={"nc-app-main w_1x" + (props.className ? ' ' + props.className : '')}>{props.children}</section>;
}

export function NCTitle(props) {
    return (
        <div className={"nc-app-title nc-title-level" + (props.level || 1) + (props.className ? ' ' + props.className : '')}>{props.children}</div>
    );
}

export function NCSplit(props) {
    return (
        <div className={"nc-app-split flex" + (props.className ? ' ' + props.className : '')}><div className="pl_m pr_m">{props.children}</div></div>
    );
}

export function NCToolbar({ children, ...props }) {
    children = React.Children.toArray(children);

    let right = null;
    if (children[children.length - 1].type === NCToolbarRight) {
        right = children.pop();
    }

    return (
        <div className={"nc-app-toolbar flex" + (props.className ? ' ' + props.className : '')}><div className="fx_1">{children}</div>{right}</div>
    );
}

function NCToolbarRight(props) {
    return <div {...props} className={"nc-app-toolbar-right flex"}>{props.children}</div>;
};

NCToolbar.Right = NCToolbarRight;

export function NCSearch({ title, children, ...props }) {
    return (
        <>
            {title ? <NCTitle>{title}</NCTitle> : null}
            <div {...props} className={"nc-app-search" + (props.className ? ' ' + props.className : '')}>
                {children}
            </div>
        </>
    );
}

export function NCCard(props) {
    return <div {...props} className={"nc-app-card" + (props.className ? ' ' + props.className : '')}>{props.children}</div>;
}

export function NCFooter(props) {
    return <div {...props} className={"nc-app-footer flex" + (props.className ? ' ' + props.className : '')}>{props.children}</div>;
}