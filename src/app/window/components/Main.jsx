import React from 'react';
import { inject } from 'snowball/app';
import { DropTarget } from '../../../components/drag';
import { renderDecoration } from '../../../atom-core/decorationUtils';

const Main = ({ toolbar, currentTab, decorationHandler }) => {
    const currentAtoms = (currentTab && currentTab.atoms) || [];

    return (
        <div className="flex_1 nc-window-main">
            {toolbar}
            <DropTarget
                className="of_s h_1x nc-root dock"
            >
                {renderDecoration(currentAtoms, decorationHandler, ['root'], {})}
            </DropTarget>
        </div>
    );
};

const MainInjector = inject('currentTab', 'decorationHandler')(Main);

export { MainInjector as Main };
