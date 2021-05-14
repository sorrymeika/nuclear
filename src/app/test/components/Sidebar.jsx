import React from 'react';

export default function Sidebar({ className, ...props }) {
    return <div {...props} className={"nc-window-sidebar" + (className ? ' ' + className : '')} />;
}