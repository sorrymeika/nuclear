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
        <div className="nc_window__toolbar">
            <div className="flex" style={{ paddingLeft: 10, width: '100%', height: '100%', overflowX: 'auto' }}>
                <div
                    className={"nc_window__toolbar_tab" + (currentTabId == 'main' ? ' curr' : '')}
                    onClick={() => onSwitchTab('main')}
                >
                    <h4>
                        {
                            !currentPage
                                ? '主窗口'
                                : ((currentPage.project
                                    ? currentPage.project.replace('../', '') + '/'
                                    : '') + (currentPage.name || '主窗口'))
                        }
                    </h4>
                </div>
                {
                    !!dialogs && dialogs.map((dialog, i) => {
                        return (
                            <div
                                key={dialog.name}
                                className={"nc_window__toolbar_tab" + (currentTabId == dialog.id ? ' curr' : '')}
                                style={{ zIndex: 2 + i }}
                                onClick={() => onSwitchTab(dialog.id)}
                            ><h4>{dialog.name}</h4></div>
                        );
                    })
                }
                <button
                    className="nc_window__toolbar_add"
                    onClick={onAddDialog}
                ></button>
                <div className="flexitem"></div>
                {
                    currentTabId == 'main'
                        ? null
                        : <button
                            className="nc_window__toolbar_edit"
                            onClick={onRemoveDialog}
                        >X</button>
                }
                <button
                    className="nc_window__toolbar_edit"
                    onClick={onEditPage}
                >...</button>
                <button
                    className="nc_window__toolbar_edit"
                    onClick={onEditUIJson}
                >UI</button>
                <button
                    className="nc_window__toolbar_edit"
                    onClick={onEditCss}
                >CSS</button>
                <button
                    className="nc_window__toolbar_edit"
                    onClick={onSavePage}
                >保存</button>
            </div>
        </div>
    );
};