import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DropTargetContext } from './DropTarget';


export default class DragItem extends Component<{
    onBeforeDragStart?: () => any,
    onDragStart?: () => any,
    // 前后是否可插入元素
    insertable: boolean,
    // 是否可拖拽
    dragable: boolean,
    // 是否可插入子DragItem
    appendable: boolean,
    // 分组，当前组件只能插入到同组的DropTarget中
    groups?: string[],
    // 定位: absolute|relative|static
    position: string
}> {
    static contextTypes = DropTargetContext;

    constructor(props, context) {
        super(props, context);

        this.state = {
            dragging: false
        };

        context.addDragItem(this);
        this.disposeDropEvent = context.subscribe('drop', this.onDrop);
    }

    onMouseDown = (e) => {
        const { onBeforeDragStart } = this.props;
        if (onBeforeDragStart && false === onBeforeDragStart(e)) {
            return;
        }
        e.stopPropagation();

        const { dragable = true } = this.props;
        if (!dragable) {
            return;
        }

        const { insertable = true } = this.props;
        const options = {
            source: this,
            sourceType: 'move',
            insertable
        };
        const node = ReactDOM.findDOMNode(this);
        const placeholder = node.cloneNode(true);
        const rect = node.getBoundingClientRect();

        const mover = this.context.mover;
        mover.style.width = rect.width + 'px';
        mover.style.height = rect.height + 'px';
        mover.appendChild(node.cloneNode(true));

        options.offsetX = rect.x - e.pageX + 5;
        options.offsetY = rect.y - e.pageY + 5;

        this.placeholder = placeholder;
        placeholder.style.pointerEvents = 'none';
        node.parentNode.insertBefore(placeholder, node);

        this.context.doDragStart(e, options);
        this.props.onDragStart && this.props.onDragStart(e);

        this.setState({
            dragging: true
        });
    }

    onDrop = (e) => {
        if (e.source === this) {
            this.setState({
                dragging: false
            });
            if (this.placeholder) {
                this.placeholder.parentNode && this.placeholder.parentNode.removeChild(this.placeholder);
                this.placeholder = null;
            }
        }
    }

    componentWillUnmount() {
        this.disposeDropEvent();
        this.context.removeDragItem(this);
    }

    render() {
        const { className, style, children } = this.props;

        return (
            <div
                className={(this.state.dragging ? 'nuclear-drag-item-dragging ' : '') + className}
                style={style}
                onMouseDown={this.onMouseDown}
            >{children}</div>
        );
    }
}