import React from "react";
import ReactDOM from "react-dom";

import { $, isFunction } from '../../utils';
import { EventEmitter } from '../../core/event';

import { IPage, Location, IApplication } from '../types';

export const PageContext = React.createContext();

export default class Page extends EventEmitter implements IPage {
    constructor(componentFactory, location: Location, application: IApplication, mapStoreToProps) {
        super();

        this.location = location;
        this.$el = $('<div class="app-view" route-path="' + location.path + '"></div>')
            .appendTo(application.rootElement);
        this.el = this.$el[0];
        this.messageChannel = new EventEmitter();
        this._mapStoreToProps = mapStoreToProps;
        this._componentFactory = isFunction(componentFactory.render)
            ? React.createFactory(componentFactory)
            : componentFactory;

        this.on('destroy', () => {
            Promise.resolve().then(() => {
                ReactDOM.unmountComponentAtNode(this.el);
                this.$el.remove();
            });
        });
    }

    setProps(props) {
        if (!this.isSetup) {
            this.isSetup = true;
            this._setup(props);
        } else {
            this.render(Object.assign(this.store, props));
        }
    }

    _setup(props) {
        const store = {
            ...props
        };
        this.store = store;

        if (this._mapStoreToProps) {
            const data = this._mapStoreToProps(store);
            if (typeof data === 'function') {
                data((newData) => {
                    this.render(Object.assign(this.store, newData));
                });
            } else {
                this.render(Object.assign(store, data));
            }
        } else {
            this.render(store);
        }
    }

    $(selector) {
        return this.$el.find(selector);
    }

    render(store) {
        ReactDOM.render(
            <PageContext.Provider value={store}>
                {this._componentFactory()}
            </PageContext.Provider>,
            this.el
        );
    }
}