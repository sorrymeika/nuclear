import React, { Component } from "react";
import { inject } from "snowball/app";
import { DragItem } from "../../components/drag";
import { excludeProps } from "snowball/utils";

@inject('windowService')
class DecorationItem extends Component {
    handleClick = () => {
        const { windowService, context } = this.props;
        windowService.selectAtom(context);
    }

    render() {
        const { factory, context, windowService, dragProps } = this.props;
        const newProps = excludeProps(this.props, ['windowService', 'factory', 'dragProps']);
        const className = 'nc-window-atom nc-window-atom-' + context.type + (context.subType ? '-' + context.subType : '') + ' ' + (windowService.currentAtom && windowService.currentAtom.id == context.id
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