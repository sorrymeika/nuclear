import { style as addStylesheet } from 'snowball/utils';

addStylesheet('nc-drag',
    '.nc-dnd-disable-select{-webkit-user-select: none; -webkit-touch-callout: none; user-select: none;}' +
    '.nc-dnd-mover{display:none;position:fixed;top:0;left:0;width:auto;height:auto;opacity:.7;pointer-events:none;z-index:9999;}' +
    '.nc-dnd-preview-del { opacity: .3 }' +
    '.nc-drag-item-dragging { display: none !important; }'
);

export { default as Drag } from './Drag';
export { default as DragSource } from './DragSource';
export { default as DragItem } from './DragItem';
export { default as DropTarget } from './DropTarget';