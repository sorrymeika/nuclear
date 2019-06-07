# 后台UI拖拽生成系统

## 描述

1. 启动项目后在界面左侧的控件栏拖拽控件到中间装修区域，并在右侧配置控件相关属性。
2. 属性配置使用模版语言，如:`我是{user.name},年龄{user.age}`，`{expression}`中的数据来自`controller`并且为`null`时不会抛异常。
3. UI数据通过`mobx.observable`进行状态管理和同步。
4. UI层只是一份`json`数据。

## 优点
1. 可视化拖拽生成UI，高效率易维护。
2. 一个核心框架库＋多个业务库。业务库之间不依赖，可单独发布。
3. 发布后到业务库共用一份核心库的js/css/image/iconfont，减少下载资源的大小。
4. 多个业务库，却又是单页应用。保证用户体验的统一和代码风格的统一。

# 实现方式

## 路由
```
该路由方案将多个库整合成一个单页应用，使所有业务都使用相同的跳转动画、手势返回、页面缓存
```
1. 核心框架 `nuclear` 统一控制路由
2. 业务库打包后会生成`asset-manifest.json`文件，`nuclear` 通过路由匹配到业务，并加载manifest中的js和css。
3. 业务js加载时调用`nuclear.reigsterRoutes('bizName', {...})` 方法注册子路由
4. `nuclear` 在业务js／css加载完成后，根据业务注册的子路由跳至对应页面。

## 开发

1. 将`snowball`放到`nuclear`同级文件夹下
2. 运行命令
```sh
ln -s ../../snowball/src ./node_modules
```
3. `import snowball from "snowball"`
4. 运行命令
```sh
# 启动nuclear
npm start
# 构建
npm run build
```

## 打包
```
业务项目打包后会剔除掉`react`,`react-dom`,`polyfill`,`nuclear`,`mobx`等框架和框架中的公共组件/公共样式
```
1. `nuclear`会将`React`等框架注册到 `window.nuclear` 上
2. 使用 `nuclear-loader`, 该loader会将 `import React from "react"` 替换成 `const React = window.nuclear.React`

## 框架版本管理

1. `nuclear` 会分大版本（1.x和2.x）和小版本（1.x.x和1.x.x），小版本升级(自动化测试)业务不感知。大版本升级业务需处理。
2. `nuclear` 会尽量保证兼容性。让大版本升级尽量平滑。大版本一年一次。
3. 大版本不同的业务之间跳转通过`iframe`。
4. 大版本变更之后由某个业务先行试点，稳定后一个月内全部升级。
5. 成立前端架构组，收集业务对框架方面的需求。

# API

## projects.js

* 子项目

```js
export default {
    // 子项目的路由+子项目的`bundle.js`或`asset-manifest.json`链接
    'subproject': 'http://localhost:5581/static/js/bundle.js'
}
```

## app.navigate(url: string) 方法

* 页面跳转

```js
import { app } from 'nuclear';

app.navigate('/geass')
```

## registerRoutes(projects: Array<{ path: string, Component: ReactComponent }>) 方法

* 注册子路由

```js
import { registerRoutes } from 'nuclear';
import App from './App';

registerRoutes('geass', {
    "/": App
})
```

## env 对象

* 环境变量

```js
import { env } from 'nuclear';

// http server 地址
env.HTTP_SERVER;
```

## 示例

* 组件render函数中调用了mobx observable属性，当属性变化后会自动重新render

```js
import { Component } from 'React';
import { controller, service } from 'nuclear';
import { observer, inject } from 'mobx-react'
import { observable, observer } from 'mobx'

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

@observer(['userService'])
class App extends Component<{ userService: IUserService }, never> {
    render() {
        const { userService } = this.props;
        return (
            <div onClick={userService.setUserName.bind(null)}>
                {userService.user.userName}
            </div>
        )
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