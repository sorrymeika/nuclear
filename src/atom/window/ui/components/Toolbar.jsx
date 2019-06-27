import React from 'react';

export const Toolbar = ({
    currentPage,
    currentTab,
    onSwitchTab,
    onAddDialog,
    onRemoveDialog,
    onEditPage,
    onEditUIJson,
    onEditCss,
    onSavePage
}) => {
    const currentTabId = currentTab ? currentTab.id : 'main';
    const dialogs = currentPage ? currentPage.dialogs : null;

    return (
        <div className="nuclear-window-toolbar">
            <div className="flex" style={{ paddingLeft: 10, width: '100%', height: '100%', overflowX: 'auto' }}>
                <div
                    className={"nuclear-window-toolbar-tab" + (currentTabId == 'main' ? ' curr' : '')}
                    onClick={() => onSwitchTab('main')}
                >
                    <div className="nuclear-window-toolbar-tab-name">
                        {
                            !currentPage
                                ? '主窗口'
                                : ((currentPage.project
                                    ? currentPage.project.replace('../', '') + '/'
                                    : '') + (currentPage.name || '主窗口'))
                        }
                    </div>
                </div>
                {
                    !!dialogs && dialogs.map((dialog, i) => {
                        return (
                            <div
                                key={dialog.name}
                                className={"nuclear-window-toolbar-tab" + (currentTabId == dialog.id ? ' curr' : '')}
                                style={{ zIndex: 2 + i }}
                                onClick={() => onSwitchTab(dialog.id)}
                            ><div className="nuclear-window-toolbar-tab-name">{dialog.name}</div></div>
                        );
                    })
                }
                <button
                    className="nuclear-window-toolbar-add-button"
                    onClick={onAddDialog}
                ></button>
                <div className="flexitem"></div>
                {
                    currentTabId == 'main'
                        ? null
                        : <button
                            className="nuclear-window-toolbar-button"
                            onClick={onRemoveDialog}
                        >X</button>
                }
                <button
                    className="nuclear-window-toolbar-button"
                    onClick={onEditPage}
                >...</button>
                <button
                    className="nuclear-window-toolbar-button"
                    onClick={onEditUIJson}
                >UI</button>
                <button
                    className="nuclear-window-toolbar-button"
                    onClick={onEditCss}
                >CSS</button>
                <button
                    className="nuclear-window-toolbar-button"
                    onClick={onSavePage}
                >保存</button>
            </div>
        </div>
    );
};