import React from 'react';
import { inject } from 'snowball/app';
import { DropTarget } from '../../../../components/drag';
import { Toolbar } from './Toolbar';

const Main = ({ currentTab, currentPage }) => {
    return (
        <div className="flex_1 nuclear-window-main">
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

const MainInjector = inject('currentPage', 'currentTab')(Main);

export { MainInjector as Main };