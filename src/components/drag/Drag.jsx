import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import whatever from '../../core/whatever';
import util from '../../snowball/util';

util.style('nuclear-drag',
    '.nuclear-disable-select{-webkit-user-select: none; -webkit-touch-callout: none; user-select: none;}' +
    '.nuclear-drag-mover{display:none;position:fixed;top:0;left:0;width:auto;height:auto;opacity:.7;pointer-events:none;z-index:9999;}' +
    '.nuclear-inserter-del { opacity: .3 }' +
    '.nuclear-dragcusor-dragging { display: none !important; }'
);

function containsNode(node, childNode) {
    if (childNode === node) return false;

    while ((childNode = childNode.parentNode)) {
        if (childNode === node) return true;
    }
    return false;
}

function insertAfter(node, newNode) {
    if (node.parentNode && node.nextSibling != newNode) {
        node.nextSibling
            ? node.parentNode.insertBefore(newNode, node.nextSibling)
            : node.parentNode.appendChild(newNode);
    }
}

function insertBefore(node, newNode) {
    if (node.parentNode && node.previousSibling != newNode) {
        node.parentNode.insertBefore(newNode, node);
    }
}

export class Drag extends Component {
    static childContextTypes = {
        _getInsert: whatever,
        _dragStart: whatever,
        _mover: whatever,
        _observeDragStart: whatever,
        _unobserveDragStart: whatever,
        _observeDragEnd: whatever,
        _unobserveDragEnd: whatever,
        _observeDragClick: whatever,
        _unobserveDragClick: whatever,
    }

    getChildContext() {
        return {
            _getInsert: () => this.insert,
            _dragStart: this._dragStart,
            _mover: this.mover,
            _observeDragStart: this._observeDragStart,
            _unobserveDragStart: this._unobserveDragStart,
            _observeDragEnd: this._observeDragEnd,
            _unobserveDragEnd: this._unobserveDragEnd,
            _observeDragClick: this._observeDragClick,
            _unobserveDragClick: this._unobserveDragClick,
        };
    }

    constructor(props) {
        super(props);

        var mover = document.createElement('div');
        mover.className = 'nuclear-drag-mover';
        this.mover = mover;
        document.body.appendChild(mover);

        document.body.addEventListener('mousemove', this.onMouseMove, false);
        document.body.addEventListener('mouseup', this.onMouseUp, true);
        document.body.addEventListener('mousedown', this.onMouseDown, true);
    }

    componentWillUnmount() {
        document.body.removeEventListener('mousemove', this.onMouseMove, false);
        document.body.removeEventListener('mouseup', this.onMouseUp, true);
        document.body.removeEventListener('mousedown', this.onMouseDown, true);
    }

    onMouseDown = (e) => {
        this.moved = false;
        this.clickTarget = e.target;
    }

    _dragStart = (e, {
        source,
        insert,
        offsetX = 0,
        offsetY = 0,
        dragable = true
    }, cb) => {
        this._isStart = true;
        this.moved = false;
        this.movedTimes = 0;
        this.source = source;
        this.dragable = dragable;

        if (!dragable) return;

        const x = e.pageX + offsetX;
        const y = e.pageY + offsetY;

        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.mover.style.webkitTransform = `translate3d(${x}px,${y}px,0)`;

        this.insert = insert || this.mover.cloneNode(true);
        this.insert.style.display = insert === false ? 'none' : 'block';
        this.insert.classList.remove('nuclear-drag-mover');
        this.insert.classList.add('nuclear-inserter');
        this.insert.style.webkitTransform = ``;

        document.body.classList.add('nuclear-disable-select');

        for (var i = 0; i < this.dragStartActions.length; i++) {
            this.dragStartActions[i](e, this.insert);
        }

        cb && cb(e, this.insert);
    }

    dragStartActions = [];

    _observeDragStart = (fn) => {
        this.dragStartActions.push(fn);
    }

    _unobserveDragStart = (fn) => {
        var index = this.dragStartActions.indexOf(fn);
        if (index != -1) {
            this.dragStartActions.splice(index, 1);
        }
    }

    dragEndActions = [];

    _observeDragEnd = (fn) => {
        this.dragEndActions.push(fn);
    }

    _unobserveDragEnd = (fn) => {
        var index = this.dragEndActions.indexOf(fn);
        if (index != -1) {
            this.dragEndActions.splice(index, 1);
        }
    }

    dragClickActions = [];

    _observeDragClick = (fn) => {
        this.dragClickActions.push(fn);
    }

    _unobserveDragClick = (fn) => {
        var index = this.dragClickActions.indexOf(fn);
        if (index != -1) {
            this.dragClickActions.splice(index, 1);
        }
    }

    onMouseMove = (e) => {
        if (this._isStart && this.dragable && this.movedTimes >= 1) {
            const x = e.pageX + this.offsetX;
            const y = e.pageY + this.offsetY;

            this.mover.style.display = 'block';
            this.mover.style.webkitTransform = `translate3d(${x}px,${y}px,0)`;
        }

        this.moved = true;
        this.movedTimes++;
    }

    onMouseUp = (e) => {
        !this.moved && this.props.onClick && this.props.onClick({
            type: 'click',
            target: this.clickTarget
        });
        this.moved = false;

        if (this._isStart) {
            this._isStart = false;

            var dragEndEvent = {
                target: e.target,
                source: this.source,
                moved: this.moved,
                movedTimes: this.movedTimes
            };

            if (!this.moved || this.movedTimes <= 1) {
                for (var i = 0; i < this.dragClickActions.length; i++) {
                    this.dragClickActions[i](dragEndEvent);
                }
            }

            if (!this.dragable) return;

            this.mover.innerHTML = '';
            this.mover.style.display = 'none';

            document.body.classList.remove('nuclear-disable-select');

            const insert = this.insert;
            if (insert) {
                if (insert.__cloneForDist) {
                    insert.__cloneForDist.__dragSource =
                        insert.__cloneForDist.__dragCursor =
                        insert.__cloneForDist = null;
                }
                insert.__dragSource = null;
                this.insert = null;
            }

            // 因为是捕获阶段监听的mouseup,所以要等待冒泡结束再触发事件
            this.props.onDragEnd && setTimeout(() => {
                for (var i = 0; i < this.dragEndActions.length; i++) {
                    this.dragEndActions[i](dragEndEvent);
                }
                this.props.onDragEnd(dragEndEvent, insert);
            }, 0);
        }
    }

    render() {
        const { className, children } = this.props;

        return (
            <div className={className}>{children}</div>
        );
    }
}

export class DragSource extends Component<{
    // 拖动时跟随鼠标移动的控件，默认DragSource自身的clone
    mover?: Component | Function,
    // 插入的node
    insert?: Component | Function | boolean,
    onDragStart?: () => any
}> {
    static contextTypes = {
        _dragStart: whatever,
        _mover: whatever
    }

    dragStart = (e) => {
        e.stopPropagation();

        const { mover: Mover, insert } = this.props;
        const options = {
            insert,
            source: this
        };
        const mover = this.context._mover;
        const onDragStart = (e, insert) => {
            insert.__dragSource = this;
            this.props.onDragStart && this.props.onDragStart(e, insert);
        };

        mover.style.width = '';
        mover.style.height = '';

        if (!Mover) {
            var node = ReactDOM.findDOMNode(this);
            var clone = node.cloneNode(true);
            var rect = node.getBoundingClientRect();

            mover.appendChild(clone);

            options.offsetX = rect.x - e.pageX + 5;
            options.offsetY = rect.y - e.pageY + 5;
            this.context._dragStart(e, options, onDragStart);
        } else {
            ReactDOM.render(<Mover></Mover>, mover, () => {
                this.context._dragStart(e, options, onDragStart);
            });
        }
    }

    render() {
        const { className, style, children } = this.props;

        return (
            <div
                className={className}
                onMouseDown={this.dragStart}
                style={style}
            >{children}</div>
        );
    }
}


export class DragDestination extends Component<{
    onDragOut?: (e: { target: HTMLElement, source: any }) => any,
    onPutDown?: (e: any) => any,
    onDragChange?: (e: any) => any,
    onDragMove?: (e: any) => any
}> {
    static contextTypes = {
        _observeDragStart: whatever,
        _unobserveDragStart: whatever,
        _observeDragEnd: whatever,
        _unobserveDragEnd: whatever,
        _getInsert: whatever
    }

    static childContextTypes = {
        _addDestination: whatever,
        _removeDestination: whatever
    }

    getChildContext() {
        return {
            _addDestination: this._addDestination,
            _removeDestination: this._removeDestination,
        };
    }

    constructor(props, context) {
        super(props, context);

        this.destinations = [];

        context._observeDragStart(this.onDragStart);
        context._observeDragEnd(this.onDragEnd);
    }

    componentWillUnmount() {
        this.context._unobserveDragStart(this.onDragStart);
        this.context._unobserveDragEnd(this.onDragEnd);
    }

    onDragStart = (e, insert) => {
        this._dragMoveTimes = 0;
    }

    onDragEnd = (e) => {
        this._dragMoveTimes = 0;
        this.place = null;
    }

    onDragMove = (e) => {
        let insert = this.context._getInsert();
        if (!insert) return;

        if (this._dragMoveTimes <= 1) {
            this._dragMoveTimes++;
            return;
        }
        const dragSource = insert.__dragSource;
        const { groups, position } = dragSource.props;
        const { group, onDragMove } = this.props;
        if (onDragMove && onDragMove(e, dragSource, insert) === false) return;
        if (groups && group && groups.indexOf(group) !== -1) {
            return;
        }

        const container = ReactDOM.findDOMNode(this);
        let place;

        if (position === 'fixed' || position === 'absolute') {
            place = {
                type: 'prepend',
                node: container,
                insert,
                destination: this
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

            if (!insert.__cloneForDist) {
                insert.__cloneForDist = insert.cloneNode(true);
                insert.__cloneForDist.__dragSource = this;
            }
            insert = insert.__cloneForDist;

            const destinations = [];

            this.destinations.forEach((destination) => {
                if (dragSource == destination) return;

                var destNode = ReactDOM.findDOMNode(destination);
                var draggingNode = destNode;
                while (draggingNode && draggingNode != container && draggingNode != document.body) {
                    if (draggingNode.classList.contains('nuclear-dragcusor-dragging')) return;
                    draggingNode = draggingNode.parentNode;
                }

                destinations.push({
                    node: destNode,
                    destination
                });
            });

            const eachDest = (fn) => {
                for (var i = 0; i < destinations.length; i++) {
                    fn(destinations[i]);
                }
            };

            const relativeDist = (parent) => {
                if (parent.children) return parent.children;

                var children = parent.children = [];
                eachDest((item) => {
                    if (parent != item && containsNode(parent.node, item.node)) {
                        if (item.parent) {
                            if (item.parent != parent) {
                                if (containsNode(parent.node, item.parent.node)) {
                                    // 如果parent是爷爷辈的就不继续
                                    relativeDist(item);
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
                        relativeDist(item);
                        children.push(item);
                    }
                });
                return parent;
            };

            const trees = [];

            eachDest((item) => {
                relativeDist(item);

                if (!item.parent) {
                    trees.push(item);
                }
            });

            const eachBranch = (branches, fn) => {
                for (var i = 0; i < branches.length; i++) {
                    var item = branches[i];
                    var destNode = item.node;
                    var destination = item.destination;

                    var rect = destNode.getBoundingClientRect();
                    var option = {
                        destination,
                        position: destination.position,
                        node: destNode,
                        x: rect.left,
                        y: rect.top,
                        height: rect.height,
                        width: rect.width,
                        centerX: rect.left + (rect.width / 2),
                        centerY: rect.top + (rect.height / 2)
                    };
                    option.distance = Math.abs(option.centerX - pageX) + Math.abs(option.centerY - pageY);

                    var res = fn({
                        ...item,
                        ...option
                    }, i);

                    if (res != null) {
                        return res;
                    }
                }
            };

            const isMouseIn = (dragItem) => {
                return pageX >= dragItem.x && pageX <= dragItem.x + dragItem.width && pageY >= dragItem.y && pageY <= dragItem.y + dragItem.height;
            };

            const findMouseIn = (branches) => {
                return eachBranch(branches, (item) => {
                    var pointIsInNode = isMouseIn(item);
                    if (pointIsInNode) {
                        var child = findMouseIn(item.children);
                        if (child) {
                            return child;
                        }
                        return item;
                    }
                });
            };

            let pointerIn = findMouseIn(trees);
            let nearest;

            const canInsertBeforeOrInsertAfter = (dragItem) => {
                return dragItem.destination.props.insertable !== false;
            };
            const canAppendTo = (dragItem) => {
                return !!dragItem.destination.dragAppendable;
            };

            if (pointerIn && !pointerIn.children.length && canInsertBeforeOrInsertAfter(pointerIn)) {
                nearest = pointerIn;
            } else {
                let comparers = pointerIn && pointerIn.children.length ? pointerIn.children : trees;

                eachBranch(comparers, (option) => {
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
                    nearest = pointerIn;
                }
            }

            if (nearest) {
                var insertType = canAppendTo(nearest)
                    && pageX > nearest.x && pageY > nearest.y
                    && pageX < nearest.x + nearest.width && pageY < nearest.y + nearest.height
                    ? 'append'
                    : pageX < nearest.x || pageY < nearest.y || (pageX < nearest.centerX && pageY < nearest.centerY)
                        ? 'before'
                        : 'after';

                place = {
                    type: insertType,
                    node: nearest.node,
                    insert,
                    destination: nearest.destination
                };
            } else {
                place = {
                    type: 'append',
                    node: container,
                    insert,
                    destination: this
                };
            }
        }

        if (!this.place || (this.place.node != place.node || this.place.type != place.type || this.place.insert != place.insert)) {
            if (!this.props.onDragChange || (this.props.onDragChange({
                target: this,
                source: insert.__dragSource,
                ...place
            }) !== false)) {
                if (place.type === 'before') {
                    insertBefore(place.node, insert);
                } else if (place.type === 'after') {
                    insertAfter(place.node, insert);
                } else if (place.type === 'prepend') {
                    place.node.firstChild
                        ? insertBefore(place.node.firstChild, insert)
                        : place.node.appendChild(insert);
                } else {
                    place.node.appendChild(insert);
                }
            }
        }
        insert.classList.remove('nuclear-inserter-del');
        this.place = place;
    }

    onDragOut = () => {
        if (this.place) {
            const insert = this.place.insert;
            insert.classList.add('nuclear-inserter-del');

            this.props.onDragOut && this.props.onDragOut({
                target: insert,
                source: insert.__dragSource,
                ...this.place
            });
            this.place = null;
        }
        this.stopAutoScroll();
    }

    onPutDown = (e) => {
        if (this.place) {
            const insert = this.place.insert;
            insert.parentNode && insert.parentNode.removeChild(insert);

            this.props.onPutDown && this.props.onPutDown({
                target: this,
                source: insert.__dragSource,
                ...this.place
            });
        }
    }

    _addDestination = (dest) => {
        this.destinations.push(dest);
    }

    _removeDestination = (dest) => {
        var index = this.destinations.indexOf(dest);
        if (index != -1) {
            this.destinations.splice(index, 1);
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
        const { className, children } = this.props;

        return (
            <div
                className={className}
                onMouseMove={this.onDragMove}
                onMouseLeave={this.onDragOut}
                onMouseUp={this.onPutDown}
            >{children}</div>
        );
    }
}

export class DragCursor extends Component<{
    onBeforeDragStart?: () => any,
    onDragStart?: () => any,
    // 前后是否可插入元素
    insertable: boolean,
    // 是否可拖拽
    dragable: boolean,
    // 是否可插入子DragCursor
    appendable: boolean,
    // 定位: absolute|relative|static
    position: string
}> {
    static contextTypes = {
        _addDestination: whatever,
        _removeDestination: whatever,
        _mover: whatever,
        _dragStart: whatever,
        _observeDragEnd: whatever,
        _unobserveDragEnd: whatever,
        _observeDragClick: whatever,
        _unobserveDragClick: whatever
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            dragging: false
        };

        context._addDestination(this);
        context._observeDragClick(this.onClick);
        context._observeDragEnd(this.onDragEnd);
    }

    dragStart = (e) => {
        if (this.props.onBeforeDragStart && false === this.props.onBeforeDragStart(e)) {
            return;
        }

        e.stopPropagation();

        const { dragable = true, insertable = true } = this.props;
        const options = {
            source: this,
            dragable,
            insertable
        };

        if (!dragable) {
            this.context._dragStart(e, options);
            return;
        }

        this.setState({
            dragging: true
        });

        const mover = this.context._mover;

        var node = ReactDOM.findDOMNode(this);
        var moverClone = node.cloneNode(true);
        var inserterClone = node.cloneNode(true);
        var rect = node.getBoundingClientRect();

        mover.style.width = rect.width + 'px';
        mover.style.height = rect.height + 'px';
        mover.appendChild(moverClone);
        options.offsetX = rect.x - e.pageX + 5;
        options.offsetY = rect.y - e.pageY + 5;

        this.inserterClone = inserterClone;
        inserterClone.style.pointerEvents = 'none';
        node.parentNode.insertBefore(inserterClone, node);

        this.context._dragStart(e, options, (e, insert) => {
            insert.__dragSource = this;
            insert.__cloneForDist = inserterClone;
            insert.__cloneForDist.__dragSource = this;
            this.props.onDragStart && this.props.onDragStart(e, insert);
        });
    }

    onDragEnd = (e) => {
        if (e.source == this) {
            this.setState({
                dragging: false
            });
            if (this.inserterClone) {
                this.inserterClone.parentNode && this.inserterClone.parentNode.removeChild(this.inserterClone);
                this.inserterClone = null;
            }
        }
    }

    componentWillUnmount() {
        this.context._unobserveDragEnd(this.onDragEnd);
        this.context._unobserveDragClick(this.onClick);
        this.context._removeDestination(this);
    }

    onClick = (e) => {
        if (e.source == this) {
            this.props.onClick && this.props.onClick(e);
        }
    }

    render() {
        const { className, style, children, appendable } = this.props;

        this.dragAppendable = appendable;

        return (
            <div
                className={(this.state.dragging ? 'nuclear-dragcusor-dragging ' : '') + className}
                style={style}
                onMouseDown={this.dragStart}
            >{children}</div>
        );
    }
}