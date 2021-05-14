import { $, util } from 'snowball';
import ReactDOM from 'react-dom';
import React, { PureComponent, useEffect, useRef } from 'react';

util.style('nc-dnd-css', `[nc-dnd] {user-select: none;}
.nc-dnd-remover{ opacity: .5; }`);

export function Drag({ onDrop, onChange, ...props }) {
    const containerRef = useRef();

    useEffect(() => {
        let currentDnd = null;
        let dndRemover = document.createElement('DIV');
        dndRemover.className = 'nc-dnd-remover';

        const handleDndChange = (type, destNode) => {
            if (currentDnd.result && currentDnd.result.type == type && currentDnd.result.destNode == destNode) {
                return;
            }
            const result = {
                type,
                destNode
            };
            onChange && onChange(createDndEvent(currentDnd.result));

            // TODO: preventDefault();
            switch (type) {
                case 'append':
                    destNode.appendChild(currentDnd.el);
                    break;
                case 'before':
                    insertBefore(destNode, currentDnd.el);
                    break;
                case 'after':
                    insertAfter(destNode, currentDnd.el);
                    break;
                case 'remove':
                    if (currentDnd.el.parentNode) {
                        insertBefore(currentDnd.el, dndRemover);
                        dndRemover.appendChild(currentDnd.el);
                    }
                    break;
            }

            if (type != 'remove' && currentDnd.result && currentDnd.result.type == 'remove') {
                $(dndRemover).remove();
            }
            currentDnd.result = result;
        };

        const handleMouseDown = (e) => {
            disposeCurrentDnd();
            let target = e.currentTarget;
            while (target) {
                if (isDragable(target) && !isFixed(target)) {
                    let dndEl;
                    if (isSource(target)) {
                        // TODO: use source element
                        dndEl = target.cloneNode(true);
                        dndEl.style.width = target.offsetWidth + 'px';
                        dndEl.style.height = target.offsetHeight + 'px';
                    } else {
                        dndEl = target;
                    }
                    currentDnd = {
                        el: dndEl,
                        isStart: false,
                        startPageX: e.pageX,
                        startPageY: e.pageY,
                    };
                    break;
                }
                target = $(target).closest('[nc-dnd]')[0];
            }
        };

        const handleMouseMove = (e) => {
            if (currentDnd) {
                if (!currentDnd.isStart) {
                    if (Math.max(Math.abs(currentDnd.startPageX - e.pageX), Math.abs(currentDnd.startPageY - e.pageY)) >= 5) {
                        currentDnd.isStart = true;
                        currentDnd.ghost = createGhost(currentDnd.el);
                        currentDnd.dndNodes = $(containerRef.current)
                            .find('[nc-dnd]')
                            .filter((i, el) => {
                                return !isSource(el);
                            });
                        const originPlace = document.createComment('origin place');
                        insertBefore(currentDnd.el, originPlace);
                        currentDnd.originPlace = originPlace;
                    } else {
                        return;
                    }
                }
                currentDnd.ghost.style.transform = `translate(${e.pageX}px,${e.pageY}px)`;

                let insideNode;
                currentDnd.dndNodes.each((i, el) => {
                    const rect = el.getBoundingClientRect();
                    if (isInRect(e.pageX, e.pageY, rect)) {
                        if (!insideNode || insideNode.contains(el)) {
                            insideNode = el;
                        }
                    }
                });

                if (insideNode && insideNode != currentDnd.el && !currentDnd.el.contains(insideNode)) {
                    const children = $('[nc-dnd]', insideNode)
                        .filter((i, el) => {
                            return !isFixed(el) && !isSource(el);
                        });
                    if (children.length) {
                        // 插入到 children 中间
                        // 找到角距最近的
                        let nearest;
                        let minDistance = -1;
                        children.each((i, el) => {
                            const rect = el.getBoundingClientRect();
                            const { left, top, width, height } = rect;
                            const distance = Math.min(
                                Math.abs(left - e.pageX) + Math.abs(top - e.pageY),
                                Math.abs(left - e.pageX) + Math.abs(top + height - e.pageY),
                                Math.abs(left + width - e.pageX) + Math.abs(top - e.pageY),
                                Math.abs(left + width - e.pageX) + Math.abs(top + height - e.pageY),
                            );
                            if (minDistance == -1 || distance < minDistance) {
                                minDistance = distance;
                                nearest = el;
                            }
                        });
                        if (nearest && nearest != currentDnd.el) {
                            const maxOffset = 10;
                            const { left, top, width, height } = nearest.getBoundingClientRect();
                            const isInRange = isInRect(e.pageX, e.pageY, {
                                top: top - maxOffset,
                                left: left - maxOffset,
                                width: width + (maxOffset * 2),
                                height: height + (maxOffset * 2),
                            });
                            if (isInRange) {
                                if (e.pageX < left || e.pageY < top) {
                                    handleDndChange('before', nearest);
                                } else if (e.pageX > left + width || e.pageY > top + height) {
                                    handleDndChange('after', nearest);
                                }
                            }
                        }
                    } else {
                        // 如果允许插入子node，则插入，否则根据位置判断插入到当前DOM的前面还是后面
                        if (isAppendable(insideNode)) {
                            handleDndChange('append', insideNode);
                        } else {
                            // 一个block分左上、右上、左下和右下四块
                            const position = getPointPosition(e.pageX, e.pageY, insideNode.getBoundingClientRect());
                            if (currentDnd.insideNode != insideNode) {
                                currentDnd.insideNode = insideNode;
                                currentDnd.position = position;
                            }
                            if (position != currentDnd.position) {
                                handleDndChange(currentDnd.position == 'tl' || position == 'br'
                                    ? 'after'
                                    : 'before', insideNode);
                                currentDnd.position = position;
                            }
                        }
                    }
                } else if (!insideNode) {
                    // 可拖拽区域外，删除DOM
                    currentDnd.insideNode = null;
                    handleDndChange('remove', currentDnd.el);
                }
            }
        };

        const handleMouseUp = () => {
            if (currentDnd) {
                const result = currentDnd.result;
                result && onDrop && onDrop(createDndEvent(result));

                // TODO: preventDefault();
                currentDnd.originPlace && insertBefore(currentDnd.originPlace, currentDnd.el);

                disposeCurrentDnd();
            }
        };

        const createDndEvent = (result) => {
            return {
                data: result.destNode.data,
                target: result.destNode,
                type: result.type
            };
        };

        const disposeCurrentDnd = () => {
            if (currentDnd) {
                currentDnd.ghost && $(currentDnd.ghost).remove();
                currentDnd.originPlace && $(currentDnd.originPlace).remove();
                currentDnd = null;
            }
        };

        $(document.body).on('mousedown', '[nc-dnd]', handleMouseDown)
            .on('mousemove', handleMouseMove)
            .on('mouseup', handleMouseUp, true);

        return () => {
            $(document.body).off('mousedown', '[nc-dnd]', handleMouseDown)
                .off('mousemove', handleMouseMove)
                .off('mouseup', handleMouseUp, true);
        };
    }, [onChange, onDrop]);

    return <div
        ref={containerRef}
        {...props}
    />;
}

function createGhost(el, options = {}) {
    const { width, height } = options;
    const ghost = document.createElement('div');
    ghost.style.cssText = `pointer-events:none;cursor:default;position:absolute;z-index: 10000;top:0;left:0;opacity:.5;width: ${width || el.offsetWidth}px;height: ${height || el.offsetHeight}px;`;
    const clone = el.cloneNode(true);
    clone.style.marginLeft = "0px";
    clone.style.marginTop = "0px";
    ghost.appendChild(clone);
    document.body.appendChild(ghost);
    return ghost;
}

function getPointPosition(x, y, rect) {
    let isLeft = x <= rect.left + (rect.width / 2);
    let isTop = y <= rect.top + (rect.height / 2);
    if (isLeft && isTop) {
        return 'tl';
    }
    if (isLeft && !isTop) {
        return 'bl';
    }
    if (!isLeft && isTop) {
        return 'tr';
    }
    return 'br';
}

function isAppendable(el) {
    const attr = el.getAttribute('nc-dnd');
    return attr && attr.includes('appendable,');
}

function isDragable(el) {
    const attr = el.getAttribute('nc-dnd');
    return attr && attr.includes('dragable,');
}

function isFixed(el) {
    const attr = el.getAttribute('nc-dnd');
    return attr && attr.includes('fixed,');
}

function isSource(el) {
    const attr = el.getAttribute('nc-dnd');
    return attr && attr.includes('source,');
}

function isInRect(x, y, rect) {
    const { top, left, width, height } = rect;
    return x >= left && y >= top && x <= left + width && y <= top + height;
}

function insertAfter(destNode, newNode) {
    if (destNode.nextSibling != newNode) {
        destNode.nextSibling
            ? destNode.parentNode.insertBefore(newNode, destNode.nextSibling)
            : destNode.parentNode.appendChild(newNode);
    }
}

function insertBefore(destNode, newNode) {
    if (destNode.parentNode) {
        destNode.parentNode.insertBefore(newNode, destNode);
    }
}

export class DragItem extends PureComponent {
    componentDidMount() {
        this.updateAttribute();
    }

    componentDidUpdate() {
        this.updateAttribute();
    }

    componentWillUnmount() {
        const container = ReactDOM.findDOMNode(this);
        container.removeAttribute('nc-dnd');
        container.data = null;
    }

    updateAttribute() {
        const container = ReactDOM.findDOMNode(this);
        const {
            dragable = true,
            appendable = false,
            source = false,
            sourceElement,
            fixed,
            data,
            domRef
        } = this.props;
        let attrs = '';
        if (dragable) {
            attrs += 'dragable,';
        }
        if (appendable) {
            attrs += 'appendable,';
        }
        if (fixed) {
            attrs += 'fixed,';
        }
        if (source) {
            attrs += 'source,';
            container.sourceElement = sourceElement;
        }
        container.setAttribute('nc-dnd', attrs);
        container.data = data;
        if (domRef) {
            domRef.current = container;
        }
    }

    render() {
        const { children, htmlType, source, appendable, fixed, domRef, ...props } = this.props;
        if (htmlType) {
            props.ref = domRef;
            return React.createElement(htmlType, props, children);
        }
        return React.Children.only(children);
    }
}

export function DragSource(props) {
    return <DragItem
        htmlType="div"
        {...props}
        source
    />;
}

export function Drop(props) {
    return <DragItem
        htmlType="div"
        {...props}
        fixed
        appendable
    />;
}