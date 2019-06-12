import ReactDOM from 'react-dom';

export function containsNode(node, childNode) {
    if (childNode === node) return false;

    while ((childNode = childNode.parentNode)) {
        if (childNode === node) return true;
    }
    return false;
}

export function insertAfter(node, newNode) {
    if (node.parentNode && node.nextSibling != newNode) {
        node.nextSibling
            ? node.parentNode.insertBefore(newNode, node.nextSibling)
            : node.parentNode.appendChild(newNode);
    }
}

export function insertBefore(node, newNode) {
    if (node.parentNode && node.previousSibling != newNode) {
        node.parentNode.insertBefore(newNode, node);
    }
}