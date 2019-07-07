import React from 'react';
import { inject } from 'snowball/app';
import { DropTarget } from '../../../../components/drag';
import { Toolbar } from './Toolbar';
import { renderDecoration } from '../../shared/decorationUtils';

const Main = ({ currentTab, currentPage, decorationHandler, windowService }) => {
    const currentAtoms = (currentTab && currentTab.atoms) || [];
    return (
        <div className="flex_1 nc-window-main">
            <Toolbar
                currentTab={currentTab}
                currentPage={currentPage}
            ></Toolbar>
            <DropTarget
                className="of_s h_1x nc-root dock"
            >
                {renderDecoration(currentAtoms, decorationHandler, ['root'], {})}
            </DropTarget>
        </div>
    );
};

const MainInjector = inject('currentPage', 'currentTab', 'decorationHandler', 'windowService')(Main);

export { MainInjector as Main };