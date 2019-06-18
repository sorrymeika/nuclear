
import { IApplication, IRouteManager, IPageManager } from '../types';

/**
 * 应用控制器
 * @param {Element} rootElement 页面根元素
 */
export default class Application implements IApplication {

    constructor(
        navigationFactory: (app: IApplication) => INavigation,
        pageManagerFactory: (app: IApplication) => IPageManager,
        router: IRouteManager,
        rootElement,
        options = {}
    ) {
        this.router = router;
        this.rootElement = rootElement;
        this.options = options;

        this.pageManager = pageManagerFactory(this, options);
        this.navigation = navigationFactory(this, options);
    }

    /**
     * 启动应用
     * @return {Application} 返回当前应用
     */
    start(callback) {
        this.navigation.startNavigateListener();

        this.hashChangeTime = Date.now();
        this.isStarting = true;
        this.navigate(location.hash, { isForward: true })
            .catch((err) => {
                console.error(err);
            })
            .then(() => {
                this.pageCache = null;
            })
            .then(callback);

        return this;
    }

    then(fn) {
        return this.navigationTask
            ? (this.navigationTask = this.navigationTask.then(fn))
            : fn();
    }

    /**
     * 匹配路由并跳转至关联页面
     * 队列方式，避免hashchange多次同时触发出错
     */
    navigate(url, options = {}, props?) {
        this.navigating = true;
        this.navigationTask = this.navigationTask
            ? this.navigationTask.then(this._navigate.bind(this, url, options, props))
            : this._navigate(url, options, props);

        return this.navigationTask.then((res) => {
            this.navigating = false;
            return res;
        });
    }

    /**
     * 匹配路由并跳转至关联页面
     */
    async _navigate(url, options = {}, props?) {
        const { location, route } = await this.router.match(url);
        if (!location) return false;

        const prevPage = this.currentPage;
        const { beforeNavigate, onNavigateFailure } = options;

        beforeNavigate && await beforeNavigate();

        if (prevPage && location.path == prevPage.location.path) {
            prevPage.setProps({
                location,
                ...props
            });
            this.navigation.url = location.url;
            prevPage.trigger('qschange');
            return true;
        }
        this.now = Date.now();

        const pageManager = this.pageManager;
        const newPage = await pageManager.createPage(route, location);
        if (!newPage) {
            onNavigateFailure && onNavigateFailure();
            return false;
        }

        let { isForward } = options;
        if (prevPage) {
            if (isForward) {
                newPage._prev && (newPage._prev._next = newPage._next);
                newPage._next && (newPage._next._prev = newPage._prev);

                newPage._prev = prevPage;
                prevPage._next = newPage;
            }
            location.referrer = newPage._prev ? newPage._prev.url : null;
        } else {
            isForward = true;
        }
        newPage.location = location;

        this.navigation.url = location.url;
        this.navigation.referrer = location.referrer;
        this.navigation.isForward = newPage.isForward = isForward;

        this.prevPage = prevPage;
        this.currentPage = newPage;

        await pageManager.replacePage(prevPage, newPage, props);

        return true;
    }
}