import * as antd from 'antd';
import * as moment from 'moment';
import { util, $ } from 'snowball';

export * from "./atoms";
export * from "./components";

$(window).on('load resize', () => {
    util.style('antd-hack', `.ant-modal-body { max-height: ${window.innerHeight - 200}px; overflow-y:auto; }`, true);
});

export { antd, moment };
