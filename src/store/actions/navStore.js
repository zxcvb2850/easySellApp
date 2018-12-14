/**
 * 路由相关的信息
 * */
import {observable, action} from 'mobx'

//路由信息  如果直接没有走登录页面则index=1
export class NavIndex {
    @observable
    navIndex = "";

    constructor(route) {
        this.navIndex = route
    }

    @action
    setRoute(route) {
        this.navIndex = route
    }
}

//如果直接没有走登录页面则index=2
export class NavInfo {
    @observable
    navInfo = 0;

    constructor(route) {
        this.navInfo = route;
    }

    @action
    setRoute(bool = false) {
        this.navInfo = bool ? 0 : 1
    }
}
