import React from 'react';
import './App.css';
import { Drag, DragSource, DropTarget } from './components/drag';

const AppContext = React.createContext();

function App() {

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
                <DropTarget style={{ height: 100, background: '#ddd' }}></DropTarget>
            </Drag>
        </AppContext.Provider>
    );
}

export default App;
