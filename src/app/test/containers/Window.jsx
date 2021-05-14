import React from 'react';
import { Drag } from "../components/Drag";
import Sidebar from '../components/Sidebar';
import ComponentList from '../components/ComponentList';
import Main from '../components/Main';

export default function Window({ components }) {

    return <Drag className="nc-window">
        <Sidebar>
            <ComponentList components={components} />
        </Sidebar>
        <Main>

        </Main>
    </Drag>;
}