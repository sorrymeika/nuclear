import { isThenable } from '../../utils';
import { IPageManager, IApplication, Location } from '../types';
import Page from './Page';

async function createPage(route, location: Location, application: IApplication) {
    let componentFactory = route.componentFactory;

    if (isThenable(componentFactory)) {
        componentFactory = route.componentFactory = await componentFactory;
    }
    return new Page(componentFactory.default || componentFactory, location, application);
}

export default class PageManager implements IPageManager {

    application: IApplication;

    constructor(application, options) {
        this.options = options;
        this.application = application;
    }

    createPage(route, location): Page {
        return createPage(route, location, this.application);
    }

    /**
     * 页面切换
     * @param {Activity} prevPage 当前要被替换掉的页面
     * @param {Activity} newPage 当前要切换到的页面
     * @param {object} intentProps 传给下个页面的props
     */
    replacePage(prevPage, newPage, intentProps) {
        newPage.setProps({
            location: newPage.location,
            ...intentProps
        });
        newPage.$el.css({
            display: 'block'
        });
        newPage.trigger('show');

        if (prevPage) {
            prevPage.$el.removeClass('app-view-actived');
            prevPage.$el.css({ zIndex: '' });
            prevPage.trigger('destroy');
        }
    }
}
