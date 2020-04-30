import React, { Component } from "react";
import { inject } from "snowball/app";
import { excludeProps } from "snowball/utils";
import { DragItem } from "../components/drag";

@inject('windowService')
class DecorationItem extends Component {
    handleClick = () => {
        const { windowService, context } = this.props;
        windowService.selectAtom(context);
    }

    render() {
        const { factory, context, windowService, dragProps } = this.props;
        const newProps = excludeProps(this.props, ['windowService', 'factory', 'dragProps']);
        const { currentAtom } = windowService;
        const isCurrentAtom = currentAtom && currentAtom.id == context.id && context.subType == currentAtom.subType && context.subId == currentAtom.subId;
        const className = 'nc-window-atom nc-window-atom-' + context.type + (context.subType ? '-' + context.subType : '') + ' ' + (isCurrentAtom
            ? 'nc-window-atom-current '
            : '') + ((dragProps && dragProps.className) || '');

        return (
            <DragItem
                {...dragProps}
                data={context}
                className={className}
                onClick={this.handleClick}
            >{factory(newProps)}</DragItem>
        );
    }
}

export { DecorationItem };

export const createDecorationItem = (componentClass, dragProps) => {
    const factory = React.createFactory(componentClass);
    return (props) => {
        return (
            <DecorationItem
                {...props}
                dragProps={dragProps}
                factory={factory}
            />
        );
    };
};