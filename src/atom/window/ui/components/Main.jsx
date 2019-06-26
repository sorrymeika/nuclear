import React from 'react';
import { inject } from 'snowball/app';
import { DropTarget } from '../../../../components/drag';
import { Toolbar } from './Toolbar';

const Main = ({ currentTab, currentPage }) => {
    return (
        <div className="flex_1 nc_window__content">
            <Toolbar
                currentTab={currentTab}
                currentPage={currentPage}
            ></Toolbar>
            <DropTarget
                className="of_s h_1x nuclear-root dock"
            >
            </DropTarget>
        </div>
    );
};

const MainInjector = inject(({ windowService }) => ({
    currentTab: windowService.currentTab,
    currentPage: windowService.currentPage
}))(Main);

export { MainInjector as Main };