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
        const { children, context, windowService, containerProps } = this.props;
        const newProps = excludeProps(this.props, ['windowService', 'children', 'containerProps']);
        const className = (windowService.currentAtom && windowService.currentAtom.id == context.id
            ? 'nc-window-atom nc-window-atom-current '
            : 'nc-window-atom ') + ((containerProps && containerProps.className) || '');

        return (
            <DragItem
                {...containerProps}
                className={className}
                onClick={this.handleClick}
            >{children(newProps)}</DragItem>
        );
    }
}

export { DecorationItem };

export const createDecorationItem = (componentClass, containerProps) => {
    const factory = React.createFactory(componentClass);
    return (props) => {
        return <DecorationItem {...props} containerProps={containerProps}>{factory}</DecorationItem>;
    };
};