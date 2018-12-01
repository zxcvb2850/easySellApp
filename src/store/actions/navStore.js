/**
 * 路由相关的信息
 * */
import {observable, action} from 'mobx'

//路由信息
class NavInfo {
    @observable
    navList = "";

    constructor(route) {
        this.navList = route
    }

    @action
    addRoute(route) {
        this.navList = route + 1
    }

    @action
    delRoute(route) {
        this.navList = route - 1
    }

    @action
    removeRoute() {
        this.navList = ""
    }

    @action
    setRoute(route) {
        this.navList = route
    }
}

export default NavInfo;
