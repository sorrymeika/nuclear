import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { insertAfter, insertBefore, containsNode } from './util';
import { DragContext } from './Drag';

export const DropTargetContext = React.createContext();

export default class DropTarget extends Component<{
    group?: string,
    onDragOut?: (e: { target: HTMLElement, source: any }) => any,
    onDrop?: (e: any) => any,
    onDragChange?: (e: any) => any,
    onDragMove?: (e: any) => any
}> {
    static contextType = DragContext;

    constructor(props, context) {
        super(props, context);

        this.items = [];
        this.disposers = [
            context.subscribe('dragstart', this.reset),
            context.subscribe('dragend', this.reset),
        ];
    }

    componentWillUnmount() {
        this.disposers.forEach((dispose) => dispose());
    }

    reset = (e) => {
        this.mouseMoveTimes = 0;
    }

    onMouseMove = (e) => {
        let current = this.context.getCurrent();
        if (!current) return;

        if (this.mouseMoveTimes <= 1) {
            this.mouseMoveTimes++;
            return;
        }

        const { source, previewElement } = current;
        const { groups, position } = source.props;
        const { group, onDragMove } = this.props;

        if (groups && group && groups.indexOf(group) !== -1) {
            return;
        }
        if (onDragMove && onDragMove(e, current) === false) return;

        const container = ReactDOM.findDOMNode(this);
        let targetPlace;

        if (position === 'fixed' || position === 'absolute') {
            targetPlace = {
                type: 'prepend',
                node: container,
                target: this
            };
        } else {
            const { pageX, pageY } = e;
            const containerRect = container.getBoundingClientRect();

            if (pageY + 50 >= containerRect.y + containerRect.height) {
                this.autoScroll('up');
            } else if (pageY <= containerRect.y + 50) {
                this.autoScroll('down');
            } else {
                this.stopAutoScroll();
            }

            const eachBranchesItem = (branches, fn) => {
                for (var i = 0; i < branches.length; i++) {
                    const item = branches[i];
                    const destNode = item.node;
                    const target = item.target;

                    const rect = destNode.getBoundingClientRect();
                    const option = {
                        target,
                        position: target.position,
                        node: destNode,
                        x: rect.left,
                        y: rect.top,
                        height: rect.height,
                        width: rect.width,
                        centerX: rect.left + (rect.width / 2),
                        centerY: rect.top + (rect.height / 2)
                    };
                    option.distance = Math.abs(option.centerX - pageX) + Math.abs(option.centerY - pageY);

                    const res = fn({
                        ...item,
                        ...option
                    }, i);

                    if (res != null) {
                        return res;
                    }
                }
            };

            const isMouseOver = (dragItem) => {
                return pageX >= dragItem.x && pageX <= dragItem.x + dragItem.width && pageY >= dragItem.y && pageY <= dragItem.y + dragItem.height;
            };

            const getItemFromMousePoint = (branches) => {
                return eachBranchesItem(branches, (item) => {
                    const pointIsInItem = isMouseOver(item);
                    if (pointIsInItem) {
                        const child = getItemFromMousePoint(item.children);
                        return child || item;
                    }
                });
            };

            const trees = componentsToTrees(this.items.filter(item => item !== source), container);
            let itemAtMousePoint = getItemFromMousePoint(trees);
            let nearest;

            const canInsertBeforeOrInsertAfter = (dragItem) => {
                return dragItem.target.props.insertable !== false;
            };
            const canAppendTo = (dragItem) => {
                return !!dragItem.target.props.appendable;
            };

            if (itemAtMousePoint && !itemAtMousePoint.children.length && canInsertBeforeOrInsertAfter(itemAtMousePoint)) {
                nearest = itemAtMousePoint;
            } else {
                let comparers = itemAtMousePoint && itemAtMousePoint.children.length ? itemAtMousePoint.children : trees;

                eachBranchesItem(comparers, (option) => {
                    if (option.position !== 'fixed' && option.position !== 'absolute') {
                        if (!nearest) {
                            nearest = option;
                        } else if (option.distance < nearest.distance) {
                            if (canInsertBeforeOrInsertAfter(option)) {
                                nearest = option;
                            }
                        }
                    }
                });
                if (!nearest) {
                    nearest = itemAtMousePoint;
                }
            }

            if (nearest) {
                const insertType = canAppendTo(nearest)
                    && pageX > nearest.x && pageY > nearest.y
                    && pageX < nearest.x + nearest.width && pageY < nearest.y + nearest.height
                    ? 'append'
                    : pageX < nearest.x || pageY < nearest.y || (pageX < nearest.centerX && pageY < nearest.centerY)
                        ? 'before'
                        : 'after';

                targetPlace = {
                    type: insertType,
                    node: nearest.node,
                    target: nearest.target
                };
            } else {
                targetPlace = {
                    type: 'append',
                    node: container,
                    target: this
                };
            }
        }

        targetPlace.previewElement = previewElement;
        previewElement.classList.remove('nc-dnd-preview-del');

        if (!this.targetPlace || (this.targetPlace.node != targetPlace.node || this.targetPlace.type != targetPlace.type || this.targetPlace.previewElement != previewElement)) {
            if (!this.props.onDragChange || (this.props.onDragChange({
                target: this,
                source,
                ...targetPlace
            }) !== false)) {
                if (targetPlace.type === 'before') {
                    insertBefore(targetPlace.node, previewElement);
                } else if (targetPlace.type === 'after') {
                    insertAfter(targetPlace.node, previewElement);
                } else if (targetPlace.type === 'prepend') {
                    targetPlace.node.firstChild
                        ? insertBefore(targetPlace.node.firstChild, previewElement)
                        : targetPlace.node.appendChild(previewElement);
                } else {
                    targetPlace.node.appendChild(previewElement);
                }
                this.context.setDndState({
                    status: targetPlace.type,
                    target: targetPlace.target
                });
            }
        }

        this.targetPlace = targetPlace;
    }

    onDragOut = () => {
        if (this.targetPlace) {
            const previewElement = this.targetPlace.previewElement;
            previewElement.classList.add('nc-dnd-preview-del');

            let current = this.context.getCurrent();

            this.context.setDndState({
                status: 'dragout',
                target: this.targetPlace.target
            });
            this.props.onDragOut && this.props.onDragOut({
                ...this.targetPlace,
                source: current.source
            });
            this.targetPlace = null;
        }
        this.stopAutoScroll();
    }

    onMouseUp = (e) => {
        const { targetPlace } = this;
        if (targetPlace) {
            const previewElement = targetPlace.previewElement;
            previewElement.parentNode && previewElement.parentNode.removeChild(previewElement);

            this.props.onDrop && this.props.onDrop({
                type: 'drop',
                nativeEvent: e,
                target: targetPlace.target
            });
            this.targetPlace = null;
        }
    }

    addDragItem = (dest) => {
        this.items.push(dest);
    }

    removeDragItem = (dest) => {
        var index = this.items.indexOf(dest);
        if (index != -1) {
            this.items.splice(index, 1);
        }
    }

    autoScroll = (type) => {
        this.autoScrollType = type;
        if (!this.autoScrollTimer) {
            const thisNode = ReactDOM.findDOMNode(this);
            this.autoScrollTimer = setInterval(() => {
                thisNode.scrollTop = this.autoScrollType === 'up' ? thisNode.scrollTop + 10 : thisNode.scrollTop - 10;
            }, 60);
        }
    }

    stopAutoScroll = () => {
        if (this.autoScrollTimer) {
            clearTimeout(this.autoScrollTimer);
            this.autoScrollTimer = null;
        }
    }

    render() {
        const { className, style, children } = this.props;

        return (
            <DropTargetContext.Provider value={{
                ...this.context,
                addDragItem: this.addDragItem,
                removeDragItem: this.removeDragItem,
            }}>
                <div
                    className={className}
                    style={style}
                    onMouseMove={this.onMouseMove}
                    onMouseLeave={this.onDragOut}
                    onMouseUp={this.onMouseUp}
                >{children}</div>
            </DropTargetContext.Provider>
        );
    }
}


function componentsToTrees(components, container) {
    const items = [];

    components.forEach((item) => {
        const destNode = ReactDOM.findDOMNode(item);
        let draggingNode = destNode;
        while (draggingNode && draggingNode != container && draggingNode != document.body) {
            if (draggingNode.classList.contains('nc-drag-item-dragging')) return;
            draggingNode = draggingNode.parentNode;
        }

        items.push({
            node: destNode,
            target: item
        });
    });

    const eachItem = (fn) => {
        for (let i = 0; i < items.length; i++) {
            fn(items[i]);
        }
    };

    const pushChildren = (parent) => {
        if (parent.children) return parent.children;

        var children = parent.children = [];
        eachItem((item) => {
            if (parent != item && containsNode(parent.node, item.node)) {
                if (item.parent) {
                    if (item.parent != parent) {
                        if (containsNode(parent.node, item.parent.node)) {
                            // 如果parent是爷爷辈的就不继续
                            pushChildren(item);
                            return;
                        }
                        if (containsNode(item.parent.node, parent.node)) {
                            // 如果item.parent是爷爷辈的就移除爷爷辈的children里的item
                            for (var i = item.parent.children.length; i >= 0; i--) {
                                if (item.parent.children[i] === item) {
                                    item.parent.children.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    }
                }
                item.parent = parent;
                pushChildren(item);
                children.push(item);
            }
        });
        return parent;
    };

    const trees = [];
    eachItem((item) => {
        pushChildren(item);
        if (!item.parent) {
            trees.push(item);
        }
    });

    return trees;
}
