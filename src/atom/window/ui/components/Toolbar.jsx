import React from 'react';
import { inject } from 'snowball/app';
import WindowService from '../services/WindowService';

const Toolbar = ({
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
        <div className="nc-window-toolbar">
            <div className="flex" style={{ paddingLeft: 10, width: '100%', height: '100%', overflowX: 'auto' }}>
                <div
                    className={"nc-window-toolbar-tab" + (currentTabId == 'main' ? ' curr' : '')}
                    onClick={() => onSwitchTab('main')}
                >
                    <div className="nc-window-toolbar-tab-name">
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
                                className={"nc-window-toolbar-tab" + (currentTabId == dialog.id ? ' curr' : '')}
                                style={{ zIndex: 2 + i }}
                                onClick={() => onSwitchTab(dialog.id)}
                            ><div className="nc-window-toolbar-tab-name">{dialog.name}</div></div>
                        );
                    })
                }
                <button
                    className="nc-window-toolbar-add-button"
                    onClick={onAddDialog}
                ></button>
                <div className="flexitem"></div>
                {
                    currentTabId == 'main'
                        ? null
                        : <button
                            className="nc-window-toolbar-button"
                            onClick={onRemoveDialog}
                        >X</button>
                }
                <button
                    className="nc-window-toolbar-button"
                    onClick={onEditPage}
                >...</button>
                <button
                    className="nc-window-toolbar-button"
                    onClick={onEditUIJson}
                >UI</button>
                <button
                    className="nc-window-toolbar-button"
                    onClick={onEditCss}
                >CSS</button>
                <button
                    className="nc-window-toolbar-button"
                    onClick={onSavePage}
                >保存</button>
            </div>
        </div>
    );
};

type ToolbarInjectorProps = {
    windowService: WindowService
}

const ToolbarInjector = inject(({ windowService }: ToolbarInjectorProps) => ({
    onEditPage: windowService.editPage
}))(Toolbar);

export { ToolbarInjector as Toolbar };