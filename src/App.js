import React from 'react';
import './App.css';

const AppContext = React.createContext();

function App() {
    return (
        <AppContext.Provider value={{ test: 1, name: 'asdf' }}>
            <div className="App" app-drag="container">
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
        </AppContext.Provider>
    );
}

export default App;
