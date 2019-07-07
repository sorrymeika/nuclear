import React, { Component } from 'react';
import { EventEmitter } from 'snowball';

export const DragContext = React.createContext();

export default class Drag extends Component {
    constructor(props) {
        super(props);

        this.eventEmitter = new EventEmitter();

        const mover = document.createElement('div');
        mover.className = 'nc-dnd-mover';
        document.body.appendChild(mover);

        this.mover = mover;
        this.dndState = {};

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
        this.mouseStartX = e.pageX;
        this.mouseStartY = e.pageY;
        this.mouseDownTarget = e.target;
    }

    doDragStart = (e, options) => {
        const {
            source,
            previewElement,
            sourceType,
            offsetX = 0,
            offsetY = 0
        } = options;

        const x = e.pageX + offsetX;
        const y = e.pageY + offsetY;

        this.mover.style.webkitTransform = `translate3d(${x}px,${y}px,0)`;

        const preview = previewElement || this.mover.cloneNode(true);

        preview.style.display = previewElement === false ? 'none' : '';
        preview.classList.remove('nc-dnd-mover');
        preview.classList.add('nc-dnd-preview');
        preview.style.webkitTransform = ``;

        document.body.classList.add('nc-dnd-disable-select');

        this._isStart = true;
        this.moveLongEnough = false;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.current = {
            source,
            sourceType,
            previewElement: preview
        };
        this.dndState.status = 'start';

        const dragEvent = {
            type: 'dragstart',
            nativeEvent: e,
            source,
            current: this.current
        };
        this.eventEmitter.trigger(dragEvent);
        this.props.onDragStart && this.props.onDragStart(dragEvent);
    }

    onMouseMove = (e) => {
        if (this._isStart) {
            if (this.moveLongEnough) {
                const x = e.pageX + this.offsetX;
                const y = e.pageY + this.offsetY;

                this.mover.style.display = 'block';
                this.mover.style.webkitTransform = `translate3d(${x}px,${y}px,0)`;
            } else if (Math.abs(this.mouseStartX - e.pageX) > 6 || Math.abs(this.mouseStartY - e.pageY) > 6) {
                this.moveLongEnough = true;
            }
        }
    }

    onMouseUp = (e) => {
        if (!this._isStart) return;
        this._isStart = false;

        if (!this.moveLongEnough) {
            const { onClick } = this.current.source.props;
            onClick && onClick({
                type: 'click',
                target: e.target
            });
        }

        this.mover.style.display = 'none';
        this.mover.innerHTML = '';

        document.body.classList.remove('nc-dnd-disable-select');
        if (this.dndState.status === 'dragout') {
            this.current.previewElement && this.current.previewElement.parentNode.removeChild(this.current.previewElement);
        }

        const dropEvent = {
            type: 'dragend',
            nativeEvent: e,
            source: this.current.source,
            sourceType: this.current.sourceType
        };
        this.eventEmitter.trigger(dropEvent);
        this.current = null;

        if (this.moveLongEnough && this.dndState.status !== 'start') {
            // 因为是捕获阶段监听的mouseup,所以要等待冒泡结束再触发事件
            setTimeout(() => {
                this.props.onDrop && this.props.onDrop({
                    ...dropEvent,
                    ...this.dndState,
                    type: 'drop'
                });
            }, 0);
        }
    }

    subscribe = (type, fn) => {
        this.eventEmitter.on(type, fn);
        return () => {
            this.eventEmitter.off(type, fn);
        };
    }

    getCurrent = () => this.current;

    setDndState = (dndState) => {
        this.dndState = dndState;
    }

    render() {
        const { className, children } = this.props;

        return (
            <DragContext.Provider value={{
                mover: this.mover,
                doDragStart: this.doDragStart,
                subscribe: this.subscribe,
                getCurrent: this.getCurrent,
                setDndState: this.setDndState
            }}>
                <div className={className}>{children}</div>
            </DragContext.Provider>
        );
    }
}

