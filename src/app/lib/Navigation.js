/**
 * 功能: 单页间跳转
 * 作者: sunlu
 */

import { IApplication, INavigation } from '../types';
import { $ } from '../../utils';

const NavigateType = {
    Forward: 1,
    Back: -1,
    Replace: 0,
    Unknow: 2
};

function isReplaceHistory(navigateType) {
    return navigateType == NavigateType.Replace;
}

let isNavigateListenerStart = false;

export default class Navigation implements INavigation {

    constructor(application: IApplication) {
        this.application = application;
        this.ignoreHashChangeCount = 0;
    }

    startNavigateListener() {
        if (isNavigateListenerStart) {
            throw new Error('NavigateListener is already start!');
        }
        isNavigateListenerStart = true;

        const $window = $(window);
        const createEvent = $.Event;

        $window.on('hashchange', () => {
            this.hashChangeTime = Date.now();

            if (this.ignoreHashChangeCount <= 0) {
                const navigateEvent = createEvent('beforenavigate');
                $window.trigger(navigateEvent);
                if (navigateEvent.isDefaultPrevented()) return;

                const url = location.hash.replace(/^#/, '') || '/';

                this.application.navigate(url);
            } else {
                this.ignoreHashChangeCount--;
            }
        });

        if (!location.hash || location.hash === '#') {
            this.ignoreHashChangeCount++;
            location.hash = '/';
        }
    }

    /**
     * 带前进动画的页面跳转
     *
     * @param {string} url 跳转连接
     * @param {object} [props] 传给下个页面的props
     */
    forward(url, props) {
        this.transitionTo(url, NavigateType.Forward, props);
        return this;
    }

    /**
     * 带返回动画的页面跳转
     *
     * @param {string} [url] 跳转连接，不填默认返回referrer
     */
    back() {
        history.back();
        return this;
    }

    replace(url) {
        this.transitionTo(url, NavigateType.Replace);
        return this;
    }

    /**
     * 页面跳转
     *
     * @param {string} url 跳转连接
     * @param {NavigateType} [navigateType]
     * @param {object} [props] 传给下个页面的props
     */
    async transitionTo(url, navigateType, props) {
        const { application } = this;

        await application.navigationTask;

        if (/^(https?:)?\/\//.test(url)) {
            setTimeout(() => {
                if (isReplaceHistory(navigateType)) {
                    location.replace(url);
                } else {
                    location.href = url;
                }
            }, 0);
            return;
        }

        if (typeof navigateType === 'object') {
            props = navigateType;
            navigateType = undefined;
        }

        const isReplace = isReplaceHistory(navigateType);

        url = url.replace(/^#/, '') || '/';
        if (url.startsWith('?')) {
            url = (application.currentPage ? application.currentPage.location.path : '/') + url;
        }

        const currentUrl = application.currentPage ? application.currentPage.location.url : null;
        const index = this.history.lastIndexOf(url);
        const currIndex = this.history.lastIndexOf(currentUrl);

        if (currIndex === index && currIndex !== -1) {
            return;
        } else {
            const isForward = navigateType === undefined
                ? (index === -1 || index > currIndex)
                : isReplace
                    ? undefined
                    : navigateType === NavigateType.Forward;

            const navigateSuccess = await application.navigate(url, {
                isForward,
                beforeNavigate: () => {
                    this.ignoreHashChangeCount++;
                    if (isReplace) {
                        this.history[this.history.length - 1] = url;
                        location.replace('#' + url);
                    } else if (!isForward && index !== -1) {
                        this.history.length = index + 1;
                        history.go(index - currIndex);
                    } else {
                        this.history.length = currIndex + 1;
                        if (currIndex == -1 && currentUrl)
                            this.history.push(currentUrl);
                        this.history.push(url);

                        if (Date.now() - application.hashChangeTime < 500) {
                            // 两次hashchange间隔小于500ms容易不记录到history中，原理不明
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    location.hash = url;
                                    resolve();
                                }, 500);
                            });
                        } else {
                            location.hash = url;
                        }
                    }
                },
                onNavigateFailure() {
                    location.replace('#/');
                },
            }, props);

            if (!navigateSuccess) {
                console.error("route not match", url);
            }
        }
    }
}