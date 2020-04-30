import * as antd from 'antd';
import * as moment from 'moment';
import { util, $ } from 'snowball';
import 'moment/locale/zh-cn';
import "./atoms";

moment.locale('zh-cn');

$(window).on('load resize', () => {
    util.style('antd-hack', `.ant-modal-body { max-height: ${window.innerHeight - 200}px; overflow-y:auto; }`, true);
});

export { default as wrapAtomFormItem } from './atoms/form/wrapFormItem';
export { FormContext } from './atoms/form/Form';

export * from "./components";
export { NuclearConfiguration } from './configuration';
export { antd, moment };
