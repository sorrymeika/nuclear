
export type Location = {
    path: string,
    url: string,
    search: string,
    query: any,
    params: any
}

export type PageLifecycleDelegate = {
    /**
     * 页面是否需要渲染，除使用快照外一般不使用
     */
    shouldRender: () => boolean,
    /**
     * 页面第一次打开，且动画开始前触发
     */
    onInit: () => never;
    /**
     * 页面显示，动画结束时触发
     * 比 onCreate,onResume 先触发
     * 若有上个页面，晚于上一页面onPause，onDestroy触发
     */
    onShow: () => never,
    /**
     * 页面第一次打开，且动画结束后触发
     */
    onCreate: () => never,
    /**
     * 页面从后台进入前台，且动画结束时触发
     */
    onResume: () => never,
    /**
     * 页面链接query string变化
     */
    onQsChange: () => never,
    /**
     * 页面从前台进入后台，且动画结束时触发
     */
    onPause: () => never,
    /**
     * 页面被销毁后触发
     */
    onDestroy: () => never
}

export interface IPage {
    el: HTMLElement;
    /**
     * 是否是活动状态
     */
    isActive: () => boolean,
    /**
     * 是否已销毁
     */
    isDestroy: () => boolean,
    /**
     * 页面进入动画结束并切渲染完成
     */
    ready: () => boolean,
    /**
     * 监听页面事件
     * `show`, `create`, `pause`, `destroy`
     */
    on: (e: any, cb: () => any) => any;
    /**
     * 获取或设置当前页document.title
     */
    title: string;
    /**
     * 设置页面事件代理
     */
    setLifecycleDelegate: (delegate: PageLifecycleDelegate) => any;
    location: Location;
    $: (selector: string) => HTMLElement;

    isForward: boolean,
    location: Location,
}


export interface INavigation {
    history: string[],
    forward: (url: string) => any;
    back: (url: string) => any;
    /**
     * type = { Forward: 1, Back: -1, Replace: 0, Unknow: 2 };
     */
    transitionTo: (url: string, type: number) => any;
    replace: (url: string) => any;
}

export interface IPageManager {
    getOrCreate: (url: string, isForward) => IPage,
    replacePage: (prevActivity: any, activity: any, intentProps: any) => IPage,
}

export interface IRouter {
    registerProjects: (projects: any) => never,
    registerRoutes: (routes: any) => never,
    match: (url: string) => Promise<boolean>
}

type NavigateOptions = {
    /**
     * 导航是前进(true)、后退(false)还是replace(undefined)
     */
    isForward: boolean | undefined,
    /**
     * 替换hash
     */
    beforeNavigate?: () => any | Promise<any>,
    onNavigateFailure?: () => any
}

export interface IApplication {
    currentPage: IActivity;
    prevActivity: IActivity;
    pageManager: IPageManager;
    router: IRouteManager;
    rootElement: HTMLElement;
    navigate: (url: string, options: NavigateOptions, props?: any) => Promise<boolean>;
    start: (cb: () => never) => IApplication;
}