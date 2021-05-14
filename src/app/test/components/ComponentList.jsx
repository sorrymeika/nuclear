import React from 'react';
import { DragSource } from './Drag';

export default function ComponentList({ className, components }) {
    return (
        <div className={"nc-window-component-list"}>
            {
                components.map((group) => {
                    return (
                        <div key={group.name}>
                            <div className="nc-window-component-list-hd">{group.name}</div>
                            <ul className="flexwrap nc-window-component-list-group-item">
                                {
                                    group.items.map((item) => (
                                        <DragSource
                                            htmlType="li"
                                            key={item.type}
                                            className="nc-window-component-list-item"
                                            data={item}
                                        >{item.name}</DragSource>
                                    ))
                                }
                            </ul>
                        </div>
                    );
                })
            }
        </div>
    );
}