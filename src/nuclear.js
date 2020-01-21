import * as antd from 'antd';
import * as moment from 'moment';
import { util, $ } from 'snowball';

import 'moment/locale/zh-cn';

export * from "./atoms";
export * from "./components";

export { ViewModelConfiguration } from './configuration';

$(window).on('load resize', () => {
    util.style('antd-hack', `.ant-modal-body { max-height: ${window.innerHeight - 200}px; overflow-y:auto; }`, true);
});

moment.locale('zh-cn');

export { antd, moment };
