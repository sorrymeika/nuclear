import { style as addStylesheet } from '../../utils';

addStylesheet('nuclear-drag',
    '.nuclear-dnd-disable-select{-webkit-user-select: none; -webkit-touch-callout: none; user-select: none;}' +
    '.nuclear-dnd-mover{display:none;position:fixed;top:0;left:0;width:auto;height:auto;opacity:.7;pointer-events:none;z-index:9999;}' +
    '.nuclear-dnd-preview-del { opacity: .3 }' +
    '.nuclear-drag-item-dragging { display: none !important; }'
);