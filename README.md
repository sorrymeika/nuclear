# 后台UI拖拽生成系统

## 描述

1. 启动项目后在界面左侧的控件栏拖拽控件到中间装修区域，并在右侧配置控件相关属性。
2. 属性配置使用模版语言，如:`我是{user.name},年龄{user.age}`，`{expression}`中的数据来自`handler`并且为`null`时不会抛异常。
3. UI数据通过`mobx.observable`进行状态管理和同步。
4. UI层只是一份`json`数据。

## 优点
1. 可视化拖拽生成UI，高效率易维护。
2. 一个核心框架库＋多个业务库。业务库之间不依赖，可单独发布。
3. 发布后到业务库共用一份核心库的js/css/image/iconfont，减少下载资源的大小。

## 开发

```sh
# TODO
npm run project yourProjectName
# 启动nuclear
npm start
# 构建
npm run build
```

## 打包
```
业务项目打包后会剔除掉`react`,`react-dom`,`polyfill`,`nuclear`,`antd`等框架和框架中的公共组件/公共样式
```
1. `nuclear`会将`antd`等框架注册到 `window.Nuclear` 上
2. 使用 `snowball-loader`, 该loader会将 `import React from "react"` 替换成 `const React = window.nuclear._React`

## 框架版本管理

1. `nuclear` 会分大版本（1.x和2.x）和小版本（1.x.x和1.x.x），小版本升级(自动化测试)业务不感知。大版本升级业务需处理。
2. `nuclear` 会尽量保证兼容性。让大版本升级尽量平滑。大版本一年一次。
3. 大版本不同的业务之间跳转通过`iframe`。
4. 大版本变更之后由某个业务先行试点，稳定后一个月内全部升级。

## 示例

* 组件render函数中调用了mobx observable属性，当属性变化后会自动重新render

```js
import { Component } from 'React';
import { controller, service } from 'nuclear';
import { observer, inject } from 'snowball/app'
import { observable } from 'snowball'

interface IUser {
    userId: number;
    userName: string;
}

class User implements IUser {
    @observable
    userId;

    @observable
    userName;

    constructor(user: IUser) {
        Object.assign(this, user);
    }
}

interface IUserService {
    user: IUser;
    setUserName(): void
}

@service
class UserService implements IUserService {
    constructor() {
        this._user = new User();
    }

    get user() {
        return this._user
    }

    setUserName(userName) {
        this.user.userName = userName;
    }
}

@controller(App)
class AppController {
    constructor({ location }) {
        this.userService = new UserService();
    }

    pgOnInit() {
        this.userService.loadUser();
    }
}
```