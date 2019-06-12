

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragContext } from './Drag';

export class DragSource extends Component<{
    // 拖动时跟随鼠标移动的控件，默认DragSource自身的clone
    mover?: Component | Function,
    // 插入的DOMElement
    previewElement?: HTMLElement | boolean,
    onDragStart?: () => any
}> {
    static contextTypes = DragContext;

    onMouseDown = (e) => {
        e.stopPropagation();

        const { mover: Mover, previewElement } = this.props;
        const options = {
            previewElement,
            source: this,
            sourceType: 'new'
        };
        const mover = this.context._mover;
        const onDragStart = (e, insert) => {
            insert.__dragSource = this;
            this.props.onDragStart && this.props.onDragStart(e, insert);
        };

        mover.style.width = '';
        mover.style.height = '';

        if (!Mover) {
            const node = ReactDOM.findDOMNode(this);
            const clone = node.cloneNode(true);
            const rect = node.getBoundingClientRect();

            mover.appendChild(clone);

            options.offsetX = rect.x - e.pageX + 5;
            options.offsetY = rect.y - e.pageY + 5;
            this.context.doDragStart(e, options, onDragStart);
        } else {
            ReactDOM.render(<Mover></Mover>, mover, () => {
                this.context.doDragStart(e, options, onDragStart);
            });
        }
    }

    render() {
        const { className, style, children } = this.props;

        return (
            <div
                className={className}
                onMouseDown={this.onMouseDown}
                style={style}
            >{children}</div>
        );
    }
}
