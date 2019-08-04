import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export interface IDraggableListProps {
    draggable: string | boolean,
    onDragEnd?: (oldIndex, newIndex) => any
}

export default class DraggableList extends Component<IDraggableListProps, never> {

    componentDidMount() {
        if (!this.props.draggable) return null;

        var draggable = this.props.draggable;
        var items;
        var clone;
        var offset;
        var movingItem;
        var oldIndex;
        var list = ReactDOM.findDOMNode(this);
        var isStart;
        var startX;
        var startY;

        list.style.userSelect = "none";

        list.addEventListener('mousedown', (e) => {
            if (clone) return;

            movingItem = null;
            items = [].slice.call(list.querySelectorAll(draggable));
            oldIndex = -1;
            isStart = false;

            var target = e.target;
            var findItem = (item) => item === target;
            while (target) {
                oldIndex = items.findIndex(findItem);
                if (oldIndex !== -1) {
                    break;
                }
                target = target.parentNode;
            }
            if (oldIndex !== -1) {
                var node = movingItem = items[oldIndex];

                items.splice(oldIndex, 1);

                offset = node.getBoundingClientRect();

                clone = movingItem.cloneNode(true);

                clone.style.position = "fixed";
                clone.style.boxSizing = "border-box";
                clone.style.width = movingItem.offsetWidth + 'px';
                clone.style.height = movingItem.offsetHeight + 'px';
                clone.style.left = offset.x + 'px';
                clone.style.top = offset.y + 'px';
                clone.style.zIndex = 1000;
                clone.style.opacity = .8;
                clone.style.pointerEvents = 'none';

                startX = e.pageX;
                startY = e.pageY;

                offset = {
                    x: offset.x - e.pageX,
                    y: offset.y - e.pageY
                };
            }
        }, false);

        document.body.addEventListener('mousemove', (this._move = (e) => {
            if (clone) {
                if (!isStart) {
                    if (Math.abs(e.pageX - startX) > 8 || Math.abs(e.pageY - startY) > 8) {
                        isStart = true;
                    } else {
                        return;
                    }
                }
                if (!movingItem.parentNode) return;
                if (!clone.parentNode) movingItem.parentNode.appendChild(clone);

                clone.style.left = e.pageX + offset.x + 'px';
                clone.style.top = e.pageY + offset.y + 'px';

                for (var i = 0; i < items.length; i++) {
                    var rect = items[i].getBoundingClientRect();
                    if (
                        (e.pageX < rect.x + (rect.width / 2) && e.pageY < rect.y + rect.height)
                        || (e.pageY < rect.y + (rect.height / 2) && e.pageX < rect.x + rect.width)
                    ) {
                        movingItem.parentNode.insertBefore(movingItem, items[i]);
                        break;
                    }
                    if (i === items.length - 1) {
                        movingItem.parentNode.appendChild(movingItem);
                    }
                }
            }
        }), false);

        document.body.addEventListener('mouseup', (this._mouseUp = () => {
            if (clone) {
                clone.parentNode && clone.parentNode.removeChild(clone);

                var newItems = [].slice.call(list.querySelectorAll(draggable));
                var newIndex = newItems.findIndex((item) => item === movingItem);

                if (newIndex !== oldIndex) {
                    this.props.onDragEnd && this.props.onDragEnd(oldIndex, newIndex);
                }

                movingItem = null;
                clone = null;
            }
        }), false);
    }

    componentWillUnmount() {
        this._move && document.body.removeEventListener('mousemove', this._move, false);
        this._mouseUp && document.body.removeEventListener('mouseup', this._mouseUp, false);
    }

    render() {
        return (
            <div
                className={this.props.className}
            >
                {this.props.children}
            </div>
        );
    }
}
