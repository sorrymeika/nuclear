import React from 'react';
import { Drop } from './Drag';

const Main = ({ toolbar }) => {
    return (
        <div className="nc-window-main">
            {toolbar}
            <Drop
                className="of_s h_1x nc-root dock"
            >
            </Drop>
        </div>
    );
};


export default Main;
