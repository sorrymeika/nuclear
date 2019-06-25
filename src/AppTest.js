
import React from 'react';
import { Drag, DragSource, DropTarget, DragItem } from './components/drag';
import MobxTest from './components/test/MobxTest';

const AppContext = React.createContext();

function AppTest() {
    return (
        <AppContext.Provider value={{ test: 1, name: 'asdf' }}>
            <div className="App">
                asdfasf
                <AppContext.Consumer>
                    {
                        (props) => {
                            return props.test;
                        }
                    }
                </AppContext.Consumer>
                <AppContext.Consumer>
                    {
                        (props) => {
                            return <AppContext.Provider value={{ ...props, test: 2 }}>
                                <div>
                                    <AppContext.Consumer>
                                        {
                                            (props) => {
                                                return props.name;
                                            }
                                        }
                                    </AppContext.Consumer>
                                </div>
                            </AppContext.Provider>;
                        }
                    }
                </AppContext.Consumer>
            </div>
            <Drag
                onDrop={(e) => {
                    console.log(e);
                }}
            >
                <div>
                    <DragSource>asdfasf</DragSource>
                </div>
                <DropTarget style={{ height: 100, background: '#ddd' }}>
                    <DragItem>12345</DragItem>
                </DropTarget>
            </Drag>
            <MobxTest></MobxTest>
        </AppContext.Provider>
    );
}

export default AppTest;
