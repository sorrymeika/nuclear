import React from 'react';
import { DragSource } from '../../../../components/drag';

export function AtomBox({ atomGroups }) {
    return (
        <div className="nuclear-window-atom-box">
            <div className="of_s h_1x">
                {
                    atomGroups.map((atomGroup) => {
                        return (
                            <div key={atomGroup.groupName}>
                                <div className="nuclear-window-atom-box-hd">{atomGroup.groupName}</div>
                                <div className="flexwrap nuclear-window-atom-box-group-item">
                                    {
                                        atomGroup.items.map((item) => (
                                            <DragSource
                                                key={item.type}
                                                className="nuclear-window-atom-box-item"
                                                data={item}
                                            >{item.name}</DragSource>
                                        ))
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}